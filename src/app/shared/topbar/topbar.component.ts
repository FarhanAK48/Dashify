import { Component, inject, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss'
})
export class TopbarComponent {
  @Input() title = 'Dashboard';
  @Output() menuToggle = new EventEmitter<void>();
  auth = inject(AuthService);

  get firstName(): string {
    return (this.auth.currentUser()?.name ?? '').split(' ')[0];
  }
}
