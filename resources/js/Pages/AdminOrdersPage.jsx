import { usePage, router } from "@inertiajs/react";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faReceipt, faChevronDown, faChevronUp,
  faCreditCard, faMoneyBill, faFire, faTruck,
  faBoxOpen, faCheck, faMotorcycle,
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
  1: { label: "Confirmado",      color: "secondary" },
  2: { label: "Em Produção",     color: "warning"   },
  3: { label: "Saiu p/ Entrega", color: "primary"   },
  4: { label: "Entregue",        color: "success"   },
};

// ─── Delivery Modal ───────────────────────────────────────────────────────────
function DeliverySelectModal({ orderGroup, deliveries, onClose, onConfirm }) {
  const [selected, setSelected] = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(false);

  const handleConfirm = () => {
    if (!selected) { setError(true); return; }
    setLoading(true);
    router.patch(
      `/orders/${orderGroup}/delivery`,
      { delivery_id: selected },
      {
        preserveScroll: true,
        onSuccess: () => { setLoading(false); onConfirm(); onClose(); },
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
              <h5 className="modal-title fw-bold mb-0">Selecionar Entregador</h5>
              <p className="text-muted small mb-0 mt-1">
                Pedido #{orderGroup.slice(0, 8).toUpperCase()}
              </p>
            </div>
            <button className="btn-close" onClick={onClose} />
          </div>

          <div className="modal-body">
            {deliveries.length === 0 ? (
              <div className="text-center py-3 text-muted">
                <FontAwesomeIcon icon={faMotorcycle} style={{ fontSize: "2rem", opacity: 0.3 }} className="mb-2 d-block mx-auto" />
                <p className="small mb-0">Nenhum entregador cadastrado para esta loja.</p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-2">
                {deliveries.map((d) => {
                  const isSelected = selected === d.id;
                  return (
                    <label
                      key={d.id}
                      className="d-flex align-items-center gap-3 p-2 rounded-3 mb-0"
                      style={{
                        cursor: "pointer",
                        background: isSelected ? "#e8f0fe" : "#f8fafc",
                        border: `1.5px solid ${isSelected ? "#bad4ff" : "#e2e8f0"}`,
                        transition: "background 0.15s, border-color 0.15s",
                      }}
                    >
                      <input
                        type="radio"
                        className="form-check-input m-0 flex-shrink-0"
                        checked={isSelected}
                        onChange={() => { setSelected(d.id); setError(false); }}
                        style={{ width: 18, height: 18 }}
                      />
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                        style={{
                          width: 36, height: 36,
                          background: isSelected ? "#0d6efd" : "#e2e8f0",
                          color: isSelected ? "#fff" : "#64748b",
                          fontSize: "0.85rem",
                          transition: "background 0.15s, color 0.15s",
                        }}
                      >
                        <FontAwesomeIcon icon={faMotorcycle} />
                      </div>
                      <span className="fw-semibold small">{d.name}</span>
                    </label>
                  );
                })}
              </div>
            )}

            {error && (
              <p className="text-danger small mt-2 mb-0">
                Selecione um entregador para continuar.
              </p>
            )}
          </div>

          <div className="modal-footer border-0 pt-0">
            <button className="btn btn-outline-secondary rounded-3" onClick={onClose}>
              Cancelar
            </button>
            <button
              className="btn btn-primary rounded-3"
              onClick={handleConfirm}
              disabled={loading || deliveries.length === 0}
            >
              <FontAwesomeIcon icon={faTruck} className="me-1" />
              {loading ? "Enviando..." : "Confirmar Saída"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Order Group Card ─────────────────────────────────────────────────────────
function OrderGroupCard({ orderGroup, items, deliveries }) {
  const [open,            setOpen]            = useState(false);
  const [loading,         setLoading]         = useState(false);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);

  const total      = items.reduce((sum, i) => sum + Number(i.product_price), 0);
  const method     = items[0]?.payment_method;
  const status     = Number(items[0]?.status_order ?? items[0]?.status ?? 1);
  const statusInfo = STATUS[status] ?? STATUS[1];
  const shortGroup = orderGroup.slice(0, 8).toUpperCase();

  const handleStatus = (newStatus) => {
    setLoading(true);
    router.patch(`/orders/${orderGroup}/status`, { status: newStatus }, {
      preserveScroll: true,
      onSuccess: () => setLoading(false),
      onError:   () => setLoading(false),
    });
  };

  return (
    <>
      <div className="card shadow-sm border mb-3" style={{ borderRadius: 12, overflow: "hidden" }}>
        {/* Barra de status */}
        <div style={{ height: 4 }} className={`bg-${statusInfo.color}`} />

        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">

            {/* Info do pedido */}
            <div
              className="d-flex align-items-center gap-3"
              style={{ cursor: "pointer", flex: 1 }}
              onClick={() => setOpen((o) => !o)}
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

              {/* Botão Em Preparo */}
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

              {/* Botão Saiu p/ Entrega — abre modal */}
              {status === 2 && (
                <button
                  className="btn btn-primary btn-sm fw-semibold rounded-pill"
                  onClick={() => setShowDeliveryModal(true)}
                  disabled={loading}
                  style={{ whiteSpace: "nowrap" }}
                >
                  <FontAwesomeIcon icon={faTruck} className="me-1" />
                  Saiu p/ Entrega
                </button>
              )}

              {/* Botão Concluir */}
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

              <button
                className="btn btn-light btn-sm rounded-circle"
                style={{ width: 32, height: 32, padding: 0 }}
                onClick={() => setOpen((o) => !o)}
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
              <span className="fw-bold" style={{ fontFamily: "monospace" }}>
                R$ {fmt(total)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Modal de seleção de entregador */}
      {showDeliveryModal && (
        <DeliverySelectModal
          orderGroup={orderGroup}
          deliveries={deliveries}
          onClose={() => setShowDeliveryModal(false)}
          onConfirm={() => setShowDeliveryModal(false)}
        />
      )}
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminOrdersPage({ orders = {}, deliveries = [] }) {
  const { auth } = usePage().props;
  const [filter, setFilter] = useState("all");

  const groupEntries = Object.entries(orders);

  const filtered = filter === "all"
    ? groupEntries
    : groupEntries.filter(([, items]) =>
        Number(items[0]?.status_order ?? items[0]?.status) === Number(filter)
      );

  const countByStatus = (s) =>
    groupEntries.filter(([, items]) =>
      Number(items[0]?.status_order ?? items[0]?.status) === s
    ).length;

  const tabs = [
    { key: "all", label: "Todos",           count: groupEntries.length },
    { key: "1",   label: "Confirmados",     count: countByStatus(1)    },
    { key: "2",   label: "Em Produção",     count: countByStatus(2)    },
    { key: "3",   label: "Saiu p/ Entrega", count: countByStatus(3)    },
    { key: "4",   label: "Entregues",       count: countByStatus(4)    },
  ];

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Header user={auth?.user} />

      <main className="container py-4 flex-grow-1">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="h3 fw-bold mb-1">Gestão de Pedidos</h1>
            <p className="text-muted small mb-0">
              {groupEntries.length}{" "}
              {groupEntries.length === 1 ? "pedido recebido" : "pedidos recebidos"}
            </p>
          </div>
        </div>

        {/* Filtros */}
        <div className="d-flex gap-2 mb-4 flex-wrap">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setFilter(t.key)}
              className={`btn btn-sm rounded-pill fw-semibold ${
                filter === t.key ? "btn-primary" : "btn-outline-secondary"
              }`}
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
              deliveries={deliveries}
            />
          ))
        )}
      </main>

      <Footer />
    </div>
  );
}