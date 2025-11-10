import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Product, ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);
  private readonly cart = inject(CartService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly loading = signal<boolean>(false);
  readonly product = signal<Product | null>(null);
  readonly imageSrc = signal<string>('assets/placeholder.png');

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) { return; }
    this.loading.set(true);
    this.productService.getProduct(id).subscribe({
      next: (p) => {
        if (this.isValidProduct(p)) {
          console.log('[Detail] API product', p);
          this.product.set(p as Product);
          this.imageSrc.set(this.resolveImageSrc((p as any).imageFile));
          console.log('[Detail] API imageSrc', this.imageSrc());
          this.loading.set(false);
        } else {
          const fallbackName = (p && (p as any).name) ? String((p as any).name) : '';
          this.loadFromCategoriesById(id, fallbackName);
        }
      },
      error: () => this.loadFromCategoriesById(id, '')
    });
  }

  addToCart(p: Product) {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: `/product/${p.id}` } });
      return;
    }
    this.cart.add(p, 1);
  }

  private resolveImageSrc(imageFile?: string): string {
    if (!imageFile) { return 'assets/placeholder.png'; }
    const val = imageFile.trim();
    if (val.startsWith('http://') || val.startsWith('https://')) { return val; }
    if (val.startsWith('assets/')) { return val; }
    return `assets/${val}`;
  }

  private isValidProduct(p: any): p is Product {
    if (!p) { return false; }
    // Require at least an image or multiple critical fields to avoid placeholder-only objects
    const hasImage = typeof p.imageFile === 'string' && p.imageFile.trim().length > 0;
    const hasCategory = typeof p.categoryName === 'string' && p.categoryName.trim().length > 0;
    const hasPrice = typeof p.price === 'string' && p.price.trim().length > 0;
    // valid if we have image OR (category and price)
    return hasImage || (hasCategory && hasPrice);
  }

  private loadFromCategoriesById(id: number, fallbackName: string): void {
    this.productService.getCategories().subscribe({
      next: (cats) => {
        const all = (cats || []).flatMap(c => c.products || []);
        let found = all.find(p => p.id === id) || null;
        if (!found && fallbackName) {
          const nameLc = fallbackName.toLowerCase();
          found = all.find(p => (p.name || '').toLowerCase() === nameLc) || null;
        }
        console.debug('[Detail] Fallback found', found);
        this.product.set(found);
        this.imageSrc.set(this.resolveImageSrc((found as any)?.imageFile));
        console.debug('[Detail] Fallback imageSrc', this.imageSrc());
        this.loading.set(false);
      },
      error: () => {
        this.product.set(null);
        this.imageSrc.set('assets/placeholder.png');
        this.loading.set(false);
      }
    });
  }
}


