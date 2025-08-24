import { SuppliersProvider } from '../context/suppliers/SuppliersContext'
import { SuppliersListComponent } from '../components/suppliers/SuppliersListComponent'

export const SupplierPage = () => {
  return (
    <SuppliersProvider>
      <SuppliersListComponent />
    </SuppliersProvider>
  )
}
