import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ShellComponent } from '../../../shared/shell/shell.component';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [NgIf, NgFor, ReactiveFormsModule, RouterLink, ShellComponent],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent implements OnInit {
  private fb     = inject(FormBuilder);
  private svc    = inject(UserService);
  private router = inject(Router);
  private route  = inject(ActivatedRoute);

  isEdit  = false;
  editId  = 0;
  success = signal(false);

  departments = ['Engineering','Marketing','Sales','HR','Finance','Operations'];

  form = this.fb.group({
    name:       ['', Validators.required],
    email:      ['', [Validators.required, Validators.email]],
    role:       ['user'],
    status:     ['active'],
    department: ['Engineering'],
    joinDate:   [new Date().toISOString().split('T')[0]],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.editId = +id;
      const user = this.svc.getById(this.editId);
      if (user) this.form.patchValue(user);
      else this.router.navigate(['/users']);
    }
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const val    = this.form.value;
    const avatar = (val.name ?? '').split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
    const data   = { ...val, avatar } as any;
    if (this.isEdit) this.svc.update(this.editId, data);
    else             this.svc.create(data);
    this.success.set(true);
    setTimeout(() => this.router.navigate(['/users']), 1200);
  }
}
