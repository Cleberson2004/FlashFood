// resources/js/Components/ProfileModal.jsx
import { useEffect, useRef } from "react";
import { router } from "@inertiajs/react";

export default function ProfileModal({ user, onClose }) {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    router.get("/logout");
    onClose();
  };

  return (
    <div
      ref={modalRef}
      className="position-absolute bg-white border rounded shadow"
      style={{
        top: "calc(100% + 8px)",
        right: 0,
        width: 240,
        zIndex: 1050,
      }}
    >
      {/* Cabeçalho */}
      <div className="p-3 border-bottom d-flex align-items-center gap-2">
        <div
          className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
          style={{ width: 40, height: 40, fontSize: "1rem" }}
        >
          {user?.email?.[0]?.toUpperCase()}
        </div>
        <div className="overflow-hidden">
          <div className="fw-semibold text-dark small text-truncate">{user?.name}</div>
          <div className="text-muted" style={{ fontSize: "0.75rem" }}>{user?.email}</div>
        </div>
      </div>

      {/* Ações */}
      <div className="p-2">
        <button
          className="btn btn-sm w-100 text-start text-danger d-flex align-items-center gap-2"
          onClick={handleLogout}
        >
          🚪 Sair
        </button>
      </div>
    </div>
  );
}