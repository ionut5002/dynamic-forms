import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { doc, Firestore } from '@angular/fire/firestore';
import { onSnapshot } from 'firebase/firestore';
import { User } from '../user.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  fields: any[] = [
    { type: 'text', label: 'Name', value: '' , alignment: 100 },
    { type: 'number', label: 'Age', value: '' , alignment: 25 },
    { type: 'checkbox', label: 'Subscribe', value: false , alignment: 25 },
    { type: 'select', label: 'Country', value: '', options: ['USA', 'UK', 'Canada'] , alignment: 25 },
    { type: 'radio', label: 'Gender', value: '', options: ['Male', 'Female'], alignment: 25  },
    { type: 'date', label: 'Birthdate', value: '', alignment: 100  }
  ];
  userDetails: User | undefined;

  constructor(private authService: AuthService, private firestore: Firestore) {}

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();

    if (currentUser) {
      const userDoc = doc(this.firestore, 'users', currentUser.uid);
      onSnapshot(userDoc, (snapshot) => {
        this.userDetails = snapshot.data() as User;
      });
    }
  }
}
