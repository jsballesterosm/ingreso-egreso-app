import { Component, OnDestroy, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as ingresosEgresosActions  from '../ingreso-egreso/ingreso-egreso.actions';

import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { IngresoEgresoService } from '../services/ingreso-egreso.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ]
})
export class DashboardComponent implements OnInit, OnDestroy {
  
  subs: Subscription = new Subscription();

  constructor(
    private store: Store<AppState>,
    private ingresoEgresoService: IngresoEgresoService
  ) { }

  ngOnInit(): void {
    this.subs.add(this.store.select('auth')
      .pipe(
        filter( auth => auth.user != null )
      )
      .subscribe(({ user }) => {

        this.subs.add(this.ingresoEgresoService.initIngresoEgresoListener( user.uid )
          .subscribe( ingresosEgresosFb => this.store.dispatch( ingresosEgresosActions.setItems({ items: ingresosEgresosFb }))))
        
        })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

}
