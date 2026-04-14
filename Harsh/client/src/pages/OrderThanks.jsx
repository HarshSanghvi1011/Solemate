import { Link, useLocation } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

export default function OrderThanks() {
  const { state } = useLocation();
  const total = state?.total;
  const orderId = state?.orderId;

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
        <CheckCircle2 className="h-9 w-9" strokeWidth={1.5} />
      </div>
      <h1 className="text-2xl font-black uppercase tracking-tight text-white sm:text-3xl">
        Order confirmed
      </h1>
      <p className="mt-3 text-sm text-zinc-400">
        Thank you for your purchase. You&apos;ll receive a confirmation email shortly.
      </p>
      {orderId && (
        <p className="mt-4 font-mono text-sm text-brand-orange">
          Order ref: {String(orderId).slice(-8).toUpperCase()}
        </p>
      )}
      {total != null && (
        <p className="mt-2 text-lg font-bold text-white">Total paid: ${Number(total).toFixed(2)}</p>
      )}
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link
          to="/my-orders"
          className="border border-brand-orange/60 px-8 py-3 text-sm font-bold uppercase text-brand-orange hover:bg-brand-orange/10"
        >
          View orders
        </Link>
        <Link
          to="/shop"
          className="bg-brand-orange px-8 py-3 text-sm font-bold uppercase text-white hover:opacity-90"
        >
          Keep shopping
        </Link>
        <Link
          to="/"
          className="border border-white/20 px-8 py-3 text-sm font-bold uppercase text-white hover:border-brand-orange hover:text-brand-orange"
        >
          Home
        </Link>
      </div>
    </main>
  );
}
