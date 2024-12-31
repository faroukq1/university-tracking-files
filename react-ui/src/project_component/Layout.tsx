import { Outlet, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { useAuthStore } from "../store/authStore";

const Layout = () => {
  const navigation = useNavigate();
  const logOut = useAuthStore((state) => state.clearUser);
  const handleLogOut = () => {
    logOut();
    navigation("/auth");
  };
  return (
    <main
      className="h-screen grid"
      style={{ gridTemplateRows: "auto 1fr auto" }}
    >
      {/* Header/Nav */}
      <nav className="bg-slate-800 p-3 flex items-center justify-between px-8">
        <h1 className="font-bold font-xl text-white leading-8">
          University Tracking System
        </h1>
        <Button onClick={handleLogOut} variant={"destructive"}>
          LogOut
        </Button>
      </nav>

      {/* Main Content */}
      <div className="p-4 overflow-auto">
        <Outlet />
      </div>

      {/* Footer */}
      <footer className="bg-slate-800 p-2 text-center">
        <p className="text-white text-lg">
          &copy; {new Date().getFullYear()} Your Company Name. All rights
          reserved.
        </p>
      </footer>
    </main>
  );
};

export default Layout;
