import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray } from '@angular/forms';
import { UserProfile } from '../../interfaces/user-profile';
import { Address } from '../../interfaces/address';
import { UserService } from '../../services/user/user.service';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { GlobalService } from 'src/app/services/global/global.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit {
  
  profileForm = this.formBuilder.group({
    firstName: [''],
    lastName: [''],
    emailAddress: [''],
    birthDate: [''],
    addresses: this.formBuilder.array([this.formBuilder.group(
      {
        unitNo: [''],
        street: [''],
        suburb: ['']
      }
    )]) 
  });

  constructor(private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private toastController: ToastController,
    private globalService: GlobalService
    ) { 
      this.userService.initializeDatabase();
  }

  ngOnInit() {
    
  }

  onSubmit(){
     let userProfile = <UserProfile>{};
     let userAddresses: Address[] = new Array();
    
     userProfile.firstName = this.profileForm.controls['firstName'].value;
     userProfile.lastName = this.profileForm.controls['lastName'].value;
     userProfile.emailAddress = this.profileForm.controls['emailAddress'].value;
     userProfile.birthDate =  new Date(this.profileForm.controls['birthDate'].value);

     this.addresses.controls.forEach(item => {
      let userAddress= <Address>{};
      
      userAddress.unitNo = item.value.unitNo;
      userAddress.street = item.value.street;
      userAddress.suburb = item.value.suburb;

      userAddresses.push(userAddress);
     });

     userProfile.addresses = userAddresses;

     this.userService.addUser(userProfile)
      .then((id) => { 
        this.openToast('Profile successfully created', "success");
        this.globalService.publish({userId: id})
        this.router.navigate(['weather-main'])
      })
      .catch(e => console.error(JSON.stringify(e)));
  }

  deleteAddress(index: number){
    this.addresses.removeAt(index);
  }

  get addresses(): FormArray{
    return this.profileForm.get('addresses') as FormArray
  }
  
  addAddress(){
    this.addresses.push(this.formBuilder.group(
      {
        unitNo: [''],
        street: [''],
        suburb: ['']
      })
    )
  }

  async openToast(msg: string, color: string){
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000,
      color: color,
      position: "top"
    }); 
    toast.present();
  }
}
