import { Component } from '@angular/core';
import { IOrder } from '../core/models/order.model';
import { OrderService } from '../core/services/order.service';
import { ActivatedRoute } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { APIHost } from '../core/enum/api_path.enums';
import { OrderStatus } from '../core/enum/global.enums';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss'
})
export class OrderComponent {
  order: IOrder|null = null;

  restoId: string = "";
  tableId: string = "";
  orgId: string = "";
  orderId: string = "";

  constructor(
    private route: ActivatedRoute,
    private orderSvc: OrderService,
    private socket: Socket
  ) { }

  ngOnInit() {
    this.route.params
      .subscribe(params => {
        this.orgId = params["orgId"];
        this.tableId = params["tableId"];
        this.restoId = params["restoId"];
        this.orderId = params["orderId"];
        this.orderSvc.findById(this.orderId).subscribe(data => {
          this.order = data;
          this.socket.emit("room:join", [this.tableId], (_: any) => {
            console.log("Joined room");
          });
        })
      }
    );
    this.socket.on("order:update", (data: any) => {
      this.order = data;
    })
  }

  renderImage(name: String) {
    return APIHost.uri + "static/" + name;
  }
  calculateSubtotal() {
    let subtotal = 0;
    if (!this.order) return 0;
    this.order.items.forEach(item => {
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
    return this.calculateSubtotal();
  }

  getStatus(status: OrderStatus) {
    switch (status) {
      case OrderStatus.cancelled: return "Cancelled";
      case OrderStatus.completed: return "Completed";
      case OrderStatus.failed: return "Failed";
      case OrderStatus.preparing: return "Preparing";
      case OrderStatus.processing: return "Processing";
      case OrderStatus.queued: return "Queued";
      case OrderStatus.serving: return "Serving";
    }
  }

  finishOrder() {
    if (!this.order) return;
    this.order.status = OrderStatus.completed;
    this.orderSvc.changeOrderStatus(this.order).subscribe(data => {
      this.socket.emit("order:update", [this.tableId], data, (_: any) => {
        console.log("Update realtime");
      });
    })
  }

}
