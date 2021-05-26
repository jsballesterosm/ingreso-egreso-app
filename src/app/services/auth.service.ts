import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators'
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private auth: AngularFireAuth,
    private firestore: AngularFirestore
  ) { }

  initAuthListener() : void {
    this.auth.authState.subscribe( fuser => {
      console.log(fuser);
    });
  }

  crearUsuario( nombre: string, correo: string, password: string ) {
    
    return this.auth.createUserWithEmailAndPassword( correo, password )
      .then( ( { user } ) => {
        const addUser = new Usuario(user.uid, nombre, correo);

        return this.firestore.doc(`${ user.uid }/usuario`)
          .set( { ...addUser } );
      });
  }

  loginUsuario( correo: string, password: string ) {
    return this.auth.signInWithEmailAndPassword( correo, password );
  } 

  logout() {
    return this.auth.signOut();
  }

  isAuth() {
    return this.auth.authState.pipe(
      map( fuser => fuser != null )
    );
  }
}
