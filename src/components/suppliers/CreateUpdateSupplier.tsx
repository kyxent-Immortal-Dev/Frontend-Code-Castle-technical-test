import React, { useState, useEffect } from 'react'
import { useSuppliersContext } from '../../hooks/useSuppliersContext'
import type { SupplierInterface } from '../../interfaces/inventary/Supliers.interface'

interface CreateUpdateSupplierProps {
  isOpen: boolean;
  onClose: () => void;
  supplier: SupplierInterface | null;
}

export const CreateUpdateSupplier: React.FC<CreateUpdateSupplierProps> = ({ 
  isOpen, 
  onClose, 
  supplier 
}) => {
  const { createSupplier, updateSupplier, isLoading } = useSuppliersContext();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    unit_price: '',
    stock: 0,
    is_active: true
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditing = !!supplier;

  useEffect(() => {
    if (supplier) {
      setFormData({
        name: supplier.name,
        description: supplier.description,
        unit_price: supplier.unit_price,
        stock: supplier.stock,
        is_active: supplier.is_active
      });
    } else {
      setFormData({
        name: '',
        description: '',
        unit_price: '',
        stock: 0,
        is_active: true
      });
    }
    setErrors({});
  }, [supplier]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    }

    if (!formData.unit_price || parseFloat(formData.unit_price) <= 0) {
      newErrors.unit_price = 'El precio unitario debe ser mayor a 0';
    }

    if (formData.stock < 0) {
      newErrors.stock = 'El stock no puede ser negativo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      if (isEditing && supplier) {
        await updateSupplier({
          ...supplier,
          ...formData
        });
      } else {
        await createSupplier({
          id: 0, // Will be assigned by the backend
          ...formData,
          purchase_details: []
        });
      }
      onClose();
    } catch (error) {
      console.error('Error saving supplier:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      is_active: e.target.checked
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <h3 className="font-bold text-lg mb-4">
          {isEditing ? 'Editar Proveedor' : 'Nuevo Proveedor'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Nombre *</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`input input-bordered w-full ${errors.name ? 'input-error' : ''}`}
              placeholder="Nombre del proveedor"
            />
            {errors.name && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.name}</span>
              </label>
            )}
          </div>

          {/* Descripción */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Descripción *</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className={`textarea textarea-bordered w-full ${errors.description ? 'textarea-error' : ''}`}
              placeholder="Descripción del proveedor"
              rows={3}
            />
            {errors.description && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.description}</span>
              </label>
            )}
          </div>

          {/* Precio Unitario y Stock */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Precio Unitario *</span>
              </label>
              <div className="input-group">
                <span className="input-group-text">$</span>
                <input
                  type="number"
                  name="unit_price"
                  value={formData.unit_price}
                  onChange={handleInputChange}
                  className={`input input-bordered w-full ${errors.unit_price ? 'input-error' : ''}`}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>
              {errors.unit_price && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.unit_price}</span>
                </label>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Stock</span>
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                className={`input input-bordered w-full ${errors.stock ? 'input-error' : ''}`}
                placeholder="0"
                min="0"
              />
              {errors.stock && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.stock}</span>
                </label>
              )}
            </div>
          </div>

          {/* Estado Activo */}
          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">Estado Activo</span>
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleCheckboxChange}
                className="checkbox checkbox-primary"
              />
            </label>
          </div>

          {/* Botones */}
          <div className="modal-action">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                isEditing ? 'Actualizar' : 'Crear'
              )}
            </button>
          </div>
        </form>
      </div>
      
      {/* Backdrop */}
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  )
}
