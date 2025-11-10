import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProductCategory, ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {
  private readonly productService = inject(ProductService);

  readonly loading = signal<boolean>(false);
  readonly categories = signal<ProductCategory[]>([]);
  readonly query = signal<string>('');
  readonly selectedCategory = signal<string>('');

  readonly filteredCategories = computed(() => {
    const q = this.query().toLowerCase().trim();
    const cat = this.selectedCategory();
    const categories = this.categories();
    if (!q && !cat) { return categories; }
    return categories
      .filter(c => !cat || c.categoryName === cat)
      .map(c => ({
        ...c,
        products: c.products.filter(p => !q || p.name.toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q))
      }))
      .filter(c => c.products.length > 0);
  });

  ngOnInit(): void {
    this.loading.set(true);
    this.productService.getCategories().subscribe({
      next: (data) => {
        const allowed = new Set(['Wearables', 'Audio Tech', 'Smart Home', 'Accessories']);
        const filtered = (data ?? []).filter(c => allowed.has(c.categoryName));
        this.categories.set(filtered);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
}


