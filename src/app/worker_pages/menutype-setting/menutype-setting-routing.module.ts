import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenutypeSettingPage } from './menutype-setting.page';

const routes: Routes = [
  {
    path: '',
    component: MenutypeSettingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenutypeSettingPageRoutingModule {}
