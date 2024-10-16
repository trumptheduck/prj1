import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzUploadModule } from 'ng-zorro-antd/upload';

import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { ManageComponent } from './manage.component';
import { Route, RouterModule } from '@angular/router';
import { OrganizationComponent } from './organization/organization.component';
import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from '../core/guards/auth.guard';
import { AuthService } from '../core/services/auth.service';
import { RestaurantsComponent } from './restaurants/restaurants.component';
import { TablesComponent } from './tables/tables.component';
import { MenuComponent } from './menu/menu.component';



const routes: Route[] = [
  {
    path: "m",
    component: ManageComponent,
    children: [
      {
        path: "",
        component: OrganizationComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "r/:id",
        component: RestaurantsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "t/:orgId/:restoId",
        component: TablesComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "m/:orgId/:restoId",
        component: MenuComponent,
        canActivate: [AuthGuard],
      },
    ]
  },
  {
    path: "login",
    component: AuthComponent
  },
]

@NgModule({
  declarations: [
    ManageComponent,
    OrganizationComponent,
    RestaurantsComponent,
    TablesComponent,
    MenuComponent,
    AuthComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NzLayoutModule,
    NzButtonModule,
    NzBreadCrumbModule,
    NzMenuModule,
    NzFormModule,
    NzInputModule,
    NzCardModule,
    NzModalModule,
    NzCheckboxModule,
    NzMessageModule,
    NzIconModule,
    NzPopconfirmModule,
    NzUploadModule,
    FormsModule,
    ReactiveFormsModule,

  ]
})
export class ManageModule {

}
