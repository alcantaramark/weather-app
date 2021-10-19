import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { UserProfile } from 'src/app/interfaces/user-profile';
import { Address } from '../../interfaces/address';
import { UserService } from 'src/app/services/user/user.service';
import { FormBuilder, FormArray, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {
  userId:number;
  profileForm = this.formBuilder.group({
    firstName: [''],
    lastName: [''],
    emailAddress: [''],
    birthDate: ['',],
    addresses: this.formBuilder.array([])
  });
  
  constructor(private activatedRouted: ActivatedRoute
    , private userService: UserService
    , private router: Router
    , private toastController: ToastController
    , private alertController: AlertController
    , private formBuilder: FormBuilder
    ) { 
    }
  
  ionViewWillEnter(){
    this.init();
  }
  ngOnInit() {
   
  }

  init(){
    this.userId = parseInt(this.activatedRouted.snapshot.paramMap.get('id'));
    this.userService.initializeDatabase().then(() => this.userService.getUser(this.userId).then(res => { 
          let controls = <FormArray>this.profileForm.controls.addresses;
          controls.clear();

          this.profileForm.controls['firstName'].setValidators(Validators.required);
          this.profileForm.controls['lastName'].setValidators(Validators.required);
          this.profileForm.controls['emailAddress'].setValidators(Validators.required);
          this.profileForm.controls['birthDate'].setValidators(Validators.required);
        
          res.addresses.forEach((item) => { 
            controls.push(this.formBuilder.group({
              unitNo: [item.unitNo, [Validators.required]],
              street: [item.street, [Validators.required]],
              suburb: [item.suburb, [Validators.required]]
            }))
          });
          

          this.profileForm.patchValue({
            firstName: res.firstName,
            lastName: res.lastName,
            emailAddress: res.emailAddress,
            birthDate: res.birthDate
          })
      })
    );
  }

  onSubmit(){
    let userProfile = <UserProfile>{};
    let userAddresses: Address[] = new Array();
    
    if(this.profileForm.valid){
      userProfile.id = this.userId;
      userProfile.firstName = this.profileForm.controls['firstName'].value;
      userProfile.lastName = this.profileForm.controls['lastName'].value;
      userProfile.emailAddress = this.profileForm.controls['emailAddress'].value;
      userProfile.birthDate = this.profileForm.controls['birthDate'].value;

      this.addresses.controls.forEach(item => {
        let userAddress= <Address>{};
        
        userAddress.unitNo = item.value.unitNo;
        userAddress.street = item.value.street;
        userAddress.suburb = item.value.suburb;

        userAddresses.push(userAddress);
      });

      userProfile.addresses = userAddresses;
      this.userService.updateUser(userProfile).then(() => {
        this.openToast('Profile Successfully Updated', 'success');
        this.router.navigate(['weather-main']);
      }).catch(e => console.error(e));
    }
  }
  
  addAddress(){
    this.addresses.push(this.formBuilder.group(
      {
        unitNo: ['', [Validators.required]],
        street: ['', [Validators.required]],
        suburb: ['', [Validators.required]]
      })
    )
  }
  
  deleteAddress(index: number){
    this.addresses.removeAt(index);
  }

  get addresses(){
    return this.profileForm.get('addresses') as FormArray
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

  confirmDelete(){
    this.alertController.create({
      header: 'Confirm Delete',
      message: 'Are you sure you want to delete your profile?',
      buttons: [
        { 
          text: 'Yes',
          handler: () => {
            this.userService.deleteUser(this.userId).then(() => {
              this.openToast('Your profile was successfully deleted', 'success');
              this.router.navigate(['/', 'user-profile']);
            }).catch(e => console.error(e));
          }
        },
        {
          text: 'No'
        }
      ]
    }).then(res => res.present());
  }
}
