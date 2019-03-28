import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MintService } from '../services/mint.service';
import { DataService } from '../services/data.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-reset-password',
  template: `
    <form #passwordResetForm="ngForm">
      <div class="modal-header bg-mint-red text-light">
        <h4 class="modal-title">Forgot Password ?</h4>
        <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div class="text-center">
          Enter your Hubble username to receive a reset link on your email
        </div>
        <div class="form-group mt-2">
          <input type="text" name="hubbleId" id="hubbleId" class="form-control" #hubbleId ngModel
                 placeholder="Hubble ID" required/>
        </div>
        <div [ngClass]="(response?.isReset)? 'text-success': 'text-danger'">
          <p class="message"> {{response?.Message}}</p>
          <!--<span *ngIf="!response?.isReset">Please try again with valid Hubble Id</span>-->
        </div>
      </div>
      <div class="modal-footer">
        <div class="btn btn btn-outline-secondary " (click)="activeModal.close('Close click')">
          Cancel
        </div>
        <button class="btn btn btn-outline-danger" [disabled]="!passwordResetForm.form.valid"
                (click)="resetPassword(hubbleId.value)">
          <span class=" fa fa-fw fa-refresh " [ngClass]="loading? 'fa-spin' : ''"></span> Reset Password
        </button>
      </div>
    </form>
  `,
  styleUrls: ['./login.component.less']
})
export class ResetPasswordComponent {
  loading: boolean;
  response: any;

  constructor(public activeModal: NgbActiveModal, private mint: MintService) {
  }

  resetPassword(hubbleId) {
    this.loading = true;
    this.response = '';
    this.mint.resetPassword(hubbleId).subscribe(res => {
      this.response = res;
      this.loading = false;
    }, error => {
      console.log(error.error);
      this.response = error.error;
      this.loading = false;
    });
  }
}


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {
  @Output() passAuth = new EventEmitter<boolean>();

  message: string;
  loading = false;
  auditInProgress = true;
  auditDetails;

  constructor(private mint: MintService, private data: DataService, private modalService: NgbModal) {
    this.mint.getAuditDetails().subscribe(res => {
      this.auditDetails = res;
      this.auditInProgress = this.auditDetails.isAuditRunning;
      this.data.auditDetails = this.auditDetails;
    },
      error => this.message = error.message);
  }

  ngOnInit() {
  }

  login(loginForm) {
    const username = loginForm.username;
    const password = loginForm.password;
    this.loading = true;

    /*localStorage.setItem('loggedIn', 'true');
    this.passAuth.emit(true);*/

    this.data.username = username;
    this.data.password = password;
    localStorage.setItem('username', username);
    localStorage.setItem('password', password);
    this.mint.login().subscribe(res => {
      if (res['Message'] === 'Login successful') {
        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('loggedInUser', JSON.stringify(res['UserModel']));
        this.passAuth.emit(true);
      }
      this.loading = false;
    },
      error => {
        this.message = error.error['Message'];
        this.loading = false;
      });
  }

  open() {
    this.modalService.open(ResetPasswordComponent);

  }
}
