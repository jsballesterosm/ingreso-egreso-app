export class Usuario {

    static fromFirebase( { correo, nombre, uid } ) {
        return new Usuario(uid, nombre, correo)
    }

    constructor(
        private uid: string,
        private nombre: string,
        private correo: string
    ) {}
}