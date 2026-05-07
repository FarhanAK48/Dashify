import { Component, inject, signal, computed } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ShellComponent } from '../../../shared/shell/shell.component';
import { ConfirmModalComponent } from '../../../shared/confirm-modal/confirm-modal.component';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../models/user.model';

type SortKey = 'name' | 'email' | 'department' | 'joinDate';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink, FormsModule, ShellComponent, ConfirmModalComponent],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent {
  private svc = inject(UserService);

  search       = '';
  roleFilter   = '';
  statusFilter = '';
  sortKey      = signal<SortKey>('name');
  sortDir      = signal<'asc' | 'desc'>('asc');
  currentPage  = signal(1);
  pageSize     = 5;

  filtered     = signal<User[]>(this.svc.getAll());
  showConfirm  = signal(false);
  deleteTarget = signal<User | null>(null);

  columns = [
    { label: 'User',       key: 'name'       as SortKey | null },
    { label: 'Role',       key: null },
    { label: 'Department', key: 'department' as SortKey | null },
    { label: 'Status',     key: null },
    { label: 'Joined',     key: 'joinDate'   as SortKey | null },
    { label: 'Actions',    key: null },
  ];

  get total()   { return this.svc.getAll().length; }

  totalPages = computed(() => Math.max(1, Math.ceil(this.filtered().length / this.pageSize)));
  paginated  = computed(() => {
    const s = (this.currentPage() - 1) * this.pageSize;
    return this.filtered().slice(s, s + this.pageSize);
  });

  onSearch(): void { this.currentPage.set(1); this.applyFilters(); }

  sort(key: SortKey): void {
    if (this.sortKey() === key) this.sortDir.update(d => d === 'asc' ? 'desc' : 'asc');
    else { this.sortKey.set(key); this.sortDir.set('asc'); }
    this.applyFilters();
  }

  applyFilters(): void {
    let result = this.svc.search(this.search, this.roleFilter, this.statusFilter);
    const k = this.sortKey(); const d = this.sortDir();
    result = [...result].sort((a, b) => {
      const av = a[k] as string; const bv = b[k] as string;
      return d === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
    });
    this.filtered.set(result);
  }

  prevPage(): void { if (this.currentPage() > 1) this.currentPage.update(p => p - 1); }
  nextPage(): void { if (this.currentPage() < this.totalPages()) this.currentPage.update(p => p + 1); }

  confirmDelete(user: User): void { this.deleteTarget.set(user); this.showConfirm.set(true); }
  doDelete(): void {
    if (this.deleteTarget()) { this.svc.delete(this.deleteTarget()!.id); this.applyFilters(); }
    this.showConfirm.set(false);
  }
}
