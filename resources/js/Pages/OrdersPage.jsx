import { usePage, router } from "@inertiajs/react";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faReceipt, faChevronDown, faChevronUp,
  faCreditCard, faMoneyBill, faBoxOpen, faImage,
  faStar as faStarSolid,
} from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";
import { faPix } from "@fortawesome/free-brands-svg-icons";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import Toast from "../Components/Toast";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (v) => Number(v).toFixed(2).replace(".", ",");

const paymentIcon = (method) => {
  if (method === "pix")  return <FontAwesomeIcon icon={faPix} />;
  if (method === "card") return <FontAwesomeIcon icon={faCreditCard} />;
  return <FontAwesomeIcon icon={faMoneyBill} />;
};

const paymentLabel = (method) => {
  if (method === "pix")  return "PIX";
  if (method === "card") return "Cartão";
  return "Dinheiro";
};

const statusLabel = (status) => {
  switch (Number(status)) {
    case 1: return { label: "Confirmado",        color: "secondary" };
    case 2: return { label: "Em preparo",         color: "warning"   };
    case 3: return { label: "Saiu para entrega",  color: "primary"   };
    case 4: return { label: "Entregue",           color: "success"   };
    default: return { label: "Pendente",          color: "secondary" };
  }
};

// ─── Star Rating ──────────────────────────────────────────────────────────────
function StarRating({ value, onChange, readonly = false }) {
  const [hovered, setHovered] = useState(0);
  const active = hovered || value;

  return (
    <div className="d-flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => !readonly && onChange(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          style={{
            fontSize: "1.6rem",
            color: star <= active ? "#f59e0b" : "#d1d5db",
            cursor: readonly ? "default" : "pointer",
            transition: "color 0.1s",
          }}
        >
          <FontAwesomeIcon icon={star <= active ? faStarSolid : faStarRegular} />
        </span>
      ))}
    </div>
  );
}

