import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  private readonly cart = inject(CartService);
  readonly items = this.cart.items;
  readonly total = this.cart.total;

  updateQty(id: number, value: string) {
    const qty = Number(value);
    this.cart.updateQuantity(id, qty);
  }

  remove(id: number) { this.cart.remove(id); }

  subTotal(price: string, qty: number): number {
    const n = Number.parseFloat(price || '0');
    return n * qty;
  }
}


