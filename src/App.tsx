import { AppRouter } from "./routes/App.routes"
import { useThemeStore } from "./store/useTheme.store"

export const App = () => {
  const { theme } = useThemeStore();
  return (
    <div data-theme={theme}>
      <AppRouter />
    </div>
  );
};
