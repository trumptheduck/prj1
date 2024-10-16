import { Component } from '@angular/core';
import { ITable } from '../../core/models/table.model';
import { TableService } from '../../core/services/table.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ActivatedRoute, Router } from '@angular/router';
import { IOrder } from '../../core/models/order.model';
import { OrderStatus, PaymentStatus, PaymentType } from '../../core/enum/global.enums';
import { OrderService } from '../../core/services/order.service';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrl: './tables.component.scss'
})
export class TablesComponent {
  public tables: ITable[] = [];
  public latestOrders: Map<String, IOrder> = new Map();
  
  private orgId: string = "";
  private restoId: string = "";

  public currentTable: ITable = {
    _id: "",
    orgId: "",
    restoId: "",
    description: "",
    name: "",
  };

  get modalTitle(): string {
    return this.isEditMode? "Edit Table": "Create Table";
  }

  isModalVisible = false;
  isModalLoading = false;
  isEditMode = false;

  constructor(
    private route: ActivatedRoute,
    private tableSvc: TableService,
    private orderSvc: OrderService,
    private router: Router,
    private nzMessage: NzMessageService,
    private socket: Socket) {}

  ngOnInit(): void {
    this.route.params
      .subscribe(params => {
        this.orgId = params["orgId"];
        this.restoId = params["restoId"];
        this.tableSvc.findByRestoId(this.restoId).subscribe(data => {
          this.tables = data;
          this.socket.emit("room:join", this.tables.map(e => e._id), (_: any) => {
            console.log("Joined rooms");
          })
          console.log(data);
          data.forEach(table => {
            this.orderSvc.findByTableId(table._id).subscribe(orders => {
              if (orders.length > 0) {
                let latestOrder = orders.pop() as IOrder;
                this.latestOrders.set(table._id, latestOrder);
              }
            })
          })
        })
      }
    );
    this.socket.on("order:update", (order: IOrder) => {
      this.latestOrders.set(order.tableId, order);
    })
  }

  showModal(table?: ITable): void {
    if (table) {
      this.isEditMode = true;
      this.currentTable = {...table};
    } else {
      this.isEditMode = false;
      this.currentTable = {
        _id: "",
        orgId: this.orgId,
        restoId: this.restoId,
        description: "",
        name: "",
      }
    }
    this.isModalVisible = true;
  }

  validateModal():boolean {
    if (this.currentTable.name.trim().length == 0) return false;
    if (this.currentTable.description.trim().length == 0) return false;
    return true;
  }

  handleOk(): void {
    this.isModalLoading = true;
    if (!this.validateModal()) {
      this.nzMessage.create("error", `Please fill all required fields`);
      this.isModalLoading = false;
    } else {
      if (this.isEditMode) {
        this.tableSvc.update(this.currentTable).subscribe(data => {
          let index = this.tables.findIndex(e => e._id == data._id);
          if (index >= 0) {
            this.tables[index] = data;
          } else {
            this.tables.push(data);
          }
          this.isModalLoading = false;
          this.isModalVisible = false;
        });
      } else {
        this.tableSvc.create(this.currentTable).subscribe(data => {
          this.tables.push(data);
          this.isModalLoading = false;
          this.isModalVisible = false;
        });
      }
    }
  }

  handleCancel(): void {
    this.isModalVisible = false;
  }

deleteTable(org: ITable) {
    if (!org._id) return;
    this.tableSvc.delete(org._id).subscribe(data => {
      this.tables = this.tables.filter(e => e?._id != org?._id);
      this.nzMessage.info('Operation successful!');
    })
  }

  viewRestaurants(org: ITable) {
    this.router.navigate(["/admin/m/r/" + org._id]);
  }

    getStatus(status: OrderStatus) {
      switch (status) {
        case OrderStatus.cancelled: return "cancelled";
        case OrderStatus.completed: return "completed";
        case OrderStatus.failed: return "failed";
        case OrderStatus.preparing: return "preparing";
        case OrderStatus.processing: return "processing";
        case OrderStatus.queued: return "queued";
        case OrderStatus.serving: return "serving";
      }
  }

  updateOrderStatus(order: IOrder, status: number) {
    order.status = status;
    this.orderSvc.update(order).subscribe(data => {
      this.socket.emit("order:update", [order.tableId], data, (_: any) => {
        console.log("Update realtime");
      });
    })
  }

  copyTableURL(table: ITable) {
    navigator.clipboard.writeText(`http://localhost:4200/menu/${this.orgId}/${this.restoId}/${table._id}`);
    this.nzMessage.success("Successfully copied Table URL");
  }
}