// ─── Review Modal ─────────────────────────────────────────────────────────────
function ReviewModal({ orderGroup, onClose, onSuccess }) {
  const [rating,  setRating]  = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(false);

  const LABELS = ["", "Ruim", "Regular", "Bom", "Muito bom", "Excelente"];

  const handleSubmit = () => {
    if (!rating) { setError(true); return; }
    setLoading(true);
    router.patch(
      `/orders/${orderGroup}/review`,
      { review_rating: rating, review_comment: comment || null },
      {
        preserveScroll: true,
        onSuccess: () => { setLoading(false); onSuccess(); onClose(); },
        onError:   () => setLoading(false),
      }
    );
  };

  return (
    <div className="modal d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,.45)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content rounded-4 shadow">
          <div className="modal-header border-0 pb-0">
            <div>
              <h5 className="modal-title fw-bold mb-0">Avaliar Pedido</h5>
              <p className="text-muted small mb-0 mt-1">
                Pedido #{orderGroup.slice(0, 8).toUpperCase()}
              </p>
            </div>
            <button className="btn-close" onClick={onClose} />
          </div>

          <div className="modal-body">
            {/* Estrelas */}
            <div className="text-center mb-3">
              <p className="fw-semibold small mb-2">Como foi seu pedido?</p>
              <StarRating value={rating} onChange={(v) => { setRating(v); setError(false); }} />
              {rating > 0 && (
                <p className="mt-2 mb-0 fw-semibold" style={{ color: "#f59e0b", fontSize: ".9rem" }}>
                  {LABELS[rating]}
                </p>
              )}
              {error && (
                <p className="text-danger small mt-1 mb-0">Selecione uma nota para continuar.</p>
              )}
            </div>

            {/* Comentário */}
            <div>
              <label className="form-label fw-semibold small">
                Comentário <span className="text-muted fw-normal">(opcional)</span>
              </label>
              <textarea
                className="form-control rounded-3"
                rows={3}
                maxLength={500}
                placeholder="Conte como foi sua experiência..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                style={{ resize: "none", fontSize: ".875rem" }}
              />
              <div className="text-end text-muted mt-1" style={{ fontSize: ".75rem" }}>
                {comment.length}/500
              </div>
            </div>
          </div>

          <div className="modal-footer border-0 pt-0">
            <button className="btn btn-outline-secondary rounded-3" onClick={onClose}>
              Cancelar
            </button>
            <button
              className="btn btn-primary rounded-3"
              onClick={handleSubmit}
              disabled={loading}
            >
              <FontAwesomeIcon icon={faStarSolid} className="me-1" />
              {loading ? "Enviando..." : "Enviar Avaliação"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Order Group Card ─────────────────────────────────────────────────────────
function OrderGroupCard({ orderGroup, items, onReviewSent }) {
  const [open,       setOpen]       = useState(false);
  const [showReview, setShowReview] = useState(false);

  const total      = items.reduce((sum, i) => sum + Number(i.product_price), 0);
  const method     = items[0]?.payment_method;
  const status     = statusLabel(items[0]?.status_order);
  const shortGroup = orderGroup.slice(0, 8).toUpperCase();

  // avaliação já existe se qualquer item do grupo tiver review_rating
  const existingRating = items[0]?.review_rating;
  const isDelivered    = Number(items[0]?.status_order) === 4;

  return (
    <>
      <div className="card shadow-sm border mb-3" style={{ borderRadius: 12, overflow: "hidden" }}>
        {/* Barra de status */}
        <div style={{ height: 4 }} className={`bg-${status.color}`} />

        {/* Header */}
        <div
          className="card-body d-flex justify-content-between align-items-center"
          style={{ cursor: "pointer" }}
          onClick={() => setOpen((o) => !o)}
        >
          <div className="d-flex align-items-center gap-3">
            <div
              className="d-flex align-items-center justify-content-center bg-light rounded-3"
              style={{ width: 44, height: 44, fontSize: "1.2rem", color: "#0d6efd" }}
            >
              <FontAwesomeIcon icon={faReceipt} />
            </div>
            <div>
              <p className="mb-0 fw-bold" style={{ fontSize: ".95rem" }}>
                Pedido <span className="text-muted fw-normal">#{shortGroup}</span>
              </p>
              <p className="mb-0 text-muted small">
                {items.length} {items.length === 1 ? "item" : "itens"} ·{" "}
                <span className="me-1">{paymentIcon(method)}</span>
                {paymentLabel(method)}
              </p>
            </div>
          </div>

          <div className="d-flex align-items-center gap-3">
            <div className="text-end">
              <p className="mb-0 fw-bold" style={{ color: "#198754", fontFamily: "monospace" }}>
                R$ {fmt(total)}
              </p>
              <span className={`badge bg-${status.color}`}>{status.label}</span>
            </div>
            <span className="text-muted">
              <FontAwesomeIcon icon={open ? faChevronUp : faChevronDown} />
            </span>
          </div>
        </div>

        {/* Itens expandidos */}
        {open && (
          <div className="card-footer bg-light border-top p-0">
            {items.map((item) => {
              const imageUrl = item.product_image
                ? `/storage/${item.product_image}`
                : null;
              return (
                <div
                  key={item.order_id}
                  className="d-flex justify-content-between align-items-center px-4 py-2 border-bottom gap-3"
                  style={{ fontSize: ".875rem" }}
                >
                 
                  <span className="text-dark flex-grow-1">{item.product_name}</span>
                  <span className="fw-semibold" style={{ color: "#198754", fontFamily: "monospace" }}>
                    R$ {fmt(item.product_price)}
                  </span>
                </div>
              );
            })}

            <div className="d-flex justify-content-between align-items-center px-4 py-2">
              <span className="text-muted small">Total</span>
              <span className="fw-bold" style={{ fontFamily: "monospace" }}>
                R$ {fmt(total)}
              </span>
            </div>

            {/* Avaliação — só aparece se entregue */}
            {isDelivered && (
              <div className="px-4 py-3 border-top">
                {existingRating ? (
                  <div className="d-flex align-items-center gap-2">
                    <StarRating value={existingRating} readonly />
                    <span className="text-muted small">Sua avaliação</span>
                  </div>
                ) : (
                  <button
                    className="btn btn-outline-warning btn-sm rounded-3 fw-semibold"
                    onClick={(e) => { e.stopPropagation(); setShowReview(true); }}
                  >
                    <FontAwesomeIcon icon={faStarSolid} className="me-1" />
                    Avaliar pedido
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {showReview && (
        <ReviewModal
          orderGroup={orderGroup}
          onClose={() => setShowReview(false)}
          onSuccess={onReviewSent}
        />
      )}
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function OrdersPage({ orders = {} }) {
  const { auth, flash } = usePage().props;
  const [toast, setToast] = useState(null);

  const groupEntries = Object.entries(orders);

  const showToast = (message, icon) => {
    setToast({ message, icon });
    setTimeout(() => setToast(null), 3000);
  };

  const handleReviewSent = () => {
    showToast("Avaliação enviada, obrigado!", <FontAwesomeIcon icon={faStarSolid} style={{ color: "#f59e0b" }} />);
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Header user={auth?.user} />

      <main className="container py-4 flex-grow-1">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="h3 fw-bold mb-1">Meus Pedidos</h1>
            <p className="text-muted small mb-0">
              {groupEntries.length}{" "}
              {groupEntries.length === 1 ? "pedido realizado" : "pedidos realizados"}
            </p>
          </div>
        </div>

        {groupEntries.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <div className="mb-3" style={{ fontSize: "2.5rem", opacity: 0.4 }}>
              <FontAwesomeIcon icon={faBoxOpen} />
            </div>
            <h5 className="fw-semibold text-dark">Nenhum pedido ainda</h5>
            <p className="small">Seus pedidos aparecerão aqui após a compra</p>
            <a href="/pedido" className="btn btn-primary mt-2 rounded-pill">
              Ver Cardápio
            </a>
          </div>
        ) : (
          groupEntries.map(([orderGroup, items]) => (
            <OrderGroupCard
              key={orderGroup}
              orderGroup={orderGroup}
              items={items}
              onReviewSent={handleReviewSent}
            />
          ))
        )}
      </main>

      <Footer />
      {toast && <Toast message={toast.message} icon={toast.icon} />}
    </div>
  );
}