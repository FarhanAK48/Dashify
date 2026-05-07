import { Injectable, signal } from '@angular/core';
import { User } from '../../models/user.model';

const SEED: User[] = [
  { id:1, name:'Alice Johnson', email:'alice@demo.com', role:'admin', status:'active',   avatar:'AJ', joinDate:'2023-01-15', department:'Engineering' },
  { id:2, name:'Bob Smith',     email:'bob@demo.com',   role:'user',  status:'active',   avatar:'BS', joinDate:'2023-03-22', department:'Marketing'   },
  { id:3, name:'Carol White',   email:'carol@demo.com', role:'user',  status:'inactive', avatar:'CW', joinDate:'2023-05-10', department:'Sales'       },
  { id:4, name:'David Lee',     email:'david@demo.com', role:'user',  status:'active',   avatar:'DL', joinDate:'2023-07-04', department:'HR'          },
  { id:5, name:'Eva Martinez',  email:'eva@demo.com',   role:'admin', status:'active',   avatar:'EM', joinDate:'2022-11-30', department:'Engineering' },
  { id:6, name:'Frank Brown',   email:'frank@demo.com', role:'user',  status:'active',   avatar:'FB', joinDate:'2024-01-08', department:'Finance'     },
  { id:7, name:'Grace Kim',     email:'grace@demo.com', role:'user',  status:'inactive', avatar:'GK', joinDate:'2023-09-14', department:'Marketing'   },
  { id:8, name:'Henry Davis',   email:'henry@demo.com', role:'user',  status:'active',   avatar:'HD', joinDate:'2024-02-20', department:'Sales'       },
];

@Injectable({ providedIn: 'root' })
export class UserService {
  private _users = signal<User[]>(SEED);
  private _nextId = SEED.length + 1;

  getAll()  { return this._users(); }
  getById(id: number) { return this._users().find(u => u.id === id); }

  create(data: Omit<User,'id'>): User {
    const u: User = { ...data, id: this._nextId++ };
    this._users.update(l => [...l, u]);
    return u;
  }

  update(id: number, data: Partial<User>): boolean {
    if (!this._users().some(u => u.id === id)) return false;
    this._users.update(l => l.map(u => u.id === id ? { ...u, ...data } : u));
    return true;
  }

  delete(id: number): boolean {
    if (!this._users().some(u => u.id === id)) return false;
    this._users.update(l => l.filter(u => u.id !== id));
    return true;
  }

  search(q: string, role: string, status: string): User[] {
    return this._users().filter(u => {
      const t = q.toLowerCase();
      const mQ = !q || u.name.toLowerCase().includes(t) || u.email.toLowerCase().includes(t) || u.department.toLowerCase().includes(t);
      return mQ && (!role || u.role === role) && (!status || u.status === status);
    });
  }
}
