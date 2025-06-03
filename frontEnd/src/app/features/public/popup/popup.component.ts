import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Pizza } from 'src/app/models/pizza.model'; 

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupComponent {
  @Input() pizza: Pizza | null = null;
  @Output() addToCart = new EventEmitter<Pizza>();
  @Output() cancel = new EventEmitter<void>();

  constructor() { }

  onAddToCartClick(): void {
    if (this.pizza) {
      this.addToCart.emit(this.pizza);
    }
  }

  onCancelClick(): void {
    this.cancel.emit();
  }
}
