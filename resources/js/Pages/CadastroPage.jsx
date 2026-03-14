import { useState, useEffect } from "react";
import { usePage, useForm } from "@inertiajs/react";

export default function CadastroPage() {
  const { data, setData, post, processing, errors } = useForm({
    name: "",
    email: "",
    password: "",
    password_confirmation: "", 
  });

  const { flash } = usePage().props;
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (flash?.success) showToast(flash.success, "✅");
  }, [flash?.success]);

  const showToast = (message, icon = "✅") => {
    setToast({ message, icon });
    setTimeout(() => setToast(null), 3000);
  };

  function handleSubmit(e) {
    e.preventDefault();
    post("/cadastroSubmit"); 
  }

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ width: "100%", maxWidth: "420px" }}>
        <div className="mb-4">
          <small className="text-primary text-uppercase fw-semibold">Criar nova Conta</small>
          <h1 className="h3 fw-bold mt-1">Preencha os dados</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Nome</label>
            <input
              type="text"
              value={data.name} 
              className="form-control"
              onChange={(e) => setData("name", e.target.value)}
              placeholder="João da Silva"
            />
            {errors.name && <div className="text-danger">{errors.name}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">E-mail</label>
            <input
              type="email"
              value={data.email} 
              className="form-control"
              onChange={(e) => setData("email", e.target.value)}
              placeholder="voce@exemplo.com"
            />
            {errors.email && <div className="text-danger">{errors.email}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Senha</label>
            <input
              type="password"
              value={data.password} 
              className="form-control"
              onChange={(e) => setData("password", e.target.value)}
              placeholder="••••••••"
              name="password"
            />
            {errors.password && <div className="text-danger">{errors.password}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Confirmar Senha</label>
            <input
              type="password"
              value={data.password_confirmation} 
              className="form-control"
              onChange={(e) => setData("password_confirmation", e.target.value)}
              placeholder="••••••••"
              name="password_confirmation"
            />
            {errors.password_confirmation && (
              <div className="text-danger">{errors.password_confirmation}</div>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={processing}
          >
            {processing ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>
      </div>
    </div>
  );
}