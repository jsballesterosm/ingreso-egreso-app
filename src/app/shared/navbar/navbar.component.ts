import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styles: [
  ]
})
export class NavbarComponent implements OnInit, OnDestroy {
  
  subs: Subscription = new Subscription();
  nombre: string = '';

  constructor(
    private store: Store<AppState>
  ) { }


  ngOnInit(): void {
    this.subs.add(
      this.store.select('auth')
      .pipe(
        filter( ({ user }) => user !== null )
      )
      .subscribe(({user}) => this.nombre = user.nombre)
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

}
