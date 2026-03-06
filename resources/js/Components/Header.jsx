// resources/js/Components/Header.jsx
import { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import ProfileModal from "./ProfileModal";

export default function Header({ user }) {
  const { url } = usePage();
  const isActive = (path) => url.startsWith(path);
  const [showProfile, setShowProfile] = useState(false);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm px-4">
      <a href="/" className="navbar-brand fw-bold text-primary">Home</a>

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
           <li className="nav-item">
            <Link href="/pedido" className={`nav-link ${isActive("/pedido") ? "active fw-semibold" : ""}`}>
              Pedido
            </Link>
          </li>
          
          
          
        </ul>

        <div className="d-flex align-items-center gap-3">
          {user && (
            <div className="position-relative">
              <div
                className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold"
                style={{ width: 36, height: 36, fontSize: "0.85rem", cursor: "pointer" }}
                title={user.email}
                onClick={() => setShowProfile((v) => !v)}
              >
                {user.email?.[0]?.toUpperCase()}
              </div>

              {showProfile && (
                <ProfileModal user={user} onClose={() => setShowProfile(false)} />
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}