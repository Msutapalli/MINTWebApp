import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class MintService {
  private baseURL = environment.serverBaseURL;
  // private baseURL = 'https://mint-api.miraclesoft.com/'
  username: any;
  password: any;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private http: HttpClient, private data: DataService) {
    this.getLoginData();
  }

  getLoginData() {
    this.username = localStorage.getItem('username');
    this.password = localStorage.getItem('password');
  }

  login() {
    this.getLoginData();
    const loginData = {
      'hubbleId': this.username,
      'password': this.password
    };
    return this.http.post(this.baseURL + `LoginProd`,
      loginData, this.httpOptions);
  }

  getAllDevices() {
    this.getLoginData();

    const loginData = {
      'hubbleId': this.username,
      'password': this.password
    };

    return this.http.post(this.baseURL + `getalldevicesProd`,
      loginData, this.httpOptions);
  }


  getAllDevicesByUserId() {
    this.getLoginData();

    const loginData = {
      'hubbleId': this.username,
      'password': this.password
    };
    console.log('login data', loginData)
    return this.http.post(this.baseURL + `getYourItemsProd`,
      loginData, this.httpOptions);
  }

  getDeviceByQRCode(qrCode) {
    this.getLoginData();
    const loginData = {
      'hubbleId': this.username,
      'password': this.password
    };

    return this.http.post(this.baseURL + `getItemByqrcodeProd?qrCode=${qrCode}`,
      loginData, this.httpOptions);
  }

  addReason(reason, docId) {
    this.getLoginData();
    const postData = {
      'hubbleId': this.username,
      'password': this.password,
      'reason':
      {
        'hubbleId': this.username,
        'reasonText': reason
      }
    };
    console.log('-->service', postData, docId)
    return this.http.post(this.baseURL + `addreasonProd?documentId=${docId}`,
      postData, this.httpOptions);
  }

  updateScan(qrCode) {
    this.getLoginData();
    const postData = {
      'hubbleId': this.username,
      'password': this.password,
    };
    return this.http.post(this.baseURL + `updatescandetailsProd?qrCode=${qrCode}`,
      postData, this.httpOptions);
  }

  resetPassword(hubbleId) {
    const loginData = {
      'hubbleId': hubbleId
    };

    return this.http.post(this.baseURL + `passwordResetProd`,
      loginData, this.httpOptions);
  }


  getAuditDetails() {
    this.getLoginData();
    const postData = {
      'hubbleId': this.username,
      'password': this.password,
    };
    return this.http.get(this.baseURL + `getAuditDetailsProd`, this.httpOptions);
  }
}
