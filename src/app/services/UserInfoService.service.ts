import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserInfoServiceService {
  userInfo: any;

  constructor() { }

  // setUserInfo(userInfo: any) {
  //   this.userInfo = userInfo;
  // }

  // getUserInfo() {
  //   return this.userInfo;
  // }
  setUserInfo(userInfo: any){
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
  }

  getUserInfo(){
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo): null;
  }

}
