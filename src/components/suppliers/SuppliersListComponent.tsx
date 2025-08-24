import React, { useEffect, useState } from 'react'
import { useSuppliersContext } from '../../hooks/useSuppliersContext'
import { CreateUpdateSupplier } from './CreateUpdateSupplier'
import { DeleteConfirmation } from './DeleteConfirmation'
import { SupplierDetails } from './SupplierDetails'
import type { SupplierInterface } from '../../interfaces/inventary/Supliers.interface'

export const SuppliersListComponent = () => {
  const { suppliers, isLoading, error, getSuppliers, deleteSupplier } = useSuppliersContext();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierInterface | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    getSuppliers();
  }, [getSuppliers]);

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (supplier: SupplierInterface) => {
    setSelectedSupplier(supplier);
    setShowEditModal(true);
  };

  const handleDelete = (supplier: SupplierInterface) => {
    setSelectedSupplier(supplier);
    setShowDeleteModal(true);
  };

  const handleViewDetails = (supplier: SupplierInterface) => {
    setSelectedSupplier(supplier);
    setShowDetailsModal(true);
  };

  const confirmDelete = async () => {
    if (selectedSupplier) {
      await deleteSupplier(selectedSupplier.id);
      setShowDeleteModal(false);
      setSelectedSupplier(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-base-content">Proveedores</h1>
          <p className="text-base-content/70">Gestiona tu inventario de proveedores</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="btn btn-primary"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Nuevo Proveedor
        </button>
      </div>

      {/* Search Bar */}
      <div className="form-control w-full max-w-md">
        <div className="input-group">
          <input
            type="text"
            placeholder="Buscar proveedores..."
            className="input input-bordered w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="btn btn-square">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Suppliers Table */}
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Precio Unitario</th>
              <th>Stock</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredSuppliers.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-base-content/70">
                  {searchTerm ? 'No se encontraron proveedores' : 'No hay proveedores registrados'}
                </td>
              </tr>
            ) : (
              filteredSuppliers.map((supplier) => (
                <tr key={supplier.id}>
                  <td className="font-medium">{supplier.name}</td>
                  <td className="max-w-xs truncate">{supplier.description}</td>
                  <td>${supplier.unit_price}</td>
                  <td>
                    <div className="badge badge-outline">
                      {supplier.stock} unidades
                    </div>
                  </td>
                  <td>
                    <div className={`badge ${supplier.is_active ? 'badge-success' : 'badge-error'}`}>
                      {supplier.is_active ? 'Activo' : 'Inactivo'}
                    </div>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewDetails(supplier)}
                        className="btn btn-ghost btn-sm"
                        title="Ver detalles"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleEdit(supplier)}
                        className="btn btn-ghost btn-sm"
                        title="Editar"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(supplier)}
                        className="btn btn-ghost btn-sm text-error"
                        title="Eliminar"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateUpdateSupplier
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          supplier={null}
        />
      )}

      {showEditModal && selectedSupplier && (
        <CreateUpdateSupplier
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          supplier={selectedSupplier}
        />
      )}

      {showDeleteModal && selectedSupplier && (
        <DeleteConfirmation
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={confirmDelete}
          supplierName={selectedSupplier.name}
        />
      )}

      {showDetailsModal && selectedSupplier && (
        <SupplierDetails
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          supplier={selectedSupplier}
        />
      )}
    </div>
  )
}
