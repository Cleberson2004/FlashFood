// resources/js/Components/DeleteModal.jsx
import { useState } from "react";

export default function DeleteModal({ item, onConfirm, onCancel }) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = () => {
    setLoading(true);
    onConfirm(item);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="modal-backdrop fade show"
        onClick={onCancel}
        style={{ zIndex: 1040 }}
      />

      {/* Modal */}
      <div
        className="modal fade show d-block"
        role="dialog"
        aria-modal="true"
        style={{ zIndex: 1050 }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content shadow">

            <div className="modal-header border-bottom">
              <div className="d-flex align-items-center gap-3">
                <div
                  className="rounded d-flex align-items-center justify-content-center bg-danger bg-opacity-10"
                  style={{ width: 44, height: 44, fontSize: "1.2rem" }}
                >
                  🗑️
                </div>
                <div>
                  <h5 className="modal-title mb-0">Excluir Item</h5>
                  <small className="text-muted">Esta ação não pode ser desfeita.</small>
                </div>
              </div>
              <button className="btn-close" onClick={onCancel} disabled={loading} />
            </div>

            <div className="modal-body">
              {/* Preview */}
              <div className="bg-light border rounded p-3 mb-3">
                <div className="fw-semibold">{item.title}</div>
                {item.description && (
                  <div className="text-muted small mt-1">
                    {item.description.slice(0, 80)}{item.description.length > 80 ? "…" : ""}
                  </div>
                )}
              </div>

              <p className="text-muted small mb-0">
                Tem certeza que deseja excluir{""}
                <strong className="text-danger">"{item.name}"</strong>?{" "}
                Todos os dados associados serão perdidos.
              </p>
            </div>

            <div className="modal-footer border-top bg-light">
              <button className="btn btn-secondary" onClick={onCancel} disabled={loading}>
                Cancelar
              </button>
              <button className="btn btn-danger" onClick={handleConfirm} disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Excluindo…
                  </>
                ) : "Sim, excluir"}
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}