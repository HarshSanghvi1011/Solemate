import { Link, useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { api } from "../api/client.js";
import { useState } from "react";

export default function Cart() {
  const { user } = useAuth();
  const { cart, loading, updateQty, removeItem, load } = useCart();
  const navigate = useNavigate();
  const [checkingOut, setCheckingOut] = useState(false);

  if (!user) {
    return (
      <main className="mx-auto max-w-lg px-4 py-24 text-center">
        <p className="text-zinc-400">Sign in to view your cart.</p>
        <Link to="/auth" className="mt-4 inline-block text-brand-orange font-semibold">
          Sign in
        </Link>
      </main>
    );
  }

  if (loading && !cart) {
    return (
      <main className="px-4 py-24 text-center text-zinc-500">Loading cart…</main>
    );
  }

  const items = cart?.items?.filter((i) => i.product) ?? [];
  const empty = !items.length;

  const handleCheckout = async () => {
    setCheckingOut(true);
    try {
      const { data } = await api.post("/orders");
      await load();
      navigate("/order/thanks", {
        replace: true,
        state: {
          orderId: data._id,
          total: data.totalPrice,
        },
      });
    } catch (e) {
      alert(e.response?.data?.message || "Checkout failed");
    } finally {
      setCheckingOut(false);
    }
  };

  if (empty) {
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center px-4">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-zinc-800">
          <Trash2 className="h-9 w-9 text-white" strokeWidth={1.25} />
        </div>
        <h1 className="text-2xl font-black uppercase tracking-wide text-white sm:text-3xl">
          Your cart is empty
        </h1>
        <p className="mt-3 text-center text-sm text-zinc-500">
          Looks like you haven&apos;t added any gear to your cart yet.
        </p>
        <Link
          to="/shop"
          className="mt-8 bg-brand-orange px-10 py-3 text-sm font-bold uppercase text-white hover:opacity-90"
        >
          Start shopping
        </Link>
      </main>
    );
  }

  const subtotal = items.reduce(
    (s, i) => s + i.product.price * i.quantity,
    0
  );

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-black uppercase">Your cart</h1>
      <ul className="mt-8 space-y-4">
        {items.map((line) => {
          const p = line.product;
          return (
            <li
              key={p._id}
              className="flex gap-4 rounded-xl border border-white/10 bg-brand-card p-4"
            >
              <img
                src={p.imageUrl}
                alt={p.name}
                className="h-24 w-24 rounded-lg object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold uppercase text-brand-orange">{p.brand}</p>
                <h2 className="font-bold text-white">{p.name}</h2>
                <p className="text-sm text-zinc-400">${p.price.toFixed(2)} each</p>
                <div className="mt-2 flex items-center gap-3">
                  <label className="text-xs text-zinc-500">Qty</label>
                  <input
                    type="number"
                    min={1}
                    max={p.stock + line.quantity}
                    value={line.quantity}
                    onChange={(e) => {
                      const n = parseInt(e.target.value, 10);
                      if (n >= 1) updateQty(p._id, n);
                    }}
                    className="w-16 rounded border border-white/10 bg-black px-2 py-1 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => removeItem(p._id)}
                    className="text-zinc-500 hover:text-red-400"
                    aria-label="Remove"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="text-right font-bold text-white">
                ${(p.price * line.quantity).toFixed(2)}
              </div>
            </li>
          );
        })}
      </ul>
      <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
        <span className="text-lg font-bold uppercase text-zinc-400">Subtotal</span>
        <span className="text-2xl font-black text-white">${subtotal.toFixed(2)}</span>
      </div>
      <button
        type="button"
        onClick={handleCheckout}
        disabled={checkingOut}
        className="mt-6 w-full bg-brand-orange py-3 text-sm font-bold uppercase text-white hover:opacity-90 disabled:opacity-50"
      >
        {checkingOut ? "Placing order…" : "Checkout"}
      </button>
    </main>
  );
}
