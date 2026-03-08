import { usePage } from "@inertiajs/react";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faReceipt, faChevronDown, faChevronUp,
  faCreditCard, faMoneyBill, faBoxOpen
} from "@fortawesome/free-solid-svg-icons";
import { faPix } from "@fortawesome/free-brands-svg-icons";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

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
    case 1: return { label: "Confirmado", color: "secondary" };
    case 2: return { label: "Em preparo", color: "warning" };
    case 3: return { label: "Saiu para entrega",   color: "primary" };
    case 4: return { label: "Entregue",   color: "dark" };

    default: return { label: "Pendente",  color: "secondary" };
  }
};

// ─── Order Group Card ─────────────────────────────────────────────────────────
function OrderGroupCard({ orderGroup, items }) {
  const [open, setOpen] = useState(false);

  const total = items.reduce((sum, i) => sum + Number(i.product_price), 0);
  const method = items[0]?.payment_method;
  const status = statusLabel(items[0]?.status_order);
  const shortGroup = orderGroup.slice(0, 8).toUpperCase();

  return (
    <div
      className="card shadow-sm border mb-3"
      style={{ borderRadius: 12, overflow: "hidden", transition: "box-shadow .2s" }}
    >
      {/* Barra de status no topo */}
      <div style={{ height: 4 }} className={`bg-${status.color}`} />

      {/* Header do card */}
      <div
        className="card-body d-flex justify-content-between align-items-center"
        style={{ cursor: "pointer" }}
        onClick={() => setOpen(o => !o)}
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
          {items.map((item) => (
            <div
              key={item.order_id}
              className="d-flex justify-content-between align-items-center px-4 py-2 border-bottom"
              style={{ fontSize: ".875rem" }}
            >
              <span className="text-dark">{item.product_name}</span>
              <span className="fw-semibold" style={{ color: "#198754", fontFamily: "monospace" }}>
                R$ {fmt(item.product_price)}
              </span>
            </div>
          ))}
          <div className="d-flex justify-content-between align-items-center px-4 py-2">
            <span className="text-muted small">Total</span>
            <span className="fw-bold" style={{ color: "#000000", fontFamily: "monospace" }}>
              R$ {fmt(total)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function OrdersPage({ orders = {} }) {
  const { auth } = usePage().props;

  // orders chega como objeto agrupado por order_group do Laravel
  const groupEntries = Object.entries(orders);

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Header user={auth?.user} />

      <main className="container py-4 flex-grow-1">
        {/* Page header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="h3 fw-bold mb-1">Meus Pedidos</h1>
            <p className="text-muted small mb-0">
              {groupEntries.length} {groupEntries.length === 1 ? "pedido realizado" : "pedidos realizados"}
            </p>
          </div>
        </div>

        {/* Lista de pedidos */}
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
            />
          ))
        )}
      </main>

      <Footer />
    </div>
  );
}