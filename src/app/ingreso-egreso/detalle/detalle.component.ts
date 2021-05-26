import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { IngresoEgreso } from 'src/app/models/ingreso-egreso.model';
import { AppState } from '../../app.reducer';

import { IngresoEgresoService } from '../../services/ingreso-egreso.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: [
  ]
})
export class DetalleComponent implements OnInit, OnDestroy {
  
  ingresosEgresos: IngresoEgreso[];
  subs: Subscription;

  constructor(
    private store: Store<AppState>,
    private ingresoEgresoService: IngresoEgresoService
  ) { }

  ngOnInit(): void {
    this.subs = this.store.select('ingresosEgresos')
      .subscribe( ({items}) =>  this.ingresosEgresos = items);
  }
  
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  borrar(uid: string) :void  {
    this.ingresoEgresoService.borrarIngresoEgreso(uid)
      .then( () => Swal.fire('Borrado!', 'Elemento borrado con exito' ,'success'))
      .catch( (err) => Swal.fire('Alerta!', err.message ,'error'))
      
  }
}
