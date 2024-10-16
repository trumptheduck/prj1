import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';
import { OrganizationComponent } from './organization/organization.component';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';
import { HttpClientModule } from '@angular/common/http';
import { RestaurantComponent } from './restaurant/restaurant.component';
import { MenuComponent } from './menu/menu.component';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { LayoutComponent } from './layout/layout.component';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AuthGuard } from './core/guards/auth.guard';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageModule } from 'ng-zorro-antd/message';

import { provideNzI18n, en_US } from 'ng-zorro-antd/i18n';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrderComponent } from './order/order.component';

const config: SocketIoConfig = { url: 'http://localhost:3001', options: {} };

const firebaseConfig = {
  apiKey: "AIzaSyC7jV2S2LJoxKLhZleHAG27LfCaLX2O960",
  authDomain: "project1-ff610.firebaseapp.com",
  projectId: "project1-ff610",
  storageBucket: "project1-ff610.appspot.com",
  messagingSenderId: "834226234062",
  appId: "1:834226234062:web:7af49c3041a3dde459669f"
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    OrganizationComponent,
    RestaurantComponent,
    MenuComponent,
    LayoutComponent,
    HeaderComponent,
    FooterComponent,
    OrderComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes),
    SocketIoModule.forRoot(config),
    AngularFireModule.initializeApp(firebaseConfig),
    HttpClientModule,
    BrowserAnimationsModule,
    NzModalModule,
    NzCollapseModule,
    NzButtonModule,
    NzMessageModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [AuthGuard, provideNzI18n(en_US)],
  bootstrap: [AppComponent],
})
export class AppModule { }
