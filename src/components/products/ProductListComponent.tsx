import React, { useState, useEffect } from 'react';
import { useProductsContext } from '../../hooks/useProductsContext';
import { CreateUpdateProduct } from './CreateUpdateProduct';
import { DeleteConfirmation } from './DeleteConfirmation';
import { ProductDetails } from './ProductDetails';
import { ModalComponent } from '../atoms/ModalComponent';
import type { ProductInterface } from '../../interfaces/inventary/Product.interface';

type ModalType = 'create' | 'edit' | 'delete' | 'details' | null;

export const ProductListComponent: React.FC = () => {
  const { products, isLoading, error, getProducts, deleteProduct } = useProductsContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'in-stock' | 'low-stock' | 'out-of-stock'>('all');
  const [modalType, setModalType] = useState<ModalType>(null);
  const [selectedProduct, setSelectedProduct] = useState<ProductInterface | null>(null);

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  const handleCreate = () => {
    setSelectedProduct(null);
    setModalType('create');
  };

  const handleEdit = (product: ProductInterface) => {
    setSelectedProduct(product);
    setModalType('edit');
  };

  const handleDelete = (product: ProductInterface) => {
    setSelectedProduct(product);
    setModalType('delete');
  };

  const handleViewDetails = (product: ProductInterface) => {
    setSelectedProduct(product);
    setModalType('details');
  };

  const handleCloseModal = () => {
    setModalType(null);
    setSelectedProduct(null);
  };

  const handleConfirmDelete = async () => {
    if (selectedProduct) {
      try {
        await deleteProduct(selectedProduct.id);
        handleCloseModal();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  // Filter products based on search and filters
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && product.is_active) ||
                         (statusFilter === 'inactive' && !product.is_active);
    
    const matchesStock = stockFilter === 'all' ||
                        (stockFilter === 'in-stock' && product.stock > 10) ||
                        (stockFilter === 'low-stock' && product.stock > 0 && product.stock <= 10) ||
                        (stockFilter === 'out-of-stock' && product.stock === 0);

    return matchesSearch && matchesStatus && matchesStock;
  });

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(parseFloat(price));
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { text: 'Sin stock', color: 'badge-error' };
    if (stock < 10) return { text: 'Stock bajo', color: 'badge-warning' };
    return { text: 'En stock', color: 'badge-success' };
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
          <p className="text-gray-600">Gestiona el inventario de productos</p>
        </div>
        <button
          onClick={handleCreate}
          className="btn btn-primary"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Nuevo Producto
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Buscar</span>
            </label>
            <input
              type="text"
              placeholder="Nombre o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input input-bordered w-full"
            />
          </div>

          {/* Status Filter */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Estado</span>
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
              className="select select-bordered w-full"
            >
              <option value="all">Todos</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
            </select>
          </div>

          {/* Stock Filter */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Stock</span>
            </label>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value as 'all' | 'in-stock' | 'low-stock' | 'out-of-stock')}
              className="select select-bordered w-full"
            >
              <option value="all">Todos</option>
              <option value="in-stock">En stock</option>
              <option value="low-stock">Stock bajo</option>
              <option value="out-of-stock">Sin stock</option>
            </select>
          </div>

          {/* Results Count */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Resultados</span>
            </label>
            <div className="input input-bordered w-full bg-gray-50">
              {filteredProducts.length} productos
            </div>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => {
                const stockStatus = getStockStatus(product.stock);
                return (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td>
                      <div>
                        <div className="font-semibold text-gray-900">{product?.name}</div>
                        <div className="text-sm text-gray-600 truncate max-w-xs">
                          {product?.description}
                        </div>
                      </div>
                    </td>
                    <td className="font-semibold text-green-600">
                      {formatPrice(product?.unit_price || '0')}
                    </td>
                    <td>
                      <span className={`badge ${stockStatus.color}`}>
                        {stockStatus?.text}
                      </span>
                      <div className="text-sm text-gray-600 mt-1">
                        {product?.stock} unidades
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${product.is_active ? 'badge-success' : 'badge-error'}`}>
                        {product.is_active ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewDetails(product)}
                          className="btn btn-ghost btn-sm"
                          title="Ver detalles"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleEdit(product)}
                          className="btn btn-outline btn-sm"
                          title="Editar"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(product)}
                          className="btn btn-error btn-sm"
                          title="Eliminar"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron productos</h3>
            <p className="text-gray-600">Intenta ajustar los filtros o crear un nuevo producto.</p>
          </div>
        )}
      </div>

      {/* Modals */}
      <ModalComponent
        isOpen={modalType === 'create'}
        onClose={handleCloseModal}
        title="Nuevo Producto"
      >
        <CreateUpdateProduct
          onClose={handleCloseModal}
          product={null}
        />
      </ModalComponent>

      <ModalComponent
        isOpen={modalType === 'edit'}
        onClose={handleCloseModal}
        title="Editar Producto"
      >
        {selectedProduct && (
          <CreateUpdateProduct
            onClose={handleCloseModal}
            product={selectedProduct}
          />
        )}
      </ModalComponent>

      <ModalComponent
        isOpen={modalType === 'delete'}
        onClose={handleCloseModal}
        title="Confirmar Eliminación"
      >
        <DeleteConfirmation
          product={selectedProduct}
          onConfirm={handleConfirmDelete}
          onCancel={handleCloseModal}
          isLoading={isLoading}
        />
      </ModalComponent>

      <ModalComponent
        isOpen={modalType === 'details'}
        onClose={handleCloseModal}
        title="Detalles del Producto"
        size="xl"
      >
        <ProductDetails
          product={selectedProduct}
          onEdit={() => {
            setModalType('edit');
          }}
          onDelete={() => {
            setModalType('delete');
          }}
        />
      </ModalComponent>
    </div>
  );
}; 