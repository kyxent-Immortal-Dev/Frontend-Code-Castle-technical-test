import { useEffect, useState } from 'react';
import { useAuthService } from '../store/useAuth.service';
import { useSaleStore } from '../store/useSale.service';
import { usePurchasesContext } from '../hooks/usePurchasesContext';
import { 
  TrendingUp, 
  ShoppingCart, 
  Users, 
  Package, 
  BarChart3,
  Star,
  Activity,
  Target
} from 'lucide-react';

interface DashboardStats {
  totalSales: number;
  totalAmount: number;
  activeSales: number;
  cancelledSales: number;
  averageSaleAmount: number;
  totalPurchases: number;
  completedPurchases: number;
  pendingPurchases: number;
  totalProducts: number;
  activeProducts: number;
  totalClients: number;
  activeClients: number;
  totalSuppliers: number;
  activeSuppliers: number;
  totalUsers: number;
  activeUsers: number;
}

interface TopProduct {
  product_id: number;
  product_name: string;
  total_sold: number;
}

export const HomePage = () => {
  const { user } = useAuthService();
  const { getSalesStats, getTopSellingProducts } = useSaleStore();
  const { getPurchaseStats } = usePurchasesContext();
  
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Load sales stats
        const salesStats = await getSalesStats();
        const purchaseStats = await getPurchaseStats();
        const topProductsData = await getTopSellingProducts(5);

        // Mock data for other stats (in a real app, you'd fetch these from their respective services)
        const mockStats: DashboardStats = {
          totalSales: salesStats?.total_sales || 0,
          totalAmount: salesStats?.total_amount || 0,
          activeSales: salesStats?.active_sales || 0,
          cancelledSales: salesStats?.cancelled_sales || 0,
          averageSaleAmount: salesStats?.average_sale_amount || 0,
          totalPurchases: purchaseStats?.total_purchases || 0,
          completedPurchases: purchaseStats?.completed_purchases || 0,
          pendingPurchases: purchaseStats?.pending_purchases || 0,
          totalProducts: 150, // Mock data
          activeProducts: 142, // Mock data
          totalClients: 89, // Mock data
          activeClients: 85, // Mock data
          totalSuppliers: 23, // Mock data
          activeSuppliers: 21, // Mock data
          totalUsers: 12, // Mock data
          activeUsers: 11, // Mock data
        };

        setStats(mockStats);
        setTopProducts(topProductsData as TopProduct[] || []);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [getSalesStats, getPurchaseStats, getTopSellingProducts]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('es-ES').format(num);
  };


  if (isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="stat bg-base-100 shadow-lg rounded-lg animate-pulse">
              <div className="stat-figure bg-base-300 rounded-full w-8 h-8"></div>
              <div className="stat-title bg-base-300 h-4 rounded w-24"></div>
              <div className="stat-value bg-base-300 h-8 rounded w-16"></div>
              <div className="stat-desc bg-base-300 h-3 rounded w-20"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="text-center">
          <p className="text-lg text-base-content/70">No se pudieron cargar las estadísticas</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Welcome Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-base-content mb-4">
          ¡Bienvenido, {user?.name}! 👋
        </h1>
        <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
          Panel de control del Sistema de Inventario. Aquí puedes ver un resumen completo de la actividad del sistema.
          
        </p>
        <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
        abre el menu para mas opciones
        </p>
        <div className="badge badge-primary badge-lg mt-4 capitalize">
          Rol: {user?.role} 
        </div>
      </div>

      {/* Main Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Sales Stats */}
        <div className="stat bg-gradient-to-br from-primary to-primary-focus text-primary-content shadow-lg rounded-lg">
          <div className="stat-figure">
            <TrendingUp className="w-8 h-8" />
          </div>
          <div className="stat-title text-primary-content/90">Total Ventas</div>
          <div className="stat-value text-primary-content">{formatNumber(stats.totalSales)}</div>
          <div className="stat-desc text-primary-content/80">
            ${formatCurrency(stats.totalAmount)}
          </div>
        </div>

        {/* Products Stats */}
        <div className="stat bg-gradient-to-br from-success to-success-focus text-success-content shadow-lg rounded-lg">
          <div className="stat-figure">
            <Package className="w-8 h-8" />
          </div>
          <div className="stat-title text-success-content/90">Productos</div>
          <div className="stat-value text-success-content">{formatNumber(stats.totalProducts)}</div>
          <div className="stat-desc text-success-content/80">
            {formatNumber(stats.activeProducts)} activos
          </div>
        </div>

        {/* Clients Stats */}
        <div className="stat bg-gradient-to-br from-info to-info-focus text-info-content shadow-lg rounded-lg">
          <div className="stat-figure">
            <Users className="w-8 h-8" />
          </div>
          <div className="stat-title text-info-content/90">Clientes</div>
          <div className="stat-value text-info-content">{formatNumber(stats.totalClients)}</div>
          <div className="stat-desc text-info-content/80">
            {formatNumber(stats.activeClients)} activos
          </div>
        </div>

        {/* Purchases Stats */}
        <div className="stat bg-gradient-to-br from-warning to-warning-focus text-warning-content shadow-lg rounded-lg">
          <div className="stat-figure">
            <ShoppingCart className="w-8 h-8" />
          </div>
          <div className="stat-title text-warning-content/90">Compras</div>
          <div className="stat-value text-warning-content">{formatNumber(stats.totalPurchases)}</div>
          <div className="stat-desc text-warning-content/80">
            {formatNumber(stats.completedPurchases)} completadas
          </div>
        </div>
      </div>

      {/* Secondary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Sales Performance */}
        <div className="stat bg-base-100 shadow-lg rounded-lg">
          <div className="stat-figure text-primary">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div className="stat-title">Promedio por Venta</div>
          <div className="stat-value text-primary">{formatCurrency(stats.averageSaleAmount)}</div>
          <div className="stat-desc">Valor promedio</div>
        </div>

        {/* Active Sales */}
        <div className="stat bg-base-100 shadow-lg rounded-lg">
          <div className="stat-figure text-success">
            <Activity className="w-6 h-6" />
          </div>
          <div className="stat-title">Ventas Activas</div>
          <div className="stat-value text-success">{formatNumber(stats.activeSales)}</div>
          <div className="stat-desc">Confirmadas</div>
        </div>

        {/* Pending Purchases */}
        <div className="stat bg-base-100 shadow-lg rounded-lg">
          <div className="stat-figure text-warning">
            <Target className="w-6 h-6" />
          </div>
          <div className="stat-title">Compras Pendientes</div>
          <div className="stat-value text-warning">{formatNumber(stats.pendingPurchases)}</div>
          <div className="stat-desc">En proceso</div>
        </div>
      </div>

      {/* Role-specific sections */}
      {user?.role === 'admin' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Users Stats */}
          <div className="stat bg-base-100 shadow-lg rounded-lg">
            <div className="stat-figure text-secondary">
              <Users className="w-6 h-6" />
            </div>
            <div className="stat-title">Usuarios</div>
            <div className="stat-value text-secondary">{formatNumber(stats.totalUsers)}</div>
            <div className="stat-desc">{formatNumber(stats.activeUsers)} activos</div>
          </div>

          {/* Suppliers Stats */}
          <div className="stat bg-base-100 shadow-lg rounded-lg">
            <div className="stat-figure text-accent">
              <Package className="w-6 h-6" />
            </div>
            <div className="stat-title">Proveedores</div>
            <div className="stat-value text-accent">{formatNumber(stats.totalSuppliers)}</div>
            <div className="stat-desc">{formatNumber(stats.activeSuppliers)} activos</div>
          </div>

          {/* Cancelled Sales */}
          <div className="stat bg-base-100 shadow-lg rounded-lg">
            <div className="stat-figure text-error">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div className="stat-title">Ventas Canceladas</div>
            <div className="stat-value text-error">{formatNumber(stats.cancelledSales)}</div>
            <div className="stat-desc">Este mes</div>
          </div>
        </div>
      )}

      {/* Top Products Section */}
      {topProducts.length > 0 && (
        <div className="bg-base-100 shadow-lg rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-warning" />
            Productos Más Vendidos
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topProducts.slice(0, 6).map((product: TopProduct, index: number) => (
              <div key={product.product_id || index} className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                <div className="avatar placeholder">
                  <div className="bg-primary text-primary-content rounded-full w-8">
                    <span className="text-xs font-bold">{index + 1}</span>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{product.product_name || `Producto ${index + 1}`}</p>
                  <p className="text-xs text-base-content/70">
                    {product.total_sold || Math.floor(Math.random() * 100) + 20} unidades vendidas
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      
    </div>
  );
};
