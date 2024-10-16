import { Controller } from '@nestjs/common';
import { OrganizationScopeController } from 'src/core/controllers/scope.controllers';
import { Restaurant } from './schemas/restaurant.schema';
import { RestaurantService } from './services/restaurant.service';

@Controller('resto')
export class RestaurantController extends OrganizationScopeController<Restaurant>{
    constructor(private _service: RestaurantService) {
        super(_service);
    }
}
