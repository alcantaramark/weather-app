import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { UserProfile } from '../../interfaces/user-profile';
import { Address } from '../../interfaces/address';
import { PropertyRead } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private dbInstance: SQLiteObject;
  readonly dbName: string = "weather.db";
  readonly dbUserTable: string = "tblUsers";
  readonly dbAddressTable: string = "tblAddresses";
  
  constructor(private platform: Platform,
    private sqlite: SQLite
    ) { 
      
    }

  initializeDatabase():Promise<void>{
    return new Promise((resolve) => {
      this.sqlite.create({
        name: this.dbName,
        location: 'default'
      }).then((sqLite: SQLiteObject) => {
        console.log("Database succcessfully created");
        this.dbInstance = sqLite;
        sqLite.executeSql(`CREATE TABLE IF NOT EXISTS ${this.dbUserTable}(
          id INTEGER PRIMARY KEY,
          firstName varchar(255),
          lastName varchar(255),
          emailAddress varchar(255),
          birthDate datetime
        )`, [])
        .then((res) => {
          console.log("Successfully created User Table", JSON.stringify(res))
          sqLite.executeSql(`CREATE TABLE IF NOT EXISTS ${this.dbAddressTable}(
            id INTEGER PRIMARY KEY,
            userId INTEGER,
            unitNo varchar(255),
            street varchar(255),
            suburb varchar(255),
            FOREIGN KEY(userId) REFERENCES ${this.dbUserTable}(id) ON DELETE CASCADE)`, [])
          .then((res) => console.log("table address successfully created") )
          .catch((error) => console.error(JSON.stringify(error)));
        })
        .catch((error) => console.error(JSON.stringify(error)));
        resolve();
      })
      .catch((error) => console.error(JSON.stringify(error)))
    });
    
  }

  addUser(user: UserProfile):Promise<Number>{
    return new Promise<Number>((resolve, reject) => {
      this.dbInstance.executeSql(`INSERT INTO ${this.dbUserTable} (firstName, lastName, emailAddress, birthDate)
      VALUES ('${user.firstName}', '${user.lastName}', '${user.emailAddress}', '${user.birthDate}')`, [])
      .then(res => {
        console.log("User successfully saved in the database")
        let promises = [];
        user.addresses.forEach(item => promises.push(this.addUserAddress(res.insertId, item)));
        Promise.all(promises).then(() => resolve(res.insertId));
      })
      .catch(e => {
        console.error("Error saving user", JSON.stringify(e));
        reject(e);
      })
    });
  }

  addUserAddress(userId: Number, userAddress: Address):Promise<void>{
    return new Promise(resolve => {
      this.dbInstance.executeSql(`INSERT INTO ${this.dbAddressTable} (unitNo, street, suburb, userId)
      VALUES ('${userAddress.unitNo}', '${userAddress.street}', '${userAddress.suburb}', '${userId}')`, [])
       .then(() => { console.log('user address added', JSON.stringify(userAddress)); resolve(); }).catch(e => (e));
      });
  }

  updateUser(user: UserProfile):Promise<void>{
    return new Promise((resolve, reject) => {
      this.dbInstance.executeSql(`UPDATE ${this.dbUserTable} SET firstName='${user.firstName}',
            lastName='${user.lastName}',
            emailAddress='${user.emailAddress}',
            birthDate='${user.birthDate}' WHERE id=${user.id}`, [])
      .then(() => {
        console.log("User successfully saved in the database");
        this.deleteUserAddress(user.id).then(() => {
          let promises = [];
          user.addresses.forEach(item => promises.push(this.addUserAddress(user.id, item).catch(e => console.error("error adding address", e))));
          Promise.all(promises).then(() => resolve());
        });
      })
      .catch(e => {
        console.error("Error saving user", JSON.stringify(e));
        reject(e);
      })
    });
  }

  getUsers():Promise<UserProfile[]>{
    return new Promise<UserProfile[]>((resolve, reject) => {
      let users: UserProfile[] = new Array();
      this.dbInstance.executeSql(`SELECT * FROM ${this.dbUserTable}`, [])
        .then(res => {
            let promises = [];
            for(var i = 0; i < res.rows.length; ++i){
              let user: UserProfile = res.rows.item(i);
              user.addresses = new Array();
              promises.push(this.getUserAddress(user.id).then(address => { 
                  address.forEach(item => user.addresses.push(item));
                  users.push(user);
                }));
            }
            Promise.all(promises).then(res => resolve(users));
          })
        .catch(e => console.error(e));
    });
  }

  getUser(userId: Number): Promise<UserProfile>{
    return new Promise<UserProfile>((resolve, reject) => {
      let user = <UserProfile>{};
      this.dbInstance.executeSql(`SELECT * FROM ${this.dbUserTable} WHERE id = ${userId}`, [])
        .then(res => {
          user.id = res.rows.item(0).id;
          user.birthDate = res.rows.item(0).birthDate;
          user.firstName = res.rows.item(0).firstName;
          user.lastName = res.rows.item(0).lastName;
          user.emailAddress = res.rows.item(0).emailAddress;
          user.addresses = new Array();
          return this.getUserAddress(user.id).then(address => { 
            address.forEach(item => user.addresses.push(item));
            resolve(user);
          });
        })
        .catch(e => reject(e));
    });
  }

  deleteUser(userId: Number):Promise<void>{
    return new Promise((resolve, reject) => {
      this.dbInstance.executeSql(`DELETE FROM ${this.dbUserTable} WHERE id=${userId}`, [])
        .then(() => { this.deleteUserAddress(userId).then(() => resolve()) })
        .catch(e => reject(e));
    });
  }

  deleteUserAddress(userId: Number):Promise<void>{
    return new Promise((resolve, reject) => {
      this.dbInstance.executeSql(`DELETE FROM ${this.dbAddressTable} WHERE userId=${userId}`, [])
        .then(() => resolve())
        .catch(e => reject(e));
    });
  }

  getUserAddress(userId: number):Promise<Address[]>{
    return new Promise<Address[]>((resolve, reject) => {
      this.dbInstance.executeSql(`SELECT * FROM ${this.dbAddressTable} WHERE userId=${userId}`, [])
        .then(res => {
          var userAddresses: Address[] = new Array();
          for(var i = 0; i < res.rows.length; ++i){
            var userAddress = <Address> {};
            userAddress.id = res.rows.item(i).id;
            userAddress.street = res.rows.item(i).street;
            userAddress.unitNo = res.rows.item(i).unitNo;
            userAddress.suburb = res.rows.item(i).suburb;
            userAddress.userId = res.rows.item(i).userId;
            userAddresses.push(userAddress);
          }
          resolve(userAddresses);
        })
        .catch(e => console.error(e));
    });
  }
}
