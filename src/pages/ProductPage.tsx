import { ProductListComponent } from "../components/products"
import { ProductsProvider } from "../context/Products/ProductsContext"

    export const ProductsPage = () => {
  return (
    <>
    <ProductsProvider >
        <div className="min-h-screen bg-base-200 p-10">
            <ProductListComponent />
        </div>
    </ProductsProvider>
    </>
  )
}
