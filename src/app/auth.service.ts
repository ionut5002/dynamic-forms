import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, signOut, User as FirebaseUser, onAuthStateChanged } from '@angular/fire/auth';
import { Firestore, doc, setDoc, updateDoc } from '@angular/fire/firestore';
import { User } from './user.model';
import { Observable } from 'rxjs';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private auth: Auth, private firestore: Firestore, private router: Router, private storage: Storage) {}

  async register(email: string, password: string, displayName: string, phoneNumber: string, selectedFile: File | null): Promise<User> {
    try {
      const { user } = await createUserWithEmailAndPassword(this.auth, email, password);

      let photoURL: string | undefined;
      if (selectedFile) {
        const filePath = `users/${user.uid}/profile-picture`;
        const storageRef = ref(this.storage, filePath);
        await uploadBytes(storageRef, selectedFile);
        photoURL = await getDownloadURL(storageRef);
      }

      await updateProfile(user, { displayName, photoURL });

      const newUser = {
        uid: user.uid, 
        email: email, 
        displayName: displayName, 
        phoneNumber: phoneNumber, 
        photoURL: photoURL
       } ;
      console.log(newUser)
      const userRef = doc(this.firestore, `users/${user.uid}`);
      await setDoc(userRef, newUser);
      await this.router.navigate(['/dashboard']);
      return newUser;
    } catch (error) {
      console.error('Error during registration:', error);
      throw error;
    }
  }

  async login(email: string, password: string): Promise<void> {
    try {
      const { user } = await signInWithEmailAndPassword(this.auth, email, password);
      if (user && user.uid) {
        console.log('User logged in successfully');
        await this.router.navigate(['/dashboard']);
      } else {
        console.error('User login failed: user object or UID is missing');
      }
    } catch (error) {
      console.error(error);
    }
  }

  getCurrentUser(): FirebaseUser | null {
    return this.auth.currentUser;
  }

  onAuthStateChanged(): Observable<FirebaseUser | null> {
    return new Observable<FirebaseUser | null>((observer) => {
      const unsubscribe = onAuthStateChanged(this.auth, (user) => {
        observer.next(user);
      });

      return () => unsubscribe();
    });
  }

  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      console.log('User logged out successfully');
      return Promise.resolve();
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  }

  

  async updateProfile(displayName: string, phoneNumber: string, selectedFile: File | null): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) {
      throw new Error('User not logged in');
    }

    let photoURL: string | undefined;
    if (selectedFile) {
      const filePath = `users/${user.uid}/profile-picture`;
      const storageRef = ref(this.storage, filePath);
      await uploadBytes(storageRef, selectedFile);
      photoURL = await getDownloadURL(storageRef);
    }

    await updateProfile(user, { displayName, photoURL });

    const userRef = doc(this.firestore, `users/${user.uid}`);
    const updatedData: Partial<User> = {
      displayName,
      phoneNumber,
      photoURL: photoURL || user.photoURL || undefined,
    };
    await updateDoc(userRef, updatedData);
  }


  
}
