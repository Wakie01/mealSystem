import { Component, OnInit } from '@angular/core';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-scan',
  templateUrl: './scan.page.html',
  styleUrls: ['./scan.page.scss'],
})
export class ScanPage implements OnInit {

  public light: boolean;    //判断闪光灯
  public frontCamera: boolean;    //判断摄像头
  public isShow: boolean = false;     //控制显示背景，避免切换页面卡顿

  constructor(
    private qrScanner: QRScanner,
    private navController: NavController,
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    if(window.sessionStorage.getItem("deskId")!=null){
      this.navController.navigateRoot(['/tabs/menus']);
      return ;
    }

    this.qrScanner.prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          // start scanning
          let scanSub = this.qrScanner.scan().subscribe((text: string) => {
            console.log('Scanned something', text);
            // alert(text);
            this.qrScanner.hide(); // hide camera preview
            scanSub.unsubscribe(); // stop scanning

            window.sessionStorage.setItem("userType","1");
            window.sessionStorage.setItem("deskId",text);     
            this.navController.navigateRoot(['/tabs/menus']);
          });
          // 打开摄像头
          this.qrScanner.show();
        } else if (status.denied) {
          console.log('camera permission was permanently denied');
        } else {
          // permission was denied, but not permanently. You can ask for permission
          console.log('permission was denied, but not permanently');
        }
      })
      .catch((e: any) => console.log('Error is', e));
  }

  ionViewDidEnter() {
    this.isShow = true;//显示背景
  }

  ionViewWillLeave(){
    this.qrScanner.hide();
    this.qrScanner.destroy();
  }

  toggleLight(){
    if(this.light){
      this.qrScanner.disableLight();
    }else{
      this.qrScanner.enableLight();
    }
    this.light=!this.light;
  }

  toggleCamera(){
    if (this.frontCamera) {
      this.qrScanner.useBackCamera();
    } else {
      this.qrScanner.useFrontCamera();
    }
    this.frontCamera = !this.frontCamera;
  }
}
