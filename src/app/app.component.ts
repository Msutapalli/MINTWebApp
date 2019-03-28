import {Component, OnInit} from '@angular/core';
import {DataService} from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  loggedIn = false;
  screenSize = 'BIG';
  imgSrc = 'https://thumb9.shutterstock.com/display_pic_with_logo/2327279/450966898/stock-vector-male-profile-picture-placeholder-vector-illustration-design-social-profile-template-avatar-450966898.jpg';
  userDetails;
  constructor(private data: DataService) {
    window.addEventListener('resize', this.updateSidebarMode);
  }

  ngOnInit() {
    this.setLogin(localStorage.getItem('loggedIn'));

    if (window.innerWidth <= 800 && window.innerHeight <= 825) {
      this.screenSize = 'SMALL';
    } else {
      this.screenSize = 'BIG';
    }
  }

  updateSidebarMode() {
    if (window.innerWidth <= 800 && window.innerHeight <= 800) {
      this.screenSize = 'SMALL';
    } else {
      this.screenSize = 'BIG';
    }
  }


  setLogin(flag) {
    console.log(flag)
    if (flag) {
      this.loggedIn = flag;
      this.userDetails = JSON.parse(localStorage.getItem('loggedInUser'));
    } else {
      this.loggedIn = false;
    }
  }

  logout() {
    this.setLogin(false);
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('loggedInUser');
  }
}
