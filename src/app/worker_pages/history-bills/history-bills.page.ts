import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonDatetime } from '@ionic/angular';
import { format } from 'date-fns';
import { HttpProvider } from 'src/providers/httpProvider';

@Component({
  selector: 'app-history-bills',
  templateUrl: './history-bills.page.html',
  styleUrls: ['./history-bills.page.scss'],
})
export class HistoryBillsPage implements OnInit {

  @ViewChild("startTime", { static: false }) startTime: IonDatetime;
  @ViewChild("endTime", { static: false }) endTime: IonDatetime;

  constructor(
    private http: HttpProvider,
    private alertController: AlertController,
    private router: Router,
  ) { }

  ngOnInit() {
  }

  timeItemToggle() {
    let timeCard = document.getElementById("timeCard");
    if (timeCard.hidden) {
      timeCard.hidden = false;
    } else {
      timeCard.hidden = true;
    }
  }

  async searchHistoryBills() {
    if (this.startTime.value == null || this.endTime.value == null) {
      this.showAlert("出错", "请先选择始止时间");
      return;
    }

    let st = format(new Date(this.startTime.value), "yyyyMMdd");
    let et = format(new Date(this.endTime.value), "yyyyMMddhhmmss");

    if (st > et) {
      this.showAlert("出错", "请正确选择始止时间");
      return;
    }

    let reqData = {
      fromTime: st + "000000",
      toTime: et,
    };
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    let receiveData: any = await this.http.getData_post("getHistoryBills", reqData, headers);
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
    this.initHistoryBillsHTML(receiveData.data.historyBills,st,et);
  }


  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: [
        {
          text: '确定',
        }
      ]
    });
    await alert.present();
  }

  /**
   * 对历史账单页面HTML进行初始化
   * @param historyBills 
   */
  initHistoryBillsHTML(historyBills,st:string,et:string) {
    document.getElementById("timeCard").hidden=true;

    document.getElementById("startLabel").hidden=false;
    document.getElementById("startP").innerText="始："+st.slice(0,4)+"-"+st.slice(4,6)+"-"+st.slice(6,8);

    document.getElementById("endLabel").hidden=false;
    document.getElementById("endP").innerText="止："+et.slice(0,4)+"-"+et.slice(4,6)+"-"+et.slice(6,8);


    document.getElementById("historyBillsCard").hidden=false;
    
    let historyBillGrid = document.getElementById("historyBillGrid");

    let rowNodes = historyBillGrid.querySelectorAll("ion-row");
    for (let i = 1; i < rowNodes.length; i++) {
      rowNodes[i].remove();
    }

    let totalBenefit:number=0;

    historyBills.forEach(item => {
      let ionRow = document.createElement("ion-row");
      ionRow.setAttribute("style", "padding: 3px 0px;");

      //单号
      let ionCol = document.createElement("ion-col");
      ionCol.setAttribute("style", "display: flex;justify-content: center;align-items: center;");

      let a = document.createElement("a");
      a.onclick = () => {
        this.router.navigate(['/serve-info'], { queryParams: { billId: item.id,deskId:item.deskId,orderTime:item.orderTime,finish:true } });
      }
      a.innerText = item.id;
      ionCol.append(a);

      //桌号
      let ionCol2 = document.createElement("ion-col");
      ionCol2.setAttribute("style", "display: flex;justify-content: center;align-items: center;");
      ionCol2.innerText = item.deskId;

      //时间
      let ionCol3 = document.createElement("ion-col");
      ionCol3.setAttribute("style", "display:block; text-align: center;");
      ionCol3.size = "4";

      let orderTime=new String(item.orderTime);
      
      let p1=document.createElement("p");
      let date=orderTime.slice(0,4)+"-"+orderTime.slice(4,6)+"-"+orderTime.slice(6,8);
      p1.innerText=date;

      let p2=document.createElement("p");
      let time=orderTime.slice(8, 10) + ":" + orderTime.slice(10, 12)+ ":" + orderTime.slice(12, 14);
      p2.innerText=time;

      ionCol3.append(p1);
      ionCol3.append(p2);

      //收入
      let ionCol4 = document.createElement("ion-col");
      ionCol4.setAttribute("style", "display: flex;justify-content: center;align-items: center;");
      ionCol4.innerText="￥"+item.benefit;

      totalBenefit+=item.benefit;


      ionRow.append(ionCol);
      ionRow.append(ionCol2);
      ionRow.append(ionCol3);
      ionRow.append(ionCol4);

      historyBillGrid.append(ionRow);
    })

    document.getElementById("historyBillFooter").hidden=false;
    document.getElementById("totalBenefitLabel").innerText="￥"+totalBenefit.toFixed(2);
  }
}
