import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { UserProfile } from '../interfaces/user-profile';

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
      this.initializeDatabase();
    }

  initializeDatabase(){
      this.platform.ready().then(() => {
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
              FOREIGN KEY(userId) REFERENCES ${this.dbUserTable}(id)
            )`, [])
            .then((res) => console.log("table address successfully created"))
            .catch((error) => console.error(JSON.stringify(error)));
          })
          .catch((error) => console.error(JSON.stringify(error)));
        })
        .catch((error) => console.error(JSON.stringify(error)));     
      })
      .catch((error) => console.error(JSON.stringify(error))); 
  }

  addUser(user: UserProfile):Promise<any>{
    return new Promise<boolean>((resolve, reject) => {
      this.dbInstance.executeSql(`INSERT INTO ${this.dbUserTable} (firstName, lastName, emailAddress, birthDate)
      VALUES ('${user.firstName}', '${user.lastName}', '${user.emailAddress}', '${user.birthDate}')`, [])
      .then(res => {
        console.log("User successfully saved in the database")
        alert("newly inserted id: " + res.insertId);
        user.addresses.forEach(item => {
          this.dbInstance.executeSql(`INSERT INTO ${this.dbAddressTable} (unitNo, street, suburb, userId)
          VALUES ('${item.unitNo}', '${item.street}', '${item.suburb}', '${res.insertId}')`, [])
          .then(res => console.log("User Address successfully saved", JSON.stringify(res)));
        });
        resolve(res);
      })
      .catch(e => {
        console.log("Error saving user", JSON.stringify(e));
        reject(e);
      })
    });
  }
}
