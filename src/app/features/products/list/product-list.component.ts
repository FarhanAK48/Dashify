import { Component, inject, signal, computed } from '@angular/core';
import { NgFor, NgIf, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ShellComponent } from '../../../shared/shell/shell.component';
import { ConfirmModalComponent } from '../../../shared/confirm-modal/confirm-modal.component';
import { ProductService } from '../../../core/services/product.service';
import { AuthService } from '../../../core/services/auth.service';
import { Product } from '../../../models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [NgFor, NgIf, CurrencyPipe, RouterLink, FormsModule, ShellComponent, ConfirmModalComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent {
  private svc = inject(ProductService);
  auth        = inject(AuthService);

  search         = '';
  categoryFilter = '';
  statusFilter   = '';
  sortKey        = signal('name');
  sortDir        = signal<'asc' | 'desc'>('asc');
  currentPage    = signal(1);
  pageSize       = 5;
  filtered       = signal<Product[]>(this.svc.getAll());
  showConfirm    = signal(false);
  deleteTarget   = signal<Product | null>(null);

  categories = ['Electronics','Clothing','Books','Food','Sports'];
  columns    = [
    { label: 'Product',  key: 'name'      },
    { label: 'Category', key: 'category'  },
    { label: 'Price',    key: 'price'     },
    { label: 'Stock',    key: 'stock'     },
    { label: 'Status',   key: null        },
    { label: 'Created',  key: 'createdAt' },
    { label: 'Actions',  key: null        },
  ];

  totalPages = computed(() => Math.max(1, Math.ceil(this.filtered().length / this.pageSize)));
  paginated  = computed(() => {
    const s = (this.currentPage() - 1) * this.pageSize;
    return this.filtered().slice(s, s + this.pageSize);
  });

  onSearch(): void { this.currentPage.set(1); this.applyFilters(); }

  sort(key: string): void {
    if (this.sortKey() === key) this.sortDir.update(d => d === 'asc' ? 'desc' : 'asc');
    else { this.sortKey.set(key); this.sortDir.set('asc'); }
    this.applyFilters();
  }

  applyFilters(): void {
    let result = this.svc.search(this.search, this.categoryFilter, this.statusFilter);
    const k = this.sortKey() as keyof Product; const d = this.sortDir();
    result = [...result].sort((a, b) => {
      const av = a[k]; const bv = b[k];
      if (typeof av === 'number' && typeof bv === 'number') return d === 'asc' ? av - bv : bv - av;
      return d === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
    });
    this.filtered.set(result);
  }

  prevPage(): void { if (this.currentPage() > 1) this.currentPage.update(p => p - 1); }
  nextPage(): void { if (this.currentPage() < this.totalPages()) this.currentPage.update(p => p + 1); }
  confirmDelete(p: Product): void { this.deleteTarget.set(p); this.showConfirm.set(true); }
  doDelete(): void {
    if (this.deleteTarget()) { this.svc.delete(this.deleteTarget()!.id); this.applyFilters(); }
    this.showConfirm.set(false);
  }
}
