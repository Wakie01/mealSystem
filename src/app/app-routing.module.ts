import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./worker_pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./worker_pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'tabs',
    loadChildren:()=>import('./tabs/tabs/tabs.module').then(m=>m.TabsPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./worker_pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'menu-info',
    loadChildren: () => import('./customer_pages/menu-info/menu-info.module').then( m => m.MenuInfoPageModule)
  },
  {
    path: 'menu-setting',
    loadChildren: () => import('./worker_pages/menu-setting/menu-setting.module').then( m => m.MenuSettingPageModule)
  },
  {
    path: 'history-bills',
    loadChildren: () => import('./worker_pages/history-bills/history-bills.module').then( m => m.HistoryBillsPageModule)
  },
  {
    path: 'menutype-setting',
    loadChildren: () => import('./worker_pages/menutype-setting/menutype-setting.module').then( m => m.MenutypeSettingPageModule)
  },
  {
    path: 'serve-info',
    loadChildren: () => import('./customer_pages/serve-info/serve-info.module').then( m => m.ServeInfoPageModule)
  },
  {
    path: 'scan',
    loadChildren: () => import('./customer_pages/scan/scan.module').then( m => m.ScanPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
