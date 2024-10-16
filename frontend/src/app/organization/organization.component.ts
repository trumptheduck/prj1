import { Component } from '@angular/core';
import { IOrganization } from '../core/models/organization.model';
import { ActivatedRoute } from '@angular/router';
import { OrganizationService } from '../core/services/organization.service';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrl: './organization.component.scss'
})
export class OrganizationComponent {
  orgs: IOrganization[] = [];
  constructor(
    private service: OrganizationService
    ) {

  }
  ngOnInit() {
    this.service.findAll().subscribe((list) => {
      this.orgs = list;
      console.log(list);
    });
  }
}
