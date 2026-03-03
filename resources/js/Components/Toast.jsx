// resources/js/Components/Toast.jsx

export default function Toast({ message, icon = "✅" }) {
  return (
    <div
      className="position-fixed bottom-0 end-0 p-3"
      style={{ zIndex: 1100 }}
    >
      <div className="toast show align-items-center text-bg-dark border-0 shadow" role="alert">
        <div className="d-flex">
          <div className="toast-body d-flex align-items-center gap-2">
            <span>{icon}</span>
            {message}
          </div>
        </div>
      </div>
    </div>
  );
}