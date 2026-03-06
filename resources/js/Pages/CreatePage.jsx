// resources/js/Pages/CreatePage.jsx
import { useForm, usePage, Link } from "@inertiajs/react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

export default function CreatePage({ item }) {
  const { auth } = usePage().props;
  const isEdit = !!item;
  const MAX_DESC = 300;

const { data, setData, post, put, processing, errors } = useForm({
  product_id: item?.id ?? null,
  name: item?.name ?? "",
  description: item?.description ?? "",
  price: item?.price ?? "",
});

function handleSubmit(e) {
    e.preventDefault();
    post("/createProduct");
}

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Header user={auth?.user} />

      <main className="container py-4 flex-grow-1">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="" className="text-decoration-none">Itens</a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {isEdit ? "Editar Item" : "Novo Item"}
            </li>
          </ol>
        </nav>

        {/* Card do formulário */}
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <div className="card shadow-sm border">

              {/* Cabeçalho */}
              <div className="card-header bg-white border-bottom py-3 px-4">
                <h5 className="mb-1 fw-bold">
                  {isEdit ? "Editar Item" : "Criar Novo Item"}
                </h5>
                <p className="text-muted small mb-0">
                  {isEdit
                    ? "Modifique as informações do item abaixo"
                    : "Preencha as informações para criar um novo item"}
                </p>
              </div>

              {/* Formulário */}
              <form onSubmit={handleSubmit}>
                <div className="card-body p-4 d-flex flex-column gap-3">

                  {/* Título */}
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
                      onChange={(e) => setData("name", e.target.value)}
                    />
                    {errors.name && (
                      <div className="invalid-feedback">{errors.name}</div>
                    )}
                  </div>

                  {/* Descrição */}
                  <div>
                    <label className="form-label fw-semibold">Descrição</label>
                    <textarea
                      className={`form-control ${errors.description ? "is-invalid" : ""}`}
                      placeholder="Descreva o item com detalhes relevantes..."
                      value={data.description}
                      rows={5}
                      onChange={(e) => setData("description", e.target.value)}
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
                    <textarea
                      className={`form-control ${errors.price ? "is-invalid" : ""}`}
                      placeholder="Informe o preço do produto..."
                      value={data.price}
                      rows={5}
                      min="0"
                      step="0.01"
                      onChange={(e) => setData("price", e.target.value)}
                    />
                    {errors.name && (
                      <div className="invalid-feedback">{errors.price}</div>
                    )}
                  </div>

                </div>
                

                {/* Rodapé */}
                <div className="card-footer bg-light border-top d-flex justify-content-end gap-2 py-3 px-4">
                  <Link href="/" className="btn btn-secondary">
                    Cancelar
                  </Link>
                  <button type="submit" className="btn btn-primary" disabled={processing}>
                    {processing ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Salvando…
                      </>
                    ) : isEdit ? "Salvar Alterações" : "Criar Item"}
                  </button>
                </div>
              </form>

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}