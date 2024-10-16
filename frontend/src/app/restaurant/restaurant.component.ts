import { Component } from '@angular/core';
import { RestaurantService } from '../core/services/restaurant.service';
import { ActivatedRoute } from '@angular/router';
import { IRestaurant } from '../core/models/restaurant.model';

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrl: './restaurant.component.scss'
})
export class RestaurantComponent {
  restaurants: IRestaurant[] = [];
  constructor(
    private route: ActivatedRoute,
    private service: RestaurantService
    ) {

  }
  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        console.log(params); // { order: "popular" }

        let orgId = params["id"];
        this.service.findByOrgId(orgId).subscribe((list) => {
          this.restaurants = list;
          console.log(list);
        });
        console.log(orgId);
      }
    );
  }
}
