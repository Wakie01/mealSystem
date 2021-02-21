import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ServeInfoPageRoutingModule } from './serve-info-routing.module';

import { ServeInfoPage } from './serve-info.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ServeInfoPageRoutingModule
  ],
  declarations: [ServeInfoPage]
})
export class ServeInfoPageModule {}
