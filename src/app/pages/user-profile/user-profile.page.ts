import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { UserProfile } from '../../interfaces/user-profile';
import { Address } from '../../interfaces/address';
import { UserService } from '../../services/user.service';

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
    private userService: UserService
    ) { 
      
  }

  ngOnInit() {

  }

  onSubmit(){
     let userProfile = <UserProfile>{};
     let userAddresses: Address[] = new Array();
    
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

     this.userService.addUser(userProfile)
      .then(() => alert('User Successfully saved'))
      .catch(e => alert(JSON.stringify(e)));
     console.log(JSON.stringify(userProfile));
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

}
