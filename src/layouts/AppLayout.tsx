import { Outlet } from "react-router-dom";
import { Footer } from "../components/home/Footer";
import { Header } from "../components/home/Header";

export const AppLayout = () => {
  return (
    <>
      <Header />
      <div className="pb-200">
      <Outlet />
      </div>
      <Footer />
    </>
  );
};
