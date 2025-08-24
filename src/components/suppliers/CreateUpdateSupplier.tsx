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
    email: '',
    phone: '',
    address: '',
    is_active: true
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditing = !!supplier;

  useEffect(() => {
    if (supplier) {
      setFormData({
        name: supplier.name,
        email: supplier.email,
        phone: supplier.phone,
        address: supplier.address,
        is_active: supplier.is_active
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
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

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'La dirección es requerida';
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
          purchases: []
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

          {/* Email */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email *</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`input input-bordered w-full ${errors.email ? 'input-error' : ''}`}
              placeholder="email@ejemplo.com"
            />
            {errors.email && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.email}</span>
              </label>
            )}
          </div>

          {/* Teléfono y Dirección */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Teléfono *</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`input input-bordered w-full ${errors.phone ? 'input-error' : ''}`}
                placeholder="+1 (555) 123-4567"
              />
              {errors.phone && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.phone}</span>
                </label>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Dirección *</span>
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className={`input input-bordered w-full ${errors.address ? 'input-error' : ''}`}
                placeholder="123 Business St, City, State 12345"
              />
              {errors.address && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.address}</span>
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
