// Types for the hardware store system
export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  minStock: number;
  maxStock: number;
  supplier: string;
  description: string;
  barcode?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  documentType: 'DNI' | 'RUC';
  documentNumber: string;
  createdAt: Date;
  totalPurchases: number;
}

export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  ruc: string;
  contactPerson: string;
  paymentTerms: string;
  createdAt: Date;
}

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Sale {
  id: string;
  customerId?: string;
  customerName: string;
  items: SaleItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: 'efectivo' | 'tarjeta' | 'transferencia' | 'yape' | 'plin';
  documentType: 'boleta' | 'factura';
  documentNumber: string;
  createdAt: Date;
  status: 'completed' | 'pending' | 'cancelled';
}

export interface Purchase {
  id: string;
  supplierId: string;
  supplierName: string;
  items: PurchaseItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'pending' | 'received' | 'cancelled';
  orderDate: Date;
  expectedDate?: Date;
  receivedDate?: Date;
}

export interface PurchaseItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface DashboardStats {
  totalSales: number;
  salesCount: number;
  lowStockProducts: number;
  totalCustomers: number;
  totalProducts: number;
  monthlySales: { month: string; amount: number }[];
  topProducts: { name: string; sales: number }[];
}