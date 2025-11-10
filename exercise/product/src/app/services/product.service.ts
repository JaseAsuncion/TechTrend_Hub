import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Product {
  id: number;
  name: string;
  description: string;
  categoryName: string;
  imageFile: string;
  unitOfMeasure: string;
  price: string;
  badge?: string;
}

export interface ProductCategory {
  categoryName: string;
  products: Product[];
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly apiBase = `${environment.apiUrl}/product`;

  // Existing backend calls
  getCategories(): Observable<ProductCategory[]> {
    return this.http.get<ProductCategory[]>(`${this.apiBase}`);
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiBase}/${id}`);
  }

  // Optional: implement category filtering on the backend later.
  getProductsByCategory(categoryName: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiBase}?category=${encodeURIComponent(categoryName)}`);
  }
}
