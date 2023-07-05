export class User {
  uid: string;
  email: string;
  displayName: string;
  phoneNumber: string;
  photoURL?: string;

  constructor(uid: string, email: string, displayName: string, phoneNumber: string, photoURL?: string) {
    this.uid = uid;
    this.email = email;
    this.displayName = displayName;
    this.phoneNumber = phoneNumber;
    if (photoURL) {
      this.photoURL = photoURL;
    }
  }
}
