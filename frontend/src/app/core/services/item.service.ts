import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RestaurantScopeRepo } from '../repos/scope.repo';
import { IItem } from '../models/item.model';
import { RestaurantScopeDataService } from './scope.service';
import { RestaurantScopePath } from '../enum/api_path.enums';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})

export class ItemService extends RestaurantScopeDataService<IItem> {
  constructor(private http: ApiService) {
    super(new RestaurantScopeRepo<IItem>(http, new RestaurantScopePath("item")));
  }
}