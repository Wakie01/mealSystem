import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  private haveWea: boolean = false;

  constructor() {}

  ionViewDidEnter(){
    if (!this.haveWea) {
      (function (d) {
        var script1 = d.createElement("script");
        script1.src = "../../assets/script1.js";

        var c = d.createElement('link')
        c.rel = 'stylesheet'
        c.href = 'https://widget.heweather.net/standard/static/css/he-standard.css?v=1.3'
        var s = d.createElement('script')
        s.src = 'https://widget.heweather.net/standard/static/js/he-standard.js?v=1.3'
        var sn = d.getElementsByTagName('style')[0]

        sn.parentNode.insertBefore(script1, sn);
        sn.parentNode.insertBefore(c, sn)
        sn.parentNode.insertBefore(s, sn)
      })(document)

      this.haveWea = true;
    }
  }

  /**
   * 设置用户类型
   */
  setUserType(userType){
    switch(userType){
      case 'viewer':
        window.sessionStorage.setItem("userType","2");
        break;
    }
  }
}
