import { Injectable, signal } from '@angular/core';
import { Product } from '../../models/product.model';

const SEED: Product[] = [
  { id:1, name:'MacBook Pro 16"',    category:'Electronics', price:2499, stock:45,  status:'active',   description:'Powerful laptop for pros.',       createdAt:'2024-01-10' },
  { id:2, name:'Wireless Headphones',category:'Electronics', price:199,  stock:120, status:'active',   description:'Noise cancelling headphones.',     createdAt:'2024-01-15' },
  { id:3, name:'Running Shoes',      category:'Sports',      price:89,   stock:0,   status:'inactive', description:'Lightweight running shoes.',       createdAt:'2024-02-01' },
  { id:4, name:'Angular Deep Dive',  category:'Books',       price:39,   stock:200, status:'active',   description:'Complete Angular guide.',          createdAt:'2024-02-10' },
  { id:5, name:'Organic Coffee',     category:'Food',        price:24,   stock:80,  status:'active',   description:'Premium roasted coffee beans.',    createdAt:'2024-02-20' },
  { id:6, name:'Slim Fit Jacket',    category:'Clothing',    price:149,  stock:30,  status:'active',   description:'Modern slim-fit winter jacket.',   createdAt:'2024-03-01' },
  { id:7, name:'Smart Watch',        category:'Electronics', price:329,  stock:0,   status:'inactive', description:'Health tracking smartwatch.',      createdAt:'2024-03-05' },
  { id:8, name:'Yoga Mat',           category:'Sports',      price:45,   stock:60,  status:'active',   description:'Non-slip premium yoga mat.',       createdAt:'2024-03-15' },
];

@Injectable({ providedIn: 'root' })
export class ProductService {
  private _products = signal<Product[]>(SEED);
  private _nextId   = SEED.length + 1;

  getAll()  { return this._products(); }
  getById(id: number) { return this._products().find(p => p.id === id); }

  create(data: Omit<Product,'id'|'createdAt'>): Product {
    const p: Product = { ...data, id: this._nextId++, createdAt: new Date().toISOString().split('T')[0] };
    this._products.update(l => [...l, p]);
    return p;
  }

  update(id: number, data: Partial<Product>): boolean {
    if (!this._products().some(p => p.id === id)) return false;
    this._products.update(l => l.map(p => p.id === id ? { ...p, ...data } : p));
    return true;
  }

  delete(id: number): boolean {
    if (!this._products().some(p => p.id === id)) return false;
    this._products.update(l => l.filter(p => p.id !== id));
    return true;
  }

  search(q: string, cat: string, status: string): Product[] {
    return this._products().filter(p => {
      const t = q.toLowerCase();
      const mQ = !q || p.name.toLowerCase().includes(t) || p.description.toLowerCase().includes(t);
      return mQ && (!cat || p.category === cat) && (!status || p.status === status);
    });
  }
}
