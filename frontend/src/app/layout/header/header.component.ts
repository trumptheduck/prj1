import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {

  public isDocked: boolean = true;
  private scrollThreshold: number = 80;

  ngOnInit(): void {
    window.addEventListener("scroll", (e) => {
      if (window.scrollY > this.scrollThreshold) {
        this.isDocked = false;
      } else {
        this.isDocked = true;
      }
    })
  }
  
}
