import { useEffect, useState } from "react";
import { X } from "lucide-react";

const emptyForm = {
  name: "New Shoe",
  brand: "Nike",
  price: "199.99",
  originalPrice: "",
  stock: "50",
  imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
  category: "Men",
  isFeatured: false,
  rating: "4",
  reviewCount: "0",
};

function productToForm(p) {
  return {
    name: p.name ?? "",
    brand: p.brand ?? "",
    price: String(p.price ?? ""),
    originalPrice: p.originalPrice != null ? String(p.originalPrice) : "",
    stock: String(p.stock ?? 0),
    imageUrl: p.imageUrl ?? "",
    category: p.category ?? "Men",
    isFeatured: !!p.isFeatured,
    rating: String(p.rating ?? 4),
    reviewCount: String(p.reviewCount ?? 0),
  };
}

export function ProductFormModal({ open, onClose, editingProduct, onSave }) {
  const [form, setForm] = useState(emptyForm);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setErr("");
    if (editingProduct) setForm(productToForm(editingProduct));
    else setForm(emptyForm);
  }, [open, editingProduct]);

  if (!open) return null;

  const isEdit = !!editingProduct;

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const body = {
        name: form.name,
        brand: form.brand,
        price: parseFloat(form.price),
        stock: parseInt(form.stock, 10),
        imageUrl: form.imageUrl,
        category: form.category,
        isFeatured: form.isFeatured,
        rating: parseFloat(form.rating) || 0,
        reviewCount: parseInt(form.reviewCount, 10) || 0,
      };
      if (form.originalPrice.trim() !== "") {
        body.originalPrice = parseFloat(form.originalPrice);
      } else if (isEdit) {
        body.originalPrice = null;
      }
      await onSave(body, isEdit ? editingProduct._id : null);
      onClose();
      if (!isEdit) setForm(emptyForm);
    } catch (e2) {
      setErr(e2.response?.data?.message || "Save failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/10 bg-brand-card p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-black uppercase text-white">
            {isEdit ? "Edit product" : "Add product"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-white"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-bold uppercase text-zinc-500">Name</label>
              <input
                required
                className="w-full rounded-lg border border-white/10 bg-brand-input px-3 py-2 text-sm text-white"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold uppercase text-zinc-500">Brand</label>
              <input
                required
                className="w-full rounded-lg border border-white/10 bg-brand-input px-3 py-2 text-sm text-white"
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-bold uppercase text-zinc-500">Price</label>
              <input
                required
                type="number"
                step="0.01"
                min="0"
                className="w-full rounded-lg border border-white/10 bg-brand-input px-3 py-2 text-sm text-white"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold uppercase text-zinc-500">
                Original price <span className="font-normal normal-case text-zinc-600">(sale)</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="Optional"
                className="w-full rounded-lg border border-white/10 bg-brand-input px-3 py-2 text-sm text-white placeholder:text-zinc-600"
                value={form.originalPrice}
                onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-bold uppercase text-zinc-500">Stock</label>
              <input
                required
                type="number"
                min="0"
                className="w-full rounded-lg border border-white/10 bg-brand-input px-3 py-2 text-sm text-white"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold uppercase text-zinc-500">Category</label>
              <select
                className="w-full rounded-lg border border-white/10 bg-brand-input px-3 py-2 text-sm text-white"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {["Men", "Women", "Kids", "Sport", "Casual"].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold uppercase text-zinc-500">Image URL</label>
            <input
              required
              type="url"
              className="w-full rounded-lg border border-white/10 bg-brand-input px-3 py-2 text-sm text-white"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-bold uppercase text-zinc-500">Rating (0–5)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                className="w-full rounded-lg border border-white/10 bg-brand-input px-3 py-2 text-sm text-white"
                value={form.rating}
                onChange={(e) => setForm({ ...form, rating: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold uppercase text-zinc-500">Review count</label>
              <input
                type="number"
                min="0"
                className="w-full rounded-lg border border-white/10 bg-brand-input px-3 py-2 text-sm text-white"
                value={form.reviewCount}
                onChange={(e) => setForm({ ...form, reviewCount: e.target.value })}
              />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-zinc-300">
            <input
              type="checkbox"
              checked={form.isFeatured}
              onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
              className="accent-brand-orange"
            />
            Featured product
          </label>
          {err && <p className="text-sm text-red-400">{err}</p>}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-bold uppercase text-white hover:text-zinc-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-brand-orange px-6 py-2 text-sm font-black uppercase text-white hover:opacity-90 disabled:opacity-50"
            >
              {isEdit ? "Update product" : "Save product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
