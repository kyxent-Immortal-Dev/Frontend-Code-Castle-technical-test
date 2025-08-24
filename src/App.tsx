import { AppRouter } from "./routes/App.routes";
import { ThemeProvider } from "./components/atoms/ThemeProvider";
import { UsersProvider } from "./context/users/UsersContext";
import { SuppliersProvider } from "./context/suppliers/SuppliersContext";

export const App = () => {
  return (
    <UsersProvider>
      <SuppliersProvider>
        <ThemeProvider>
          <AppRouter />
        </ThemeProvider>
      </SuppliersProvider>
    </UsersProvider>
  );
};
