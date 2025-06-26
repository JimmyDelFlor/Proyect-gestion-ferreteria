import React from 'react';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Users, 
  TruckIcon,
  Store,
  AlertTriangle
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  lowStockCount: number;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange, lowStockCount }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'sales', label: 'Ventas', icon: ShoppingCart },
    { id: 'products', label: 'Productos', icon: Package },
    { id: 'customers', label: 'Clientes', icon: Users },
    { id: 'suppliers', label: 'Proveedores', icon: TruckIcon },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Store className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Ferreteria Elizabeth</h1>
              <p className="text-sm text-gray-500">Sistema de Ventas</p>
            </div>
          </div>
        </div>
        
        <nav className="mt-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`w-full flex items-center px-6 py-3 text-left transition-colors relative ${
                activeTab === tab.id
                  ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="h-5 w-5 mr-3" />
              {tab.label}
              {tab.id === 'products' && lowStockCount > 0 && (
                <div className="ml-auto flex items-center space-x-1">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
                    {lowStockCount}
                  </span>
                </div>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;