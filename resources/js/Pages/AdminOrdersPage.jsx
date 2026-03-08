import { usePage, router } from "@inertiajs/react";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faReceipt, faChevronDown, faChevronUp,
  faCreditCard, faMoneyBill, faFire, faTruck, faBoxOpen, faCheck
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

const STATUS = {
  1: { label: "Confirmado",      color: "secondary", next: null },
  2: { label: "Em Produção",     color: "warning",   next: null },
  3: { label: "Saiu p/ Entrega", color: "primary",   next: null },
  4: { label: "Entregue",        color: "success",   next: null },
};

// ─── Order Group Card ─────────────────────────────────────────────────────────
function OrderGroupCard({ orderGroup, items, onUpdateStatus }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const total    = items.reduce((sum, i) => sum + Number(i.product_price), 0);
  const method   = items[0]?.payment_method;
  const status   = Number(items[0]?.status_order ?? items[0]?.status ?? 1);
  const statusInfo = STATUS[status] ?? STATUS[1];
  const shortGroup = orderGroup.slice(0, 8).toUpperCase();

  const handleStatus = (newStatus) => {
    setLoading(true);
    router.patch(`/orders/${orderGroup}/status`, { status: newStatus }, {
      preserveScroll: true,
      onSuccess: () => setLoading(false),
      onError: ()   => setLoading(false),
    });
  };

  return (
    <div
      className="card shadow-sm border mb-3"
      style={{ borderRadius: 12, overflow: "hidden" }}
    >
      {/* Barra de status */}
      <div style={{ height: 4 }} className={`bg-${statusInfo.color}`} />

      {/* Header */}
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">

          {/* Info do pedido */}
          <div
            className="d-flex align-items-center gap-3"
            style={{ cursor: "pointer", flex: 1 }}
            onClick={() => setOpen(o => !o)}
          >
            <div
              className="d-flex align-items-center justify-content-center bg-light rounded-3"
              style={{ width: 44, height: 44, fontSize: "1.2rem", color: "#0d6efd", flexShrink: 0 }}
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

          {/* Total + status + ações */}
          <div className="d-flex align-items-center gap-2 flex-wrap justify-content-end">
            <div className="text-end me-1">
              <p className="mb-1 fw-bold" style={{ color: "#198754", fontFamily: "monospace" }}>
                R$ {fmt(total)}
              </p>
              <span className={`badge bg-${statusInfo.color}`}>{statusInfo.label}</span>
            </div>

            {/* Botão Em Produção */}
            {status === 1 && (
              <button
                className="btn btn-warning btn-sm fw-semibold rounded-pill"
                onClick={() => handleStatus(2)}
                disabled={loading}
                style={{ whiteSpace: "nowrap" }}
              >
                <FontAwesomeIcon icon={faFire} className="me-1" />
                Em Preparo
              </button>
            )}

            {/* Botão Saiu p/ Entrega */}
            {status === 2 && (
              <button
                className="btn btn-primary btn-sm fw-semibold rounded-pill"
                onClick={() => handleStatus(3)}
                disabled={loading}
                style={{ whiteSpace: "nowrap" }}
              >
                <FontAwesomeIcon icon={faTruck} className="me-1" />
                Saiu p/ Entrega
              </button>
            )}

            {/* Botão Entregue */}
            {status === 3 && (
              <button
                className="btn btn-success btn-sm fw-semibold rounded-pill"
                onClick={() => handleStatus(4)}
                disabled={loading}
                style={{ whiteSpace: "nowrap" }}
              >
                <FontAwesomeIcon icon={faCheck} className="me-1" />
                Concluir Entrega
              </button>
            )}

            {status === 4 && (
              <span className="badge bg-success rounded-pill px-3 py-2">
                <FontAwesomeIcon icon={faCheck} className="me-1" />
                Concluído
              </span>
            )}

            {/* Expandir */}
            <button
              className="btn btn-light btn-sm rounded-circle"
              style={{ width: 32, height: 32, padding: 0 }}
              onClick={() => setOpen(o => !o)}
            >
              <FontAwesomeIcon icon={open ? faChevronUp : faChevronDown} />
            </button>
          </div>
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
              <div>
                <span className="fw-semibold text-dark">{item.product_name}</span>
                <span className="badge bg-light text-muted ms-2">
                  #{String(item.product_id).padStart(3, "0")}
                </span>
              </div>
              <span className="fw-semibold" style={{ color: "#198754", fontFamily: "monospace" }}>
                R$ {fmt(item.product_price)}
              </span>
            </div>
          ))}
          <div className="d-flex justify-content-between align-items-center px-4 py-2">
            <span className="text-muted small">Total do pedido</span>
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
export default function AdminOrdersPage({ orders = {} }) {
  const { auth } = usePage().props;
  const [filter, setFilter] = useState("all");

  const groupEntries = Object.entries(orders);

  const filtered = filter === "all"
    ? groupEntries
    : groupEntries.filter(([, items]) => Number(items[0]?.status_order ?? items[0]?.status) === Number(filter));

  const countByStatus = (s) =>
    groupEntries.filter(([, items]) => Number(items[0]?.status_order ?? items[0]?.status) === s).length;

  const tabs = [
    { key: "all",  label: "Todos",             count: groupEntries.length },
    { key: "1",    label: "Confirmados",        count: countByStatus(1) },
    { key: "2",    label: "Em Produção",        count: countByStatus(2) },
    { key: "3",    label: "Saiu p/ Entrega",   count: countByStatus(3) },
    { key: "4",    label: "Entregues",          count: countByStatus(4) },
  ];

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Header user={auth?.user} />

      <main className="container py-4 flex-grow-1">

        {/* Page header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="h3 fw-bold mb-1">Gestão de Pedidos</h1>
            <p className="text-muted small mb-0">
              {groupEntries.length} {groupEntries.length === 1 ? "pedido recebido" : "pedidos recebidos"}
            </p>
          </div>
        </div>

        {/* Filtros por status */}
        <div className="d-flex gap-2 mb-4 flex-wrap">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setFilter(t.key)}
              className={`btn btn-sm rounded-pill fw-semibold ${filter === t.key ? "btn-primary" : "btn-outline-secondary"}`}
            >
              {t.label}
              <span className={`badge ms-2 ${filter === t.key ? "bg-white text-primary" : "bg-secondary"}`}>
                {t.count}
              </span>
            </button>
          ))}
        </div>

        {/* Lista */}
        {filtered.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <div className="mb-3" style={{ fontSize: "2.5rem", opacity: 0.4 }}>
              <FontAwesomeIcon icon={faBoxOpen} />
            </div>
            <h5 className="fw-semibold text-dark">Nenhum pedido neste status</h5>
            <p className="small">Os pedidos aparecerão aqui conforme forem realizados</p>
          </div>
        ) : (
          filtered.map(([orderGroup, items]) => (
            <OrderGroupCard
              key={orderGroup}
              orderGroup={orderGroup}
              items={items}
              onUpdateStatus={() => {}}
            />
          ))
        )}
      </main>

      <Footer />
    </div>
  );
}