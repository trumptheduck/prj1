import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RestaurantComponent } from './restaurant/restaurant.component';
import { OrganizationComponent } from './organization/organization.component';
import { MenuComponent } from './menu/menu.component';
import { AppComponent } from './app.component';
import { LayoutComponent } from './layout/layout.component';
import { OrderComponent } from './order/order.component';

export const routes: Routes = [
    {
        path: "",
        component: LayoutComponent,
        children: [
            {
                path: "",
                component: HomeComponent
            },
            {
                path: "org",
                component: OrganizationComponent
            },
            {
                path: "resto",
                component: RestaurantComponent
            },
            {
                path: "menu/:orgId/:restoId/:tableId",
                component: MenuComponent
            },
            {
                path: "order/:orgId/:restoId/:tableId/:orderId",
                component: OrderComponent
            }
        ]
    },
    {
        path: 'admin',
        loadChildren: () => import('./manage/manage.module').then(m => m.ManageModule)
    },
    {path: '**', redirectTo: '/'}
];
