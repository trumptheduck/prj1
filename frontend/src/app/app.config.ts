import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { ItemService } from './core/services/item.service';
import { OrderService } from './core/services/order.service';
import { OrganizationService } from './core/services/organization.service';
import { RestaurantService } from './core/services/restaurant.service';
import { TableService } from './core/services/table.service';
import { HttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), ItemService, OrderService, OrganizationService, RestaurantService, TableService]
};
