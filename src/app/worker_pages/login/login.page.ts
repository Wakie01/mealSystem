import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { HttpProvider } from 'src/providers/httpProvider';
import { AES, SHA256, SHA3 } from 'crypto-js';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {


  private canvasWidth: number = 400; //验证码宽度 （与px的对不上，可能是单位问题）
  private canvasHeight: number = 155; //验证码高度

  private codeLength: number = 4; //验证码长度

  private backgroundColorMin: number = 200; //验证码图片背景色最小值
  private backgroundColorMax: number = 220; //验证码图片背景色最大值

  private fontColorMin: number = 50; //数字颜色最小值
  private fontColorMax: number = 160; //数字颜色最大值

  private fontSizeMin: number = 95; // 字体最小值
  private fontSizeMax: number = 105; // 字体最大值

  private degMin: number = -30; //旋转最小角度
  private degMax: number = 30; //旋转最大角度

  private lineColorMin: number = 100; //干扰线颜色最小值
  private lineColorMax: number = 200; //干扰线颜色最大值
  private lineNum: number = 30; //干扰线数量

  private dotColorMin: number = 0; //干扰点颜色最小值
  private dotColorMax: number = 255; //干扰点颜色最大值
  private dotNum: number = 90; //干扰点数量

  private code: string = "";      //随机生成的验证码

  protected userName: string;
  protected password: string;
  protected vertifyCode: string;



  constructor(
    private http: HttpProvider,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private navController: NavController,

  ) { }

  ngOnInit() {
    this.drawPic()
  }

  ionViewWillEnter(){
    this.checkUserOnline();
  }



  drawPic() {
    this.vertifyCode = "";
    var verticalCode = document.getElementsByTagName("canvas")[0];
    var content2d = verticalCode.getContext("2d"); //获得CanvasRenderingContext2D 实例
    content2d.fillStyle = this.randomColor(this.backgroundColorMin, this.backgroundColorMax); //设置背景颜色
    content2d.fillRect(0, 0, this.canvasWidth, this.canvasHeight); //根据当前的填充样式，填充矩形
    for (var i = 0; i < this.codeLength; i++) {
      this.drawText(content2d, i);
    }
    this.drawLine(content2d);
    this.drawDot(content2d);
  }

  //生成随机颜色
  randomColor(min, max) {
    var r = Math.floor(Math.random() * (max - min) + min);
    var g = Math.floor(Math.random() * (max - min) + min);
    var b = Math.floor(Math.random() * (max - min) + min);
    return 'rgb(' + r + ',' + g + ',' + b + ')';
  }

  //绘制随机数字
  drawText(content2d, i) {
    content2d.fillStyle = this.randomColor(this.fontColorMin, this.fontColorMax); //随机生成字体颜色
    content2d.font = Math.floor(Math.random() * (this.fontSizeMax - this.fontSizeMin) + this.fontSizeMin) + 'px SimHei'; //设置字体
    var x = (i + 1) * (this.canvasWidth / (this.codeLength + 3));
    var y = Math.floor(Math.random() * (this.canvasHeight - 5 - this.fontSizeMax) + this.fontSizeMax);
    var deg = Math.floor(Math.random() * (this.degMax - this.degMin) + this.degMin); //随机角度
    var txt = Math.floor(Math.random() * 9).toString(); //随机数
    if (i == 0) {
      this.code = "";
    }
    this.code += txt;
    // 修改坐标原点和旋转角度
    content2d.translate(x, y); //移动坐标原点
    content2d.rotate(deg * Math.PI / 180); //旋转
    content2d.fillText(txt, 0, 0);

    //恢复坐标原点和旋转角度
    content2d.rotate(-deg * Math.PI / 180);
    content2d.translate(-x, -y)
  }

  // 绘制干扰线
  drawLine(content2d) {
    for (var i = 0; i < this.lineNum; i++) {
      content2d.strokeStyle = this.randomColor(this.lineColorMin, this.lineColorMax); //设置画笔的颜色
      content2d.beginPath(); //清空子路径列表，并开始一个新路径
      var moveToX = Math.floor(Math.random() * this.canvasWidth);
      var moveToY = Math.floor(Math.random() * this.canvasHeight);
      content2d.moveTo(moveToX, moveToY); //移动路径的起点

      var lineToX = Math.floor(Math.random() * this.canvasWidth);
      var lineToY = Math.floor(Math.random() * this.canvasHeight);
      content2d.lineTo(lineToX, lineToY); //使用直线连接路径的终点到x，y坐标，注意：并不会真正地绘制
      content2d.stroke(); //绘制当前或已经存在的路径的方法
    }
  }

  // 绘制干扰点
  drawDot(content2d) {
    for (var i = 0; i < this.dotNum; i++) {
      content2d.fillStyle = this.randomColor(this.dotColorMin, this.dotColorMax);
      content2d.beginPath();
      var x = Math.floor(Math.random() * this.canvasWidth); //圆心的 x 轴坐标。
      var y = Math.floor(Math.random() * this.canvasHeight); //圆心的 y 轴坐标。
      var radius = 1; //圆弧的半径
      var startAngle = 0; //圆弧的起始点
      var endAngle = 2 * Math.PI; //圆弧的终点
      content2d.arc(x, y, radius, startAngle, endAngle); //绘制圆弧路径
      content2d.fill(); //根据当前的填充样式，填充当前或已存在的路径
    }
  }

  async doLogin() {
    if (this.vertifyCode != this.code) {
      let alert = await this.alertController.create({
        header: '出错',
        message: '请正确输入验证码',
        buttons: [
          {
            text: '确定',
            handler: () => {
              this.userName = "";
              this.password = "";
              this.vertifyCode = "";
              this.drawPic();
            }
          }
        ]
      });
      return await alert.present();
    }

    let loading = await this.loadingController.create({
      spinner: "circular",
      message: "登录中...",
    });
    await loading.present();

    //生成MD5
    let pwd = SHA3(this.password, { outputLength: 256 }).toString();

    let body: any = { "acot": this.userName, "password": pwd };
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    let loginData: any = await this.http.getData_post("login", body, headers);
    await loading.dismiss();

    if (loginData.code != 0) {
      let alert = await this.alertController.create({
        header: '出错',
        message: loginData.msg,
        buttons: [
          {
            text: '确定',
            handler: () => {
              this.userName = "";
              this.password = "";
              this.vertifyCode = "";
              this.drawPic();
            }
          }
        ]
      });
      return await alert.present();
    } else {
      this.userName = "";
      this.password = "";
      this.vertifyCode = "";

      window.sessionStorage.setItem("workerId",loginData.data.user.id);
      window.sessionStorage.setItem("workerAcot",loginData.data.user.acot);
      window.sessionStorage.setItem("userType","0");
      this.navController.navigateRoot(['/tabs/menus']);
      
      
    }

  }


  async checkUserOnline(){
    let receiveData: any = await this.http.getData_post("checkOnline", null, null);
    if(receiveData.code==11){
      this.navController.navigateRoot(['/tabs/menus']);
    } 
  }

}
