import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { HttpClientModule } from '@angular/common/http';
import { HttpProvider } from 'src/providers/httpProvider';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { FileTransfer} from '@ionic-native/file-transfer/ngx';
import { QRScanner } from '@ionic-native/qr-scanner/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [
    QRScanner,
    StatusBar,
    SplashScreen,
    HttpProvider,
    ImagePicker,
    FileTransfer,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
