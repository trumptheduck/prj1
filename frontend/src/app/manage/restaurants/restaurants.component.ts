import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RestaurantService } from '../../core/services/restaurant.service';
import { IRestaurant } from '../../core/models/restaurant.model';
import { Location } from '@angular/common';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-restaurants',
  templateUrl: './restaurants.component.html',
  styleUrl: './restaurants.component.scss'
})
export class RestaurantsComponent implements OnInit {

  private orgId: string = "";
  public restaurants: IRestaurant[] = [];

  get modalTitle(): string {
    return this.isEditMode? "Edit Restaurant": "Create Restaurant";
  }

  public currentRestaurant: IRestaurant = {
    orgId: this.orgId,
    description: "",
    name: "",
  };

  isModalVisible = false;
  isModalLoading = false;
  isEditMode = false;

  constructor(
    private route: ActivatedRoute,
    private nzMessage: NzMessageService,
    private restoSvc: RestaurantService,
    private router: Router
    ) {

  }
  ngOnInit(): void {
    this.route.params
      .subscribe(params => {
        this.orgId = params["id"];
        console.log(params);
        this.restoSvc.findByOrgId(this.orgId).subscribe((list) => {
          this.restaurants = list;
          console.log(list);
        });
      }
    );
  }

  showModal(resto?: IRestaurant): void {
    if (resto) {
      this.isEditMode = true;
      this.currentRestaurant = {...resto};
    } else {
      this.isEditMode = false;
      this.currentRestaurant = {
        orgId: this.orgId,
        description: "",
        name: "",
      };
    }
    this.isModalVisible = true;
  }

  validateModal():boolean {
    if (this.currentRestaurant.name.trim().length == 0) return false;
    if (this.currentRestaurant.description.trim().length == 0) return false;
    return true;
  }

  handleOk(): void {
    this.isModalLoading = true;
    if (!this.validateModal()) {
      this.nzMessage.create("error", `Please fill all required fields`);
      this.isModalLoading = false;
    } else {
      if (this.isEditMode) {
        this.restoSvc.update(this.currentRestaurant).subscribe(data => {
          let index = this.restaurants.findIndex(e => e._id == data._id);
          if (index >= 0) {
            this.restaurants[index] = data;
          } else {
            this.restaurants.push(data);
          }
          this.isModalLoading = false;
          this.isModalVisible = false;
        });
      } else {
        console.log(this.currentRestaurant);
        this.restoSvc.create(this.currentRestaurant).subscribe(data => {
          this.restaurants.push(data);
          this.isModalLoading = false;
          this.isModalVisible = false;
        });
      }
    }
  }

  handleCancel(): void {
    this.isModalVisible = false;
  }

  deleteRestaurant(resto: IRestaurant) {
    if (!resto._id) return;
    this.restoSvc.delete(resto._id).subscribe(data => {
      this.restaurants = this.restaurants.filter(e => e?._id != resto?._id);
      this.nzMessage.info('Operation successful!');
    })
  }

  viewMenu(resto: IRestaurant) {
    this.router.navigate([`/admin/m/m/${this.orgId}/${resto._id}`]);
  }

  viewTables(resto: IRestaurant) {
    this.router.navigate([`/admin/m/t/${this.orgId}/${resto._id}`]);
  }
}
