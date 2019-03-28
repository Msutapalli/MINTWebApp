import {Component, Input, OnInit} from '@angular/core';
import {MintService} from '../services/mint.service';
import {QrCodeReader} from '../services/qrcode-reader.service';
import {Subscription} from 'rxjs';


import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-message',
  template: `
    <div class="modal-header bg-mint-red text-light">
      <h4 class="modal-title">Alert!</h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click'); activateCamera();">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <div class="text-center" [innerHTML] = "message"> </div>
    </div>
    <div class="modal-footer">
      <div class="btn btn btn-outline-danger " (click)="activeModal.close('Close click'); activateCamera();">
        Close
      </div>
    </div>
  `
})

export class MessageComponent {
  @Input() message;

  constructor(public activeModal: NgbActiveModal) {
  }

  activateCamera() {
    const video = document.querySelector('video');
    video.play();
  }
}

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.less']
})
export class CameraComponent implements OnInit {
  qrString = '';
  scanInProgress = false;
  fallbackCamera = false;
  subscription: Subscription;
  deviceQR = '';

  constructor(private mint: MintService, private qrReader: QrCodeReader, private modalService: NgbModal, private route: ActivatedRoute) {
    this.deviceQR = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i))) {
      this.fallbackCamera = true;
    } else {
      this.fallbackCamera = false;
      navigator.mediaDevices.getUserMedia({audio: false, video: {facingMode: {exact: 'environment'}}}).then((stream) => {
        const vid = document.getElementById('camera-stream');
        vid['srcObject'] = stream;
      }).catch((err) => {
        console.log('The following error occurred when trying to use getUserMedia: ' + err);
        this.fallbackCamera = true;
      });
    }
  }

  captureImage() {
    let decoderInput;
    this.scanInProgress = true;
    if (!this.fallbackCamera) {
      const canvas = document.querySelector('canvas');
      const video = document.querySelector('video');
      video.pause();
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0);
      decoderInput = this.b64toBlob(canvas.toDataURL().replace(/^data:image\/(png|jpeg|jpg);base64,/, ''), 'image/jpg');
    } else {
      decoderInput = document.getElementById('file-input')['files'][0];
    }
    this.subscription = this.qrReader.decode(decoderInput)
      .subscribe(decodedString => {
        this.qrString = decodedString;
        // this.qrString = 'MSS0001726';
        this.validateAndUpdate();
      });

  }

  validateAndUpdate() {
    if (this.qrString.length !== 10 || this.qrString.substr(0, 3) !== 'MSS') {
      this.open('Invalid QR Code. Please try again!');
      this.scanInProgress = false;
    } else if (this.deviceQR !== this.qrString) {
      this.open(`The scanned QR does not belong to this device. <br> Please scan the right device QR code.`);
      this.scanInProgress = false;
    } else {
      this.mint.updateScan(this.qrString).subscribe(res => {
        this.scanInProgress = true;
        // alert('Update Successful!');
        this.open('Update Successful!');
        this.scanInProgress = false;
      }, error => {
        this.open('Update Failed. Please try again!');
        this.scanInProgress = false;
      });
    }
  }


  b64toBlob(b64Data, contentType, sliceSize = 512) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, {type: contentType});
  }

  open(message) {
    const modalRef = this.modalService.open(MessageComponent);
    modalRef.componentInstance.message = message;
  }
}
