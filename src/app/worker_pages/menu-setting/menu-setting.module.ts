import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MenuSettingPageRoutingModule } from './menu-setting-routing.module';

import { MenuSettingPage } from './menu-setting.page';
import { PhotoLibrary } from '@ionic-native/photo-library/ngx';
import {FileUploadModule} from 'primeng/fileupload';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MenuSettingPageRoutingModule,
    FileUploadModule,
  ],
  providers:[
    PhotoLibrary
  ],
  declarations: [MenuSettingPage]
})
export class MenuSettingPageModule {}
