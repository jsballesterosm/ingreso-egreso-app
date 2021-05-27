import { Component, OnDestroy, OnInit } from '@angular/core';

// Store ngrx
import { Store } from '@ngrx/store';

// models
import { IngresoEgreso } from 'src/app/models/ingreso-egreso.model';
import { Subscription } from 'rxjs';

// charts
import { ChartType } from 'chart.js';
import { MultiDataSet, Label } from 'ng2-charts';
import { AppStateWithIngreso } from '../ingreso-egreso.reducer';

@Component({
  selector: 'app-estadistica',
  templateUrl: './estadistica.component.html',
  styles: [
  ]
})
export class EstadisticaComponent implements OnInit, OnDestroy {
  // Doughnut
  public doughnutChartLabels: Label[] = ['Ingresos', 'Egresos'];
  public doughnutChartData: MultiDataSet = [
    [350, 450]
  ];
  public doughnutChartType: ChartType = 'doughnut';

  
  subs: Subscription = new Subscription();

  totalEgresos: number = 0;
  totalIngresos: number = 0;

  egresos: number = 0;
  ingresos: number = 0;

  constructor(
    private store: Store<AppStateWithIngreso>
  ) { }


  ngOnInit(): void {
    this.subs.add(
      this.store.select('ingresosEgresos')
        .subscribe( ({items}) => this.generarEstadistica(items))
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  generarEstadistica( items: IngresoEgreso[]) {
    this.totalEgresos = 0;
    this.totalIngresos = 0;
    this.ingresos = 0;
    this.egresos = 0;

    for (const item of items) {
      if ( item.tipo ==='ingreso') {
        this.totalIngresos+= item.monto;
        this.ingresos++;
      } else {
        this.totalEgresos+= item.monto;
        this.egresos++;
      }
    }

    this.doughnutChartData = [ [this.totalIngresos, this.totalEgresos] ];
  }

}
