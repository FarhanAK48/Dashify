import { Component, inject, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

export interface NavItem { label: string; icon: string; route: string; adminOnly: boolean; }

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgFor, NgIf],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  @Input() open = true;
  @Input() isMobile = false;
  @Output() closed = new EventEmitter<void>();

  auth = inject(AuthService);

  navItems: NavItem[] = [
    { label: 'Dashboard', icon: '📊', route: '/dashboard',  adminOnly: false },
    { label: 'Users',     icon: '👥', route: '/users',      adminOnly: true  },
    { label: 'Products',  icon: '📦', route: '/products',   adminOnly: false },
    { label: 'Profile',   icon: '👤', route: '/profile',    adminOnly: false },
  ];
}
