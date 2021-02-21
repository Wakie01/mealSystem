import { HttpHandler, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AlertController, IonButton, IonIcon, ToastController } from '@ionic/angular';
import { HttpProvider } from 'src/providers/httpProvider';

@Component({
  selector: 'app-menutype-setting',
  templateUrl: './menutype-setting.page.html',
  styleUrls: ['./menutype-setting.page.scss'],
})
export class MenutypeSettingPage implements OnInit {

  constructor(
    private http: HttpProvider,
    private alertController: AlertController,
    private toastController: ToastController,
  ) { }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    let menuTypes = await this.getMenuTypeInfo();
    this.initMenuTypeHTML(menuTypes);
  }


  ionViewDidEnter() {

  }


  /**
 * 获取菜单类型信息
 */
  async getMenuTypeInfo() {
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
   * 对现有的菜单类型进行初始化HTML
   * @param menuTypes
   */
  initMenuTypeHTML(menuTypes) {
    let menutypeDiv = document.getElementById("menutypeDiv");

    let itemNodes = menutypeDiv.querySelectorAll("ion-item");

    for (let i = 0; i < itemNodes.length; i++) {
      itemNodes[i].remove();
    }

    menuTypes.forEach(item => {
      let ionItem = document.createElement("ion-item");
      ionItem.setAttribute("style", "margin-top: 8px;padding-bottom: 2px;");

      let ionLabel = document.createElement("ion-label");
      ionLabel.setAttribute("style", "margin-left: 3px;");

      let div = document.createElement("div");
      div.setAttribute("style", "background-color: #5fd5d5;width: 17px; height: 17px; border-radius: 20px;");

      ionLabel.append(div);

      let ionInput = document.createElement("ion-input");
      ionInput.setAttribute("value", item.name);
      ionInput.setAttribute("readonly", "true");
      ionInput.setAttribute("style", "margin-left: 20px;");

      //修改按钮
      let ionButton = document.createElement("ion-button");
      ionButton.setAttribute("color", "warning");
      ionButton.setAttribute("style", "height: 34px; width: 37px;margin-bottom: 10px;");

      let ionIcon = document.createElement("ion-icon");
      ionIcon.setAttribute("name", "settings-outline");
      ionIcon.setAttribute("style", "height: 20px; width: 20px;");

      ionButton.append(ionIcon);

      //删除按钮
      let ionButton3 = document.createElement("ion-button");
      ionButton3.setAttribute("color", "danger");
      ionButton3.setAttribute("style", "height: 34px; width: 37px;margin-left: 7px;margin-bottom: 10px;");

      let ionIcon3 = document.createElement("ion-icon");
      ionIcon3.setAttribute("name", "trash-outline");
      ionIcon3.setAttribute("style", "height: 20px; width: 20px;");

      ionButton3.append(ionIcon3);


      //保存按钮
      let ionButton2 = document.createElement("ion-button");
      ionButton2.setAttribute("color", "success");
      ionButton2.disabled = true;
      ionButton2.setAttribute("style", "height: 34px; width: 37px;margin-left: 7px;margin-bottom: 10px;");

      let ionIcon2 = document.createElement("ion-icon");
      ionIcon2.setAttribute("name", "checkmark-outline");
      ionIcon2.setAttribute("style", "height: 20px; width: 20px;");

      ionButton2.append(ionIcon2);



      //修改按钮点击事件
      ionButton.onclick = () => {
        ionInput.readonly = false;
        ionInput.setFocus();
        ionButton2.disabled = false;
        ionButton.disabled = true;
      };

      //保存按钮点击事件
      ionButton2.onclick = () => {
        let type = ionInput.value;
        ionInput.readonly = true;
        ionButton.disabled = false;
        ionButton2.disabled = true;
        this.updateMenuType(item.id, type);
      };

      //删除按钮点击事件
      ionButton3.onclick = async () => {
        let alert = await this.alertController.create({
          header: '提示',
          message: '确定要删除此菜单类型？',
          buttons: [
            {
              text: '取消',
              handler: () => { }
            },
            {
              text: '确定',
              handler: async () => {
                if (await this.removeMenuType(item.id)) {
                  ionItem.remove();
                }
              }
            }
          ]
        });
        return await alert.present();
      }

      ionItem.append(ionLabel);
      ionItem.append(ionInput);
      ionItem.append(ionButton);
      ionItem.append(ionButton2);
      ionItem.append(ionButton3);

      menutypeDiv.append(ionItem);
    });
  }


  /**
   * 初始化新添菜单类型的HTML
   */
  async initMenuAddHTML() {
    let menuAddDiv = document.getElementById("menuAddDiv");

    let ionItem = document.createElement("ion-item");
    ionItem.setAttribute("style", "margin-top: 8px;padding-bottom: 2px;");

    let ionLabel = document.createElement("ion-label");
    ionLabel.setAttribute("style", "margin-left: 3px;");

    let div = document.createElement("div");
    div.setAttribute("style", "background-color: #5fd5d5;width: 17px; height: 17px; border-radius: 20px;");

    ionLabel.append(div);

    let ionInput = document.createElement("ion-input");
    ionInput.setAttribute("style", "margin-left: 20px;");
    ionInput.placeholder = "请输入需要新添的菜单类型";
    ionInput.setFocus();

    //删除按钮
    let ionButton3 = document.createElement("ion-button");
    ionButton3.setAttribute("color", "danger");
    ionButton3.setAttribute("style", "height: 34px; width: 37px;margin-left: 7px;margin-bottom: 10px;");

    let ionIcon3 = document.createElement("ion-icon");
    ionIcon3.setAttribute("name", "trash-outline");
    ionIcon3.setAttribute("style", "height: 20px; width: 20px;");

    ionButton3.append(ionIcon3);

    //删除按钮点击事件
    ionButton3.onclick = () => {
      ionItem.remove();
      if (menuAddDiv.querySelectorAll("ion-item").length == 0) {
        document.getElementById("menuAddBtn").hidden = true;
      }
    }

    ionItem.append(ionLabel);
    ionItem.append(ionInput);
    ionItem.append(ionButton3);

    menuAddDiv.append(ionItem);

    document.getElementById("menuAddBtn").hidden = false;
  }


  /**
   * 更新菜单类型
   * @param id 
   * @param menutype 
   */
  async updateMenuType(id, menutype) {
    let formData = new FormData();
    formData.append("id", id);
    formData.append("name", menutype);
    let receiveData: any = await this.http.getData_post("updateMenuType", formData, null);
    if (receiveData.code != 0) {
      const alert = await this.alertController.create({
        header: '修改失败',
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
      message: '修改成功',
      duration: 2000
    });
    await toast.present();
  }


  /**
   * 删除某id的菜单类型
   * @param id 
   */
  async removeMenuType(id) {
    let formData = new FormData();
    formData.append("id", id);
    let receiveData: any = await this.http.getData_post("removeMenuType", formData, null);
    if (receiveData.code != 0) {
      const alert = await this.alertController.create({
        header: '删除失败',
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
   * 对新添的菜单类型进行保存
   */
  async saveMenuType() {
    let inputData=new Array();

    let menuAddDiv=document.getElementById("menuAddDiv");
    let inputNodes=menuAddDiv.querySelectorAll("ion-input");
    inputNodes.forEach(async item=>{
      if(item.value==null){
        const alert = await this.alertController.create({
          header: '提示',
          message: '新添的输入框中不能为空',
          buttons: [
            {
              text: '确定',
              handler: () => { }
            }
          ]
        });
        return await alert.present();
      }

      inputData.push(item.value);
    });
    
    let body={
      names:inputData
    };

    let headers=new HttpHeaders().set('Content-Type', 'application/json')
    let receiveData:any= await this.http.getData_post("addMenuType", body, headers);
    if (receiveData.code != 0) {
      const alert = await this.alertController.create({
        header: '新增失败',
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
      message: '新增成功',
      duration: 2000
    });
    await toast.present();


    let itemNodes=menuAddDiv.querySelectorAll("ion-item");
    for(let i=0;i<itemNodes.length;i++){
      itemNodes[i].remove();
    }
    document.getElementById("menuAddBtn").hidden=true;
    this.ionViewWillEnter();
  }
  
}
