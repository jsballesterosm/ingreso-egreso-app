import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as authActions from '../auth/auth.actions';
import * as ingresoEgresoActions from '../ingreso-egreso/ingreso-egreso.actions';

import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  subs: Subscription = new Subscription();
  private _user: Usuario;

  constructor(
    private auth: AngularFireAuth,
    private firestore: AngularFirestore,
    private store: Store<AppState>
  ) {}

  get user() {
    return this._user;
  }

  initAuthListener(): void {
    this.auth.authState.subscribe((fuser) => {
      if (fuser) {
        this.subs = this.firestore
            .doc(`${fuser.uid}/usuario`)
            .valueChanges()
            .subscribe((firestoreUser: any) => {
              const user = Usuario.fromFirebase(firestoreUser);
              this.store.dispatch(authActions.setUser({ user }));
              this._user = user;
            })
      } else {
        this._user = null;
        this.subs.unsubscribe();
        this.store.dispatch(authActions.unSetUser());
        this.store.dispatch(ingresoEgresoActions.unSetItems());
      }
    });
  }

  crearUsuario(nombre: string, correo: string, password: string) {
    return this.auth
      .createUserWithEmailAndPassword(correo, password)
      .then(({ user }) => {
        const addUser = new Usuario(user.uid, nombre, correo);

        return this.firestore.doc(`${user.uid}/usuario`).set({ ...addUser });
      });
  }

  loginUsuario(correo: string, password: string) {
    return this.auth.signInWithEmailAndPassword(correo, password);
  }

  logout() {
    return this.auth.signOut();
  }

  isAuth() {
    return this.auth.authState.pipe(map((fuser) => fuser != null));
  }
}
