import { AppRouter } from "./routes/App.routes"
import { ThemeProvider } from "./components/atoms/ThemeProvider"

export const App = () => {
  return (
    <ThemeProvider>
      <AppRouter />
    </ThemeProvider>
  );
};
