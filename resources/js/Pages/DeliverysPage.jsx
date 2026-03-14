import { useState, useEffect } from "react";
import { router, usePage } from "@inertiajs/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTrash,
  faPen,
  faCheck,
  faCheckCircle,
  faMotorcycle,
} from "@fortawesome/free-solid-svg-icons";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import Toast from "../Components/Toast";

// ── Delete Modal ──────────────────────────────────────────────────────────────
function DeleteDeliveryModal({ delivery, onConfirm, onCancel }) {
  return (
    <div className="modal d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,.45)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content rounded-4 shadow">
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title fw-bold">Excluir entregador</h5>
            <button className="btn-close" onClick={onCancel} />
          </div>
          <div className="modal-body pt-2">
            <p className="text-muted mb-0">
              Tem certeza que deseja excluir <strong>{delivery.name}</strong>? Esta ação não pode ser desfeita.
            </p>
          </div>
          <div className="modal-footer border-0 pt-0">
            <button className="btn btn-outline-secondary rounded-3" onClick={onCancel}>Cancelar</button>
            <button className="btn btn-danger rounded-3" onClick={onConfirm}>
              <FontAwesomeIcon icon={faTrash} className="me-1" /> Excluir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Create / Edit Modal ───────────────────────────────────────────────────────
function DeliveryModal({ delivery, onClose }) {
  const isEdit = !!delivery;
  const [form, setForm] = useState({ name: delivery?.name ?? "" });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Nome do entregador é obrigatório.";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    if (isEdit) {
      router.put(`/createDelivery/${delivery.id}`, form, { preserveScroll: true, onSuccess: onClose });
    } else {
      router.post("/createDelivery", form, { preserveScroll: true, onSuccess: onClose });
    }
  };

  return (
    <div className="modal d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,.45)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content rounded-4 shadow">
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title fw-bold">
              {isEdit ? "Editar entregador" : "Novo entregador"}
            </h5>
            <button className="btn-close" onClick={onClose} />
          </div>
          <div className="modal-body">
            <div className="mb-1">
              <label className="form-label fw-semibold small">Nome</label>
              <input
                className={`form-control rounded-3 ${errors.name ? "is-invalid" : ""}`}
                value={form.name}
                onChange={(e) => setForm({ name: e.target.value })}
                placeholder="Nome do entregador"
                autoFocus
              />
              {errors.name && <div className="invalid-feedback">{errors.name}</div>}
            </div>
          </div>
          <div className="modal-footer border-0 pt-0">
            <button className="btn btn-outline-secondary rounded-3" onClick={onClose}>Cancelar</button>
            <button className="btn btn-primary rounded-3" onClick={handleSubmit}>
              <FontAwesomeIcon icon={faCheck} className="me-1" />
              {isEdit ? "Salvar" : "Criar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Delivery Card ─────────────────────────────────────────────────────────────
function DeliveryCard({ delivery, onEdit, onDelete }) {
  const PALETTE = [
    { bg: "#e8f0fe", color: "#0d6efd", border: "#bad4ff" },
    { bg: "#fff3cd", color: "#b45309", border: "#fde68a" },
    { bg: "#d1fae5", color: "#065f46", border: "#6ee7b7" },
    { bg: "#fce7f3", color: "#9d174d", border: "#f9a8d4" },
    { bg: "#ede9fe", color: "#5b21b6", border: "#c4b5fd" },
    { bg: "#ffedd5", color: "#9a3412", border: "#fdba74" },
  ];
  const palette = PALETTE[delivery.id % PALETTE.length];

  return (
    <div className="card h-100 shadow-sm border">
      <div className="card-body">
        <div className="d-flex align-items-center gap-3">
          <div
            className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
            style={{
              width: 46, height: 46,
              background: palette.bg,
              border: `1.5px solid ${palette.border}`,
              color: palette.color,
              fontSize: "1.1rem",
            }}
          >
            <FontAwesomeIcon icon={faMotorcycle} />
          </div>
          <div className="overflow-hidden">
            <h6 className="card-title fw-semibold mb-0 text-truncate">{delivery.name}</h6>
          </div>
        </div>

        <p className="card-text text-muted small mt-3 mb-0">
          Cadastrado em{" "}
          {new Date(delivery.created_at).toLocaleDateString("pt-BR", {
            year: "numeric", month: "2-digit", day: "2-digit",
          })}
        </p>
      </div>

      <div className="card-footer bg-white border-top d-flex justify-content-end gap-2">
        <button className="btn btn-outline-secondary btn-sm rounded-3" onClick={onEdit}>
          <FontAwesomeIcon icon={faPen} className="me-1" />Editar
        </button>
        <button className="btn btn-outline-danger btn-sm rounded-3" onClick={onDelete}>
          <FontAwesomeIcon icon={faTrash} className="me-1" />Excluir
        </button>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function DeliverysPage({ deliveries = [] }) {
  const { auth, flash } = usePage().props;

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showModal,    setShowModal]    = useState(false);
  const [editTarget,   setEditTarget]   = useState(null);
  const [toast,        setToast]        = useState(null);

  useEffect(() => {
    if (flash?.success) showToast(flash.success, <FontAwesomeIcon icon={faCheckCircle} color="green" />);
  }, [flash?.success]);

  const showToast = (message, icon = <FontAwesomeIcon icon={faCheck} />) => {
    setToast({ message, icon });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDeleteConfirm = () => {
    router.delete(`/deleteDelivery/${deleteTarget.id}`, {
      preserveScroll: true,
      onSuccess: () => {
        setDeleteTarget(null);
        showToast("Entregador excluído com sucesso.", <FontAwesomeIcon icon={faTrash} />);
      },
    });
  };

  const openEdit   = (d) => { setEditTarget(d); setShowModal(true); };
  const openCreate = ()  => { setEditTarget(null); setShowModal(true); };
  const closeModal = ()  => { setShowModal(false); setEditTarget(null); };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Header user={auth?.user} />

      <main className="container py-4 flex-grow-1">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="h3 fw-bold mb-1">Entregadores</h1>
            <p className="text-muted small mb-0">
              {deliveries.length} {deliveries.length === 1 ? "entregador cadastrado" : "entregadores cadastrados"}
            </p>
          </div>
          <button className="btn btn-primary mt-2 rounded-3" onClick={openCreate}>
            <FontAwesomeIcon icon={faPlus} className="me-1" /> Novo Entregador
          </button>
        </div>

        {deliveries.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <div style={{ fontSize: "2.5rem", opacity: 0.4 }} className="mb-3">🏍️</div>
            <h5 className="fw-semibold text-dark">Nenhum entregador ainda</h5>
            <p className="small">Cadastre o primeiro entregador para começar</p>
            <button className="btn btn-primary rounded-3" onClick={openCreate}>
              <FontAwesomeIcon icon={faPlus} className="me-1" /> Novo Entregador
            </button>
          </div>
        ) : (
          <div className="row g-3">
            {deliveries.map((delivery) => (
              <div className="col-sm-6 col-lg-4" key={delivery.id}>
                <DeliveryCard
                  delivery={delivery}
                  onEdit={() => openEdit(delivery)}
                  onDelete={() => setDeleteTarget(delivery)}
                />
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />

      {deleteTarget && (
        <DeleteDeliveryModal
          delivery={deleteTarget}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {showModal && <DeliveryModal delivery={editTarget} onClose={closeModal} />}

      {toast && <Toast message={toast.message} icon={toast.icon} />}
    </div>
  );
}