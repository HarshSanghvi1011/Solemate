import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LogoMark } from "../../components/Logo.jsx";
import { adminApi, setAdminAuth } from "../../api/client.js";
import { ADMIN_TOKEN_KEY } from "../../constants.js";

export default function AdminLogin() {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const { data } = await adminApi.post("/auth/admin/login", { username, password });
      localStorage.setItem(ADMIN_TOKEN_KEY, data.token);
      setAdminAuth(data.token);
      navigate("/admin");
    } catch (e2) {
      setErr(e2.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-black px-4">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(255,95,31,0.25) 0%, transparent 55%)",
        }}
      />
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-brand-card/95 p-8 shadow-2xl backdrop-blur-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <LogoMark skew className="mb-4" />
          <h1 className="text-2xl font-black uppercase tracking-tight text-white">
            Admin portal
          </h1>
          <p className="mt-2 text-sm text-zinc-500">Sign in to manage your store</p>
        </div>
        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-400">Username</label>
            <input
              className="w-full rounded-lg border border-white/10 bg-brand-input px-3 py-2.5 text-white outline-none focus:border-brand-orange"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-400">Password</label>
            <input
              type="password"
              className="w-full rounded-lg border border-white/10 bg-brand-input px-3 py-2.5 text-white outline-none focus:border-brand-orange"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          {err && <p className="text-sm text-red-400">{err}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-orange py-3 text-sm font-black uppercase text-white hover:opacity-90 disabled:opacity-50"
          >
            Secure login
          </button>
        </form>
        <div className="mt-8 border-t border-white/10 pt-6 text-center">
          <p className="text-xs text-zinc-500">Default demo credentials:</p>
          <p className="mt-1 text-sm font-mono text-brand-orange">admin / admin123</p>
        </div>
        <Link
          to="/"
          className="mt-6 block text-center text-xs text-zinc-500 hover:text-white"
        >
          ← Back to store
        </Link>
      </div>
    </main>
  );
}
