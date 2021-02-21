import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HistoryBillsPageRoutingModule } from './history-bills-routing.module';

import { HistoryBillsPage } from './history-bills.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HistoryBillsPageRoutingModule
  ],
  declarations: [HistoryBillsPage]
})
export class HistoryBillsPageModule {}
