import { AppRouter } from "./routes/App.routes";
import { ThemeProvider } from "./components/atoms/ThemeProvider";
import { UsersProvider } from "./context/users/UsersContext";
import { SuppliersProvider } from "./context/suppliers/SuppliersContext";
import { ProductsProvider } from "./context/Products/ProductsContext";
import { ErrorBoundary } from "./components/atoms/ErrorBoundary";

export const App = () => {
  return (
    <ErrorBoundary>
      <UsersProvider>
        <SuppliersProvider>
          <ProductsProvider>
            <ThemeProvider>
              <AppRouter />
            </ThemeProvider>
          </ProductsProvider>
        </SuppliersProvider>
      </UsersProvider>
    </ErrorBoundary>
  );
};
