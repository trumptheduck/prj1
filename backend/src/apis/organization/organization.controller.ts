import { Controller } from '@nestjs/common';
import { IdentifiableController } from 'src/core/controllers/scope.controllers';
import { Organization } from './schemas/organization.schema';
import { OrganizationService } from './services/organization.service';

@Controller('org')
export class OrganizationController extends IdentifiableController<Organization>{
    constructor(private _service: OrganizationService) {
        super(_service);
    }
}
