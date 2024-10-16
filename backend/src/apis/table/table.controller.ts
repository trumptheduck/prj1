import { Controller } from '@nestjs/common';
import { RestaurantScopeController } from 'src/core/controllers/scope.controllers';
import { Table } from './schemas/table.schema';
import { TableService } from './services/table.service';

@Controller('table')
export class TableController extends RestaurantScopeController<Table>{
    constructor(private _service: TableService) {
        super(_service);
    }
}
