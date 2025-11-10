import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface CreateOrderItem {
  productId: number;
  quantity: number;
  price: string;
}

export interface CreateOrderRequest {
  userId: number;
  items: CreateOrderItem[];
  total: string;
}

export interface OrderResponse {
  orderId: number;
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly http = inject(HttpClient);
  private readonly apiBase = `${environment.apiUrl}/orders`;

  createOrder(payload: CreateOrderRequest): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(`${this.apiBase}`, payload);
  }
}




