import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [NgIf],
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.scss'
})
export class ConfirmModalComponent {
  @Input() visible     = false;
  @Input() title       = 'Confirm Action';
  @Input() message     = 'Are you sure?';
  @Input() confirmLabel = 'Delete';
  @Output() confirmed  = new EventEmitter<void>();
  @Output() cancelled  = new EventEmitter<void>();
}
