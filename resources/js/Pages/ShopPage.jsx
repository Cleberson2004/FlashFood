import { useState, useRef, useEffect } from "react";
import { usePage, useForm, router } from "@inertiajs/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus, faCheck, faCheckCircle, faCreditCard, faMoneyBill, faLock, faSearch, faPen} from "@fortawesome/free-solid-svg-icons";
import { faPix } from "@fortawesome/free-brands-svg-icons";
import QRCode from "react-qr-code";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (v) => Number(v).toFixed(2).replace(".", ",");

// ─── Product Selection Modal ──────────────────────────────────────────────────

function ProductModal({ item, onClose, onAddToCart, existingQty }) {
  const [qty, setQty] = useState(existingQty || 1);
  const [note, setNote] = useState("");
  const overlayRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      style={{
        position: "fixed", inset: 0, zIndex: 1050,
        background: "rgba(0,0,0,.45)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "1rem",
      }}
    >
      <div className="card shadow-lg border-0" style={{ width: "100%", maxWidth: 440, borderRadius: 16, overflow: "hidden" }}>
        {/* Header */}
        <div className="card-header d-flex justify-content-between align-items-start border-0 text-white"
          style={{ background: "#0d6efd", padding: "1.25rem 1.5rem" }}>
          <div>
            <p className="mb-0" style={{ fontSize: ".65rem", letterSpacing: "2px", textTransform: "uppercase", opacity: .8 }}>
              Selecionar Item
            </p>
            <h5 className="mb-0 mt-1 fw-bold">{item.name}</h5>
            {item.description && (
              <p className="mb-0 mt-2 small" style={{ opacity: .9 }}>{item.description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="btn btn-sm ms-3"
            style={{ background: "rgba(255,255,255,.2)", color: "#fff", borderRadius: "50%", width: 32, height: 32, padding: 0, border: "none" }}
          >✕</button>
        </div>

        {/* Body */}
        <div className="card-body p-4">
          {/* Preço */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="text-muted small text-uppercase" style={{ letterSpacing: "1px" }}>Preço unitário</span>
            <span className="fw-bold fs-5" style={{ color: "#0d6efd", fontFamily: "monospace" }}>R$ {fmt(item.price)}</span>
          </div>

          {/* Quantidade */}
          <div className="mb-3">
            <label className="form-label text-muted small text-uppercase" style={{ letterSpacing: "1px" }}>Quantidade</label>
            <div className="d-flex align-items-center gap-3">
              <button
                onClick={() => setQty(q => Math.max(1, q - 1))}
                className="btn btn-outline-secondary rounded-circle"
                style={{ width: 40, height: 40, padding: 0, fontWeight: 700, fontSize: "1.2rem" }}
              ><FontAwesomeIcon icon={faMinus} /></button>
              <span className="fw-bold fs-5 text-center" style={{ minWidth: 40, fontFamily: "monospace" }}>{qty}</span>
              <button
                onClick={() => setQty(q => q + 1)}
                className="btn rounded-circle text-white"
                style={{ width: 40, height: 40, padding: 0, fontWeight: 700, fontSize: "1.2rem", background: "#0d6efd", border: "none" }}
              ><FontAwesomeIcon icon={faPlus} /></button>
              <span className="text-muted small ms-auto">
                Subtotal: <strong className="text-dark">R$ {fmt(item.price * qty)}</strong>
              </span>
            </div>
          </div>

          {/* Observação */}
          <div className="mb-4">
            <label className="form-label text-muted small text-uppercase" style={{ letterSpacing: "1px" }}>
              Observação <span className="text-muted fw-normal">(opcional)</span>
            </label>
            <textarea
              className="form-control"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ex: sem açúcar, bem gelado..."
              rows={2}
              style={{ resize: "none", fontSize: ".875rem" }}
            />
          </div>

          {/* Botão */}
          <button
            onClick={() => { onAddToCart(item, qty, note); onClose(); }}
            className="btn w-100 fw-bold text-white"
            style={{ background: "#0d6efd", border: "none", padding: ".85rem", borderRadius: 10, fontSize: "1rem" }}
          >
            <FontAwesomeIcon icon={faCheck} />Adicionar ao Pedido
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Payment Modal ────────────────────────────────────────────────────────────
function PaymentModal({ cart, items, onClose, onConfirm }) {
  const { post, processing } = useForm();
  const [method, setMethod] = useState("pix");
  const [cardNum, setCardNum] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExp, setCardExp] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [errors, setErrors] = useState({});
  const [paid, setPaid] = useState(false);
  const overlayRef = useRef(null);

  const total = Object.entries(cart).reduce((sum, [id, { qty }]) => {
    const item = items.find(i => i.product_id === Number(id));
    return sum + (item?.price || 0) * qty;
  }, 0);

  const validate = () => {
  const newErrors = {};

  if (method === "card") {
    const cleanNum = cardNum.replace(/\s/g, "");
    if (cleanNum.length < 16) newErrors.cardNum = "Número do cartão inválido.";
    if (!cardName.trim()) newErrors.cardName = "Informe o nome do cartão.";
    if (cardExp.length < 5) newErrors.cardExp = "Validade inválida.";
    if (cardCvv.length < 3) newErrors.cardCvv = "CVV inválido.";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0; // true = sem erros
};
  const cartItems = Object.entries(cart).map(([id, { qty, note }]) => ({
    item: items.find(i => i.product_id === Number(id)),
    qty, note,
  })).filter(e => e.item);

const handlePay = () => {
  if (!validate()) return;

    router.post("/createOrder", {
        payment_method: method,
        items: cartItems.map(({ item, qty }) => ({
            product_id: item.product_id,
            name: item.name,
            price: item.price,
            qty,
        })),
    }, {
        onSuccess: () => {
            if (method === "pix") {
                onConfirm(method);
                onClose();
            } else {
                setPaid(true);
                setTimeout(() => { onConfirm(method); onClose(); }, 2200);
            }
        },
    });
};

  const methods = [
    { key: "pix", label: "PIX", icon: <FontAwesomeIcon icon={faPix} /> },
    { key: "card", label: "Cartão", icon: <FontAwesomeIcon icon={faCreditCard} /> },
    { key: "cash", label: "Dinheiro", icon: <FontAwesomeIcon icon={faMoneyBill} /> },
  ];

  if (paid) return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1100,
      background: "rgba(0,0,0,.5)", backdropFilter: "blur(6px)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div className="card border-0 shadow-lg text-center p-5" style={{ maxWidth: 320, width: "100%", borderRadius: 20 }}>
        <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}><FontAwesomeIcon icon={faCheckCircle} /></div>
        <h5 className="fw-bold mb-2">Pedido Confirmado!</h5>
        <p className="text-muted small mb-0">Seu pedido está sendo preparado.</p>
      </div>
    </div>
  );

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      style={{
        position: "fixed", inset: 0, zIndex: 1100,
        background: "rgba(0,0,0,.45)", backdropFilter: "blur(5px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "1rem",
      }}
    >
      <div className="card border-0 shadow-lg" style={{ width: "100%", maxWidth: 520, maxHeight: "90vh", overflowY: "auto", borderRadius: 16, overflow: "hidden" }}>
        {/* Header escuro */}
        <div className="card-header border-0 d-flex justify-content-between align-items-center text-white"
          style={{ background: "#1a1a1a", padding: "1.25rem 1.5rem" }}>
          <div>
            <p className="mb-0" style={{ fontSize: ".65rem", letterSpacing: "2px", textTransform: "uppercase", opacity: .6 }}>Finalizar</p>
            <h5 className="mb-0 mt-1 fw-bold">Resumo do Pedido</h5>
          </div>
          <button onClick={onClose} className="btn btn-sm" style={{ background: "rgba(255,255,255,.1)", color: "#fff", borderRadius: "50%", width: 32, height: 32, padding: 0, border: "none" }}>
            ✕
          </button>
        </div>

        <div className="card-body p-4">
          {/* Itens */}
          <p className="text-muted small text-uppercase mb-2" style={{ letterSpacing: "2px" }}>Itens selecionados</p>
          {cartItems.map(({ item, qty, note }) => (
            <div key={item.product_id} className="d-flex justify-content-between align-items-start py-2 border-bottom">
              <div>
                <span className="fw-semibold small">{item.name}</span>
                <span className="badge bg-light text-muted ms-2">×{qty}</span>
                {note && <p className="text-muted mb-0 fst-italic" style={{ fontSize: ".75rem" }}>"{note}"</p>}
              </div>
              <span className="fw-bold small ms-3" style={{ color: "#0d6efd", fontFamily: "monospace", whiteSpace: "nowrap" }}>
                R$ {fmt(item.price * qty)}
              </span>
            </div>
          ))}
          <div className="d-flex justify-content-between pt-3 fw-bold">
            <span>Total</span>
            <span style={{ color: "#0d6efd", fontFamily: "monospace" }}>R$ {fmt(total)}</span>
          </div>

          <hr />

          {/* Método de pagamento */}
          <p className="text-muted small text-uppercase mb-2 mt-3" style={{ letterSpacing: "2px" }}>Forma de pagamento</p>
          <div className="d-flex gap-2 mb-3">
            {methods.map(m => (
              <button
                key={m.key}
                onClick={() => setMethod(m.key)}
                className={`btn flex-fill d-flex flex-column align-items-center gap-1 py-2 small fw-semibold ${method === m.key ? "btn-primary" : "btn-outline-secondary"}`}
                style={{}}
              >
                <span style={{ fontSize: "1.25rem" }}>{m.icon}</span>
                {m.label}
              </button>
            ))}
          </div>

          {/* Detalhes de pagamento */}
          {method === "card" && (
            <div className="mb-3">
              <div className="mb-2">
                <label className="form-label small text-muted">Número do cartão</label>
                <input
                  className={`form-control form-control-sm ${errors.cardNum ? "is-invalid" : ""}`}
                  value={cardNum}
                  onChange={e => {
                    setCardNum(e.target.value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim());
                    setErrors(prev => ({ ...prev, cardNum: null }));
                  }}
                  placeholder="0000 0000 0000 0000"
                />
                {errors.cardNum && <div className="invalid-feedback">{errors.cardNum}</div>}
              </div>
              <div className="mb-2">
                <label className="form-label small text-muted">Nome no cartão</label>
                <input className="form-control form-control-sm" value={cardName}
                  onChange={e => {setCardName(e.target.value.toUpperCase());
                    setErrors(prev => ({ ...prev, cardName: null }));
                  }}
                  placeholder="NOME COMPLETO" />
                  {errors.cardName && <div className="invalid-feedback">{errors.cardName}</div>}
              </div>
              <div className="row g-2">
                <div className="col">
                  <label className="form-label small text-muted">Validade</label>
                  <input className="form-control form-control-sm" value={cardExp}
                    onChange={e => { let v = e.target.value.replace(/\D/g, "").slice(0, 4); if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2); setCardExp(v);
                      setErrors(prev => ({ ...prev, cardExp: null }));
                     }}
                    placeholder="MM/AA" />
                    {errors.cardExp && <div className="invalid-feedback">{errors.cardExp}</div>}

                </div>
                <div className="col">
                  <label className="form-label small text-muted">CVV</label>
                  <input className="form-control form-control-sm" value={cardCvv}
                    onChange={e => {setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 3))
                      setErrors(prev => ({ ...prev, cardCvv: null }));
                    }} placeholder="000" />
                    {errors.cardCvv && <div className="invalid-feedback">{errors.cardCvv}</div>}

                </div>
              </div>
            </div>
          )}

          {method === "pix" && (
            <div className="alert border-0 text-center mb-3" style={{ background: "#e7f0ff" }}>
              <p className="fw-bold small mb-1">PIX Instantâneo</p>
              <p className="text-muted mb-0" style={{ fontSize: ".8rem" }}>Um QR Code será gerado após confirmar.</p>
            </div>
          )}

          {method === "cash" && (
            <div className="alert border-0 text-center mb-3" style={{ background: "#e7f0ff" }}>
              <div style={{ fontSize: "2rem" }}><FontAwesomeIcon icon={faMoneyBill} /></div>
              <p className="fw-bold small mb-1">Pagar no caixa</p>
              <p className="text-muted mb-0" style={{ fontSize: ".8rem" }}>Apresente seu pedido ao atendente.</p>
            </div>
          )}

          <button
            onClick={handlePay}
            className="btn w-100 fw-bold text-white"
            style={{ background: "#1a1a1a", border: "none", padding: ".85rem", borderRadius: 10, fontSize: "1rem" }}
          >
            <FontAwesomeIcon icon={faLock} />
            Confirmar Pagamento · R$ {fmt(total)}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Cart Pill (flutuante) ────────────────────────────────────────────────────
function CartPill({ cart, items, onClick }) {
  const totalQty = Object.values(cart).reduce((s, { qty }) => s + qty, 0);
  const total = Object.entries(cart).reduce((sum, [id, { qty }]) => {
    const item = items.find(i => i.product_id === Number(id));
    return sum + (item?.price || 0) * qty;
  }, 0);

  if (totalQty === 0) return null;

  return (
    <div style={{ position: "fixed", bottom: "1.5rem", left: "50%", transform: "translateX(-50%)", zIndex: 900 }}>
      <button
        onClick={onClick}
        className="btn fw-bold text-white d-flex align-items-center gap-3 shadow-lg"
        style={{
          background: "#0d6efd",
          borderRadius: 999, padding: ".8rem 2rem", border: "none",
          whiteSpace: "nowrap", fontSize: "1rem",
          boxShadow: "0 8px 32px rgba(13,110,253,.4)",
        }}
      >
        <span className="badge rounded-pill bg-white text-dark">{totalQty}</span>
        <span>Concluir Pedido</span>
        <span style={{ opacity: .9 }}>R$ {fmt(total)}</span>
      </button>
    </div>
  );
}

// ─── Item Card ────────────────────────────────────────────────────────────────
function ItemCard({ item, cartQty, onClick }) {
  const isInCart = cartQty > 0;
  const imageUrl = item.product_image ? `/storage/${item.product_image}` : null;

  return (
    <div
      onClick={onClick}
      className={`card h-100 shadow-sm border ${isInCart ? "border-primary" : ""}`}
      style={{ cursor: "pointer", transition: "box-shadow .2s, transform .2s", borderRadius: 12, overflow: "hidden" }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,.12)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
    >
      
      {/* Barra colorida no topo */}
      <div style={{
        height: 4,
        background: isInCart
          ? "#0d6efd"
          : "linear-gradient(90deg, #dee2e6, #e9ecef)",
      }} />
   {/* Imagem */}
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={item.name}
          style={{ width: "100%", height: 160, objectFit: "cover" }}
        />
      ) : (
        <div
          className="d-flex align-items-center justify-content-center bg-light text-muted"
          style={{ height: 160, fontSize: "2rem" }}
        >
          🍽️
        </div>
      )}
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h6 className="card-title fw-semibold mb-0">{item.name}</h6>
          {isInCart ? (
            <span className="badge text-white" style={{ background: "#0d6efd" }}><FontAwesomeIcon icon={faCheckCircle}/>{cartQty}×</span>
          ) : (
            <span className="badge bg-secondary">#{String(item.product_id).padStart(3, "0")}</span>
          )}
        </div>

        <p className="card-text text-muted small" style={{
          display: "-webkit-box", WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {item.description || <em>Sem descrição</em>}
        </p>

        <div className="d-flex justify-content-between align-items-center mt-3">
          <span className="fw-semibold" style={{ color: "#198754" }}>
            R$ {fmt(item.price)}
          </span>
          <span className="text-muted" style={{ fontSize: ".75rem" }}>
            {isInCart ? "✓ No pedido" : "Toque para adicionar"}
          </span>
        </div>
      </div>

      <div className="card-footer bg-white border-top d-flex justify-content-end">
        <button
          className="btn btn-sm fw-semibold text-white"
          style={{ background: isInCart ? "#0d6efd" : "#6c757d", border: "none", borderRadius: 8, fontSize: ".8rem" }}
          onClick={(e) => { e.stopPropagation(); onClick(); }}
        >
          {isInCart ? "Editar" : "+ Adicionar"}
        </button>
      </div>
    </div>
  );
}


//--------- PIX MODAL -------------------//

function PixModal({ onClose }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1200,
        background: "rgba(0,0,0,.5)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "1rem",
      }}
    >
      <div className="card border-0 shadow-lg text-center p-4"
        style={{ maxWidth: 360, width: "100%", borderRadius: 16, paddingBottom: 40 }}
        onClick={e => e.stopPropagation()}
      >
        <h5 className="fw-bold mb-3">Escaneie o QR Code</h5>
        <QRCode
          size={256}
          style={{ height: "auto", maxWidth: "100%", width: "100%" }}
          value="https://google.com"
          viewBox={`0 0 256 256`}
        />
        <button className="btn btn-primary mt-3 rounded-pill" onClick={onClose}>
          Fechar
        </button>
      </div>
    </div>
  );
}
// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ShopPage({ items = [] }) {
  const { auth } = usePage().props;

  const [cart, setCart] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [search, setSearch] = useState("");
  const [showPix, setShowPix] = useState(false);

  const filteredItems = items.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    (i.description || "").toLowerCase().includes(search.toLowerCase())
  );

  const addToCart = (item, qty, note) => {
    setCart(prev => ({ ...prev, [item.product_id]: { qty, note } }));
  };

