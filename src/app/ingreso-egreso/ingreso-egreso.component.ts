import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { IngresoEgreso } from '../models/ingreso-egreso.model';

import { IngresoEgresoService } from '../services/ingreso-egreso.service';

import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { Subscription } from 'rxjs';
import * as ui from '../shared/ui.actions';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: [
  ]
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {

  ingresoForm: FormGroup;
  tipo: string = 'ingreso';
  cargando: boolean = false;
  subs: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private ingresoEgresoService: IngresoEgresoService,
    private store: Store<AppState>
  ) { }


  ngOnInit(): void {
    this.ingresoForm = this.fb.group({
      descripcion: [ '', Validators.required ],
      monto: [ 0, [ Validators.required ]]
    });

    this.subs.add(
      this.store.select('ui').subscribe((ui) => (this.cargando = ui.isLoading))
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  guardar() : void {
    if ( this.ingresoForm.invalid ) { return; }

    this.store.dispatch(ui.isLoading());
    
    const { descripcion, monto } = this.ingresoForm.value;

    const ingresoEgreso = new IngresoEgreso( descripcion, monto, this.tipo );
    this.ingresoEgresoService.crearIngresoEgreso( ingresoEgreso )
      .then( () => {
        this.store.dispatch(ui.stopLoading());
        Swal.fire({
          title: 'Alerta',
          text: 'Registro creado con exito.',
          icon: 'success'
        });

        this.ingresoForm.reset();
      })
      .catch( err => {
        Swal.fire('Alerta', err.message,'error');
        this.store.dispatch(ui.stopLoading());
    });
  }

}
