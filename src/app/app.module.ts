import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {LoginComponent, ResetPasswordComponent} from './login/login.component';
import {AddReasonComponent, DashboardComponent} from './dashboard/dashboard.component';
import {CameraComponent, MessageComponent} from './camera/camera.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import {FormsModule} from '@angular/forms';
import {MintService} from './services/mint.service';
import {HttpClientModule} from '@angular/common/http';
import {DataService} from './services/data.service';
import {SidebarModule} from 'ng-sidebar';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {RouterModule, Routes} from '@angular/router';
import {QrCodeReader} from './services/qrcode-reader.service';



const appRoutes: Routes = [
  {path: '', component: DashboardComponent},
  {path: 'camera/:id', component: CameraComponent},
  {path: 'home', component: DashboardComponent}
];


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    TopBarComponent,
    CameraComponent,
    AddReasonComponent,
    MessageComponent,
    ResetPasswordComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    HttpClientModule,
    SidebarModule.forRoot(),
    NgbModule.forRoot(),
    RouterModule.forRoot(appRoutes),
  ],
  providers: [
    MintService,
    DataService,
    QrCodeReader
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    ResetPasswordComponent,
    MessageComponent,
    AddReasonComponent
  ]
})
export class AppModule { }
