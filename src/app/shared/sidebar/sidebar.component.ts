import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit, OnDestroy {

  subs: Subscription = new Subscription();
  nombre: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>
  ) { }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    this.subs.add(
      this.store.select('auth')
      .pipe(
        filter( ({ user }) => user !== null )
      )
      .subscribe(({user}) => this.nombre = user.nombre)
    );
  }

  logout() : void {
    Swal.fire({
      title: 'Cerrando sesión',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    this.authService.logout().then( () => {
      Swal.close();
      this.router.navigate(['/login']);
    })
  }

}
