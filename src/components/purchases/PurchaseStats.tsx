import React, { useEffect, useState } from 'react';
import { usePurchasesContext } from '../../hooks/usePurchasesContext';
import type { PurchaseStats } from '../../context/purchases/PurchasesContextValue';

export const PurchaseStats: React.FC = () => {
  const { getPurchaseStats } = usePurchasesContext();
  const [stats, setStats] = useState<PurchaseStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setIsLoading(true);
        const statsData = await getPurchaseStats();
        setStats(statsData);
      } catch (error) {
        console.error('Error loading purchase stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, [getPurchaseStats]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="stat bg-base-100 shadow-lg rounded-lg animate-pulse">
            <div className="stat-figure bg-base-300 rounded-full w-8 h-8"></div>
            <div className="stat-title bg-base-300 h-4 rounded w-24"></div>
            <div className="stat-value bg-base-300 h-8 rounded w-16"></div>
            <div className="stat-desc bg-base-300 h-3 rounded w-20"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="stat bg-base-100 shadow-lg rounded-lg">
        <div className="stat-figure text-primary">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <div className="stat-title">Total de Compras</div>
        <div className="stat-value text-primary">{stats.total_purchases}</div>
        <div className="stat-desc">En el sistema</div>
      </div>

      <div className="stat bg-base-100 shadow-lg rounded-lg">
        <div className="stat-figure text-success">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="stat-title">Completadas</div>
        <div className="stat-value text-success">{stats.completed_purchases}</div>
        <div className="stat-desc">Finalizadas</div>
      </div>

      <div className="stat bg-base-100 shadow-lg rounded-lg">
        <div className="stat-figure text-warning">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="stat-title">Pendientes</div>
        <div className="stat-value text-warning">{stats.pending_purchases}</div>
        <div className="stat-desc">En proceso</div>
      </div>

      <div className="stat bg-base-100 shadow-lg rounded-lg">
        <div className="stat-figure text-info">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
        </div>
        <div className="stat-title">Valor Total</div>
        <div className="stat-value text-info">{formatPrice(stats.total_amount)}</div>
        <div className="stat-desc">En compras</div>
      </div>

      {/* Additional Stats Row */}
      <div className="col-span-full grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="stat bg-base-200 shadow-lg rounded-lg">
          <div className="stat-figure text-secondary">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div className="stat-title">Promedio por Compra</div>
          <div className="stat-value text-secondary">{formatPrice(stats.average_amount)}</div>
          <div className="stat-desc">Valor promedio</div>
        </div>

        <div className="stat bg-base-200 shadow-lg rounded-lg">
          <div className="stat-figure text-accent">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="stat-title">Este Mes</div>
          <div className="stat-value text-accent">{stats.this_month_purchases}</div>
          <div className="stat-desc">Compras del mes</div>
        </div>

        <div className="stat bg-base-200 shadow-lg rounded-lg">
          <div className="stat-figure text-neutral">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <div className="stat-title">Valor del Mes</div>
          <div className="stat-value text-neutral">{formatPrice(stats.this_month_amount)}</div>
          <div className="stat-desc">Total del mes</div>
        </div>
      </div>
    </div>
  );
}; 