import { Injectable } from '@angular/core';

// firebase
import { AngularFirestore } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';

// models
import { IngresoEgreso } from '../models/ingreso-egreso.model';

// services
import { AuthService } from './auth.service';
import { AppState } from '../app.reducer';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IngresoEgresoService {

  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService,
    private store: Store<AppState>
  ) { }

  crearIngresoEgreso( ingresoEgreso: IngresoEgreso ) {
    const uid = this.authService.user.uid;
    return this.firestore.doc(`${ uid }/ingresos-egresos`)
      .collection('items')
      .add({ ...ingresoEgreso });
  }
  
  initIngresoEgresoListener(uid: string) {
    
    return this.firestore.collection(`${ uid }/ingresos-egresos/items`)
      .snapshotChanges()
      .pipe(
        map( snapshot => snapshot.map( doc => ({
              uid: doc.payload.doc.id,
              ...doc.payload.doc.data() as any
            })
          )
        )
      );
  }

  borrarIngresoEgreso(uidItem: string) {
    
    const uid = this.authService.user.uid;
    return this.firestore.doc(`${ uid }/ingresos-egresos/items/${ uidItem }`).delete()
  }
}
