import React, { useState } from 'react';
import { Plus, Minus, X } from 'lucide-react';
import { useStore } from '../hooks/useStore';
import { Product, Customer, SaleItem } from '../types';

interface SaleFormProps {
  onClose: () => void;
  products: Product[];
  customers: Customer[];
}

const SaleForm: React.FC<SaleFormProps> = ({ onClose, products, customers }) => {
  const { addSale } = useStore();
  const [formData, setFormData] = useState({
    customerId: '',
    customerName: '',
    documentType: 'boleta' as 'boleta' | 'factura',
    paymentMethod: 'efectivo' as 'efectivo' | 'tarjeta' | 'transferencia' | 'yape' | 'plin',
  });
  
  const [items, setItems] = useState<SaleItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);

  const handleCustomerChange = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    setFormData(prev => ({
      ...prev,
      customerId,
      customerName: customer?.name || ''
    }));
  };

  const addItem = () => {
    if (!selectedProduct) return;
    
    const product = products.find(p => p.id === selectedProduct);
    if (!product) return;

    const existingItem = items.find(item => item.productId === selectedProduct);
    
    if (existingItem) {
      setItems(prev => prev.map(item =>
        item.productId === selectedProduct
          ? { ...item, quantity: item.quantity + quantity, total: (item.quantity + quantity) * item.unitPrice }
          : item
      ));
    } else {
      const newItem: SaleItem = {
        productId: selectedProduct,
        productName: product.name,
        quantity,
        unitPrice: product.price,
        total: quantity * product.price
      };
      setItems(prev => [...prev, newItem]);
    }
    
    setSelectedProduct('');
    setQuantity(1);
  };

  const removeItem = (productId: string) => {
    setItems(prev => prev.filter(item => item.productId !== productId));
  };

  const updateItemQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId);
      return;
    }
    
    setItems(prev => prev.map(item =>
      item.productId === productId
        ? { ...item, quantity: newQuantity, total: newQuantity * item.unitPrice }
        : item
    ));
  };

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * 0.18; // 18% IGV
  const total = subtotal + tax;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      alert('Debe agregar al menos un producto');
      return;
    }

    if (!formData.customerName.trim()) {
      alert('Debe ingresar el nombre del cliente');
      return;
    }

    addSale({
      customerId: formData.customerId || undefined,
      customerName: formData.customerName,
      items,
      subtotal,
      tax,
      total,
      paymentMethod: formData.paymentMethod,
      documentType: formData.documentType,
      status: 'completed'
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Nueva Venta</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cliente Registrado
              </label>
              <select
                value={formData.customerId}
                onChange={(e) => handleCustomerChange(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Seleccionar cliente...</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} - {customer.documentNumber}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Cliente *
              </label>
              <input
                type="text"
                value={formData.customerName}
                onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ingrese el nombre del cliente"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Documento
              </label>
              <select
                value={formData.documentType}
                onChange={(e) => setFormData(prev => ({ ...prev, documentType: e.target.value as 'boleta' | 'factura' }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="boleta">Boleta</option>
                <option value="factura">Factura</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Método de Pago
              </label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value as any }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="efectivo">Efectivo</option>
                <option value="tarjeta">Tarjeta</option>
                <option value="transferencia">Transferencia</option>
                <option value="yape">Yape</option>
                <option value="plin">Plin</option>
              </select>
            </div>
          </div>

          {/* Add Products */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Agregar Productos</h3>
            
            <div className="flex items-end space-x-4 mb-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Producto
                </label>
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Seleccionar producto...</option>
                  {products.filter(p => p.stock > 0).map(product => (
                    <option key={product.id} value={product.id}>
                      {product.name} - S/ {product.price.toFixed(2)} (Stock: {product.stock})
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-24">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cantidad
                </label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <button
                type="button"
                onClick={addItem}
                disabled={!selectedProduct}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Agregar</span>
              </button>
            </div>

            {/* Items List */}
            {items.length > 0 && (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cantidad</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {items.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 text-sm text-gray-900">{item.productName}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              onClick={() => updateItemQuantity(item.productId, item.quantity - 1)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="text-sm font-medium">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateItemQuantity(item.productId, item.quantity + 1)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          S/ {item.unitPrice.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          S/ {item.total.toFixed(2)}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => removeItem(item.productId)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Totals */}
          {items.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Subtotal:</span>
                  <span className="text-sm font-medium">S/ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">IGV (18%):</span>
                  <span className="text-sm font-medium">S/ {tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-lg font-bold text-gray-900">Total:</span>
                  <span className="text-lg font-bold text-gray-900">S/ {total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Crear Venta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SaleForm;