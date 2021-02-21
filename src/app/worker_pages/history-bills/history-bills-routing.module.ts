import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HistoryBillsPage } from './history-bills.page';

const routes: Routes = [
  {
    path: '',
    component: HistoryBillsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HistoryBillsPageRoutingModule {}
