import { Component, OnInit } from '@angular/core';
import { IOrganization } from '../../core/models/organization.model';
import { OrganizationService } from '../../core/services/organization.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrl: './organization.component.scss'
})
export class OrganizationComponent implements OnInit {
  public organizations: IOrganization[] = [];

  public currentOrganization: IOrganization = {
    description: "",
    name: "",
  };

  get modalTitle(): string {
    return this.isEditMode? "Edit Organization": "Create Organization";
  }

  isModalVisible = false;
  isModalLoading = false;
  isEditMode = false;

  constructor(
    private organizationSvc: OrganizationService,
    private router: Router,
    private nzMessage: NzMessageService) {}

  ngOnInit(): void {
    this.organizationSvc.findOwned().subscribe(data => {
      this.organizations = data;
    })
  }

  showModal(organization?: IOrganization): void {
    if (organization) {
      this.isEditMode = true;
      this.currentOrganization = {...organization};
    } else {
      this.isEditMode = false;
      this.currentOrganization = {
        _id: "",
        description: "",
        name: "",
      }
    }
    this.isModalVisible = true;
  }

  validateModal():boolean {
    if (this.currentOrganization.name.trim().length == 0) return false;
    if (this.currentOrganization.description.trim().length == 0) return false;
    return true;
  }

  handleOk(): void {
    this.isModalLoading = true;
    if (!this.validateModal()) {
      this.nzMessage.create("error", `Please fill all required fields`);
      this.isModalLoading = false;
    } else {
      if (this.isEditMode) {
        this.organizationSvc.update(this.currentOrganization).subscribe(data => {
          let index = this.organizations.findIndex(e => e._id == data._id);
          if (index >= 0) {
            this.organizations[index] = data;
          } else {
            this.organizations.push(data);
          }
          this.isModalLoading = false;
          this.isModalVisible = false;
        });
      } else {
        this.organizationSvc.create(this.currentOrganization).subscribe(data => {
          this.organizations.push(data);
          this.isModalLoading = false;
          this.isModalVisible = false;
        });
      }
    }
  }

  handleCancel(): void {
    this.isModalVisible = false;
  }

  deleteOrganization(org: IOrganization) {
    if (!org._id) return;
    this.organizationSvc.delete(org._id).subscribe(data => {
      this.organizations = this.organizations.filter(e => e?._id != org?._id);
      this.nzMessage.info('Operation successful!');
    })
  }

  viewRestaurants(org: IOrganization) {
    this.router.navigate(["/admin/m/r/" + org._id]);
  }
}
