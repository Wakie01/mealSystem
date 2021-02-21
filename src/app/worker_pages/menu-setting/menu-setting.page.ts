import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { HttpProvider } from 'src/providers/httpProvider';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';


@Component({
  selector: 'app-menu-setting',
  templateUrl: './menu-setting.page.html',
  styleUrls: ['./menu-setting.page.scss'],
})
export class MenuSettingPage implements OnInit {

  protected menuId;
  protected uploadPic: string = "";     //需上传的菜单图片

  constructor(
    private http: HttpProvider,
    private route: ActivatedRoute,
    private alertController: AlertController,
    private toastController: ToastController,
    private imagePicker: ImagePicker,
    private navController: NavController,
  ) { }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    let menuTypes = await this.receiveMenuTypeInfo();
    this.initMenuTypeHTML(menuTypes);

    this.route.queryParams.subscribe(async res => {
      if (res.menuId != null) {
        this.menuId = res.menuId;
        let menuInfo = await this.receiveMenuInfo(this.menuId);
        this.initMenuInfoHTML(menuInfo);
      } else {
        this.initMenuInfoHTML(null);
      }

    });
  }


  ionViewDidEnter() {
    console.log("menu-setting enter");
  }

  ionViewDidLeave() {
    if (this.menuId == null && this.uploadPic != "") {
      this.http.getData("clearUnusedImage");
    }
    this.menuId = null;
    this.uploadPic = "";
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
   * 获取菜单类型信息
   */
  async receiveMenuTypeInfo() {
    let receiveData: any = await this.http.getData_post("getMenuTypeInfo", null, null);
    if (receiveData.code != 0) {
      const alert = await this.alertController.create({
        header: '获取菜单类型信息失败',
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
    return receiveData.data.menuType;
  }


  /**
   * 初始化页面的类型
   * @param menuType 
   */
  initMenuTypeHTML(menuType) {
    let list = document.getElementById("list_ms");
    let ionSelect = list.getElementsByTagName("ion-select")[0];
    menuType.forEach(item => {
      let ionSelectOpt = document.createElement("ion-select-option");
      ionSelectOpt.setAttribute("value", item.id);
      ionSelectOpt.innerText = item.name;
      ionSelect.append(ionSelectOpt);
    });
  }


  /**
   * 对页面的相关信息进行修改，除了图片跟类型
   */
  initMenuInfoHTML(menuInfo) {
    let list = document.getElementById("list_ms");

    //初始化图片部分
    let rowNodes = list.querySelectorAll("ion-row");
    for (let i = 0; i < 6; i++) {
      let ionButton;     //先获取ion-button
      if (i < 3) {
        //第一个ion-row
        ionButton = rowNodes[0].querySelectorAll("ion-button")[i];
      } else {
        //第二个ion-row
        ionButton = rowNodes[1].querySelectorAll("ion-button")[i - 3];
      }
      if (menuInfo != null && menuInfo.menuImageList.length > 0 && i < menuInfo.menuImageList.length) {
        //有图片
        ionButton.style.backgroundImage = "url(" + this.http.server + "menuImage/" + menuInfo.menuImageList[i].url + ")";
        ionButton.onclick = () => {
          this.chooseImage(menuInfo.menuImageList[i].id, ionButton);
        }
        ionButton.querySelector("ion-icon").hidden = true;
      } else {
        //没图片
        ionButton.onclick = () => {
          this.chooseImage(null, ionButton);
        }
        ionButton.querySelector("ion-icon").hidden = false;
      }
    }

    if (menuInfo != null) {
      //初始化文字部分
      let inputNodes = list.getElementsByTagName("ion-input");
      inputNodes[0].value = menuInfo.menu.name;
      inputNodes[1].value = menuInfo.menu.price;
      inputNodes[2].value = menuInfo.menu.quantity;

      list.getElementsByTagName("ion-textarea")[0].value = menuInfo.menu.description;

      let ionSelect = list.getElementsByTagName("ion-select")[0];
      ionSelect.setAttribute("value", menuInfo.menu.typeId);
    }

  }


  /**
   * 更新菜单的基本信息，除了图片
   */
  async updateMenuInfo(menuInfo) {

    let body = {
      id: this.menuId,
      name: menuInfo.name,
      price: menuInfo.price,
      quantity: menuInfo.quantity,
      typeId: menuInfo.typeId,
      description: menuInfo.description
    }
    let header = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.getData_post("updateMenuInfo", body, header);
  }


  /**
   * 从手机中选择图片,并进行上传
   * @param imageId   菜单图片Id
   * @param ionBtnNode   按钮
   */
  chooseImage(imageId, ionBtnNode: HTMLIonButtonElement) {
    let options = {
      maximumImagesCount: 1,
      outputType: 1     //输出图片的base64码
    };
    this.imagePicker.getPictures(options).then(async results => {

      let formData = new FormData();
      formData.append("base64Code", results[0]);
      if (this.menuId != null) formData.append("menuId", this.menuId);
      if (imageId != null) formData.append("imageId", imageId);
      let isFirst = true;
      let iconNodes = document.getElementById("list_ms").querySelector("ion-grid").querySelectorAll("ion-icon");
      for (let i = 0; i < iconNodes.length; i++) {
        if (iconNodes[i].hidden) {
          isFirst = false;
          break;
        }
      }
      if (isFirst) {
        formData.append("first", "1");
      } else {
        formData.append("first", "0");
      }
      let receiveData: any = await this.http.getData_post("uploadImage", formData, null);
      if (receiveData.code != 0) {
        const alert = await this.alertController.create({
          header: '出错',
          message: receiveData.msg,
          buttons: [
            {
              text: '确定',
            }
          ]
        });
        return await alert.present();
      }


      this.uploadPic += (receiveData.data.imageId + ",");
      ionBtnNode.style.backgroundImage = "url(" + this.http.server + "menuImage/" + receiveData.data.imageUrl + ")";
      ionBtnNode.onclick = () => {
        this.chooseImage(receiveData.data.imageId, ionBtnNode);
      }
      ionBtnNode.querySelector("ion-icon").hidden = true;


    }, err => {
      console.log("error: ", err);
    });
  }



  /**添加菜单 */
  async addMenu(menuInfo) {
    let body = {
      name: menuInfo.name,
      price: menuInfo.price,
      quantity: menuInfo.quantity,
      typeId: menuInfo.typeId,
      image: this.uploadPic,
      description: menuInfo.description
    }
    let header = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.getData_post("addMenu", body, header);
  }


  /**
   * 保存菜单，整合更新与添加
   */
  async saveMenu() {
    let list = document.getElementById("list_ms");
    let inputNodes = list.getElementsByTagName("ion-input");

    let name = inputNodes[0].value;
    let price = inputNodes[1].value;
    let quantity = inputNodes[2].value;
    let typeId = list.getElementsByTagName("ion-select")[0].value;

    if (name == "" || price == "" || quantity == "" || typeId == "") {
      const alert = await this.alertController.create({
        header: '保存失败',
        message: '请填写相关信息',
        buttons: [
          {
            text: '确定',
            handler: () => { }
          }
        ]
      });
      return await alert.present();
    }

    let menuInfo = {
      name: name,
      price: price,
      quantity: quantity,
      typeId: typeId,
      description: list.getElementsByTagName("ion-textarea")[0].value
    }

    let receiveData;
    if (this.menuId == null) {
      //添加
      receiveData = await this.addMenu(menuInfo);
    } else {
      //更新
      receiveData = await this.updateMenuInfo(menuInfo);
    }
    if (receiveData.code != 0) {
      const alert = await this.alertController.create({
        header: '保存发布失败',
        message: receiveData.msg,
        buttons: [
          {
            text: '确定',
            handler: () => { }
          }
        ]
      });
      return await alert.present();
    } else {
      let toast = await this.toastController.create({
        message: '保存成功',
        duration: 2000
      });
      await toast.present();
      this.navController.navigateRoot(['/tabs/menus']);
    }
  }


}
