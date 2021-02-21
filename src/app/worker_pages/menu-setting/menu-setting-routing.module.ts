import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuSettingPage } from './menu-setting.page';

const routes: Routes = [
  {
    path: '',
    component: MenuSettingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuSettingPageRoutingModule {}
