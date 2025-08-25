import React, { useState, useEffect } from 'react';
import { useProductsContext } from '../../hooks/useProductsContext';
import { CreateUpdateProduct } from './CreateUpdateProduct';
import { DeleteConfirmation } from './DeleteConfirmation';
import { ProductDetails } from './ProductDetails';
import { ViewMobileProducts } from './ViewMobileProducts';
import { ModalComponent } from '../atoms/ModalComponent';
import type { ProductInterface } from '../../interfaces/inventary/Product.interface';
import { LoadingSpinner } from '../atoms';

type ModalType = 'create' | 'edit' | 'delete' | 'details' | null;

export const ProductListComponent: React.FC = () => {
  const { products, isLoading, error, getProducts, deleteProduct, generateStockReport } = useProductsContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'in-stock' | 'low-stock' | 'out-of-stock'>('all');
  const [modalType, setModalType] = useState<ModalType>(null);
  const [selectedProduct, setSelectedProduct] = useState<ProductInterface | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

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
        setIsDeleting(true);
        await deleteProduct(selectedProduct.id);
        handleCloseModal();
      } catch (error) {
        console.error('Error deleting product:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleGenerateReport = async () => {
    try {
      setIsGeneratingReport(true);
      await generateStockReport();
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setIsGeneratingReport(false);
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
     <LoadingSpinner text='Cargando productos...'/>
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
    <div className="container mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-base-content mb-2">Gestión de Productos</h1>
        <p className="text-base-content/70 text-sm sm:text-base">Administra el inventario de productos del sistema</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
        <div className="stat bg-base-100 shadow-lg rounded-lg p-3 sm:p-6">
          <div className="stat-figure text-primary hidden sm:block">
            <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <div className="stat-title text-xs sm:text-sm">Total de Productos</div>
          <div className="stat-value text-primary text-lg sm:text-2xl">{products.length}</div>
          <div className="stat-desc text-xs">En el inventario</div>
        </div>

        <div className="stat bg-base-100 shadow-lg rounded-lg p-3 sm:p-6">
          <div className="stat-figure text-success hidden sm:block">
            <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="stat-title text-xs sm:text-sm">Productos Activos</div>
          <div className="stat-value text-success text-lg sm:text-2xl">{products.filter(p => p.is_active).length}</div>
          <div className="stat-desc text-xs">Disponibles para venta</div>
        </div>

        <div className="stat bg-base-100 shadow-lg rounded-lg p-3 sm:p-6">
          <div className="stat-figure text-warning hidden sm:block">
            <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div className="stat-title text-xs sm:text-sm">Stock Bajo</div>
          <div className="stat-value text-warning text-lg sm:text-2xl">{products.filter(p => p.stock > 0 && p.stock <= 10).length}</div>
          <div className="stat-desc text-xs">Necesitan reposición</div>
        </div>

        <div className="stat bg-base-100 shadow-lg rounded-lg p-3 sm:p-6">
          <div className="stat-figure text-error hidden sm:block">
            <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          </div>
          <div className="stat-title text-xs sm:text-sm">Sin Stock</div>
          <div className="stat-value text-error text-lg sm:text-2xl">{products.filter(p => p.stock === 0).length}</div>
          <div className="stat-desc text-xs">Agotados</div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:justify-between lg:items-center">
        {/* Filters */}
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
          <div className="form-control w-full sm:w-64">
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input input-bordered w-full"
            />
          </div>
          <div className="flex gap-2 sm:gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
              className="select select-bordered flex-1 sm:flex-none"
            >
              <option value="all">Todos los estados</option>
              <option value="active">Solo activos</option>
              <option value="inactive">Solo inactivos</option>
            </select>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value as 'all' | 'in-stock' | 'low-stock' | 'out-of-stock')}
              className="select select-bordered flex-1 sm:flex-none"
            >
              <option value="all">Todo el stock</option>
              <option value="in-stock">En stock</option>
              <option value="low-stock">Stock bajo</option>
              <option value="out-of-stock">Sin stock</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
          <button
            onClick={handleGenerateReport}
            disabled={isGeneratingReport}
            className="btn btn-secondary btn-sm sm:btn-md lg:btn-lg"
          >
            {isGeneratingReport ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                <span className="hidden sm:inline">Generando...</span>
                <span className="sm:hidden">...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="hidden sm:inline">Generar Reporte</span>
                <span className="sm:hidden">Reporte</span>
              </>
            )}
          </button>
          <button
            onClick={handleCreate}
            className="btn btn-primary btn-sm sm:btn-md lg:btn-lg"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:inline">+ Nuevo Producto</span>
            <span className="sm:hidden">+ Producto</span>
          </button>
        </div>
      </div>

      {/* Products Display - Desktop Table / Mobile Cards */}
      <div className="bg-base-100 shadow-lg rounded-lg overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead className="bg-primary text-primary-content">
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
                  <tr key={product.id} className="hover:bg-base-200">
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar placeholder">
                          <div className="bg-neutral text-neutral-content rounded-full w-10">
                            <span className="text-sm font-semibold">
                              {product.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">{product.name}</div>
                          <div className="text-sm opacity-70 truncate max-w-xs">
                            {product.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="font-semibold text-success">
                      {formatPrice(product.unit_price)}
                    </td>
                    <td>
                      <div className="flex flex-col gap-1">
                        <span className={`badge ${stockStatus.color}`}>
                          {stockStatus.text}
                        </span>
                        <span className="text-sm opacity-70">
                          {product.stock} unidades
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className={`badge badge-${product.is_active ? 'success' : 'error'} badge-outline`}>
                        {product.is_active ? 'Activo' : 'Inactivo'}
                      </div>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewDetails(product)}
                          className="btn btn-sm btn-outline btn-info"
                          title="Ver detalles"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleEdit(product)}
                          className="btn btn-sm btn-outline btn-warning"
                          title="Editar"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(product)}
                          className="btn btn-sm btn-outline btn-error"
                          title="Eliminar"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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

        {/* Mobile Cards View */}
        <div className="block lg:hidden p-4">
          <ViewMobileProducts
            products={filteredProducts}
            onViewDetails={handleViewDetails}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && !isLoading && (
          <div className="text-center py-12 px-4">
            <div className="text-base-content/50 mb-4">
              <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">No se encontraron productos</h3>
            <p className="text-base-content/70 mb-4 text-sm sm:text-base">Intenta ajustar los filtros o crear un nuevo producto</p>
            <button
              onClick={handleCreate}
              className="btn btn-primary btn-sm sm:btn-lg gap-2"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              <span className="hidden sm:inline">Agregar Producto</span>
              <span className="sm:hidden">+ Producto</span>
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      <ModalComponent
        isOpen={modalType === 'create'}
        onClose={handleCloseModal}
        title="Nuevo Producto"
        size="lg"
        showCloseButton={true}
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
        size="lg"
        showCloseButton={true}
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
        size="md"
        showCloseButton={true}
      >
        <DeleteConfirmation
          product={selectedProduct}
          onConfirm={handleConfirmDelete}
          onCancel={handleCloseModal}
          isLoading={isDeleting}
        />
      </ModalComponent>

      <ModalComponent
        isOpen={modalType === 'details'}
        onClose={handleCloseModal}
        title="Detalles del Producto"
        size="xl"
        showCloseButton={true}
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