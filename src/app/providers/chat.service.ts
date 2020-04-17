import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { Observable } from 'rxjs/Observable';
import { Mensaje } from '../interface/mensaje.interface';
import 'rxjs/add/operator/map';
@Injectable({
  providedIn: 'root'
})
export class ChatService {
  public chats: Mensaje[]=[];
  public usuario:any = {

  }
  private itemsCollection: AngularFirestoreCollection<any>;
  constructor(private afs: AngularFirestore,
              public afAuth: AngularFireAuth) {

      this.afAuth.authState.subscribe(user=>{
        console.log("estado del usuario",user);
        if(!user){
          return;
        }
        this.usuario.nombre = user.displayName;
        this.usuario.uid = user.uid;
      })
               }
  
  login() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }
  logout() {
    this.usuario = {};
    this.afAuth.auth.signOut();
  }

  cargarMensajes(){
    this.itemsCollection = this.afs.collection<Mensaje>('chats',ref => 
                                                                ref.orderBy('fecha','desc')
                                                                   .limit(5));
    return this.itemsCollection.valueChanges()
            .map( (mensajes:Mensaje[])=>{
              console.log(mensajes);
              this.chats = mensajes;

              this.chats = [];
              for(let mensaje of mensajes){
                this.chats.unshift(mensaje);
              }
              return this.chats;
            })
  }
  agregarMensaje(texto:string){
    
    let mensaje : Mensaje = {
      nombre: this.usuario.nombre,
      mensaje:texto,
      fecha: new Date().getTime(),
      uid: this.usuario.uid
    }

    return this.itemsCollection.add(mensaje);
  }
}
