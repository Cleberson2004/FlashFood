import { useState, useEffect } from "react"; 
import { router, usePage } from "@inertiajs/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faPen, faCheck, faCheckCircle, faImage } from "@fortawesome/free-solid-svg-icons";
import CreateModal from "../Components/CreateModal";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import DeleteModal from "../Components/DeleteModal";
import Toast from "../Components/Toast";

export default function MainPage({ items = [] }) {
  const { auth, flash } = usePage().props;

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showCreate,   setShowCreate]   = useState(false);
  const [editTarget,   setEditTarget]   = useState(null);
  const [toast,        setToast]        = useState(null);

  useEffect(() => {
    if (flash?.success) {
      showToast(flash.success, <FontAwesomeIcon icon={faCheckCircle} color="green" />);
    }
  }, [flash?.success]);

  const showToast = (message, icon = <FontAwesomeIcon icon={faCheck} />) => {
    setToast({ message, icon });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDeleteConfirm = (item) => {
    router.delete(`/deleteProduct/${item.product_id}`, {
      preserveScroll: true,
      onSuccess: () => {
        setDeleteTarget(null);
        showToast("Item excluído com sucesso.", <FontAwesomeIcon icon={faTrash} />);
      },
    });
  };

  const handleEdit = (item) => {
    setEditTarget(item);
    setShowCreate(true);
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Header user={auth?.user} />

      <main className="container py-4 flex-grow-1">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="h3 fw-bold mb-1">Seus Itens</h1>
            <p className="text-muted small mb-0">
              {items.length} {items.length === 1 ? "item cadastrado" : "itens cadastrados"}
            </p>
          </div>
          <button
            className="btn btn-primary mt-2 rounded-3"
            onClick={() => { setEditTarget(null); setShowCreate(true); }}
          >
            Criar Item
          </button>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <div style={{ fontSize: "2.5rem", opacity: 0.4 }} className="mb-3">📭</div>
            <h5 className="fw-semibold text-dark">Nenhum item ainda</h5>
            <p className="small">Crie seu primeiro item para começar</p>
            <button
              className="btn btn-primary rounded-3"
              onClick={() => { setEditTarget(null); setShowCreate(true); }}
            >
              <FontAwesomeIcon icon={faPlus} /> Novo Item
            </button>
          </div>
        ) : (
          <div className="row g-3">
            {items.map((item) => (
              <div className="col-sm-6 col-lg-4" key={item.product_code}>
                <ItemCard
                  item={item}
                  onEdit={() => handleEdit(item)}
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
          onConfirm={() => handleDeleteConfirm(deleteTarget)}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {toast && <Toast message={toast.message} icon={toast.icon} />}

      {showCreate && (
        <CreateModal
          item={editTarget}
          onClose={() => { setShowCreate(false); setEditTarget(null); }}
        />
      )}
    </div>
  );
}

function ItemCard({ item, onEdit, onDelete }) {
  const imageUrl = item.product_image
    ? `/storage/${item.product_image}`
    : null;

  return (
    <div className="card h-100 shadow-sm border" style={{ overflow: "hidden" }}>
      {/* Imagem */}
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={item.name}
          style={{ width: "100%", height: 180, objectFit: "cover" }}
        />
      ) : (
        <div
          className="d-flex align-items-center justify-content-center bg-light text-muted"
          style={{ height: 180, fontSize: "2rem" }}
        >
          <FontAwesomeIcon icon={faImage} style={{ opacity: 0.3 }} />
        </div>
      )}

      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h6 className="card-title fw-semibold mb-0">{item.name}</h6>
          <span className="badge bg-secondary text-white">
            #{String(item.product_code).padStart(3, "0")}
          </span>
        </div>

        <p className="card-text text-muted small">
          {item.description || <em>Sem descrição</em>}
        </p>

        <p className="card-text text-muted small">
          {new Date(item.created_at).toLocaleDateString("pt-BR", {
            year: "numeric", month: "2-digit", day: "2-digit",
            hour: "2-digit", minute: "2-digit",
          })}
        </p>

        {item.price && (
          <span className="fw-semibold text-success">
            R$ {Number(item.price).toFixed(2)}
          </span>
        )}
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