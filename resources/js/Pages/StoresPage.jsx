import { useState, useEffect } from "react";
import { router, usePage } from "@inertiajs/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTrash,
  faPen,
  faCheck,
  faCheckCircle,
  faStore,
  faUsers,
  faBoxOpen,
} from "@fortawesome/free-solid-svg-icons";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import Toast from "../Components/Toast";

// ── Delete Modal ─────────────────────────────────────────────────────────────
function DeleteStoreModal({ store, onConfirm, onCancel }) {
  return (
    <div className="modal d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,.45)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content rounded-4 shadow">
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title fw-bold">Excluir loja</h5>
            <button className="btn-close" onClick={onCancel} />
          </div>
          <div className="modal-body pt-2">
            <p className="text-muted mb-0">
              Tem certeza que deseja excluir a loja <strong>{store.name}</strong>?
              Os usuários e itens vinculados perderão a associação com ela.
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
function StoreModal({ store, onClose }) {
  const isEdit = !!store;
  const [form, setForm] = useState({ name: store?.name ?? "" });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Nome da loja é obrigatório.";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    if (isEdit) {
      router.put(`/createStore/${store.id}`, form, { preserveScroll: true, onSuccess: onClose });
    } else {
      router.post("/createStore", form, { preserveScroll: true, onSuccess: onClose });
    }
  };

  return (
    <div className="modal d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,.45)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content rounded-4 shadow">
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title fw-bold">
              {isEdit ? "Editar loja" : "Nova loja"}
            </h5>
            <button className="btn-close" onClick={onClose} />
          </div>
          <div className="modal-body">
            <div className="mb-1">
              <label className="form-label fw-semibold small">Nome da Loja</label>
              <input
                className={`form-control rounded-3 ${errors.name ? "is-invalid" : ""}`}
                value={form.name}
                onChange={(e) => setForm({ name: e.target.value })}
                placeholder="Ex: Loja Centro"
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

// ── Users Modal ───────────────────────────────────────────────────────────────
function StoreUsersModal({ store, users, onClose }) {
  const [checked, setChecked] = useState(
    () => new Set(users.filter((u) => u.store_id === store.id).map((u) => u.id))
  );
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);

  const toggle = (id) =>
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = () => {
    setSaving(true);
    router.post(
      `/stores/${store.id}/users`,
      { user_ids: [...checked] },
      {
        preserveScroll: true,
        onSuccess: () => { setSaving(false); onClose(); },
        onError: () => setSaving(false),
      }
    );
  };

  const linkedCount = checked.size;

  return (
    <div className="modal d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,.45)" }}>
      <div className="modal-dialog modal-dialog-centered modal-md">
        <div className="modal-content rounded-4 shadow">
          <div className="modal-header border-0 pb-0">
            <div>
              <h5 className="modal-title fw-bold mb-0">Usuários — {store.name}</h5>
              <p className="text-muted small mb-0 mt-1">
                {linkedCount} {linkedCount === 1 ? "usuário vinculado" : "usuários vinculados"}
              </p>
            </div>
            <button className="btn-close" onClick={onClose} />
          </div>

          <div className="modal-body pb-0">
            <input
              className="form-control rounded-3 mb-3"
              placeholder="Buscar por nome ou e-mail..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <div style={{ maxHeight: 320, overflowY: "auto" }} className="d-flex flex-column gap-2 pe-1">
              {filtered.length === 0 && (
                <p className="text-center text-muted small py-3 mb-0">Nenhum usuário encontrado.</p>
              )}
              {filtered.map((user) => {
                const isChecked = checked.has(user.id);
                const isOtherStore = user.store_id && user.store_id !== store.id;
                return (
                  <label
                    key={user.id}
                    className="d-flex align-items-center gap-3 p-2 rounded-3 mb-0"
                    style={{
                      cursor: "pointer",
                      background: isChecked ? "#e8f0fe" : "#f8fafc",
                      border: `1.5px solid ${isChecked ? "#bad4ff" : "#e2e8f0"}`,
                      transition: "background 0.15s, border-color 0.15s",
                    }}
                  >
                    <input
                      type="checkbox"
                      className="form-check-input m-0 flex-shrink-0"
                      checked={isChecked}
                      onChange={() => toggle(user.id)}
                      style={{ width: 18, height: 18 }}
                    />
                    <div
                      className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                      style={{ width: 34, height: 34, fontSize: "0.8rem" }}
                    >
                      {user.name?.[0]?.toUpperCase()}
                    </div>
                    <div className="overflow-hidden flex-grow-1">
                      <p className="mb-0 fw-semibold small text-truncate">{user.name}</p>
                      <p className="mb-0 text-muted" style={{ fontSize: "0.78rem" }}>{user.email}</p>
                    </div>
                    {isOtherStore && (
                      <span className="badge bg-warning text-dark flex-shrink-0" style={{ fontSize: "0.7rem" }}>
                        Outra loja
                      </span>
                    )}
                  </label>
                );
              })}
            </div>
          </div>

          <div className="modal-footer border-0 pt-3">
            <button className="btn btn-outline-secondary rounded-3" onClick={onClose}>Cancelar</button>
            <button className="btn btn-primary rounded-3" onClick={handleSave} disabled={saving}>
              <FontAwesomeIcon icon={faCheck} className="me-1" />
              {saving ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Store Card ────────────────────────────────────────────────────────────────
function StoreCard({ store, onEdit, onDelete, onManageUsers }) {
  const PALETTE = [
    { bg: "#e8f0fe", color: "#0d6efd", border: "#bad4ff" },
    { bg: "#fff3cd", color: "#b45309", border: "#fde68a" },
    { bg: "#d1fae5", color: "#065f46", border: "#6ee7b7" },
    { bg: "#fce7f3", color: "#9d174d", border: "#f9a8d4" },
    { bg: "#ede9fe", color: "#5b21b6", border: "#c4b5fd" },
    { bg: "#ffedd5", color: "#9a3412", border: "#fdba74" },
  ];
  const palette = PALETTE[store.id % PALETTE.length];

  return (
    <div className="card h-100 shadow-sm border">
      <div className="card-body">
        <div className="d-flex align-items-center gap-3 mb-3">
          <div
            className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
            style={{
              width: 46, height: 46,
              background: palette.bg,
              border: `1.5px solid ${palette.border}`,
              color: palette.color,
              fontSize: "1.15rem",
            }}
          >
            <FontAwesomeIcon icon={faStore} />
          </div>
          <div className="overflow-hidden">
            <h6 className="card-title fw-semibold mb-0 text-truncate">{store.name}</h6>
            <p className="text-muted small mb-0">#{String(store.id).padStart(3, "0")}</p>
          </div>
        </div>

        <div className="d-flex gap-3">
          <div className="d-flex align-items-center gap-1 text-muted small">
            <FontAwesomeIcon icon={faUsers} style={{ fontSize: "0.75rem" }} />
            <span>{store.users_count ?? 0} {store.users_count === 1 ? "usuário" : "usuários"}</span>
          </div>
          <div className="d-flex align-items-center gap-1 text-muted small">
            <FontAwesomeIcon icon={faBoxOpen} style={{ fontSize: "0.75rem" }} />
            <span>{store.products_count ?? 0} {store.products_count === 1 ? "item" : "itens"}</span>
          </div>
        </div>

        <p className="card-text text-muted small mt-2 mb-0">
          Criada em{" "}
          {new Date(store.created_at).toLocaleDateString("pt-BR", {
            year: "numeric", month: "2-digit", day: "2-digit",
          })}
        </p>
      </div>

      <div className="card-footer bg-white border-top d-flex justify-content-end gap-2 flex-wrap">
        <button className="btn btn-outline-primary btn-sm rounded-3" onClick={onManageUsers}>
          <FontAwesomeIcon icon={faUsers} className="me-1" />Usuários
        </button>
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

// ── Main Page ────────────────────────────────────────────────────────────────
export default function LojasPage({ stores = [], users = [] }) {
  const { auth, flash } = usePage().props;

  const [deleteTarget,    setDeleteTarget]    = useState(null);
  const [showModal,       setShowModal]       = useState(false);
  const [editTarget,      setEditTarget]      = useState(null);
  const [usersModalStore, setUsersModalStore] = useState(null);
  const [toast,           setToast]           = useState(null);

  useEffect(() => {
    if (flash?.success) showToast(flash.success, <FontAwesomeIcon icon={faCheckCircle} color="green" />);
  }, [flash?.success]);

  const showToast = (message, icon = <FontAwesomeIcon icon={faCheck} />) => {
    setToast({ message, icon });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDeleteConfirm = () => {
    router.delete(`/stores/${deleteTarget.id}`, {
      preserveScroll: true,
      onSuccess: () => {
        setDeleteTarget(null);
        showToast("Loja excluída com sucesso.", <FontAwesomeIcon icon={faTrash} />);
      },
    });
  };

  const openEdit        = (store) => { setEditTarget(store); setShowModal(true); };
  const openCreate      = ()      => { setEditTarget(null);  setShowModal(true); };
  const closeModal      = ()      => { setShowModal(false);  setEditTarget(null); };
  const openUsersModal  = (store) => setUsersModalStore(store);
  const closeUsersModal = ()      => setUsersModalStore(null);

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Header user={auth?.user} />

      <main className="container py-4 flex-grow-1">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="h3 fw-bold mb-1">Lojas</h1>
            <p className="text-muted small mb-0">
              {stores.length} {stores.length === 1 ? "loja cadastrada" : "lojas cadastradas"}
            </p>
          </div>
          <button className="btn btn-primary mt-2 rounded-3" onClick={openCreate}>
            <FontAwesomeIcon icon={faPlus} className="me-1" /> Nova Loja
          </button>
        </div>

        {stores.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <div style={{ fontSize: "2.5rem", opacity: 0.4 }} className="mb-3">🏪</div>
            <h5 className="fw-semibold text-dark">Nenhuma loja ainda</h5>
            <p className="small">Crie a primeira loja para começar</p>
            <button className="btn btn-primary rounded-3" onClick={openCreate}>
              <FontAwesomeIcon icon={faPlus} className="me-1" /> Nova Loja
            </button>
          </div>
        ) : (
          <div className="row g-3">
            {stores.map((store) => (
              <div className="col-sm-6 col-lg-4" key={store.id}>
                <StoreCard
                  store={store}
                  onEdit={() => openEdit(store)}
                  onDelete={() => setDeleteTarget(store)}
                  onManageUsers={() => openUsersModal(store)}
                />
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />

      {deleteTarget && (
        <DeleteStoreModal
          store={deleteTarget}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {showModal && <StoreModal store={editTarget} onClose={closeModal} />}

      {usersModalStore && (
        <StoreUsersModal
          store={usersModalStore}
          users={users}
          onClose={closeUsersModal}
        />
      )}

      {toast && <Toast message={toast.message} icon={toast.icon} />}
    </div>
  );
}