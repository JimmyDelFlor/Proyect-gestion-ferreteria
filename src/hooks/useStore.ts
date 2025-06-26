import { useLocalStorage } from './useLocalStorage';
import { Product, Customer, Supplier, Sale, Purchase } from '../types';

export function useStore() {
  const [products, setProducts] = useLocalStorage<Product[]>('products', []);
  const [customers, setCustomers] = useLocalStorage<Customer[]>('customers', []);
  const [suppliers, setSuppliers] = useLocalStorage<Supplier[]>('suppliers', []);
  const [sales, setSales] = useLocalStorage<Sale[]>('sales', []);
  const [purchases, setPurchases] = useLocalStorage<Purchase[]>('purchases', []);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addProduct = (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProduct: Product = {
      ...product,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setProducts(prev => [...prev, newProduct]);
    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(product => 
      product.id === id 
        ? { ...product, ...updates, updatedAt: new Date() }
        : product
    ));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(product => product.id !== id));
  };

  const addCustomer = (customer: Omit<Customer, 'id' | 'createdAt' | 'totalPurchases'>) => {
    const newCustomer: Customer = {
      ...customer,
      id: generateId(),
      createdAt: new Date(),
      totalPurchases: 0,
    };
    setCustomers(prev => [...prev, newCustomer]);
    return newCustomer;
  };

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    setCustomers(prev => prev.map(customer => 
      customer.id === id ? { ...customer, ...updates } : customer
    ));
  };

  const deleteCustomer = (id: string) => {
    setCustomers(prev => prev.filter(customer => customer.id !== id));
  };

  const addSupplier = (supplier: Omit<Supplier, 'id' | 'createdAt'>) => {
    const newSupplier: Supplier = {
      ...supplier,
      id: generateId(),
      createdAt: new Date(),
    };
    setSuppliers(prev => [...prev, newSupplier]);
    return newSupplier;
  };

  const updateSupplier = (id: string, updates: Partial<Supplier>) => {
    setSuppliers(prev => prev.map(supplier => 
      supplier.id === id ? { ...supplier, ...updates } : supplier
    ));
  };

  const deleteSupplier = (id: string) => {
    setSuppliers(prev => prev.filter(supplier => supplier.id !== id));
  };

  const addSale = (sale: Omit<Sale, 'id' | 'createdAt' | 'documentNumber'>) => {
    const documentNumber = sale.documentType === 'boleta' 
      ? `B001-${(sales.filter(s => s.documentType === 'boleta').length + 1).toString().padStart(8, '0')}`
      : `F001-${(sales.filter(s => s.documentType === 'factura').length + 1).toString().padStart(8, '0')}`;

    const newSale: Sale = {
      ...sale,
      id: generateId(),
      documentNumber,
      createdAt: new Date(),
    };

    // Update product stock
    sale.items.forEach(item => {
      updateProduct(item.productId, {
        stock: products.find(p => p.id === item.productId)!.stock - item.quantity
      });
    });

    // Update customer total purchases
    if (sale.customerId) {
      const customer = customers.find(c => c.id === sale.customerId);
      if (customer) {
        updateCustomer(sale.customerId, {
          totalPurchases: customer.totalPurchases + sale.total
        });
      }
    }

    setSales(prev => [...prev, newSale]);
    return newSale;
  };

  const addPurchase = (purchase: Omit<Purchase, 'id'>) => {
    const newPurchase: Purchase = {
      ...purchase,
      id: generateId(),
    };
    setPurchases(prev => [...prev, newPurchase]);
    return newPurchase;
  };

  const updatePurchase = (id: string, updates: Partial<Purchase>) => {
    setPurchases(prev => prev.map(purchase => 
      purchase.id === id ? { ...purchase, ...updates } : purchase
    ));
  };

  const getLowStockProducts = () => {
    return products.filter(product => product.stock <= product.minStock);
  };

  return {
    products,
    customers,
    suppliers,
    sales,
    purchases,
    addProduct,
    updateProduct,
    deleteProduct,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    addSale,
    addPurchase,
    updatePurchase,
    getLowStockProducts,
  };
}