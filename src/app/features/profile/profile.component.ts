import { Component, inject } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { ShellComponent } from '../../shared/shell/shell.component';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [TitleCasePipe, ShellComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  auth = inject(AuthService);
}