const handleConfirm = (method) => {
    setCart({});
    if (method === "pix") {
        setShowPix(true);
    }
};
  const totalInCart = Object.values(cart).reduce((s, { qty }) => s + qty, 0);

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Header user={auth?.user} />

      <main className="container py-4 flex-grow-1" style={{ paddingBottom: "6rem" }}>
        {/* Page header */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <div>
            <h1 className="h3 fw-bold mb-1">Cardápio</h1>
            <p className="text-muted small mb-0">
              {filteredItems.length} {filteredItems.length === 1 ? "item disponível" : "itens disponíveis"}
              {search && ` para "${search}"`}
            </p>
          </div>

          {/* Busca */}
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <div className="input-group" style={{ maxWidth: 300 }}>
              <span className="input-group-text bg-white border-end-0"><FontAwesomeIcon icon={faSearch}/></span>
              <input
                type="text"
                className="form-control border-start-0 ps-0"
                placeholder="Buscar item..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ fontSize: ".875rem" }}
              />

            </div>
            {totalInCart > 0 && (
              <span className="badge rounded-pill fw-semibold" style={{ background: "#e7f0ff", color: "#0d6efd", border: "1.5px solid #0d6efd", padding: ".45rem .9rem", fontSize: ".8rem" }}>
                🛒 {totalInCart} {totalInCart === 1 ? "item" : "itens"}
              </span>
            )}
          </div>
        </div>

        {/* Grid de produtos */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <div style={{ fontSize: "2.5rem", opacity: 0.4 }} className="mb-3">🔍</div>
            <h5 className="fw-semibold text-dark">Nenhum item encontrado</h5>
            <p className="small">Tente buscar por outro nome ou descrição</p>
          </div>
        ) : (
          <div className="row g-3">
            {filteredItems.map(item => (
              <div className="col-sm-6 col-lg-4" key={item.product_id}>
                <ItemCard
                  item={item}
                  cartQty={cart[item.product_id]?.qty || 0}
                  onClick={() => setSelectedItem(item)}
                />
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />

      {/* Cart Pill flutuante */}
      <CartPill cart={cart} items={items} onClick={() => setShowPayment(true)} />

      {/* Modal de seleção */}
      {selectedItem && (
        <ProductModal
          item={selectedItem}
          existingQty={cart[selectedItem.product_id]?.qty}
          onClose={() => setSelectedItem(null)}
          onAddToCart={addToCart}
        />
      )}
      {showPix && <PixModal onClose={() => setShowPix(false)} />}
      {/* Modal de pagamento */}
      {showPayment && (
        <PaymentModal
          cart={cart}
          items={items}
          onClose={() => setShowPayment(false)}
          onConfirm={handleConfirm}
        />
      )}
      
    </div>
  );
}