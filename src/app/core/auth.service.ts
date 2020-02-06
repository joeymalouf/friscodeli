import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { User } from '../models/user.model';


@Injectable({ providedIn: 'root' })
export class AuthService {
  user: Observable<User>;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) {

    /// Get auth data, then get firestore user doc
    this.user = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  async googleSignin() {
    const provider = new auth.GoogleAuthProvider();
    const credential = await this.afAuth.auth.signInWithPopup(provider);
    this.updateUserData(credential.user);
    return this.router.navigate(['admin']);
  }

  private updateUserData(user) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);

    const data: User = {
      uid: user.uid,
      email: user.email,
      admin: false,
    };

    return userRef.get();
  }

  async signOut() {
    await this.afAuth.auth.signOut();
    return this.router.navigate(['']);
  }

  get currentUserObservable(): any {
    return this.afAuth.authState;
  }

  checkAdmin(user: User) {
    console.log(user)
    if (!user) {
      return false;
    }
    if (user.admin === true) {
      return true;
    } else {
      return false;
    }
  }
}
