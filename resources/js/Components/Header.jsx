// resources/js/Components/Header.jsx
import { useState, useEffect, useRef } from "react";
import { Link, usePage } from "@inertiajs/react";
import ProfileModal from "./ProfileModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBoxOpen,
  faCartPlus,
  faListUl,
  faClipboardList,
  faBars,
  faXmark,
  faChevronDown,
  faUsers,
  faStore,
} from "@fortawesome/free-solid-svg-icons";

const NAV_LINKS = [
  { href: "/",              label: "Itens",               icon: faBoxOpen,       admin: true, gerente: true, usuario: false },
  { href: "/pedido",        label: "Fazer Pedido",        icon: faCartPlus,      admin: true, gerente: false, usuario: true },
  { href: "/pedidos",       label: "Meus Pedidos",        icon: faListUl,        admin: true, gerente: false, usuario: true },
  { href: "/admin/pedidos", label: "Pedidos",     icon: faClipboardList, admin: true,  gerente: true, usuario: false  },
  { href: "/usuarios",      label: "Usuários (Admin)",    icon: faUsers,         admin: true,  gerente: false, usuario: false },
  { href: "/lojas",         label: "Lojas (Admin)",       icon: faStore,         admin: true,  gerente: false, usuario: false },
  { href: "/entregadores",         label: "Entregadores",       icon: faStore,         admin: true,  gerente: true, usuario: false },

];

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

  .hdr-root {
    font-family: 'DM Sans', sans-serif;
    position: sticky;
    top: 0;
    z-index: 1000;
    background: #fff;
    border-bottom: 1px solid #e2e8f0;
    box-shadow: 0 1px 12px 0 rgba(13, 110, 253, 0.07);
  }

  .hdr-inner {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 1.5rem;
    height: 62px;
    display: flex;
    align-items: center;
    gap: 2rem;
  }

  /* ── Brand ── */
  .hdr-brand {
    display: flex;
    align-items: center;
    gap: 0.55rem;
    text-decoration: none;
    flex-shrink: 0;
  }
  .hdr-brand-icon {
    width: 34px;
    height: 34px;
    background: #0d6efd;
    border-radius: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 0.85rem;
    box-shadow: 0 2px 8px rgba(13, 110, 253, 0.35);
    transition: transform 0.2s;
  }
  .hdr-brand:hover .hdr-brand-icon { transform: rotate(-8deg) scale(1.08); }
  .hdr-brand-text {
    font-weight: 700;
    font-size: 1.05rem;
    color: #0d6efd;
    letter-spacing: -0.3px;
  }

  /* ── Desktop nav ── */
  .hdr-nav {
    display: flex;
    align-items: center;
    gap: 0.15rem;
    flex: 1;
  }
  .hdr-link {
    display: flex;
    align-items: center;
    gap: 0.45rem;
    padding: 0.45rem 0.85rem;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 500;
    color: #64748b;
    text-decoration: none;
    transition: background 0.15s, color 0.15s;
    white-space: nowrap;
  }
  .hdr-link:hover {
    background: #f0f6ff;
    color: #0d6efd;
  }
  .hdr-link.active {
    background: #e8f0fe;
    color: #0d6efd;
    font-weight: 600;
  }
  .hdr-link-icon {
    opacity: 0.7;
    font-size: 0.8rem;
  }
  .hdr-link.active .hdr-link-icon { opacity: 1; }

  /* ── Active indicator dot ── */
  .hdr-link.active::after {
    content: '';
    display: inline-block;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #0d6efd;
    margin-left: 2px;
    align-self: center;
  }

  /* ── Right side ── */
  .hdr-right {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-left: auto;
    flex-shrink: 0;
  }

  /* ── Avatar button ── */
  .hdr-avatar-wrap {
    position: relative;
  }
  .hdr-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: #0d6efd;
    color: #fff;
    font-weight: 700;
    font-size: 0.85rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border: 2px solid transparent;
    transition: border-color 0.15s, box-shadow 0.15s;
    letter-spacing: 0;
    gap: 0;
  }
  .hdr-avatar:hover,
  .hdr-avatar.open {
    border-color: #0d6efd;
    box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.18);
  }
  .hdr-avatar-chevron {
    font-size: 0.6rem;
    margin-left: 0.3rem;
    opacity: 0.7;
    transition: transform 0.2s;
  }
  .hdr-avatar-chevron.open { transform: rotate(180deg); }

  /* ── Divider ── */
  .hdr-divider {
    width: 1px;
    height: 22px;
    background: #e2e8f0;
  }

  /* ── Mobile hamburger ── */
  .hdr-hamburger {
    display: none;
    background: none;
    border: none;
    padding: 0.4rem;
    border-radius: 7px;
    color: #475569;
    font-size: 1.15rem;
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
  }
  .hdr-hamburger:hover { background: #f1f5f9; color: #0d6efd; }

  /* ── Mobile drawer ── */
  .hdr-drawer {
    display: none;
    flex-direction: column;
    gap: 0.25rem;
    padding: 0.75rem 1rem 1rem;
    border-top: 1px solid #f1f5f9;
    background: #fff;
  }
  .hdr-drawer.open { display: flex; }

  .hdr-drawer-link {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.65rem 0.85rem;
    border-radius: 9px;
    font-size: 0.9rem;
    font-weight: 500;
    color: #475569;
    text-decoration: none;
    transition: background 0.15s, color 0.15s;
  }
  .hdr-drawer-link:hover { background: #f0f6ff; color: #0d6efd; }
  .hdr-drawer-link.active { background: #e8f0fe; color: #0d6efd; font-weight: 600; }
  .hdr-drawer-link-icon { width: 20px; text-align: center; font-size: 0.85rem; opacity: 0.75; }
  .hdr-drawer-link.active .hdr-drawer-link-icon { opacity: 1; }

  .hdr-drawer-divider {
    height: 1px;
    background: #f1f5f9;
    margin: 0.35rem 0;
  }

  /* ── Responsive ── */
  @media (max-width: 768px) {
    .hdr-nav    { display: none; }
    .hdr-hamburger { display: flex; align-items: center; }
    .hdr-divider { display: none; }
  }
`;

export default function Header({ user }) {
  const { url } = usePage();
  const isActive = (href) =>
    href === "/"
      ? url === "/"
      : url === href || url.startsWith(href + "/");

  const isAdmin = user?.user_role === "admin";
  const isGerente = user?.user_role === "gerente";
  const isUsuario = user?.user_role === "usuario";
  const visibleLinks = NAV_LINKS.filter((link) => {
    if (!link.admin && !link.gerente) return true;     
    if (link.admin && isAdmin)        return true;    
    if (link.gerente && isGerente)    return true;  
    if (link.usuario && isUsuario)    return true;  
    return false;
  });

  const [showProfile, setShowProfile] = useState(false);
  const [drawerOpen,  setDrawerOpen]  = useState(false);
  const avatarRef = useRef(null);
  const brandHref = isAdmin ? "/" : isGerente ? "/admin/pedidos" : "/pedido";
  useEffect(() => {
    const handler = (e) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
      <style>{styles}</style>

      <header className="hdr-root">
        {/* ── Main bar ── */}
        <div className="hdr-inner">
          {/* Brand */}
          <a href={brandHref} className="hdr-brand">
            <div className="hdr-brand-icon">
              <FontAwesomeIcon icon={faBoxOpen} />
            </div>
            <span className="hdr-brand-text">Gestão</span>
          </a>

          {/* Desktop nav */}
          <nav className="hdr-nav">
            {visibleLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`hdr-link ${isActive(link.href) ? "active" : ""}`}
              >
                <FontAwesomeIcon icon={link.icon} className="hdr-link-icon" />
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="hdr-right">
            {user && (
              <>
                <div className="hdr-divider" />
                <div className="hdr-avatar-wrap" ref={avatarRef}>
                  <div
                    className={`hdr-avatar ${showProfile ? "open" : ""}`}
                    onClick={() => setShowProfile((v) => !v)}
                    title={user.email}
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    {user.email?.[0]?.toUpperCase()}
                    <FontAwesomeIcon
                      icon={faChevronDown}
                      className={`hdr-avatar-chevron ${showProfile ? "open" : ""}`}
                    />
                  </div>
                  {showProfile && (
                    <ProfileModal user={user} onClose={() => setShowProfile(false)} />
                  )}
                </div>
              </>
            )}

            {/* Hamburger */}
            <button
              className="hdr-hamburger"
              onClick={() => setDrawerOpen((v) => !v)}
              aria-label="Menu"
            >
              <FontAwesomeIcon icon={drawerOpen ? faXmark : faBars} />
            </button>
          </div>
        </div>

        {/* ── Mobile drawer ── */}
        <div className={`hdr-drawer ${drawerOpen ? "open" : ""}`}>
          {visibleLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`hdr-drawer-link ${isActive(link.href) ? "active" : ""}`}
              onClick={() => setDrawerOpen(false)}
            >
              <span className="hdr-drawer-link-icon">
                <FontAwesomeIcon icon={link.icon} />
              </span>
              {link.label}
            </Link>
          ))}

          {user && (
            <>
              <div className="hdr-drawer-divider" />
              <div
                className="hdr-drawer-link"
                style={{ cursor: "pointer" }}
                onClick={() => { setShowProfile((v) => !v); setDrawerOpen(false); }}
              >
                <span
                  className="hdr-drawer-link-icon rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold"
                  style={{ width: 22, height: 22, fontSize: "0.7rem" }}
                >
                  {user.email?.[0]?.toUpperCase()}
                </span>
                {user.name ?? user.email}
              </div>
            </>
          )}
        </div>
      </header>
    </>
  );
}