import { Component, Input, OnInit } from '@angular/core';
import { MintService } from '../services/mint.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-comment',
  template: `
    <form #reasonForm="ngForm">
      <div class="modal-header bg-mint-red text-light">
        <h4 class="modal-title"><span *ngIf="item.scan.accountedFor">You added a reason :</span> <span *ngIf="!item.scan.accountedFor">Add Reason</span>
        </h4>
        <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div *ngIf="item.scan.accountedFor">
          <div class="mt-2">
            " {{item['reason']['reasonText']}} "
          </div>
        </div>
        <div class="form-group" *ngIf="!item.scan.accountedFor">
          <label for="reason" class="text-muted small">Choose pre-defined comment</label>
          <select name="reason" id="reason" #reason class="form-control" (change)="showTextArea(reason.value)" ngModel required>
            <option value="The device is not with me">The device is not with me</option>
            <option value="I have returned it to IT Team">I have returned it to IT Team</option>
            <option value="The device is misplaced">The device is misplaced</option>
            <option value="The device is broken">The device is broken</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div class="form-group" *ngIf="other">
          <label for="custom-reason" class="text-muted small">Custom reason</label>
          <textarea class="form-control" name="customReason" id="custom-reason"
                    placeholder="Type your reason here" ngModel [required]="other"></textarea>
        </div>
        <div class="small p-1 text-center" [ngClass]="success? 'text-success': 'text-danger'">
          {{message}}
        </div>
      </div>
      <div class="modal-footer" *ngIf="!item.scan.accountedFor">
        <div *ngIf="!success; else closeBtn">
          <div class="btn btn btn-outline-secondary " (click)="activeModal.close('Close click')">
            <!--<span class=" fa fa-fw fa-plus"></span>--> Cancel
          </div>
          <button class="btn btn btn-outline-danger ml-2" [disabled]="reasonForm.invalid" (click)="addReason(reasonForm.value)">
            <span class=" fa fa-fw fa-plus"></span> Reason
          </button>
        </div>
        <ng-template #closeBtn>
          <div class="btn btn btn-outline-danger " (click)="activeModal.close('Close click')">
            <!--<span class=" fa fa-fw fa-plus"></span>--> Close
          </div>
        </ng-template>
      </div>
    </form>
  `
})
export class AddReasonComponent implements OnInit {
  @Input() item;
  other: boolean = false;
  message: any;
  success: boolean = false;

  constructor(public activeModal: NgbActiveModal, private mint: MintService) {

  }

  ngOnInit() {
    console.log(this.item);
  }

  showTextArea(value) {
    if (value === 'other') {
      this.other = true;
    } else {
      this.other = false;
    }
  }

  addReason(formData) {
    console.log(formData, 'reason')
    let reasonText = formData.reason;
    if (reasonText === 'other') {
      reasonText = formData.customReason;
    }
    this.mint.addReason(reasonText, this.item._id).subscribe(res => {
      this.message = 'Comment added successfully!';
      this.success = true;
    }, error => {
      this.message = 'Could not add comment. Please try again!';
      this.success = false;
    });
  }
}


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less']
})
export class DashboardComponent implements OnInit {

  deviceList = [];
  loading = true;
  interval: NodeJS.Timer;

  constructor(private mint: MintService, private modalService: NgbModal) {

  }

  ngOnInit() {
    this.mint.getAllDevicesByUserId().subscribe((res) => {
      console.log(res, '---->')
      this.deviceList = Object.assign([], res);
      this.loading = false;
    }, (err) => {
      console.log('error', err)
      this.deviceList = [];
      this.loading = false;
    });
    // this.timeOUT();
  }


  open(item) {
    const modalRef = this.modalService.open(AddReasonComponent);
    modalRef.componentInstance.item = item;
    this.mint.getAllDevicesByUserId().subscribe((res) => {
      console.log(res, '---->')
      this.deviceList = Object.assign([], res);
      this.loading = false;
    }, (err) => {
      console.log('error', err)
      this.deviceList = [];
      this.loading = false;
    });
  }
  // timeOUT() {
  //   this.interval = setInterval(() => {
  //     this.ngOnInit()
  //   }, 5000);
  // }
  // ngOnDestroy() {
  //   clearInterval(this.interval)
  // }

}
