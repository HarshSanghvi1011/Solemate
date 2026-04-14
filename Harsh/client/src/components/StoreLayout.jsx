import { Link, Outlet } from "react-router-dom";
import { Navbar } from "./Navbar.jsx";

export function StoreLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-black">
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
      <footer className="border-t border-white/10 py-8 text-center text-xs text-zinc-600">
        <p>© {new Date().getFullYear()} SOLEMATE. All rights reserved.</p>
        <Link
          to="/admin/login"
          className="mt-2 inline-block text-zinc-500 hover:text-brand-orange"
        >
          Store admin
        </Link>
      </footer>
    </div>
  );
}
