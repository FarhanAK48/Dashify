import { Component, Input, signal, HostListener } from '@angular/core';
import { NgClass } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TopbarComponent } from '../topbar/topbar.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [NgClass, SidebarComponent, TopbarComponent],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss'
})
export class ShellComponent {
  @Input() pageTitle = '';

  sidebarOpen = signal(true);
  isMobile    = signal(false);

  @HostListener('window:resize')
  onResize(): void {
    const mobile = window.innerWidth < 1024;
    this.isMobile.set(mobile);
    if (mobile) this.sidebarOpen.set(false);
    else        this.sidebarOpen.set(true);
  }

  constructor() { this.onResize(); }

  toggleSidebar(): void { this.sidebarOpen.update(v => !v); }
}
