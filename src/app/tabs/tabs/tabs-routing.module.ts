import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children:[
      {
        path:'menus',
        loadChildren:()=>import('../../worker_pages/menus/menus.module').then(m=>m.MenusPageModule)
      },
      {
        path: 'bills',
        loadChildren: () => import('../../worker_pages/bills/bills.module').then( m => m.BillsPageModule)
      },
      {
        path: 'bill-info',
        loadChildren: () => import('../../customer_pages/bill-info/bill-info.module').then( m => m.BillInfoPageModule)
      },
      {
        path: 'user',
        loadChildren: () => import('../../worker_pages/user/user.module').then( m => m.UserPageModule)
      },
    ]
  },
  {
    path:'',
    redirectTo:'/tabs/menus',
    pathMatch:'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
