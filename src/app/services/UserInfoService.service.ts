import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserInfoServiceService {
  userInfo: any;

  constructor() { }

  setUserInfo(userInfo: any) {
    this.userInfo = userInfo;
  }

  getUserInfo() {
    return this.userInfo;
  }

}
