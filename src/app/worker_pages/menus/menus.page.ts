import { HttpHeaders } from '@angular/common/http';
import { Component, Inject, Injectable, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { HttpProvider } from 'src/providers/httpProvider';

@Component({
  selector: 'app-menus',
  templateUrl: './menus.page.html',
  styleUrls: ['./menus.page.scss'],
})
export class MenusPage implements OnInit {

  protected userType: number;     //用户类型，0：worker，1：customer   2: viewer

  private menuInfo: any;

  private menu: any;     //对应类型的菜单

  private menuInterval = null;   //定时器

  protected deskId: string;   //桌号

  protected totalprice: number = 0;    //总价

  public static shoppingCar: Map<string, any> = new Map<string, any>();   //购物车

  constructor(
    private http: HttpProvider,
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {

  }

  async ionViewWillEnter() {
    await this.receiveAllMenus();
    if (this.menuInfo != null) {
      this.generateMenuTypeHTML();
      this.initMenuList();
    }
    this.initTotalPrice();
  }

  ionViewDidEnter() {
    this.userType = Number(window.sessionStorage.getItem("userType"));
    if (this.userType == 1) {
      this.deskId = window.sessionStorage.getItem("deskId");
    }
    this.upDateMenuInfo();
    
  }


  ionViewDidLeave() {
    console.log("menus leave");
    clearInterval(this.menuInterval);
    this.menuInterval=null;
  }

  /**
   * 获取菜单信息
   */
  async receiveAllMenus() {
    let formData = new FormData();
    formData.append("hotMenu", "1");
    let receiveData: any = await this.http.getData_post("getMenuInfo", formData, null);
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
    this.menuInfo = receiveData.data;

  }

  /**
   * 根据菜类型id获取相关的菜
   * @param id ,name
   */
  getMenusByType(id, name) {
    let menuList = document.getElementById("menuList");

    let itemNodes = menuList.querySelectorAll("ion-item");
    for (let i = 1; i < itemNodes.length; i++) {
      itemNodes.item(i).remove();
    }

    itemNodes.item(0).querySelector("ion-label").innerText = name;

    if (id == 1) {
      this.menuInfo.hotMenu.forEach(item => {
        this.generateMenusHTML(item);
      });
    } else {
      this.menuInfo.menu.forEach(item => {
        if (item.typeId == id) {
          this.generateMenusHTML(item);
        }
      });
    }
  }

  /**
   * 嵌入关于菜单类型的HTML
   */
  generateMenuTypeHTML() {
    let menuTypeList = document.getElementById("menuTypeList");

    let itemNodes = menuTypeList.querySelectorAll("ion-item");
    for (let i = 1; i < itemNodes.length; i++) {
      itemNodes[i].remove();
    }

    this.menuInfo.menuType.forEach(item => {
      let ionItem = document.createElement("ion-item");
      ionItem.setAttribute("button", "true");
      ionItem.setAttribute("lines", "full");
      ionItem.onclick = () => { this.getMenusByType(item.id, item.name) };

      let ionLabel = document.createElement("ion-label");
      ionLabel.innerText = item.name;

      ionItem.appendChild(ionLabel);
      menuTypeList.appendChild(ionItem);

    });

  }


  /**
   * 生成嵌入菜单列表的HTML
   * @param menu 
   */
  generateMenusHTML(menu) {
    let menuList = document.getElementById("menuList");

    let ionItem = document.createElement("ion-item");
    ionItem.setAttribute("lines", "full");
    ionItem.setAttribute("style", "--inner-padding-end:1px;--min-height:51px;");

    let ionThumbnail = document.createElement("ion-thumbnail");
    ionThumbnail.setAttribute("slot", "start");
    ionThumbnail.onclick = () => {
      this.router.navigate(['/menu-info'], { queryParams: { menuId: menu.id } });
    };

    let img = document.createElement("img");
    img.setAttribute("style","solid  1px #ddd9d9");
    if(menu.image!=null && menu.image!=""){
      img.src = this.http.server+"menuImage/"+menu.image;
    }
    
    ionThumbnail.appendChild(img);

    let ionLabel = document.createElement("ion-label");
    ionLabel.style.textAlign = "left";

    let h2 = document.createElement("h2");
    h2.style.width = "95%";
    h2.innerText = menu.name;

    let p1 = document.createElement("p");
    p1.style.float = "left";
    p1.innerText = "库存：" + menu.quantity;

    let p2 = document.createElement("p");
    p2.style.float = "left";
    p2.style.color = "red";
    p2.style.clear = "left";
    p2.innerText = "￥" + menu.price;

    //按钮
    let ionButton = document.createElement("ion-button");
    ionButton.setAttribute("fill", "clear");
    ionButton.setAttribute("color", "secondary");
    ionButton.setAttribute("slot", "end");
    ionButton.style.marginBottom = "0px";
    ionButton.style.float = "right";
    ionButton.style.marginTop = "-15px";
    ionButton.style.height = "37px";

    ionButton.onclick = () => {
      if (this.userType == 0) {
        //员工
        this.router.navigate(['/menu-info'], { queryParams: { menuId: menu.id } });
      } else if (this.userType == 1) {
        //顾客
        this.addMenuToCar(menu);
        this.totalprice += menu.price;
      }

    }

    let ionIcon = document.createElement("ion-icon");
    if (this.userType == 0) {
      ionIcon.setAttribute("name", "information-circle-outline");
    } else if (this.userType == 1) {
      ionIcon.setAttribute("name", "add-circle-outline");
    }
    ionIcon.style.width = "27px";
    ionIcon.style.height = "27px";

    ionButton.appendChild(ionIcon);

    ionLabel.appendChild(h2);
    ionLabel.appendChild(p1);
    ionLabel.appendChild(p2);

    if (this.userType != 2) {
      ionLabel.appendChild(ionButton);
    }


    ionItem.appendChild(ionThumbnail);
    ionItem.appendChild(ionLabel);

    if (this.userType != 0) {
      //顾客 or 看客
      menuList.appendChild(ionItem);
    } else {
      //工作人员   添加删除按钮
      let ionItemSliding = document.createElement("ion-item-sliding");

      let ionItemOptions = document.createElement("ion-item-options");

      let ionItemOption = document.createElement("ion-item-option");
      ionItemOption.setAttribute("color", "danger");

      let ionIcon2 = document.createElement("ion-icon");
      ionIcon2.setAttribute("name", "trash-outline");
      ionIcon2.setAttribute("style", "width: 20px; height: 20px;");

      let ionLabel = document.createElement("ion-label");
      ionLabel.innerText = "删除";

      ionItemOption.append(ionIcon2);
      ionItemOption.append(ionLabel);
      ionItemOption.onclick = async () => {
        const alert = await this.alertController.create({
          header: '提示',
          message: '确定要删除此菜单？',
          buttons: [
            {
              text: '取消',
              handler: () => { }
            },
            {
              text: '确定',
              handler: () => {
                if (this.deleteMenu(menu.id)) {
                  ionItemSliding.remove();
                }
              }
            }
          ]
        });
        return await alert.present();
      }

      ionItemOptions.append(ionItemOption);

      ionItemSliding.append(ionItem);
      ionItemSliding.append(ionItemOptions);

      menuList.append(ionItemSliding);
    }

  }

  /**
   * 初始化菜单列表，默认本周热门
   */
  initMenuList() {
    let menuList = document.getElementById("menuList");

    let itemNodes = menuList.querySelectorAll("ion-item");
    for (let i = 1; i < itemNodes.length; i++) {
      itemNodes.item(i).remove();
    }

    itemNodes.item(0).querySelector("ion-label").innerText = "本周热门";

    this.menuInfo.hotMenu.forEach(item => {
      this.generateMenusHTML(item);
    });
  }


  /**
   * 定时更新菜单库存
   */
  upDateMenuInfo() {
    this.menuInterval = setInterval(() => {
      this.receiveAllMenus();

      let itemList = document.getElementById("menuList").querySelectorAll("ion-item");
      for (let j = 1; j < itemList.length; j++) {
        let h2 = itemList[j].querySelector("ion-label").querySelector("h2");
        let p = itemList[j].querySelector("ion-label").querySelector("p");

        for (let i = 0; i < this.menuInfo.menu.length; i++) {
          if (this.menuInfo.menu[i].name == h2.innerText) {
            p.innerText = "库存：" + this.menuInfo.menu[i].quantity;
            break;
          }
        }
      }
    }, 10 * 1000);
  }


  /**
   * 删除id为menuId的菜单
   * @param menuId 
   */
  async deleteMenu(menuId) {
    let formData = new FormData();
    formData.append("id", menuId);
    let receiveData: any = await this.http.getData_post("deleteMenu", formData, null);
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

    let toast = await this.toastController.create({
      message: '删除成功',
      duration: 2000
    });
    await toast.present();
    return true;
  }


  /**
   * 添加菜单到购物车
   */
  addMenuToCar(menu) {
    if (!MenusPage.shoppingCar.has(menu.id)) {
      let menuValue = {
        name: menu.name,
        num: 1,
        price: menu.price,
        totalPrice: menu.price
      };
      MenusPage.shoppingCar.set(menu.id, menuValue);
    } else {
      let menuValue = MenusPage.shoppingCar.get(menu.id);
      menuValue.num++;
      menuValue.totalPrice+=menuValue.price;
      MenusPage.shoppingCar.set(menu.id,menuValue);
    }
  }


  /**
   * 对总价进行计算
   */
  initTotalPrice(){
    this.totalprice=0;
    MenusPage.shoppingCar.forEach((value)=>{
      this.totalprice+=value.totalPrice;
    });

  }
  


  hello(){
    if(this.menuInterval!=null){
      clearInterval(this.menuInterval);
      this.menuInterval=null;
    }
  }



}
