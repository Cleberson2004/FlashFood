// resources/js/Components/Header.jsx
import { Link, usePage, router } from "@inertiajs/react";

export default function Header({ user }) {
  const { url } = usePage();
  const isActive = (path) => url.startsWith(path);

  const handleLogout = () => {
   return(
    <Link href="/logout"></Link>
   )
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm px-4">
      <a href="/" className="navbar-brand fw-bold text-primary">
        Home
      </a>

      <div className="collapse navbar-collapse">
        <ul className="navbar-nav me-auto">
          <li className="nav-item">
            <Link href="/" className={`nav-link ${isActive("/") ? "active fw-semibold" : ""}`}>
              Itens
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/newProduct" className={`nav-link ${isActive("/newProduct") ? "active fw-semibold" : ""}`}>
              Criar
            </Link>
          </li>
        </ul>

        <div className="d-flex align-items-center gap-3">
          {user && (
            <div
              className="rounded-circle bg-primary text-black d-flex align-items-center justify-content-center fw-bold"
              style={{ width: 36, height: 36, fontSize: "0.85rem" }}
              title={user.email}
            >
              {user.email[0].toUpperCase()}
            </div>
          )}
          <button className="btn btn-outline-secondary btn-sm" onClick={handleLogout}>
            <Link href="/logout">Sair</Link>
          </button>
        </div>
      </div>
    </nav>
  );
}