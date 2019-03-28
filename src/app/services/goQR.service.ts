import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GoQRService {

  constructor(private http: HttpClient) {
  }

  decodeQR(img) {
    const formData = new FormData();
    const contentType = 'image/jpg';
    const blob = this.b64toBlob(img, contentType);
    const imgBlob = new Blob([blob], {type: 'image/jpg'});
    formData.append('file', imgBlob, 'image.jpg');

    return this.http.post('https://api.qrserver.com/v1/read-qr-code/', formData);
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

}
