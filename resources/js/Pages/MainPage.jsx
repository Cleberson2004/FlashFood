// resources/js/Pages/MainPage.jsx
import { useState } from "react";
import { router, usePage, Link } from "@inertiajs/react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import DeleteModal from "../Components/DeleteModal";
import Toast from "../Components/Toast";

export default function MainPage({ items = [] }) {
  const { auth, flash } = usePage().props;

  const [tab, setTab] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(flash?.success ? { message: flash.success, icon: "✅" } : null);

  const showToast = (message, icon = "✅") => {
    setToast({ message, icon });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDeleteConfirm = (item) => {
    router.delete("", {
      preserveScroll: true,
      onSuccess: () => {
        setDeleteTarget(null);
        showToast("Item excluído com sucesso.", "🗑️");
      },
    });
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Header user={auth?.user} />

      <main className="container py-4 flex-grow-1">
        {/* Cabeçalho da página */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="h3 fw-bold mb-1">Seus Itens</h1>
            <p className="text-muted small mb-0">
              {items.length} {items.length === 1 ? "item cadastrado" : "itens cadastrados"}
            </p>
          </div>
          <Link href="/newProduct" className="btn btn-primary">+ Novo Item</Link>
        </div>

        {/* Tabs */}
        <ul className="nav nav-tabs mb-4">
          {[
            { key: "all", label: "Todos" },
            { key: "recent", label: "Recentes" },
            { key: "archived", label: "Arquivados" },
          ].map((t) => (
            <li className="nav-item" key={t.key}>
              <button
                className={`nav-link ${tab === t.key ? "active" : ""}`}
                onClick={() => setTab(t.key)}
              >
                {t.label}
              </button>
            </li>
          ))}
        </ul>

        {/* Lista */}
        {items.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <div style={{ fontSize: "2.5rem", opacity: 0.4 }} className="mb-3">📭</div>
            <h5 className="fw-semibold text-dark">Nenhum item ainda</h5>
            <p className="small">Crie seu primeiro item para começar</p>
            <Link href="/newProduct" className="btn btn-primary mt-2">Criar Primeiro Item</Link>
          </div>
        ) : (
          <div className="row g-3">
            {items.map((item) => (
              <div className="col-sm-6 col-lg-4" key={item.id}>
                <ItemCard
                  item={item}
                  onEdit={() => ""}
                  onDelete={() => setDeleteTarget(item)}
                />
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />

      {deleteTarget && (
        <DeleteModal
          item={deleteTarget}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {toast && <Toast message={toast.message} icon={toast.icon} />}
    </div>
  );
}

function ItemCard({ item, onEdit, onDelete }) {
  return (
    <div className="card h-1 00 shadow-sm border">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h6 className="card-title fw-semibold mb-0">{item.title}</h6>
          <span className="badge bg-secondary text-white">#{String(item.id).padStart(3, "0")}</span>
        </div>
        <p className="card-text text-muted small">
          {item.description || <em>Sem descrição</em>}
        </p>
      </div>
      <div className="card-footer bg-white border-top d-flex justify-content-end gap-2">
        <button className="btn btn-outline-secondary btn-sm" title="Editar" onClick={onEdit}>
          ✏️ Editar
        </button>
        <button className="btn btn-outline-danger btn-sm" title="Excluir" onClick={onDelete}>
          🗑 Excluir
        </button>
      </div>
    </div>
  );
}