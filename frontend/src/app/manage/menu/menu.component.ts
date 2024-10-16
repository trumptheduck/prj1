import { Component } from '@angular/core';
import { IItem } from '../../core/models/item.model';
import { ItemService } from '../../core/services/item.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ActivatedRoute, Router } from '@angular/router';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable, Observer } from 'rxjs';
import { APIHost } from '../../core/enum/api_path.enums';
import { FileService } from '../../core/services/file.service';
import { IOption } from '../../core/models/option.model';
import { ISelection } from '../../core/models/selection.model';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {

  private orgId: string = "";
  private restoId: string = "";
  public items: IItem[] = [];
  public selectedThumbnail?: File;

  get modalTitle(): string {
    return this.isEditMode? "Edit Item": "Create Item";
  }

  public currentItem: IItem = {
    orgId: this.orgId,
    restoId: this.restoId,
    options: [],
    price: 0,
    thumbnail: "",
    description: "",
    name: "",
  };

  isModalVisible = false;
  isModalLoading = false;
  isEditMode = false;

  isPhotoUploading = false;

  constructor(
    private route: ActivatedRoute,
    private nzMessage: NzMessageService,
    private itemSvc: ItemService,
    private fileSvc: FileService,
    private router: Router
    ) {

  }
  ngOnInit(): void {
    this.route.params
      .subscribe(params => {
        this.orgId = params["orgId"];
        this.restoId = params["restoId"];
        console.log(params);
        this.itemSvc.findByRestoId(this.restoId).subscribe((list) => {
          this.items = list;
          console.log(list);
        });
      }
    );
  }

  showModal(item?: IItem): void {
    this.selectedThumbnail = undefined;
    if (item) {
      this.isEditMode = true;
      this.currentItem = {...item};
    } else {
      this.isEditMode = false;
      this.currentItem = {
        orgId: this.orgId,
        restoId: this.restoId,
        options: [],
        price: 0,
        thumbnail: "",
        description: "",
        name: "",
      };
    }
    this.isModalVisible = true;
  }

  validateModal():boolean {
    if (this.currentItem.name.trim().length == 0) return false;
    if (this.currentItem.description.trim().length == 0) return false;
    return true;
  }

   async handleOk(): Promise<any> {
    this.isModalLoading = true;
    if (!this.validateModal()) {
      this.nzMessage.create("error", `Please fill all required fields`);
      this.isModalLoading = false;
    } else {
      if (this.selectedThumbnail) {
        let thumbnail = await this.fileSvc.uploadFile([this.selectedThumbnail]).toPromise();
        if (thumbnail&&thumbnail.length > 0) {
          this.currentItem.thumbnail = thumbnail[0].filename;
        }
      }
      if (this.isEditMode) {
        console.log(this.currentItem);
        this.itemSvc.update(this.currentItem).subscribe(data => {
          let index = this.items.findIndex(e => e._id == data._id);
          if (index >= 0) {
            this.items[index] = data;
          } else {
            this.items.push(data);
          }
          this.isModalLoading = false;
          this.isModalVisible = false;
        });
      } else {
        console.log(this.currentItem);
        this.itemSvc.create(this.currentItem).subscribe(data => {
          this.items.push(data);
          this.isModalLoading = false;
          this.isModalVisible = false;
        });
      }
    }
  }

  handleCancel(): void {
    this.isModalVisible = false;
  }

  deleteItem(item: IItem) {
    if (!item._id) return;
    this.itemSvc.delete(item._id).subscribe(data => {
      this.items = this.items.filter(e => e?._id != item?._id);
      this.nzMessage.info('Operation successful!');
    })
  }

  viewMenu(item: IItem) {
    this.router.navigate(["/admin/m/r/" + item._id]);
  }
  
  viewTables(item: IItem) {
    this.router.navigate(["/admin/m/r/" + item._id]);
  }

  handleFileChange(event: any) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      this.selectedThumbnail = fileList[0];
    }
  }

  renderImage(name: String) {
    return APIHost.uri + "static/" + name;
  }

  addOption(options: IOption[]) {
    options.push({
      description: "",
      multi: false,
      name: "",
      selections: [],
    })
  }

  addSelection(selections: ISelection[]) {
    selections.push({
      description: "",
      name: "",
      price: 0,
    })
  }

  deleteOption(options: IOption[], index: number) {
    options.splice(index, 1);
  }

  deleteSelection(selections: ISelection[], index: number) {
    selections.splice(index, 1);
  }
}
