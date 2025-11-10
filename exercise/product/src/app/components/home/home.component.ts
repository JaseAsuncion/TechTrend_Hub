import { CommonModule } from '@angular/common';
import { Component, OnInit, AfterViewInit, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Product, ProductService } from '../../services/product.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, AfterViewInit {
  private readonly productService = inject(ProductService);

  readonly loading = signal<boolean>(true);
  readonly featuredProducts = signal<Product[]>([]);

  ngOnInit(): void {
    this.productService.getCategories().subscribe({
      next: (data) => {
        const featured: Product[] = [];
        if (data && data.length > 0) {
          data.forEach(category => {
            if (category.products && category.products.length > 0) {
              featured.push(category.products[0]);
              if (category.products.length > 1) featured.push(category.products[1]);
            }
          });
        }
        this.featuredProducts.set(featured);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  ngAfterViewInit(): void {
    // Initialize the carousel after the view is fully rendered
    setTimeout(() => this.initCarousel(), 200);
  }

  private initCarousel(): void {
    const slides = document.querySelectorAll<HTMLElement>('.slide');
    const prevBtn = document.querySelector('.carousel-btn.prev') as HTMLButtonElement;
    const nextBtn = document.querySelector('.carousel-btn.next') as HTMLButtonElement;

    if (slides.length === 0) return;

    let currentIndex = 0;
    let intervalId: any;

    const showSlide = (index: number) => {
      slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
      });
    };

    const nextSlide = () => {
      currentIndex = (currentIndex + 1) % slides.length;
      showSlide(currentIndex);
    };

    const prevSlide = () => {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      showSlide(currentIndex);
    };

    const startAutoSlide = () => (intervalId = setInterval(nextSlide, 5000));
    const stopAutoSlide = () => clearInterval(intervalId);

    // Button navigation
    prevBtn?.addEventListener('click', () => {
      stopAutoSlide();
      prevSlide();
      startAutoSlide();
    });
    nextBtn?.addEventListener('click', () => {
      stopAutoSlide();
      nextSlide();
      startAutoSlide();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        stopAutoSlide();
        prevSlide();
        startAutoSlide();
      } else if (e.key === 'ArrowRight') {
        stopAutoSlide();
        nextSlide();
        startAutoSlide();
      }
    });

    showSlide(currentIndex);
    startAutoSlide();
  }
}
