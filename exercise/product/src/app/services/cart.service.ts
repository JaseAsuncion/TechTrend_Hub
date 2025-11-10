import { Injectable, computed, signal } from '@angular/core';
import type { Product } from './product.service';

export interface CartItem {
  product: Product;
  quantity: number;
}

const STORAGE_KEY = 'tth-cart-v1';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly itemsSignal = signal<CartItem[]>(this.readFromStorage());

  readonly items = computed(() => this.itemsSignal());
  readonly count = computed(() => this.itemsSignal().reduce((sum, i) => sum + i.quantity, 0));
  readonly total = computed(() => this.itemsSignal().reduce((sum, i) => sum + parseFloat(i.product.price || '0') * i.quantity, 0));

  add(product: Product, qty: number = 1): void {
    const next = [...this.itemsSignal()];
    const idx = next.findIndex(i => i.product.id === product.id);
    if (idx >= 0) { next[idx] = { product: next[idx].product, quantity: next[idx].quantity + qty }; }
    else { next.push({ product, quantity: qty }); }
    this.commit(next);
  }

  updateQuantity(productId: number, qty: number): void {
    if (qty <= 0) { this.remove(productId); return; }
    const next = this.itemsSignal().map(i => i.product.id === productId ? { ...i, quantity: qty } : i);
    this.commit(next);
  }

  remove(productId: number): void {
    const next = this.itemsSignal().filter(i => i.product.id !== productId);
    this.commit(next);
  }

  clear(): void { this.commit([]); }

  private commit(next: CartItem[]): void {
    this.itemsSignal.set(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  private readFromStorage(): CartItem[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) as CartItem[] : [];
    } catch {
      return [];
    }
  }
}



