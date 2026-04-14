import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../api/client.js";

export default function MyOrders() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setErr("");
    api
      .get("/orders")
      .then((r) => setOrders(r.data))
      .catch((e) => setErr(e.response?.data?.message || "Could not load orders"))
      .finally(() => setLoading(false));
  }, [user, authLoading]);

  if (authLoading || (loading && user)) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-16 text-center text-zinc-500">
        Loading…
      </main>
    );
  }

  if (!user) {
    return (
      <main className="mx-auto max-w-lg px-4 py-24 text-center">
        <p className="text-zinc-400">Sign in to see your order history.</p>
        <Link to="/auth" className="mt-4 inline-block font-semibold text-brand-orange">
          Sign in
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-black uppercase tracking-tight text-white">My orders</h1>
      <p className="mt-2 text-sm text-zinc-500">Track purchases and delivery status.</p>

      {err && <p className="mt-6 text-sm text-red-400">{err}</p>}

      {!err && orders.length === 0 && !loading && (
        <div className="mt-16 flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-800 text-zinc-500">
            <Package className="h-8 w-8" strokeWidth={1.25} />
          </div>
          <p className="text-zinc-400">You haven&apos;t placed an order yet.</p>
          <Link
            to="/shop"
            className="mt-6 bg-brand-orange px-8 py-3 text-sm font-bold uppercase text-white hover:opacity-90"
          >
            Browse shop
          </Link>
        </div>
      )}

      <ul className="mt-8 space-y-4">
        {orders.map((o) => (
          <li
            key={o._id}
            className="rounded-xl border border-white/10 bg-brand-card p-5 sm:p-6"
          >
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/5 pb-4">
              <div>
                <p className="font-mono text-sm text-brand-orange">
                  #{String(o._id).slice(-8).toUpperCase()}
                </p>
                <p className="mt-1 text-xs text-zinc-500">
                  {new Date(o.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <span
                  className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-bold uppercase ${
                    o.status === "Delivered"
                      ? "border-emerald-500/50 text-emerald-400"
                      : o.status === "Cancelled"
                        ? "border-red-500/50 text-red-400"
                        : "border-brand-orange/50 text-brand-orange"
                  }`}
                >
                  {o.status}
                </span>
                <p className="mt-2 text-lg font-black text-white">
                  ${Number(o.totalPrice).toFixed(2)}
                </p>
              </div>
            </div>
            <ul className="mt-4 space-y-2">
              {(o.items || []).map((line, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 text-sm text-zinc-300"
                >
                  {line.imageUrl && (
                    <img
                      src={line.imageUrl}
                      alt=""
                      className="h-10 w-10 rounded-md object-cover"
                    />
                  )}
                  <span className="flex-1">
                    <span className="font-medium text-white">{line.name}</span>
                    <span className="text-zinc-500"> × {line.quantity}</span>
                  </span>
                  <span className="text-zinc-400">
                    ${(Number(line.price) * line.quantity).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </main>
  );
}
