import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { HttpProvider } from 'src/providers/httpProvider';

@Component({
  selector: 'app-bills',
  templateUrl: './bills.page.html',
  styleUrls: ['./bills.page.scss'],
})
export class BillsPage implements OnInit {

  private updateInterval = null;
  
  constructor(
    private http: HttpProvider,
    private alertController: AlertController,
    private router: Router,
  ) { }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    let unfinishBills = await this.getUnfinishBill();
    this.initUnfinishBillHTML(unfinishBills);
  }

  ionViewDidEnter() {
    this.updateBills();
  }

  ionViewWillLeave() {
    console.log("leave");
    if (this.updateInterval != null) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  /**
   * 获取当前账单
   */
  async getUnfinishBill() {
    let receiveData: any = await this.http.getData_post("getUnfinishBill", null, null);
    if (receiveData.code != 0) {
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
      return null;
    }

    return receiveData.data.unfinishBills;
  }


  /**
   * 对当前账单进行生成HTML
   */
  initUnfinishBillHTML(unfinishBills) {
    let billGrid = document.getElementById("billGrid");

    let rowNodes = billGrid.querySelectorAll("ion-row");
    for (let i = 1; i < rowNodes.length; i++) {
      rowNodes[i].remove();
    }

    unfinishBills.forEach(item => {
      let ionRow = document.createElement("ion-row");
      ionRow.setAttribute("style", "padding: 3px 0px;");

      let ionCol = document.createElement("ion-col");
      ionCol.setAttribute("style", "justify-content: center;display: flex;align-items: center;");

      let a = document.createElement("a");

      a.onclick = () => {
        this.router.navigate(['/serve-info'], { queryParams: { billId: item.id,deskId:item.deskId,orderTime:item.orderTime } });
      }
      a.innerText = item.id;
      ionCol.append(a);

      let ionCol2 = document.createElement("ion-col");
      ionCol2.setAttribute("style", "justify-content: center;display: flex;align-items: center;");
      ionCol2.innerText = item.deskId;

      let ionCol3 = document.createElement("ion-col");
      ionCol3.setAttribute("style", "justify-content: center;display: flex;align-items: center;");
      let timeStr = new String(item.orderTime);
      ionCol3.innerText = timeStr.slice(8, 10) + ":" + timeStr.slice(10, 12);

      ionRow.append(ionCol);
      ionRow.append(ionCol2);
      ionRow.append(ionCol3);

      billGrid.append(ionRow);


    });

    document.getElementById("notifyP").innerText = "目前餐厅有" + unfinishBills.length + "桌人用餐";
  }


  /**
   * 对当前账单进行刷新
   */
  async refreshBills(event) {
    await this.ionViewWillEnter();
    event.target.complete();
  }


  /**
   * 定时对当前账单进行更新
   */
  updateBills() {
    if (this.updateInterval == null) {
      this.updateInterval = setInterval(() => {
        this.ionViewWillEnter();
      }, 10 * 1000);
    }

  }

}
