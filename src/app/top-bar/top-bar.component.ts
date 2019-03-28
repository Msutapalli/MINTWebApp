import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {DataService} from '../services/data.service';
import {MintService} from '../services/mint.service';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.less']
})
export class TopBarComponent implements OnInit {
  @Output() passAuth = new EventEmitter<boolean>();
  auditDetails = {};
  message;
  constructor( public data: DataService, public mint: MintService) {
    this.mint.getAuditDetails().subscribe(res => {
        this.auditDetails = res;
        this.data.auditDetails = this.auditDetails;
      },
      error => this.message = error.message);
  }

  ngOnInit() {
  }



}
