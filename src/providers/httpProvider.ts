import { AlertController } from '@ionic/angular';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from "@angular/core";

@Injectable()
export class HttpProvider {

  server: string = "http://192.168.0.103:8087/";

  constructor(
    private http: HttpClient,
    private alertController: AlertController,
  ) { }


  async getData_post(file: string, body: any, headers: HttpHeaders) {
    return this.http.post(this.server + file, body, { headers, withCredentials: true }).toPromise().catch(() => {
      this.networkAlert();
    });
  }

  async getData(file: string) {
    return this.http.get(this.server + file, { withCredentials: true }).toPromise().catch(() => {
      this.networkAlert();
    });
  }


  async networkAlert() {
    const alert = await this.alertController.create({
      header: '网络错误',
      message: '连接服务器失败，请稍后再试',
      buttons: [
        {
          text: '确定',
          handler: () => {
          }
        }
      ]
    });
    await alert.present();
  }
}