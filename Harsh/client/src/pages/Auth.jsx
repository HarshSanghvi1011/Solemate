import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Zap,
  ArrowRight,
} from "lucide-react";
import { LogoMark } from "../components/Logo.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Auth() {
  const [tab, setTab] = useState("in");
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      if (tab === "up") {
        if (form.password.length < 6) {
          setErr("Password must be at least 6 characters");
          setLoading(false);
          return;
        }
        if (form.password !== form.confirmPassword) {
          setErr("Passwords do not match");
          setLoading(false);
          return;
        }
        await register({
          fullName: form.fullName,
          email: form.email,
          password: form.password,
          confirmPassword: form.confirmPassword,
        });
      } else {
        await login(form.email, form.password);
      }
      navigate("/");
    } catch (e2) {
      setErr(e2.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black px-4 py-12 sm:py-16">
      <div className="mx-auto mb-10 flex flex-col items-center">
        <div className="flex items-center gap-2">
          <LogoMark skew={false} />
          <span className="text-xl font-black uppercase tracking-tight text-brand-orange">
            Sole Mate
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-brand-card p-6 shadow-xl sm:p-8">
        <div className="mb-8 flex rounded-lg bg-brand-input p-1">
          <button
            type="button"
            onClick={() => setTab("in")}
            className={`flex-1 rounded-md py-2 text-center text-sm font-bold uppercase transition ${
              tab === "in" ? "bg-brand-orange text-white" : "text-zinc-500"
            }`}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => setTab("up")}
            className={`flex-1 rounded-md py-2 text-center text-sm font-bold uppercase transition ${
              tab === "up" ? "bg-brand-orange text-white" : "text-zinc-500"
            }`}
          >
            Sign up
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          {tab === "up" && (
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-zinc-500">
                Full name
              </label>
              <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-brand-input px-3 py-2.5">
                <User className="h-4 w-4 text-zinc-500" />
                <input
                  required
                  className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-600"
                  placeholder="Jordan Smith"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                />
              </div>
            </div>
          )}
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-zinc-500">
              Email address
            </label>
            <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-brand-input px-3 py-2.5">
              <Mail className="h-4 w-4 text-zinc-500" />
              <input
                required
                type="email"
                className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-600"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-zinc-500">
              Password
            </label>
            <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-brand-input px-3 py-2.5">
              <Lock className="h-4 w-4 text-zinc-500" />
              <input
                required
                type={show1 ? "text" : "password"}
                className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-600"
                placeholder={tab === "up" ? "Min. 6 characters" : "••••••••"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShow1(!show1)}
                className="text-zinc-500 hover:text-white"
              >
                {show1 ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {tab === "in" && (
              <p className="mt-2 text-right">
                <span className="text-xs text-brand-orange cursor-default">Forgot password?</span>
              </p>
            )}
          </div>
          {tab === "up" && (
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-zinc-500">
                Confirm password
              </label>
              <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-brand-input px-3 py-2.5">
                <Lock className="h-4 w-4 text-zinc-500" />
                <input
                  required
                  type={show2 ? "text" : "password"}
                  className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-600"
                  placeholder="Re-enter password"
                  value={form.confirmPassword}
                  onChange={(e) =>
                    setForm({ ...form, confirmPassword: e.target.value })
                  }
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShow2(!show2)}
                  className="text-zinc-500 hover:text-white"
                >
                  {show2 ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          )}

          {err && <p className="text-sm text-red-400">{err}</p>}

          {tab === "up" ? (
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 bg-brand-orange py-3 text-sm font-black uppercase text-white hover:opacity-90 disabled:opacity-50"
            >
              <Zap className="h-4 w-4" />
              Create account
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 bg-brand-orange py-3 text-sm font-black uppercase text-white hover:opacity-90 disabled:opacity-50"
            >
              Sign in
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </form>

        <p className="mt-6 text-center text-xs text-zinc-500">
          By signing up you agree to our{" "}
          <span className="text-brand-orange">Terms</span> &{" "}
          <span className="text-brand-orange">Privacy Policy</span>
        </p>
        <p className="mt-4 text-center text-sm text-zinc-400">
          {tab === "up" ? (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setTab("in")}
                className="font-semibold text-brand-orange"
              >
                Sign in
              </button>
            </>
          ) : (
            <>
              No account?{" "}
              <button
                type="button"
                onClick={() => setTab("up")}
                className="font-semibold text-brand-orange"
              >
                Create one free
              </button>
            </>
          )}
        </p>
      </div>

      <div className="mx-auto mt-10 flex max-w-3xl flex-wrap justify-center gap-3">
        {[
          "Free shipping over $100",
          "Easy 30-day returns",
          "Exclusive member deals",
        ].map((t) => (
          <div
            key={t}
            className="rounded-lg border border-white/15 bg-brand-card px-4 py-2 text-center text-xs font-medium text-white"
          >
            {t}
          </div>
        ))}
      </div>
    </main>
  );
}
