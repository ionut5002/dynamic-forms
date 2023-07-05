import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Firestore, collection, addDoc, query, orderBy, onSnapshot, updateDoc, doc, getDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor(private firestore: Firestore) {}

  

  async saveFormToFirestore(Form: any): Promise<void> {
    console.log(Form)
    try {
      const formData = {
        title: Form.title,
        fields: Form.fields
      };
      console.log(formData)
      const formsCollection = collection(this.firestore, 'fields');
      await addDoc(formsCollection, formData);
      console.log('Form saved to Firestore!');
    } catch (error) {
      console.error('Error saving form to Firestore:', error);
    }
  }

  async editFormInFirestore(formId: string, updatedForm: any): Promise<void> {
    try {
      const formData = {
        title: updatedForm.title,
        fields: updatedForm.fields
      };
  
      const formDocRef = doc(this.firestore, 'fields', formId);
      await updateDoc(formDocRef, formData);
      console.log('Form updated in Firestore!');
    } catch (error) {
      console.error('Error updating form in Firestore:', error);
    }
  }

  getAllForms(): Observable<any[]> {
    const formsCollection = collection(this.firestore, 'forms');
    const formsQuery = query(formsCollection, orderBy('title'));

    return new Observable((observer) => {
      const unsubscribe = onSnapshot(formsQuery, (snapshot) => {
        const formsData: any[] = [];
        snapshot.forEach((doc) => {
          formsData.push({ id: doc.id, ...doc.data() });
        });
        observer.next(formsData);
      });

      return () => unsubscribe();
    });
  }

  getAllTemplates(): Observable<any[]> {
    const formsCollection = collection(this.firestore, 'fields');
    const formsQuery = query(formsCollection, orderBy('title'));

    return new Observable((observer) => {
      const unsubscribe = onSnapshot(formsQuery, (snapshot) => {
        const formsData: any[] = [];
        snapshot.forEach((doc) => {
          formsData.push({ id: doc.id, ...doc.data() });
        });
        observer.next(formsData);
      });

      return () => unsubscribe();
    });
  }

  // Inside the FormService class
async getFormById(formId: string): Promise<any> {
  const formDoc = doc(this.firestore, 'fields', formId);
  const formSnapshot = await getDoc(formDoc);

  if (formSnapshot.exists()) {
    return { id: formSnapshot.id, ...formSnapshot.data() };
  } else {
    console.error('Form not found');
    return null;
  }
}

async saveFilledForm(filledForm: any) {

  const filledFormsCollection = collection(this.firestore, 'forms');
  await addDoc(filledFormsCollection, filledForm);

  console.log('Filled form saved to Firestore!');
}

  
}
