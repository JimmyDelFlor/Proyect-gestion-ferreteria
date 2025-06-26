import React from 'react';
import { DollarSign, ShoppingBag, Package, Users, TrendingUp, AlertTriangle } from 'lucide-react';
import { useStore } from '../hooks/useStore';

const Dashboard: React.FC = () => {
  const { sales, products, customers, getLowStockProducts } = useStore();

  const lowStockProducts = getLowStockProducts();
  const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0);
  const todaySales = sales.filter(sale => {
    const today = new Date();
    const saleDate = new Date(sale.createdAt);
    return saleDate.toDateString() === today.toDateString();
  });

  const topProducts = products
    .map(product => ({
      ...product,
      totalSold: sales.reduce((sum, sale) => {
        const item = sale.items.find(item => item.productId === product.id);
        return sum + (item ? item.quantity : 0);
      }, 0)
    }))
    .sort((a, b) => b.totalSold - a.totalSold)
    .slice(0, 5);

  const recentSales = sales
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const stats = [
    {
      title: 'Ventas Totales',
      value: `S/ ${totalSales.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Ventas Hoy',
      value: todaySales.length.toString(),
      icon: ShoppingBag,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Productos',
      value: products.length.toString(),
      icon: Package,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Clientes',
      value: customers.length.toString(),
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString('es-PE', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Alerts */}
      {lowStockProducts.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-3">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <h3 className="text-sm font-medium text-amber-800">
              Productos con Stock Bajo ({lowStockProducts.length})
            </h3>
          </div>
          <div className="space-y-2">
            {lowStockProducts.slice(0, 3).map(product => (
              <div key={product.id} className="flex items-center justify-between text-sm">
                <span className="text-amber-700">{product.name}</span>
                <span className="text-amber-600 font-medium">
                  Stock: {product.stock} (Min: {product.minStock})
                </span>
              </div>
            ))}
            {lowStockProducts.length > 3 && (
              <p className="text-xs text-amber-600 mt-2">
                Y {lowStockProducts.length - 3} productos más...
              </p>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Productos Más Vendidos</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{product.totalSold} vendidos</p>
                    <p className="text-xs text-gray-500">Stock: {product.stock}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Sales */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Ventas Recientes</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentSales.map(sale => (
                <div key={sale.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{sale.documentNumber}</p>
                    <p className="text-sm text-gray-500">{sale.customerName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      S/ {sale.total.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(sale.createdAt).toLocaleDateString('es-PE')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;