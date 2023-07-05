import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { doc, Firestore } from '@angular/fire/firestore';
import { onSnapshot } from 'firebase/firestore';
import { User } from '../user.model';
@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent implements OnInit {
  userDetails: User | undefined;
  updatedDisplayName: string;
  updatedphoneNumber: string;
  selectedFile: File | null = null;

  constructor(private authService: AuthService, private firestore: Firestore) {
    const user = authService.getCurrentUser();
    this.updatedDisplayName = user?.displayName || '';
    this.updatedphoneNumber = user?.phoneNumber || '';
    if (user) {
      const userDoc = doc(this.firestore, 'users', user.uid);
      onSnapshot(userDoc, (snapshot) => {
        this.userDetails = snapshot.data() as User;
        this.updatedphoneNumber = this.userDetails.phoneNumber;
      });
    }
  }

  ngOnInit(): void {}

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length) {
      this.selectedFile = target.files[0];
    }
  }

  async updateProfile(): Promise<void> {
    try {
      await this.authService.updateProfile(this.updatedDisplayName, this.updatedphoneNumber, this.selectedFile);
      console.log('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  }
}
