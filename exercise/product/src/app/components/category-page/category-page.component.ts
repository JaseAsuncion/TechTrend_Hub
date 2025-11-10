import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Product, ProductService } from '../../services/product.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-category-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './category-page.component.html',
  styleUrl: './category-page.component.css'
})
export class CategoryPageComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);
  private subscription: Subscription | null = null;

  readonly loading = signal<boolean>(true);
  readonly categoryName = signal<string>('');
  readonly products = signal<Product[]>([]);

  ngOnInit(): void {
    // Subscribe to route params to update when navigating between categories
    this.subscription = this.route.paramMap.subscribe(params => {
      const cat = params.get('name') || '';
      this.categoryName.set(cat);
      this.loading.set(true);

      // Load categories and filter on client for reliability
      this.loadFromCategories(cat);
    });
  }

  private loadFromCategories(cat: string): void {
    this.productService.getCategories().subscribe({
      next: (cats) => {
        const match = (cats || []).find(c => (c.categoryName || '') === cat || (c.categoryName || '').toLowerCase() === cat.toLowerCase());
        this.products.set(match?.products || []);
        this.loading.set(false);
      },
      error: () => {
        this.products.set([]);
        this.loading.set(false);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}


