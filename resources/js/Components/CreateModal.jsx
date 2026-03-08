import { useForm } from "@inertiajs/react";

export default function CreateModal({ item, onClose }) {
  const isEdit = !!item;
  const MAX_DESC = 300;

  const { data, setData, post, put, processing, errors } = useForm({
    product_id: item?.product_id ?? null,
    name: item?.name ?? "",
    description: item?.description ?? "",
    price: item?.price ?? "",
  });

  function handleSubmit(e) {
    e.preventDefault();
    if (isEdit) {
      put(`/createProduct/${item.product_id}`, { onSuccess: onClose });
    } else {
      post("/createProduct", { onSuccess: onClose });
    }
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1050,
        background: "rgba(0,0,0,.45)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "1rem",
      }}
    >
      <div
        className="card shadow-lg border-0"
        style={{ width: "100%", maxWidth: 520, borderRadius: 16, overflow: "hidden" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="card-header bg-white border-bottom py-3 px-4 d-flex justify-content-between align-items-center">
          <div>
            <h5 className="mb-1 fw-bold">{isEdit ? "Editar Item" : "Criar Novo Item"}</h5>
            <p className="text-muted small mb-0">
              {isEdit ? "Modifique as informações abaixo" : "Preencha as informações do novo item"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-sm text-muted"
            style={{ background: "#f0f0f0", borderRadius: "50%", width: 32, height: 32, padding: 0, border: "none" }}
          >✕</button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit}>
          <div className="card-body p-4 d-flex flex-column gap-3">

            <div>
              <label className="form-label fw-semibold">
                Título <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className={`form-control ${errors.name ? "is-invalid" : ""}`}
                placeholder="Digite um título descritivo..."
                value={data.name}
                maxLength={80}
                onChange={e => setData("name", e.target.value)}
              />
              {errors.name && <div className="invalid-feedback">{errors.name}</div>}
            </div>

            <div>
              <label className="form-label fw-semibold">Descrição</label>
              <textarea
                className={`form-control ${errors.description ? "is-invalid" : ""}`}
                placeholder="Descreva o item com detalhes relevantes..."
                value={data.description}
                rows={4}
                onChange={e => setData("description", e.target.value)}
              />
              {errors.description ? (
                <div className="invalid-feedback">{errors.description}</div>
              ) : (
                <div className={`form-text text-end ${data.description.length > MAX_DESC * 0.9 ? "text-danger" : "text-muted"}`}>
                  {data.description.length}/{MAX_DESC}
                </div>
              )}
            </div>

            <div>
              <label className="form-label fw-semibold">Preço</label>
              <input
                type="number"
                className={`form-control ${errors.price ? "is-invalid" : ""}`}
                placeholder="0,00"
                value={data.price}
                min="0"
                step="0.01"
                onChange={e => setData("price", e.target.value)}
              />
              {errors.price && <div className="invalid-feedback">{errors.price}</div>}
            </div>

          </div>

          <div className="card-footer bg-light border-top d-flex justify-content-end gap-2 py-3 px-4">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={processing}>
              {processing ? (
                <><span className="spinner-border spinner-border-sm me-2" />Salvando…</>
              ) : isEdit ? "Salvar Alterações" : "Criar Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}