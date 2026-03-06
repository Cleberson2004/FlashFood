// resources/js/Pages/DeleteConfirmPage.jsx
import { router, usePage } from "@inertiajs/react";
import { useState } from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

/**
 * Página de confirmação de exclusão — Inertia.js
 *
 * Props vindas do controller:
 *   item: { id, title, description }
 *
 * Rota esperada:
 *   DELETE /items/{id}  → items.destroy
 */
export default function DeleteConfirmPage({ item }) {
  const { auth } = usePage().props;
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => {
    setLoading(true);
    router.delete(route("items.destroy", item.product_id), {
      onSuccess: () => setConfirmed(true),
      onFinish: () => setLoading(false),
    });
  };

  return (
    <div className="page-layout">
      <Header user={auth?.user} />

      <main className="page-content">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <a href={route("main")} className="breadcrumb-link">Itens</a>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-current">Confirmar Exclusão</span>
        </div>

        <div style={{ maxWidth: "500px", margin: "0 auto" }}>
          {confirmed ? (
            <SuccessState />
          ) : (
            <ConfirmCard item={item} loading={loading} onConfirm={handleConfirm} />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

// ── Card de confirmação ──
function ConfirmCard({ item, loading, onConfirm }) {
  return (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--border)",
      borderRadius: "16px", overflow: "hidden",
      boxShadow: "var(--shadow), 0 0 60px rgba(255,79,106,0.06)",
      animation: "slideUp 0.4s cubic-bezier(0.4,0,0.2,1) both",
    }}>
      <style>{`@keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }`}</style>

      {/* Topo */}
      <div style={{
        padding: "1.75rem 2rem 1.5rem",
        background: "linear-gradient(180deg, rgba(255,79,106,0.08) 0%, var(--surface) 100%)",
        borderBottom: "1px solid var(--border)",
        display: "flex", alignItems: "flex-start", gap: "1rem",
      }}>
        <div style={{
          width: "52px", height: "52px", flexShrink: 0, borderRadius: "12px",
          background: "var(--danger-glow)", border: "1px solid rgba(255,79,106,0.3)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem",
        }}>
          🗑️
        </div>
        <div>
          <h1 style={{ fontSize: "1.2rem", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: "0.3rem" }}>
            Excluir Item
          </h1>
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
            Esta ação é permanente e não poderá ser desfeita. Revise as informações abaixo antes de confirmar.
          </p>
        </div>
      </div>

      <div style={{ padding: "1.5rem 2rem" }}>
        {/* Preview */}
        <div style={{
          background: "var(--surface-2)", border: "1px solid var(--border)",
          borderRadius: "var(--radius-sm)", padding: "1rem 1.25rem", marginBottom: "1.25rem",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: item.description ? "0.4rem" : 0 }}>
            <span className="tag">#{String(item.id).padStart(3, "0")}</span>
            <span style={{ fontWeight: 600, fontSize: "0.95rem" }}>{item.title}</span>
          </div>
          {item.description && (
            <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
              {item.description}
            </p>
          )}
        </div>

        {/* Aviso */}
        <div style={{
          display: "flex", gap: "0.75rem", padding: "0.875rem 1rem",
          background: "rgba(255,79,106,0.06)", border: "1px solid rgba(255,79,106,0.2)",
          borderRadius: "var(--radius-sm)", marginBottom: "1.5rem",
        }}>
          <span style={{ fontSize: "1rem", flexShrink: 0 }}>⚠️</span>
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
            Ao confirmar, o item{" "}
            <strong style={{ color: "var(--danger)" }}>"{item.title}"</strong>{" "}
            e todos os dados associados serão permanentemente removidos do sistema.
          </p>
        </div>

        {/* Botões */}
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
          <a href={route("main")} className="btn btn-ghost">
            Cancelar
          </a>
          <button className="btn btn-danger" onClick={onConfirm} disabled={loading}>
            {loading ? "Excluindo…" : "Confirmar Exclusão"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Estado de sucesso ──
function SuccessState() {
  return (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--border)",
      borderRadius: "16px", padding: "3rem 2rem", textAlign: "center",
      animation: "scaleIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both",
    }}>
      <style>{`@keyframes scaleIn { from{opacity:0;transform:scale(0.85)} to{opacity:1;transform:scale(1)} }`}</style>
      <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>✅</div>
      <h2 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "0.4rem" }}>Item excluído</h2>
      <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "1.25rem" }}>
        O item foi removido com sucesso.
      </p>
      <a href={route("main")} className="btn btn-primary">
        Voltar para a lista
      </a>
    </div>
  );
}
