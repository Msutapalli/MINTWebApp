import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  username = '';
  password = '';
  _sidebarVal = false;
  auditDetails;

}
