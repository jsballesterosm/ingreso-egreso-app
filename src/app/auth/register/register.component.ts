import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import * as ui from '../../shared/ui.actions';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit, OnDestroy {

  registroForm: FormGroup;
  cargando: boolean = false;
  subs: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {

    this.registroForm = this.fb.group({
      nombre:   ['', Validators.required ],
      correo:   ['', [Validators.required, Validators.email] ],
      password: ['', Validators.required ],
    });

    this.subs.add(
      this.store.select('ui').subscribe((ui) => (this.cargando = ui.isLoading))
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  crearUsuario() : void {
    
    if ( this.registroForm.invalid ) return;

    // aqui
    this.store.dispatch(ui.isLoading());

    const { nombre, correo, password } = this.registroForm.value;

    this.authService.crearUsuario( nombre, correo, password )
      .then( credenciales => {
        this.store.dispatch(ui.stopLoading());
        this.router.navigate(['/']);
      })
      .catch( err =>  {
        this.store.dispatch(ui.stopLoading());
      });
  }

}
