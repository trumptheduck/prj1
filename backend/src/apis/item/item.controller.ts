import { Body, Controller, Delete, Get, Patch, Post, Query } from '@nestjs/common';
import { ItemService } from './services/item.service';
import { CreateDTO, ObjectIdDTO, UpdateDTO } from 'src/core/dtos/global.dtos';
import { Item } from './schemas/item.schema';
import { RestaurantScopeController } from 'src/core/controllers/scope.controllers';

@Controller('item')
export class ItemController extends RestaurantScopeController<Item> {
    constructor(private _service: ItemService) {
        super(_service);
    }
}
