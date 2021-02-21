import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ServeInfoPage } from './serve-info.page';

const routes: Routes = [
  {
    path: '',
    component: ServeInfoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServeInfoPageRoutingModule {}
