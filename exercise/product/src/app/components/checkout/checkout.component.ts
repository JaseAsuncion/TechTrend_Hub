import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {
  private readonly cart = inject(CartService);
  readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly orders = inject(OrderService);
  readonly items = this.cart.items;
  readonly total = this.cart.total;
  readonly placing = signal(false);
  readonly placed = signal(false);

  placeOrder() {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/checkout' } });
      return;
    }
    const userId = this.auth.getCurrentUserId();
    if (!userId) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/checkout' } });
      return;
    }
    this.placing.set(true);
    this.orders.createOrder({
      userId,
      items: this.items().map(i => ({ productId: i.product.id, quantity: i.quantity, price: i.product.price })),
      total: this.total().toString()
    }).subscribe({
      next: () => {
        this.placing.set(false);
        this.placed.set(true);
        this.cart.clear();
      },
      error: () => {
        this.placing.set(false);
        // Stay on page; in a real app show error toast
      }
    });
  }

  subTotal(price: string, qty: number): number {
    const n = Number.parseFloat(price || '0');
    return n * qty;
  }
}


