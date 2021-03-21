import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { MenusPage } from 'src/app/worker_pages/menus/menus.page';
import { HttpProvider } from 'src/providers/httpProvider';

@Component({
  selector: 'app-bill-info',
  templateUrl: './bill-info.page.html',
  styleUrls: ['./bill-info.page.scss'],
})
export class BillInfoPage implements OnInit {

  private totalPrice: number = 0;
  private newClient: boolean = true;      //新客户
  private billId = null;     //旧客户的话会有个billId

  constructor(
    private http: HttpProvider,
    private navController:NavController,
    private alertController: AlertController,
    private toastController: ToastController,
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.initBillInfoPageHTML();
  }

  ionViewDidEnter() {

  }

  /**
   * 对结账页面HTML进行初始化
   */
  initBillInfoPageHTML() {
    this.totalPrice = 0;
    this.billId = window.sessionStorage.getItem("billId");

    document.getElementById("billInfoTitle").innerText = window.sessionStorage.getItem("deskId") + "号桌";

    let billInfoGrid = document.getElementById("billInfoGrid");

    //清楚原有的ion-row
    let rowNodes = billInfoGrid.querySelectorAll("ion-row");
    for (let i = 1; i < rowNodes.length; i++) {
      rowNodes[i].remove();
    }

    //已完成订单时
    let billId=window.sessionStorage.getItem("billId");
    if(billId!=null){
      let orderTime=window.sessionStorage.getItem("orderTime");
      let deskId=window.sessionStorage.getItem("deskId");
      document.getElementById("serveInfoDiv").hidden = false;
      document.getElementById("serveInfoDiv").querySelector("ion-button").onclick = () => {
        this.navController.navigateRoot(['/serve-info'],
        { queryParams: { billId: billId, deskId: deskId, orderTime: orderTime } });
      }
    }

    //购物车没东西时
    if (MenusPage.shoppingCar.size == 0) {
      let ionRow = document.createElement("ion-row");
      ionRow.setAttribute("style", "padding: 20px 0px;");

      let ionCol = document.createElement("ion-col");
      ionCol.setAttribute("style", "display: flex;justify-content: center;align-items: center;");
      if (this.billId == null) {
        ionCol.innerText = "空空如也，快去点菜吧~~~";
      } else {
        ionCol.innerText = "您已完成支付，祝你用餐愉快~~~";
      }
      ionRow.append(ionCol);
      billInfoGrid.append(ionRow);
      return;
    }

    MenusPage.shoppingCar.forEach((value, key) => {

      let ionRow = document.createElement("ion-row");
      ionRow.setAttribute("style", "padding: 3px 0px;");

      //菜名
      let ionCol = document.createElement("ion-col");
      ionCol.setAttribute("style", "display: flex;justify-content: center;align-items: center;");
      ionCol.innerText = value.name;

      //数量
      let ionCol2 = document.createElement("ion-col");
      ionCol2.setAttribute("style", "display: flex;justify-content: center;align-items: center;");
      ionCol2.innerText = value.num;

      //单价
      let ionCol3 = document.createElement("ion-col");
      ionCol3.setAttribute("style", "display: flex;justify-content: center;align-items: center;");
      ionCol3.innerText = value.price;

      //总价
      let ionCol4 = document.createElement("ion-col");
      ionCol4.setAttribute("style", "display: flex;justify-content: center;align-items: center;");
      ionCol4.innerText = value.totalPrice;

      //删除
      let ionCol5 = document.createElement("ion-col");
      ionCol5.setAttribute("style", "display: flex;justify-content: center;align-items: center;");
      ionCol5.setAttribute("size", "1");

      let button = document.createElement("ion-button");
      button.setAttribute("fill", "clear");
      button.setAttribute("color", "danger");
      button.onclick = () => {
        this.decreaseMenuNum(key, ionRow);
      }

      let icon = document.createElement("ion-icon");
      icon.setAttribute("name", "remove-circle-outline");

      button.append(icon);
      ionCol5.append(button);

      ionRow.append(ionCol);
      ionRow.append(ionCol2);
      ionRow.append(ionCol3);
      ionRow.append(ionCol4);
      ionRow.append(ionCol5);

      billInfoGrid.append(ionRow);

      this.totalPrice += value.totalPrice;
      
    });

    
  }

  /**
   * 对菜单数量减一
   * @param menuId 
   * @param rowNode 
   */
  decreaseMenuNum(menuId, rowNode: HTMLIonRowElement) {
    let menuValue = MenusPage.shoppingCar.get(menuId);
    this.totalPrice -= menuValue.price;
    if (menuValue.num == 1) {
      //减完就没了
      MenusPage.shoppingCar.delete(menuId);
      rowNode.remove();
    } else {
      //只是减一
      rowNode.querySelectorAll("ion-col")[1].innerText = (--menuValue.num) + "";
      menuValue.totalPrice -= menuValue.price;
      rowNode.querySelectorAll("ion-col")[3].innerText = menuValue.totalPrice;
      MenusPage.shoppingCar.set(menuId, menuValue);
    }
  }


  /**
   * 支付
   */
  async payBill() {
    if(MenusPage.shoppingCar.size==0){
      const alert = await this.alertController.create({
        header: '提示',
        message: '无须支付，请您先点菜',
        buttons: [
          {
            text: '确定',
          }
        ]
      });
      return await alert.present();
    }
    if(this.billId==null){
      this.payNewBill();
    }else{
      this.payOldBill();
    }
  }


  /**
   * 创建新的账单，然后支付
   */
  async payNewBill() {
    let reqData = {
      deskId: window.sessionStorage.getItem("deskId"),
      menuBill: [],
    };
    MenusPage.shoppingCar.forEach((value, key) => {
      reqData.menuBill.push({ menuId: key, quantity: value.num });
    });

    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    let receiveData: any = await this.http.getData_post("generateBill", reqData, headers);
    if (receiveData.code != 0) {
      const alert = await this.alertController.create({
        header: '支付失败',
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

    let toast = await this.toastController.create({
      message: '支付成功',
      duration: 3000
    });
    await toast.present();

    MenusPage.shoppingCar.clear();
    this.initBillInfoPageHTML();
    document.getElementById("serveInfoDiv").hidden = false;

    this.billId = receiveData.data.billId;
    let orderTime = receiveData.data.orderTime;
    window.sessionStorage.setItem("billId", this.billId);
    window.sessionStorage.setItem("orderTime", orderTime);
    document.getElementById("serveInfoDiv").querySelector("ion-button").onclick = () => {
      this.navController.navigateRoot(['/serve-info'],
      { queryParams: { billId: this.billId, deskId: window.sessionStorage.getItem("deskId"), orderTime: orderTime } });
    }
  }


  /**
   * 在旧的账单上进行添加，然后支付
   */
  async payOldBill() {
    let reqData = {
      billId: this.billId,
      menuBill: [],
    };

    MenusPage.shoppingCar.forEach((value, key) => {
      reqData.menuBill.push({ menuId: key, quantity: value.num });
    });

    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    let receiveData: any = await this.http.getData_post("appendBill", reqData, headers);
    if (receiveData.code != 0) {
      const alert = await this.alertController.create({
        header: '支付失败',
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

    let toast = await this.toastController.create({
      message: '支付成功',
      duration: 3000
    });
    await toast.present();

    MenusPage.shoppingCar.clear();
    this.initBillInfoPageHTML();
  }

}
