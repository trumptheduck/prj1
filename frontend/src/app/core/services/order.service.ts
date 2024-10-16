import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TableScopeRepo } from '../repos/scope.repo';
import { IOrder } from '../models/order.model';
import { TableScopeDataService } from './scope.service';
import { APIHost, TableScopePath } from '../enum/api_path.enums';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class OrderService extends TableScopeDataService<IOrder> {
  constructor(private http: ApiService) {
    super(new TableScopeRepo<IOrder>(http, new TableScopePath("order")));
  }

  placeOrder(order: IOrder): Observable<IOrder> {
    return this.http.post<IOrder>(APIHost.uri + "order/place", order);
  }

  changeOrderStatus(order: IOrder): Observable<IOrder> {
    return this.http.patch<IOrder>(APIHost.uri + "order/status", order);
  }
}