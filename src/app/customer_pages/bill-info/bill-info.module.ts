import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BillInfoPageRoutingModule } from './bill-info-routing.module';

import { BillInfoPage } from './bill-info.page';

import {InputNumberModule} from 'primeng/inputnumber';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BillInfoPageRoutingModule,
    InputNumberModule
  ],
  declarations: [BillInfoPage]
})
export class BillInfoPageModule {}
