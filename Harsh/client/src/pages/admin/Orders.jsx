import { useEffect, useState } from "react";
import { adminApi } from "../../api/client.js";

const STATUSES = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

export default function Orders() {
  const [orders, setOrders] = useState([]);

  const load = () => {
    adminApi.get("/orders").then((r) => setOrders(r.data)).catch(() => {});
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id, status) => {
    await adminApi.patch(`/orders/${id}/status`, { status });
    load();
  };

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-black uppercase text-white">Orders</h1>
        <p className="mt-2 text-sm text-zinc-500">View and manage customer orders</p>
      </header>

      <div className="overflow-x-auto rounded-xl border border-white/10 bg-brand-card">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-xs font-bold uppercase tracking-wider text-zinc-500">
              <th className="p-4">Order ID</th>
              <th className="p-4">Date</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Total</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o, idx) => (
              <tr key={o._id} className="border-b border-white/5 hover:bg-white/[0.02]">
                <td className="p-4 font-mono text-brand-orange">#{idx + 1}</td>
                <td className="p-4 text-zinc-300">
                  {new Date(o.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <p className="font-medium text-white">{o.customerName}</p>
                  <p className="text-xs text-zinc-500">{o.customerEmail}</p>
                </td>
                <td className="p-4 font-semibold text-white">
                  ${o.totalPrice?.toFixed(2)}
                </td>
                <td className="p-4">
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-xs font-bold uppercase ${
                      o.status === "Pending"
                        ? "border-brand-orange text-brand-orange"
                        : "border-zinc-600 text-zinc-400"
                    }`}
                  >
                    {o.status}
                  </span>
                </td>
                <td className="p-4">
                  <select
                    value={o.status}
                    onChange={(e) => updateStatus(o._id, e.target.value)}
                    className="rounded-lg border border-white/20 bg-brand-input px-2 py-1.5 text-xs text-white"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <p className="p-8 text-center text-zinc-500">No orders yet.</p>
        )}
      </div>
    </div>
  );
}
