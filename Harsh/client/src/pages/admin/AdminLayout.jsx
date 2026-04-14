import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { LayoutGrid, Package, ShoppingCart, Menu, X } from "lucide-react";
import { LogoText } from "../../components/Logo.jsx";
import { adminApi, setAdminAuth } from "../../api/client.js";
import { ADMIN_TOKEN_KEY } from "../../constants.js";

const links = [
  { to: "/admin", label: "Dashboard", icon: LayoutGrid, end: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/orders", label: "Orders", icon: ShoppingCart },
];

export default function AdminLayout() {
  const [ok, setOk] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const t = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (!t) {
      navigate("/admin/login", { replace: true });
      return;
    }
    setAdminAuth(t);
    adminApi
      .get("/auth/me")
      .then(({ data }) => {
        if (data.user?.role !== "admin") throw new Error();
        setOk(true);
      })
      .catch(() => {
        localStorage.removeItem(ADMIN_TOKEN_KEY);
        setAdminAuth(null);
        navigate("/admin/login", { replace: true });
      });
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    setAdminAuth(null);
    setMenuOpen(false);
    navigate("/admin/login");
  };

  if (!ok) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-zinc-500">
        Verifying session…
      </div>
    );
  }

  const SidebarContent = ({ onNavigate }) => (
    <>
      <div className="px-6">
        <LogoText variant="admin" />
      </div>
      <nav className="mt-10 flex flex-1 flex-col gap-1 overflow-y-auto px-3 pb-4">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold uppercase tracking-wide transition ${
                isActive
                  ? "border border-brand-orange/80 bg-brand-orange/10 text-brand-orange"
                  : "text-zinc-400 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto px-6 pt-8">
        <button
          type="button"
          onClick={logout}
          className="text-xs font-semibold uppercase text-zinc-500 hover:text-white"
        >
          Sign out
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-black text-white">
      {menuOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-full w-56 flex-col border-r border-white/10 bg-brand-card py-8 transition-transform duration-200 md:z-30 md:w-64 md:translate-x-0 ${
          menuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-end px-4 md:hidden">
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            className="rounded-lg p-2 text-zinc-400 hover:bg-white/10 hover:text-white"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <SidebarContent onNavigate={() => setMenuOpen(false)} />
      </aside>

      <div className="flex min-h-screen flex-1 flex-col md:pl-64">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-white/10 bg-black/95 px-4 py-3 backdrop-blur-md md:hidden">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="rounded-lg p-2 text-white hover:bg-white/10"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
          <span className="text-sm font-black uppercase tracking-wide text-white">
            Admin
          </span>
        </header>
        <div className="flex-1 p-6 md:p-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
