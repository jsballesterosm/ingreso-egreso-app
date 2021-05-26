import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit {
  
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  login() : void {

    if ( this.loginForm.invalid ) return;

    Swal.fire({
      title: 'Espere por favor',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    const { nombre, correo, password } = this.loginForm.value;

    this.authService.loginUsuario( correo, password )
      .then( credenciales => {
        Swal.close();
        this.router.navigate(['/']);
      })
      .catch( err => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.message
        });
      });
  }

}
