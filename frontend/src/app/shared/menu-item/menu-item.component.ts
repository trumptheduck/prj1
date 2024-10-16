import { Component, Input } from '@angular/core';
import { IItem } from '../../core/models/item.model';

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrl: './menu-item.component.scss'
})
export class MenuItemComponent {
  @Input() item: IItem | undefined;

  addItem() {
    if (this.item) {
      if (this.item.count == undefined) this.item.count = 0;
      this.item.count += 1;
    }
  }

  removeItem() {
    if (this.item) {
      if (this.item.count == undefined) this.item.count = 0;
      if (this.item.count > 0) this.item.count -= 1;
    }
  }
}
