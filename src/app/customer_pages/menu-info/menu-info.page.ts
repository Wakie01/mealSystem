import { HttpHeaders } from '@angular/common/http';
import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { HttpProvider } from 'src/providers/httpProvider';

@Component({
  selector: 'app-menu-info',
  templateUrl: './menu-info.page.html',
  styleUrls: ['./menu-info.page.scss'],
})
export class MenuInfoPage implements OnInit {

  protected userType: number;     //用户类型，0：worker，1：customer   2: viewer

  protected menuId;

  private updateInterval = null;

  constructor(
    private http: HttpProvider,
    private route: ActivatedRoute,
    private alertController: AlertController,
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.route.queryParams.subscribe(async res => {
      console.log("res: ", res);
      if (res != null) {
        this.menuId = res.menuId;
        let menuInfo = await this.receiveMenuInfo(this.menuId);
        this.initMenuInfoHTML(menuInfo);
        this.updateMenuInfo(this.menuId);
      }

    });
  }

  ionViewDidEnter() {
    this.userType = Number(window.sessionStorage.getItem("userType"));
  }

  ionViewWillLeave() {
    clearInterval(this.updateInterval);
    this.updateInterval = null;
  }

  /**
   * 获取某id的菜单的详细信息
   * @param menuId 
   */
  async receiveMenuInfo(menuId) {
    let formData = new FormData();
    formData.append("menuId", menuId);
    let receiveData: any = await this.http.getData_post("getSpecificMenuInfo", formData, null);
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
    return receiveData.data;
  }


  /**
   * 对页面的相关信息进行修改
   */
  initMenuInfoHTML(menuInfo) {
    document.getElementById("title_mi").innerText = menuInfo.menu.name;

    let ionCard = document.getElementById("card_mi");

    //slides 图片
    let ionSlides = ionCard.querySelector("ion-slides");
    //先清除
    let slideNodes = ionSlides.querySelectorAll("ion-slide");
    for (let i = 0; i < slideNodes.length; i++) {
      slideNodes[i].remove();
    }

    if (menuInfo.menuImageList.length == 0) {
      let ionSlide = document.createElement("ion-slide");
      let divNode = document.createElement("div");
      divNode.setAttribute("style", "width: 100%; height: 100%;display:contents;");
      divNode.innerText = "抱歉，暂无图片";
      ionSlide.append(divNode);
      //ionSlide放在ionSlides下的class为swiper-wrapper的div内
      ionSlides.querySelector("div").append(ionSlide);
    } else {
      menuInfo.menuImageList.forEach(item => {
        let ionSlide = document.createElement("ion-slide");
        let divNode = document.createElement("div");
        let imgNode = document.createElement("img");
        imgNode.setAttribute("style", "width: 100%; height: 100%;");
        imgNode.src = this.http.server + "/menuImage/" + item.url;
        divNode.append(imgNode);
        ionSlide.append(divNode);
        //ionSlide放在ionSlides下的class为swiper-wrapper的div内
        ionSlides.querySelector("div").append(ionSlide);
      });
    }


    //文字信息
    ionCard.getElementsByTagName("ion-card-title")[0].innerText = menuInfo.menu.name;
    let pNodes = ionCard.getElementsByTagName("p");
    pNodes[0].innerText = "月售：" + menuInfo.monthSellCount + "份";
    pNodes[1].innerText = "尚有：" + menuInfo.menu.quantity + "份";
    pNodes[2].innerText = menuInfo.menu.description;


    document.getElementById("priceLabel_mi").innerText = "￥" + menuInfo.menu.price;

  }

  /**
   * 对菜单的数量进行定时更新
   */
  updateMenuInfo(menuId) {
    if (this.updateInterval != null) {
      return;
    }
    this.updateInterval = setInterval(async () => {
      let menuInfo = await this.receiveMenuInfo(menuId);

      let pNodes = document.getElementById("card_mi").getElementsByTagName("p");
      pNodes[0].innerText = "月售：" + menuInfo.monthSellCount + "份";
      pNodes[1].innerText = "尚有：" + menuInfo.menu.quantity + "份";
    }, 10 * 1000);
  }
}
