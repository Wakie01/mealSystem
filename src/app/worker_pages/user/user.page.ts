import { Component, OnInit } from '@angular/core';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { HttpProvider } from 'src/providers/httpProvider';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {

  protected acot:string;

  constructor(
    private http: HttpProvider,
    private alertController: AlertController,
    private navController:NavController,
    private toastController: ToastController,
  ) { }

  async ionViewWillEnter(){
    this.acot=window.sessionStorage.getItem("workerAcot");
    if(this.acot==null){
      const toast = await this.toastController.create({
        message: '用户登录已超时，请重新登录',
        duration: 4000
      });
      await toast.present();
      window.sessionStorage.clear();
      this.navController.navigateRoot(['/home']);
    }
  }

  ngOnInit() {
    

  }

  /**
   * 注销
   */
  async logout(){
    let receiveData: any = await this.http.getData_post("logout", null, null);
    if (receiveData.code != 0) {
      if(receiveData.code == 6){
        const toast = await this.toastController.create({
          message: receiveData.msg,
          duration: 2000
        });
        await toast.present();
        this.navController.navigateRoot(['/home']);
        return ;
      }
      const alert = await this.alertController.create({
        header: '出错',
        message: receiveData.msg,
        buttons: [
          {
            text: '确定',
            handler: () => { }
          }
        ]
      });
      await alert.present();
      return;
    }
    const toast = await this.toastController.create({
      message: '注销成功',
      duration: 2000
    });
    await toast.present();

    window.sessionStorage.clear();

    this.navController.navigateRoot(['/home']);

  }


  

}
