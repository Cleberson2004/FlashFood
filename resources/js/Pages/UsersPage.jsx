import { useState, useEffect } from "react";
import { router, usePage } from "@inertiajs/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTrash,
  faPen,
  faCheck,
  faCheckCircle,
  faUser,
  faShieldHalved,
  faBriefcase,
  faToggleOn,
  faClone,
} from "@fortawesome/free-solid-svg-icons";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import Toast from "../Components/Toast";

// ── Role helpers ────────────────────────────────────────────────────────────
const ROLES = [
  { value: "admin",    label: "Admin",    icon: faShieldHalved, color: "danger"  },
  { value: "gerente",  label: "Gerente",  icon: faBriefcase,    color: "warning" },
  { value: "usuario",  label: "Usuário",  icon: faUser,         color: "secondary"},
];
const roleInfo = (value) => ROLES.find((r) => r.value === value) ?? ROLES[2];

// ── Delete Modal ─────────────────────────────────────────────────────────────
function DeleteUserModal({ user, onConfirm, onCancel }) {
  return (
    <div className="modal d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,.45)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content rounded-4 shadow">
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title fw-bold">Excluir usuário</h5>
            <button className="btn-close" onClick={onCancel} />
          </div>
          <div className="modal-body pt-2">
            <p className="text-muted mb-0">
              Tem certeza que deseja excluir <strong>{user.name}</strong>? Esta ação não pode ser desfeita.
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

// ── Edit / Create Modal ──────────────────────────────────────────────────────
function UserModal({ user, onClose }) {
  const isEdit = !!user;
  const [form, setForm] = useState({
    name:      user?.name      ?? "",
    email:     user?.email     ?? "",
    password:  "",
    user_role: user?.user_role ?? "usuario",
  });
  const [errors, setErrors] = useState({});

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.name.trim())  e.name  = "Nome obrigatório.";
    if (!form.email.trim()) e.email = "E-mail obrigatório.";
    if (!isEdit && !form.password.trim()) e.password = "Senha obrigatória.";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    const payload = { ...form };
    if (isEdit && !payload.password) delete payload.password;

    if (isEdit) {
      router.put(`/createUser/${user.id}`, payload, { preserveScroll: true, onSuccess: onClose });
    } else {
      router.post("/createUser", payload, { preserveScroll: true, onSuccess: onClose });
    }
  };

  
  return (
    <div className="modal d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,.45)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content rounded-4 shadow">
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title fw-bold">{isEdit ? "Editar usuário" : "Novo usuário"}</h5>
            <button className="btn-close" onClick={onClose} />
          </div>

          <div className="modal-body">
            {/* Name */}
            <div className="mb-3">
              <label className="form-label fw-semibold small">Nome</label>
              <input
                className={`form-control rounded-3 ${errors.name ? "is-invalid" : ""}`}
                value={form.name}
                onChange={set("name")}
                placeholder="Nome completo"
              />
              {errors.name && <div className="invalid-feedback">{errors.name}</div>}
            </div>

            {/* Email */}
            <div className="mb-3">
              <label className="form-label fw-semibold small">E-mail</label>
              <input
                type="email"
                className={`form-control rounded-3 ${errors.email ? "is-invalid" : ""}`}
                value={form.email}
                onChange={set("email")}
                placeholder="email@exemplo.com"
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>

            {/* Password */}
            <div className="mb-3">
              <label className="form-label fw-semibold small">
                Senha {isEdit && <span className="text-muted fw-normal">(deixe em branco para manter)</span>}
              </label>
              <input
                type="password"
                className={`form-control rounded-3 ${errors.password ? "is-invalid" : ""}`}
                value={form.password}
                onChange={set("password")}
                placeholder={isEdit ? "••••••••" : "Senha"}
              />
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            </div>

            {/* Role */}
            <div className="mb-1">
              <label className="form-label fw-semibold small">Função</label>
              <select
                className="form-select rounded-3"
                value={form.user_role}
                onChange={set("user_role")}
              >
                {ROLES.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
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

// ── User Card ────────────────────────────────────────────────────────────────
function UserCard({ user, onEdit, onDelete }) {
  const role = roleInfo(user.user_role);
  return (
    <div className="card h-100 shadow-sm border">
      <div className="card-body">
        {/* Avatar + name */}
        <div className="d-flex align-items-center gap-3 mb-3">
          <div
            className={`rounded-circle d-flex align-items-center justify-content-center text-white bg-${role.color}`}
            style={{ width: 42, height: 42, flexShrink: 0, fontSize: "1rem" }}
          >
            <FontAwesomeIcon icon={role.icon} />
          </div>
          <div className="overflow-hidden">
            <h6 className="card-title fw-semibold mb-0 text-truncate">{user.name}</h6>
            <p className="text-muted small mb-0 text-truncate">{user.email}</p>
          </div>
        </div>

        {/* Role badge */}
        <span className={`badge bg-${role.color} bg-opacity-10 text-${role.color} border border-${role.color} border-opacity-25 rounded-pill`}>
          <FontAwesomeIcon icon={role.icon} className="me-1" />
          {role.label}
        </span>

        {/* Date */}
        <p className="card-text text-muted small mt-2 mb-0">
          Cadastrado em{" "}
          {new Date(user.created_at).toLocaleDateString("pt-BR", {
            year: "numeric", month: "2-digit", day: "2-digit",
          })}
        </p>
      </div>

      <div className="card-footer bg-white border-top d-flex justify-content-end gap-2">

         <button className="btn btn-outline-warning btn-sm rounded-3" title="Excluir" onClick={null}>
          <FontAwesomeIcon icon={faUser} className="me-1" />Personificar
        </button>

        <button className="btn btn-outline-secondary btn-sm rounded-3" title="Editar" onClick={onEdit}>
          <FontAwesomeIcon icon={faPen} className="me-1" />Editar
        </button>
        <button className="btn btn-outline-danger btn-sm rounded-3" title="Excluir" onClick={onDelete}>
          <FontAwesomeIcon icon={faTrash} className="me-1" />Excluir
        </button>
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function UsersPage({ users = [] }) {
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
        router.delete(`/deleteUser/${deleteTarget.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteTarget(null);
                showToast("Usuário excluído com sucesso.", <FontAwesomeIcon icon={faTrash} />);
            },
        });
    };

  const openEdit = (user) => { setEditTarget(user); setShowModal(true); };
  const openCreate = () => { setEditTarget(null); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditTarget(null); };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Header user={auth?.user} />

      <main className="container py-4 flex-grow-1">
        {/* Header row */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="h3 fw-bold mb-1">Usuários</h1>
            <p className="text-muted small mb-0">
              {users.length} {users.length === 1 ? "usuário cadastrado" : "usuários cadastrados"}
            </p>
          </div>
          <button className="btn btn-primary mt-2 rounded-3" onClick={openCreate}>
            <FontAwesomeIcon icon={faPlus} className="me-1" /> Criar Usuário
          </button>
        </div>

        {/* Empty state */}
        {users.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <div style={{ fontSize: "2.5rem", opacity: 0.4 }} className="mb-3">👤</div>
            <h5 className="fw-semibold text-dark">Nenhum usuário ainda</h5>
            <p className="small">Crie o primeiro usuário para começar</p>
            <button className="btn btn-primary rounded-3" onClick={openCreate}>
              <FontAwesomeIcon icon={faPlus} /> Novo Usuário
            </button>
          </div>
        ) : (
          <div className="row g-3">
            {users.map((user) => (
              <div className="col-sm-6 col-lg-4" key={user.id}>
                <UserCard
                  user={user}
                  onEdit={() => openEdit(user)}
                  onDelete={() => setDeleteTarget(user)}
                />
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />

      {deleteTarget && (
        <DeleteUserModal
          user={deleteTarget}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {showModal && <UserModal user={editTarget} onClose={closeModal} />}

      {toast && <Toast message={toast.message} icon={toast.icon} />}
    </div>
  );
}