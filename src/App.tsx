import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Sales from './components/Sales';
import Products from './components/Products';
import Customers from './components/Customers';
import Suppliers from './components/Suppliers';
import { useStore } from './hooks/useStore';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { getLowStockProducts, addProduct, addCustomer, addSupplier } = useStore();
  const lowStockProducts = getLowStockProducts();

  // Initialize with sample data if storage is empty
  useEffect(() => {
    const initializeData = () => {
      // Add sample suppliers
      const supplier1 = addSupplier({
        name: 'Ferretería El Martillo SAC',
        email: 'ventas@elmartillo.com',
        phone: '01-234-5678',
        address: 'Av. Industrial 123, Lima',
        ruc: '20123456789',
        contactPerson: 'Juan Pérez',
        paymentTerms: '30 días'
      });

      const supplier2 = addSupplier({
        name: 'Distribuidora Tornillos Perú',
        email: 'info@tornillosperu.com',
        phone: '01-876-5432',
        address: 'Jr. Comercio 456, Lima',
        ruc: '20987654321',
        contactPerson: 'María García',
        paymentTerms: 'Contado'
      });

      // Add sample products
      addProduct({
        name: 'Martillo de Carpintero 16oz',
        category: 'Herramientas',
        price: 35.50,
        stock: 25,
        minStock: 5,
        maxStock: 50,
        supplier: supplier1.id,
        description: 'Martillo de carpintero con mango de madera, cabeza de acero templado',
        barcode: '7891234567890'
      });

      addProduct({
        name: 'Destornillador Phillips #2',
        category: 'Herramientas',
        price: 12.80,
        stock: 3,
        minStock: 10,
        maxStock: 40,
        supplier: supplier1.id,
        description: 'Destornillador Phillips punta #2, mango ergonómico',
        barcode: '7891234567891'
      });

      addProduct({
        name: 'Tornillos Autorroscantes 3/8"',
        category: 'Tornillería',
        price: 0.25,
        stock: 500,
        minStock: 100,
        maxStock: 1000,
        supplier: supplier2.id,
        description: 'Tornillos autorroscantes para madera, cabeza plana',
        barcode: '7891234567892'
      });

      addProduct({
        name: 'Pintura Látex Blanco 1 Galón',
        category: 'Pinturas',
        price: 78.90,
        stock: 2,
        minStock: 5,
        maxStock: 20,
        supplier: supplier1.id,
        description: 'Pintura látex para interiores, color blanco mate',
        barcode: '7891234567893'
      });

      // Add sample customers
      addCustomer({
        name: 'Carlos Mendoza',
        email: 'carlos.mendoza@email.com',
        phone: '987-654-321',
        address: 'Av. Libertadores 789, San Isidro',
        documentType: 'DNI',
        documentNumber: '12345678'
      });

      addCustomer({
        name: 'Constructora ABC SAC',
        email: 'compras@constructoraabc.com',
        phone: '01-555-0123',
        address: 'Jr. Construcción 321, Miraflores',
        documentType: 'RUC',
        documentNumber: '20555123456'
      });
    };

    // Check if we have data, if not initialize
    const hasData = localStorage.getItem('products') || localStorage.getItem('customers') || localStorage.getItem('suppliers');
    if (!hasData) {
      initializeData();
    }
  }, [addProduct, addCustomer, addSupplier]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'sales':
        return <Sales />;
      case 'products':
        return <Products />;
      case 'customers':
        return <Customers />;
      case 'suppliers':
        return <Suppliers />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout 
      activeTab={activeTab} 
      onTabChange={setActiveTab}
      lowStockCount={lowStockProducts.length}
    >
      {renderContent()}
    </Layout>
  );
}

export default App;