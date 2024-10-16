import { Component } from '@angular/core';
import { ItemService } from '../core/services/item.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IItem } from '../core/models/item.model';
import { OrderService } from '../core/services/order.service';
import { OrderStatus, PaymentStatus, PaymentType } from '../core/enum/global.enums';
import { APIHost } from '../core/enum/api_path.enums';
import { IRestaurant } from '../core/models/restaurant.model';
import { ITable } from '../core/models/table.model';
import { TableService } from '../core/services/table.service';
import { RestaurantService } from '../core/services/restaurant.service';
import { IOrder } from '../core/models/order.model';
import { ISelection } from '../core/models/selection.model';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  items: IItem[] = [];
  cart: IItem[] = [];
  restoId: string = "";
  tableId: string = "";
  orgId: string = "";

  currentOrder: IOrder = {
    tableId: this.tableId,
    restoId: this.restoId,
    orgId: this.orgId,
    status: OrderStatus.processing,
    paymentStatus: PaymentStatus.unpaid,
    paymentType: PaymentType.cash,
    tax: 0,
    subtotal: 0,
    total: 0,
    items: [],
    history: []
  };
  
  restaurant?: IRestaurant;
  table?: ITable;

  isModalVisible = false;
  isModalLoading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private itemSvc: ItemService,
    private tableSvc: TableService,
    private restoSvc: RestaurantService,
    private orderService: OrderService,
    private nzMessage: NzMessageService,
    private socket: Socket
  ) {

  }
  ngOnInit() {
    this.route.params
      .subscribe(params => {
        this.orgId = params["orgId"];
        this.tableId = params["tableId"];
        this.restoId = params["restoId"];
        console.log(params);
        this.itemSvc.findByRestoId(this.restoId).subscribe((list) => {
          this.items = list;
          console.log(list);
        });
        this.tableSvc.findById(this.tableId).subscribe(table => {
          this.table = table;
        })
        this.restoSvc.findById(this.restoId).subscribe(resto => {
          this.restaurant = resto;
        })
      }
    );
  }

  placeOrder() {
    this.orderService.create(this.currentOrder);
  }

  addItem(item: IItem) {
    this.currentOrder.items.push(JSON.parse(JSON.stringify(item)));
    this.nzMessage.success("Item added successfully");
  }

  renderImage(name: String) {
    return APIHost.uri + "static/" + name;
  }

  handleCancel(): void {
    this.isModalVisible = false;
  }

  handleOk(): void {
    this.isModalLoading = true;
    this.currentOrder.orgId = this.orgId;
    this.currentOrder.restoId = this.restoId;
    this.currentOrder.tableId = this.tableId;
    this.currentOrder.subtotal = this.calculateSubtotal();
    this.currentOrder.total = this.calculateTotal();
    this.orderService.placeOrder(this.currentOrder).subscribe(data => {
      this.socket.emit("order:update", [this.tableId], data, (_: any) => {
        console.log("Update realtime");
      });
      this.isModalLoading = false;
      this.isModalVisible = false;
      this.router.navigate([`/order/${this.orgId}/${this.restoId}/${this.tableId}/${data._id}`]);
    })
  }

  showModal(): void {
    this.isModalVisible = true;
  }

  selectRadioSelection(selections: ISelection[], index: number) {
    selections.forEach(selection => selection.selected = false);
    selections[index].selected = true;
  }

  calculateSubtotal() {
    let subtotal = 0;
    this.currentOrder.items.forEach(item => {
      subtotal += item.price;
      item.options.forEach(option => {
        option.selections.forEach(selection => {
          if (selection.selected) {
            subtotal += selection.price;
          }
        })
      })
    })
    return subtotal;
  }

  calculateTotal() {
    return this.calculateSubtotal() * (this.currentOrder.tax + 1)
  }

  removeItem(index: number) {
    this.currentOrder.items.splice(index, 1);
  }
}
