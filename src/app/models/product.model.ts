export type ProductStatus   = 'active' | 'inactive';
export type ProductCategory = 'Electronics' | 'Clothing' | 'Books' | 'Food' | 'Sports';
export interface Product { id: number; name: string; category: ProductCategory; price: number; stock: number; status: ProductStatus; description: string; createdAt: string; }
