import { Component, signal, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CartService } from './services/cart.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('product');
  private readonly cartService = inject(CartService);
  private readonly authService = inject(AuthService);
  readonly cartCount = this.cartService.count;
  readonly currentYear = new Date().getFullYear();
  readonly isAuthenticated = this.authService.isAuthenticated;
  readonly currentUser = this.authService.currentUser;

  logout(event: Event): void {
    event.preventDefault();
    this.authService.logout();
  }
}
