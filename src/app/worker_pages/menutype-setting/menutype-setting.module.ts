import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MenutypeSettingPageRoutingModule } from './menutype-setting-routing.module';

import { MenutypeSettingPage } from './menutype-setting.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MenutypeSettingPageRoutingModule
  ],
  declarations: [MenutypeSettingPage]
})
export class MenutypeSettingPageModule {}
