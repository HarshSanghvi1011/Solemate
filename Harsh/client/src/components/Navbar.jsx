import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { ShoppingBag, Menu, X } from "lucide-react";
import { LogoMark, LogoText } from "./Logo.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

const nav = [
  { to: "/", label: "Home", end: true },
  { to: "/shop", label: "Shop", end: true },
  { to: "/shop?category=Men", label: "Men" },
  { to: "/shop?category=Women", label: "Women" },
];

function navLinkClass(location, to, end) {
  const active =
    to === "/"
      ? location.pathname === "/"
      : to.includes("?")
        ? `${location.pathname}${location.search}` === to
        : location.pathname === to.split("?")[0] && !location.search;
  return `block py-2 text-sm font-bold uppercase tracking-wide transition md:inline md:py-0 ${
    active
      ? "border-brand-orange text-brand-orange md:border-b-2 md:pb-0.5"
      : "text-white hover:text-brand-orange"
  }`;
}

export function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname, location.search]);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <LogoMark />
          <LogoText variant="store" />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {nav.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={() => navLinkClass(location, to, end)}
            >
              {label}
            </NavLink>
          ))}
          {user && (
            <NavLink
              to="/my-orders"
              className={() => navLinkClass(location, "/my-orders", true)}
            >
              My orders
            </NavLink>
          )}
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          {user ? (
            <button
              type="button"
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="hidden text-xs font-semibold uppercase text-zinc-400 hover:text-white md:inline"
            >
              Sign out
            </button>
          ) : (
            <Link
              to="/auth"
              className="hidden text-xs font-semibold uppercase text-zinc-400 hover:text-brand-orange md:inline"
            >
              Sign in
            </Link>
          )}
          <Link to="/cart" className="relative text-white hover:text-brand-orange">
            <ShoppingBag className="h-6 w-6" strokeWidth={1.5} />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-brand-orange px-1 text-[10px] font-bold text-black">
                {count > 99 ? "99+" : count}
              </span>
            )}
          </Link>
          <button
            type="button"
            className="rounded-lg p-2 text-white hover:bg-white/10 md:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-white/10 bg-black px-4 py-4 md:hidden">
          <nav className="flex flex-col">
            {nav.map(({ to, label, end }) => (
              <NavLink key={to} to={to} end={end} className={() => navLinkClass(location, to, end)}>
                {label}
              </NavLink>
            ))}
            {user && (
              <NavLink
                to="/my-orders"
                className={() => navLinkClass(location, "/my-orders", true)}
              >
                My orders
              </NavLink>
            )}
            <div className="mt-4 flex flex-col gap-2 border-t border-white/10 pt-4">
              {user ? (
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                  className="py-2 text-left text-xs font-semibold uppercase text-zinc-400"
                >
                  Sign out
                </button>
              ) : (
                <Link
                  to="/auth"
                  className="py-2 text-xs font-semibold uppercase text-brand-orange"
                >
                  Sign in
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
