import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, IonCheckbox, NavController, ToastController } from '@ionic/angular';
import { HttpProvider } from 'src/providers/httpProvider';

@Component({
  selector: 'app-serve-info',
  templateUrl: './serve-info.page.html',
  styleUrls: ['./serve-info.page.scss'],
})
export class ServeInfoPage implements OnInit {

  protected userType: number;     //用户类型，0：worker，1：customer   2: viewer

  private billId;
  private finish: boolean = false;   //标志此页面为历史账单的详情情况

  private updateInterval_si;

  constructor(
    private http: HttpProvider,
    private alertController: AlertController,
    private route: ActivatedRoute,
    private navController: NavController,
    private toastController: ToastController,
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.route.queryParams.subscribe(async res => {
      this.billId = res.billId;
      let deskId = res.deskId;
      let orderTime = res.orderTime;
      if (res.finish != null) this.finish = res.finish;
      let menuBills = await this.receiveMenuBillInfo(this.billId);
      this.userType =Number(window.sessionStorage.getItem("userType"));
      this.initMenuBillInfoHTML(menuBills, this.billId, deskId, orderTime);
      this.initHistoryBillsHTML();
      this.updateServeInfo(this.billId);
    });
  }

  ionViewDidEnter() {
    console.log("serve-info enter");
  }

  ionViewDidLeave() {
    if (this.updateInterval_si != null) {
      clearInterval(this.updateInterval_si);
      this.updateInterval_si = null;
    }
  }

  /**
   * 对顾客用户的checkBox进行disable
   */
  customerInit() {
    let checkBoxs = document.querySelectorAll("ion-checkbox");
    if (this.userType == 0) {
      checkBoxs.forEach(item => {
        item.disabled = false;
      });
    }
  }


  /**
   * 获取上菜情况信息
   */
  async receiveMenuBillInfo(billId) {
    let formData = new FormData();
    formData.append("billId", billId);

    let receiveData: any = await this.http.getData_post("getSpecificMenuBill", formData, null);
    if (receiveData.code != 0) {
      const alert = await this.alertController.create({
        header: '获取菜单信息失败',
        message: receiveData.msg,
        buttons: [
          {
            text: '确定',
            handler: () => { }
          }
        ]
      });
      return await alert.present();
    }
    return receiveData.data.menuBills;
  }


  /**
   * 对上菜情况信息进行生成HTML
   * @param menuBills 
   */
  initMenuBillInfoHTML(menuBills, billId, deskId, orderTime:string) {
    document.getElementById("deskTitle").innerText = deskId + "号桌";
    let billIdTitle=document.getElementById("billIdTitle");

    //单号
    let p1=document.createElement("p");
    p1.setAttribute("style","margin-bottom: 5px; margin-left: 10px;");
    p1.innerText = "单号：" + billId;

    //时间
    let p2=document.createElement("p");
    p2.setAttribute("style","margin-bottom: 0px; margin-left: 10px; margin-top: 5px;");
    let date=orderTime.slice(0,4)+"-"+orderTime.slice(4,6)+"-"+orderTime.slice(6,8);
    let time=orderTime.slice(8, 10) + ":" + orderTime.slice(10, 12)+ ":" + orderTime.slice(12, 14);
    p2.innerText = "时间：" + date+" "+time;

    billIdTitle.querySelector("p").remove();
    billIdTitle.querySelector("p").remove();

    billIdTitle.append(p1);
    billIdTitle.append(p2);

    let serveInfoGrid = document.getElementById("serveInfoGrid");

    let rowNodes = serveInfoGrid.querySelectorAll("ion-row");
    for (let i = 1; i < rowNodes.length; i++) {
      rowNodes[i].remove();
    }

    let totalPrice: number = 0;

    menuBills.forEach(item => {
      let ionRow = document.createElement("ion-row");
      ionRow.setAttribute("style", "padding: 3px 0px;");

      //菜名
      let ionCol = document.createElement("ion-col");
      ionCol.setAttribute("style", "display: flex;justify-content: center;align-items: center;");
      ionCol.innerText = item.name;

      //数量Col
      let ionCol2 = document.createElement("ion-col");
      ionCol2.setAttribute("style", "display: flex;justify-content: center;align-items: center;");
      ionCol2.innerText = item.quantity;

      //价钱Col
      let ionCol4 = document.createElement("ion-col");
      ionCol4.setAttribute("style", "display: flex;justify-content: center;align-items: center;");
      ionCol4.innerText = "￥" + item.price * item.quantity;
      totalPrice += item.price * item.quantity

      //上菜Col
      let ionCol3 = document.createElement("ion-col");
      ionCol3.setAttribute("style", "display: flex;justify-content: center;align-items: center;");

      let ionCheckbox = document.createElement("ion-checkbox");
      ionCheckbox.checked = item.finish;
      ionCheckbox.disabled = this.userType != 0;
      ionCheckbox.addEventListener("ionChange", async () => {
        if (!ionCheckbox.checked) {
          const alert = await this.alertController.create({
            header: '提示',
            message: '此菜之前已上，确定要重上？',
            buttons: [
              {
                text: '取消',
                handler: () => {
                  ionCheckbox.checked = true;
                }
              },
              {
                text: '确定',
                handler: async () => {
                  if (!this.updateMenuBillStatus(billId, item.menuId, "0")) {
                    ionCheckbox.checked = true;
                    return;
                  }
                  const toast = await this.toastController.create({
                    message: '取消上菜',
                    duration: 2000
                  });
                  return await toast.present();
                }
              }
            ]
          });
          return await alert.present();
        }

        if (!this.updateMenuBillStatus(billId, item.menuId, "1")) {
          ionCheckbox.checked = false;
          return;
        }
        const toast = await this.toastController.create({
          message: '完成上菜',
          duration: 2000
        });
        return await toast.present();
      });


      ionCol3.append(ionCheckbox);

      ionRow.append(ionCol);
      ionRow.append(ionCol2);
      ionRow.append(ionCol4);
      ionRow.append(ionCol3);

      serveInfoGrid.append(ionRow);
    });

    document.getElementById("totalPriceP").innerText = "￥" + totalPrice;
  }


