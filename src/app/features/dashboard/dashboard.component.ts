import { Component, inject } from '@angular/core';
import { NgFor, NgIf, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ShellComponent } from '../../shared/shell/shell.component';
import { UserService } from '../../core/services/user.service';
import { ProductService } from '../../core/services/product.service';
import { AuthService } from '../../core/services/auth.service';

export interface BarItem  { label: string; value: string; height: number; }
export interface StatItem { label: string; value: string; change: string; positive: boolean; icon: string; }

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgFor, NgIf, CurrencyPipe, RouterLink, ShellComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  private userSvc    = inject(UserService);
  private productSvc = inject(ProductService);
  auth               = inject(AuthService);

  stats: StatItem[] = [
    { label: 'Total Users',    value: '8',      change: '+12% this month',    positive: true,  icon: '👥' },
    { label: 'Products',       value: '8',      change: '+3 added',           positive: true,  icon: '📦' },
    { label: 'Revenue',        value: '$48.2k', change: '+8.1% vs last month',positive: true,  icon: '💰' },
    { label: 'Active Users',   value: '6',      change: '-1 this week',       positive: false, icon: '✅' },
  ];

  revenueChart: BarItem[] = [
    { label:'Jan', value:'32k', height:55  },
    { label:'Feb', value:'28k', height:48  },
    { label:'Mar', value:'41k', height:70  },
    { label:'Apr', value:'38k', height:65  },
    { label:'May', value:'52k', height:88  },
    { label:'Jun', value:'48k', height:82  },
    { label:'Jul', value:'61k', height:100 },
    { label:'Aug', value:'55k', height:92  },
  ];

  get totalUsers()   { return this.userSvc.getAll().length; }
  get adminCount()   { return this.userSvc.getAll().filter(u => u.role === 'admin').length; }
  get userCount()    { return this.totalUsers - this.adminCount; }
  get adminArc()     { return Math.round((this.adminCount / this.totalUsers) * 220); }
  get recentUsers()  { return this.userSvc.getAll().slice(0, 5); }
  get topProducts()  { return this.productSvc.getAll().filter(p => p.stock > 0).slice(0, 5); }
}
