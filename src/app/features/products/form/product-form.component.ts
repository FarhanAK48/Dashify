import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ShellComponent } from '../../../shared/shell/shell.component';
import { ProductService } from '../../../core/services/product.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [NgIf, NgFor, ReactiveFormsModule, RouterLink, ShellComponent],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class ProductFormComponent implements OnInit {
  private fb     = inject(FormBuilder);
  private svc    = inject(ProductService);
  private router = inject(Router);
  private route  = inject(ActivatedRoute);

  isEdit  = false;
  editId  = 0;
  success = signal(false);

  categories = ['Electronics','Clothing','Books','Food','Sports'];

  form = this.fb.group({
    name:        ['', Validators.required],
    category:    ['Electronics'],
    price:       [0,  [Validators.required, Validators.min(0)]],
    stock:       [0,  [Validators.required, Validators.min(0)]],
    status:      ['active'],
    description: [''],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.editId = +id;
      const p = this.svc.getById(this.editId);
      if (p) this.form.patchValue(p);
      else   this.router.navigate(['/products']);
    }
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    if (this.isEdit) this.svc.update(this.editId, this.form.value as any);
    else             this.svc.create(this.form.value as any);
    this.success.set(true);
    setTimeout(() => this.router.navigate(['/products']), 1200);
  }
}
