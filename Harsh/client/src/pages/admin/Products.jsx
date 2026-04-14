import { useEffect, useMemo, useState } from "react";
import { Search, Pencil, Trash2 } from "lucide-react";
import { adminApi } from "../../api/client.js";
import { ProductFormModal } from "../../components/ProductFormModal.jsx";

export default function Products() {
  const [list, setList] = useState([]);
  const [q, setQ] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = () => {
    adminApi.get("/products").then((r) => setList(r.data)).catch(() => {});
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    if (!q.trim()) return list;
    const s = q.toLowerCase();
    return list.filter(
      (p) =>
        p.name.toLowerCase().includes(s) || p.brand.toLowerCase().includes(s)
    );
  }, [list, q]);

  const openAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (p) => {
    setEditing(p);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
  };

  const del = async (id) => {
    if (!confirm("Delete this product?")) return;
    await adminApi.delete(`/products/${id}`);
    load();
  };

  const toggleFeatured = async (p) => {
    await adminApi.patch(`/products/${p._id}`, { isFeatured: !p.isFeatured });
    load();
  };

  return (
    <div>
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-black uppercase text-white">Products</h1>
          <p className="mt-2 text-sm text-zinc-500">Manage your inventory catalog</p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="bg-brand-orange px-5 py-2.5 text-sm font-black uppercase text-white hover:opacity-90"
        >
          + Add product
        </button>
      </header>

      <div className="mb-6 flex max-w-md items-center gap-2 rounded-lg border border-white/10 bg-brand-input px-3 py-2">
        <Search className="h-4 w-4 text-zinc-500" />
        <input
          placeholder="Search products..."
          className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-600"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/10 bg-brand-card">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-xs font-bold uppercase tracking-wider text-zinc-500">
              <th className="p-4">Product</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p._id} className="border-b border-white/5 hover:bg-white/[0.02]">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={p.imageUrl}
                      alt=""
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-bold text-white">{p.name}</p>
                      <p className="text-xs text-zinc-500">{p.brand}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-zinc-300">{p.category}</td>
                <td className="p-4 font-semibold text-white">${p.price.toFixed(2)}</td>
                <td className="p-4 text-zinc-300">{p.stock}</td>
                <td className="p-4">
                  <button
                    type="button"
                    onClick={() => toggleFeatured(p)}
                    className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase ${
                      p.isFeatured
                        ? "bg-brand-orange/20 text-brand-orange"
                        : "bg-zinc-800 text-zinc-400"
                    }`}
                  >
                    {p.isFeatured ? "Featured" : "Standard"}
                  </button>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => openEdit(p)}
                      className="text-zinc-400 hover:text-brand-orange"
                      title="Edit product"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => del(p._id)}
                      className="text-zinc-400 hover:text-red-400"
                      title="Delete product"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ProductFormModal
        open={modalOpen}
        onClose={closeModal}
        editingProduct={editing}
        onSave={async (body, id) => {
          if (id) await adminApi.patch(`/products/${id}`, body);
          else await adminApi.post("/products", body);
          load();
        }}
      />
    </div>
  );
}
