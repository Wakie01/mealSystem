import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { HttpProvider } from 'src/providers/httpProvider';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

  protected userType:number;     //用户类型，0：worker，1：customer

  protected billNum:number=0;
  
  constructor(
    private http:HttpProvider,
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter(){
    this.userType =Number(window.sessionStorage.getItem("userType"));
    if(this.userType==0){
      this.getUnfinishBillNumber();
    }
  }

  async getUnfinishBillNumber(){
    let receiveData: any = await this.http.getData_post("getUnfinishBill", null, null);
    if (receiveData.code == 0) {
      this.billNum=receiveData.data.unfinishBills.length;
    }
  }

}