  /**
   * 对菜单的完成情况进行更新
   */
  async updateMenuBillStatus(billId: string, menuId: string, status: string) {
    let formData = new FormData();
    formData.append("billId", billId);
    formData.append("menuId", menuId);
    formData.append("status", status);
    let receiveData: any = await this.http.getData_post("updateMenuBillStatus", formData, null);
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
      return false;
    }

    return true;
  }


  /**
   * 对上菜情况进行下拉刷新
   */
  refreshServeInfo(event) {
    // this.ionViewWillEnter();
    event.target.complete();
  }


  /**
   * 定时更新上菜情况
   */
  updateServeInfo(billId) {
    if (this.updateInterval_si == null) {
      this.updateInterval_si = setInterval(async () => {
        let menuBills = await this.receiveMenuBillInfo(billId);

        let rowNodes = document.getElementById("serveInfoGrid").querySelectorAll("ion-row");

        menuBills.forEach(item => {
          for (let i = 1; i < rowNodes.length; i++) {
            if (rowNodes[i].querySelector("ion-col").innerText == item.name) {
              rowNodes[i].querySelector("ion-checkbox").checked = item.finish;
              break;
            }
          }
        })
      }, 10 * 1000);
    }

  }

  /**
   * 结束账单
   */
  async finishBill() {
    let checkBoxs = document.getElementById("serveInfoGrid").querySelectorAll("ion-checkbox");
    for (let i = 0; i < checkBoxs.length; i++) {
      if (!checkBoxs[i].checked) {
        let alert = await this.alertController.create({
          header: '出错',
          message: '请先完成上菜，再结束订单',
          buttons: [
            {
              text: '确定',
              handler: () => { }
            }
          ]
        });
        return await alert.present();
      }
    }

    let formData = new FormData();
    formData.append("billId", this.billId);
    let receiveData: any = await this.http.getData_post("finishBill", formData, null);
    if (receiveData.code != 0) {
      const alert = await this.alertController.create({
        header: '出错',
        message: receiveData.msg,
        buttons: [
          {
            text: '确定',
            handler: () => {
              if (receiveData.code == 8) {
                this.navController.navigateRoot(['/tabs/bills']);
              }
            }
          }
        ]
      });
      return await alert.present();
    }

    const toast = await this.toastController.create({
      message: '完成订单',
      duration: 2000
    });
    await toast.present();
    this.navController.navigateRoot(['/tabs/bills']);
  }


  /**
   * 对历史账单详情页面进行适当的HTML修改
   */
  initHistoryBillsHTML() {
    if (this.finish) {
      document.getElementById("title_si").innerText = "订单详情";
      document.getElementById("footer_si").hidden = true;

      let ionCheckBoxs = document.getElementById("serveInfoGrid").querySelectorAll("ion-checkbox");
      for (let i = 0; i < ionCheckBoxs.length; i++) {
        ionCheckBoxs[i].disabled = true;
      }
    }
  }

  /**
   * 用户结束用餐,主要是提示
   */
  async finishMeal(){
    let checkBoxs = document.getElementById("serveInfoGrid").querySelectorAll("ion-checkbox");
    for (let i = 0; i < checkBoxs.length; i++) {
      if(!checkBoxs[i].checked){
        const alert = await this.alertController.create({
          header: '提示',
          message: '尚有菜未上完，确定要结束用餐吗？',
          buttons: [
            {
              text: '取消',
            },
            {
              text: '确定',
              handler: () => {
                this.userFinishMeal();
              }
            }
          ]
        });
        return await alert.present();
      }
    }
    this.userFinishMeal();
  }

  /**
   * 用户结束用餐实际方法
   */
  async userFinishMeal(){
    let toast=await this.toastController.create({
      message:'客官慢走，欢迎再次光临',
      duration:3000
    });
    await toast.present();
    window.sessionStorage.clear();
    this.navController.navigateRoot(['/home']);
  }



}
