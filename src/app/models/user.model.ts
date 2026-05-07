export type UserRole   = 'admin' | 'user';
export type UserStatus = 'active' | 'inactive';
export interface User { id: number; name: string; email: string; role: UserRole; status: UserStatus; avatar: string; joinDate: string; department: string; }
export interface AuthUser { id: number; name: string; email: string; role: UserRole; token: string; }
export interface LoginCredentials { email: string; password: string; }
