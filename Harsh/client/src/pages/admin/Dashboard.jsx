import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { DollarSign, ShoppingCart, Clock, Package } from "lucide-react";
import { adminApi } from "../../api/client.js";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [chart, setChart] = useState([]);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    Promise.all([
      adminApi.get("/stats"),
      adminApi.get("/revenue-chart"),
      adminApi.get("/orders/recent"),
    ])
      .then(([s, c, r]) => {
        setStats(s.data);
        setChart(c.data);
        setRecent(r.data);
      })
      .catch(() => {});
  }, []);

  const cards = [
    {
      title: "Total revenue",
      value: stats ? `$${stats.totalRevenue.toFixed(2)}` : "—",
      icon: DollarSign,
      color: "text-emerald-400",
    },
    {
      title: "Total orders",
      value: stats?.totalOrders ?? "—",
      icon: ShoppingCart,
      color: "text-sky-400",
    },
    {
      title: "Pending orders",
      value: stats?.pendingOrders ?? "—",
      icon: Clock,
      color: "text-amber-400",
    },
    {
      title: "Total products",
      value: stats?.totalProducts ?? "—",
      icon: Package,
      color: "text-violet-400",
    },
  ];

  return (
    <div>
      <header className="mb-10">
        <h1 className="text-3xl font-black uppercase tracking-tight text-white md:text-4xl">
          Dashboard overview
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          Welcome back. Here&apos;s what&apos;s happening today.
        </p>
      </header>

      <div className="mb-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ title, value, icon: Icon, color }) => (
          <div
            key={title}
            className="rounded-xl border border-white/10 bg-brand-card p-5"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                  {title}
                </p>
                <p className="mt-2 text-2xl font-black text-white">{value}</p>
              </div>
              <Icon className={`h-6 w-6 ${color}`} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-brand-card p-6 lg:col-span-2">
          <h2 className="text-sm font-black uppercase tracking-wide text-white">
            Revenue this week
          </h2>
          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="day" stroke="#888" tick={{ fill: "#888", fontSize: 12 }} />
                <YAxis
                  stroke="#888"
                  tick={{ fill: "#888", fontSize: 12 }}
                  tickFormatter={(v) => `$${v}`}
                />
                <Tooltip
                  contentStyle={{
                    background: "#1a1a1a",
                    border: "1px solid #333",
                    borderRadius: 8,
                  }}
                  labelStyle={{ color: "#fff" }}
                  formatter={(value) => [`$${value}`, "Revenue"]}
                />
                <Bar dataKey="revenue" fill="#FF5F1F" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-brand-card p-6">
          <h2 className="text-sm font-black uppercase tracking-wide text-white">
            Recent orders
          </h2>
          <div className="mt-4 space-y-3">
            {recent.length === 0 && (
              <p className="text-sm text-zinc-500">No recent orders.</p>
            )}
            {recent.map((o) => (
              <div
                key={o._id}
                className="flex justify-between border-b border-white/5 pb-3 text-sm last:border-0"
              >
                <div>
                  <span className="font-mono text-brand-orange">
                    #{o._id?.slice(-6).toUpperCase()}
                  </span>
                  <p className="text-zinc-400">${o.totalPrice?.toFixed(2)}</p>
                </div>
                <span className="text-xs uppercase text-zinc-500">{o.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
