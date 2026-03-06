import { useState, useEffect, useRef } from "react";

// ─── Mock data (substitua por props reais: { items = [] }) ───────────────────


// ─── Helpers ─────────────────────────────────────────────────────────────────
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

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(15,10,5,0.65)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "1rem",
        animation: "fadeIn .18s ease",
      }}
    >
      <div style={{
        background: "#FFFDF9",
        borderRadius: "20px",
        width: "100%", maxWidth: "440px",
        boxShadow: "0 32px 80px rgba(0,0,0,0.28)",
        overflow: "hidden",
        animation: "slideUp .22s cubic-bezier(.22,.61,.36,1)",
      }}>
        {/* Header colorido */}
        <div style={{
          background: "linear-gradient(135deg, #C9622A 0%, #E8833A 100%)",
          padding: "1.5rem 1.5rem 1rem",
          color: "#fff",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <p style={{ margin: 0, fontSize: ".7rem", letterSpacing: "2px", textTransform: "uppercase", opacity: .8 }}>
                Selecionar Item
              </p>
              <h2 style={{ margin: ".25rem 0 0", fontSize: "1.4rem", fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700 }}>
                {item.name}
              </h2>
            </div>
            <button onClick={onClose} style={{
              background: "rgba(255,255,255,.2)", border: "none", borderRadius: "50%",
              width: 32, height: 32, cursor: "pointer", color: "#fff",
              fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center",
            }}>✕</button>
          </div>
          <p style={{ margin: ".75rem 0 0", fontSize: ".85rem", opacity: .9, lineHeight: 1.5 }}>
            {item.description}
          </p>
        </div>

        {/* Corpo */}
        <div style={{ padding: "1.5rem" }}>
          {/* Preço */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <span style={{ fontSize: ".8rem", color: "#888", textTransform: "uppercase", letterSpacing: "1px" }}>Preço unitário</span>
            <span style={{ fontSize: "1.4rem", fontWeight: 800, color: "#C9622A", fontFamily: "monospace" }}>
              R$ {fmt(item.price)}
            </span>
          </div>

          {/* Quantidade */}
          <div style={{ marginBottom: "1.25rem" }}>
            <label style={{ fontSize: ".8rem", color: "#555", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: ".5rem" }}>
              Quantidade
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
              <button
                onClick={() => setQty(q => Math.max(1, q - 1))}
                style={{
                  width: 40, height: 40, borderRadius: "50%",
                  border: "2px solid #E8DDD0", background: "#fff",
                  fontSize: "1.2rem", cursor: "pointer", fontWeight: 700,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all .15s",
                }}
              >−</button>
              <span style={{
                minWidth: 48, textAlign: "center", fontSize: "1.4rem",
                fontWeight: 800, fontFamily: "monospace", color: "#1a1a1a"
              }}>{qty}</span>
              <button
                onClick={() => setQty(q => q + 1)}
                style={{
                  width: 40, height: 40, borderRadius: "50%",
                  border: "2px solid #C9622A", background: "#C9622A",
                  fontSize: "1.2rem", cursor: "pointer", fontWeight: 700, color: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all .15s",
                }}
              >+</button>
              <span style={{ fontSize: ".85rem", color: "#999", marginLeft: "auto" }}>
                Subtotal: <strong style={{ color: "#1a1a1a" }}>R$ {fmt(item.price * qty)}</strong>
              </span>
            </div>
          </div>

          {/* Observação */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ fontSize: ".8rem", color: "#555", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: ".5rem" }}>
              Observação (opcional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ex: sem açúcar, bem gelado..."
              rows={2}
              style={{
                width: "100%", border: "2px solid #E8DDD0", borderRadius: "10px",
                padding: ".6rem .8rem", fontSize: ".85rem", resize: "none",
                fontFamily: "inherit", outline: "none", background: "#FDFAF6",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Botão confirmar */}
          <button
            onClick={() => { onAddToCart(item, qty, note); onClose(); }}
            style={{
              width: "100%", padding: "1rem",
              background: "linear-gradient(135deg, #C9622A 0%, #E8833A 100%)",
              color: "#fff", border: "none", borderRadius: "12px",
              fontSize: "1rem", fontWeight: 700, cursor: "pointer",
              letterSpacing: ".5px",
              boxShadow: "0 4px 20px rgba(201,98,42,.4)",
              transition: "transform .15s, box-shadow .15s",
            }}
            onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 8px 28px rgba(201,98,42,.45)"; }}
            onMouseLeave={e => { e.target.style.transform = ""; e.target.style.boxShadow = "0 4px 20px rgba(201,98,42,.4)"; }}
          >
            ✓ Adicionar ao Pedido
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Payment Modal ────────────────────────────────────────────────────────────
function PaymentModal({ cart, items, onClose, onConfirm }) {
  const [method, setMethod] = useState("pix");
  const [cardNum, setCardNum] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExp, setCardExp] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [paid, setPaid] = useState(false);
  const overlayRef = useRef(null);

  const total = Object.entries(cart).reduce((sum, [id, { qty }]) => {
    const item = items.find(i => i.product_id === Number(id));
    return sum + (item?.price || 0) * qty;
  }, 0);

  const cartItems = Object.entries(cart).map(([id, { qty, note }]) => ({
    item: items.find(i => i.product_id === Number(id)),
    qty, note,
  })).filter(e => e.item);

  const handleOverlayClick = (e) => { if (e.target === overlayRef.current) onClose(); };

  const handlePay = () => {
    setPaid(true);
    setTimeout(() => { onConfirm(); onClose(); }, 2200);
  };

  const methods = [
    { key: "pix", label: "PIX", icon: "⚡" },
    { key: "card", label: "Cartão", icon: "💳" },
    { key: "cash", label: "Dinheiro", icon: "💵" },
  ];

  if (paid) return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1100,
      background: "rgba(15,10,5,.75)", backdropFilter: "blur(6px)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div style={{
        background: "#FFFDF9", borderRadius: "20px", padding: "3rem 2rem",
        textAlign: "center", maxWidth: 320, width: "100%",
        animation: "slideUp .3s cubic-bezier(.22,.61,.36,1)",
      }}>
        <div style={{ fontSize: "4rem", marginBottom: "1rem", animation: "pop .4s .1s both" }}>✅</div>
        <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.5rem", marginBottom: ".5rem" }}>
          Pedido Confirmado!
        </h3>
        <p style={{ color: "#888", fontSize: ".9rem" }}>Seu pedido está sendo preparado.</p>
      </div>
    </div>
  );

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      style={{
        position: "fixed", inset: 0, zIndex: 1100,
        background: "rgba(15,10,5,.7)", backdropFilter: "blur(5px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "1rem",
        animation: "fadeIn .2s ease",
      }}
    >
      <div style={{
        background: "#FFFDF9", borderRadius: "20px", width: "100%", maxWidth: "520px",
        maxHeight: "90vh", overflowY: "auto",
        boxShadow: "0 40px 100px rgba(0,0,0,.3)",
        animation: "slideUp .25s cubic-bezier(.22,.61,.36,1)",
      }}>
        {/* Header */}
        <div style={{
          background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
          padding: "1.5rem", color: "#fff", borderRadius: "20px 20px 0 0",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div>
            <p style={{ margin: 0, fontSize: ".7rem", letterSpacing: "2px", textTransform: "uppercase", opacity: .6 }}>Finalizar</p>
            <h2 style={{ margin: ".2rem 0 0", fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.4rem" }}>
              Resumo do Pedido
            </h2>
          </div>
          <button onClick={onClose} style={{
            background: "rgba(255,255,255,.1)", border: "none", borderRadius: "50%",
            width: 32, height: 32, cursor: "pointer", color: "#fff", fontSize: "1rem",
          }}>✕</button>
        </div>

        <div style={{ padding: "1.5rem" }}>
          {/* Itens do pedido */}
          <div style={{ marginBottom: "1.5rem" }}>
            <p style={{ fontSize: ".7rem", letterSpacing: "2px", textTransform: "uppercase", color: "#888", marginBottom: ".75rem" }}>
              Itens selecionados
            </p>
            {cartItems.map(({ item, qty, note }) => (
              <div key={item.product_id} style={{
                display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                padding: ".75rem 0", borderBottom: "1px solid #F0EAE2",
              }}>
                <div>
                  <span style={{ fontWeight: 600, fontSize: ".95rem" }}>{item.name}</span>
                  <span style={{
                    marginLeft: ".5rem", background: "#F0EAE2", borderRadius: "999px",
                    padding: "1px 8px", fontSize: ".75rem", color: "#666",
                  }}>×{qty}</span>
                  {note && <p style={{ margin: ".2rem 0 0", fontSize: ".78rem", color: "#aaa", fontStyle: "italic" }}>"{note}"</p>}
                </div>
                <span style={{ fontWeight: 700, color: "#C9622A", fontFamily: "monospace", whiteSpace: "nowrap", marginLeft: "1rem" }}>
                  R$ {fmt(item.price * qty)}
                </span>
              </div>
            ))}
            <div style={{
              display: "flex", justifyContent: "space-between",
              padding: "1rem 0 0", fontWeight: 800, fontSize: "1.1rem",
            }}>
              <span>Total</span>
              <span style={{ color: "#C9622A", fontFamily: "monospace" }}>R$ {fmt(total)}</span>
            </div>
          </div>

          {/* Método de pagamento */}
          <div style={{ marginBottom: "1.5rem" }}>
            <p style={{ fontSize: ".7rem", letterSpacing: "2px", textTransform: "uppercase", color: "#888", marginBottom: ".75rem" }}>
              Forma de pagamento
            </p>
            <div style={{ display: "flex", gap: ".75rem" }}>
              {methods.map(m => (
                <button
                  key={m.key}
                  onClick={() => setMethod(m.key)}
                  style={{
                    flex: 1, padding: ".75rem .5rem",
                    border: `2px solid ${method === m.key ? "#C9622A" : "#E8DDD0"}`,
                    borderRadius: "12px",
                    background: method === m.key ? "#FEF3EC" : "#fff",
                    cursor: "pointer", fontWeight: 600, fontSize: ".85rem",
                    transition: "all .15s",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: ".25rem",
                    color: method === m.key ? "#C9622A" : "#555",
                  }}
                >
                  <span style={{ fontSize: "1.3rem" }}>{m.icon}</span>
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dados do cartão */}
          {method === "card" && (
            <div style={{ marginBottom: "1.5rem", animation: "fadeIn .2s ease" }}>
              <div style={{ marginBottom: ".75rem" }}>
                <label style={{ fontSize: ".75rem", color: "#777", display: "block", marginBottom: ".3rem" }}>Número do cartão</label>
                <input
                  value={cardNum}
                  onChange={e => setCardNum(e.target.value.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim())}
                  placeholder="0000 0000 0000 0000"
                  style={inputStyle}
                />
              </div>
              <div style={{ marginBottom: ".75rem" }}>
                <label style={{ fontSize: ".75rem", color: "#777", display: "block", marginBottom: ".3rem" }}>Nome no cartão</label>
                <input value={cardName} onChange={e => setCardName(e.target.value.toUpperCase())} placeholder="NOME COMPLETO" style={inputStyle} />
              </div>
              <div style={{ display: "flex", gap: ".75rem" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: ".75rem", color: "#777", display: "block", marginBottom: ".3rem" }}>Validade</label>
                  <input
                    value={cardExp}
                    onChange={e => {
                      let v = e.target.value.replace(/\D/g,"").slice(0,4);
                      if (v.length > 2) v = v.slice(0,2) + "/" + v.slice(2);
                      setCardExp(v);
                    }}
                    placeholder="MM/AA" style={inputStyle}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: ".75rem", color: "#777", display: "block", marginBottom: ".3rem" }}>CVV</label>
                  <input value={cardCvv} onChange={e => setCardCvv(e.target.value.replace(/\D/g,"").slice(0,3))} placeholder="000" style={inputStyle} />
                </div>
              </div>
            </div>
          )}

          {method === "pix" && (
            <div style={{
              marginBottom: "1.5rem", background: "#F5F0EA", borderRadius: "12px",
              padding: "1rem", textAlign: "center", animation: "fadeIn .2s ease",
            }}>
              <div style={{ fontSize: "2.5rem", marginBottom: ".5rem" }}>⚡</div>
              <p style={{ margin: 0, fontWeight: 700, fontSize: ".9rem" }}>PIX Instantâneo</p>
              <p style={{ margin: ".25rem 0 0", fontSize: ".8rem", color: "#888" }}>
                Um QR Code será gerado após confirmar.
              </p>
            </div>
          )}

          {method === "cash" && (
            <div style={{
              marginBottom: "1.5rem", background: "#F5F0EA", borderRadius: "12px",
              padding: "1rem", textAlign: "center", animation: "fadeIn .2s ease",
            }}>
              <div style={{ fontSize: "2.5rem", marginBottom: ".5rem" }}>💵</div>
              <p style={{ margin: 0, fontWeight: 700, fontSize: ".9rem" }}>Pagar no caixa</p>
              <p style={{ margin: ".25rem 0 0", fontSize: ".8rem", color: "#888" }}>
                Apresente seu pedido ao atendente.
              </p>
            </div>
          )}

          {/* Botão pagar */}
          <button
            onClick={handlePay}
            style={{
              width: "100%", padding: "1.1rem",
              background: "linear-gradient(135deg, #1a1a1a 0%, #333 100%)",
              color: "#fff", border: "none", borderRadius: "12px",
              fontSize: "1rem", fontWeight: 700, cursor: "pointer",
              letterSpacing: ".5px",
              boxShadow: "0 4px 20px rgba(0,0,0,.25)",
              transition: "transform .15s, box-shadow .15s",
            }}
            onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 8px 28px rgba(0,0,0,.3)"; }}
            onMouseLeave={e => { e.target.style.transform = ""; e.target.style.boxShadow = "0 4px 20px rgba(0,0,0,.25)"; }}
          >
            🔒 Confirmar Pagamento · R$ {fmt(total)}
          </button>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%", border: "2px solid #E8DDD0", borderRadius: "10px",
  padding: ".6rem .8rem", fontSize: ".9rem", fontFamily: "inherit",
  outline: "none", background: "#FDFAF6", boxSizing: "border-box",
  transition: "border-color .15s",
};

// ─── Cart Pill (flutuante) ────────────────────────────────────────────────────
function CartPill({ cart, items, onClick }) {
  const totalQty = Object.values(cart).reduce((s, { qty }) => s + qty, 0);
  const total = Object.entries(cart).reduce((sum, [id, { qty }]) => {
    const item = items.find(i => i.product_id === Number(id));
    return sum + (item?.price || 0) * qty;
  }, 0);

  if (totalQty === 0) return null;

  return (
    <div style={{
      position: "fixed", bottom: "1.5rem", left: "50%", transform: "translateX(-50%)",
      zIndex: 900,
      animation: "slideUp .3s cubic-bezier(.22,.61,.36,1)",
    }}>
      <button
        onClick={onClick}
        style={{
          background: "linear-gradient(135deg, #C9622A 0%, #E8833A 100%)",
          color: "#fff", border: "none", borderRadius: "999px",
          padding: ".9rem 2rem",
          display: "flex", alignItems: "center", gap: "1rem",
          cursor: "pointer",
          boxShadow: "0 8px 32px rgba(201,98,42,.5)",
          fontSize: "1rem", fontWeight: 700,
          whiteSpace: "nowrap",
          transition: "transform .15s, box-shadow .15s",
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 14px 40px rgba(201,98,42,.55)"; }}
        onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 8px 32px rgba(201,98,42,.5)"; }}
      >
        <span style={{
          background: "rgba(255,255,255,.25)", borderRadius: "50%",
          width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: ".85rem", fontWeight: 900,
        }}>{totalQty}</span>
        <span>Concluir Pedido</span>
        <span style={{ opacity: .85, fontSize: ".9rem" }}>R$ {fmt(total)}</span>
      </button>
    </div>
  );
}

// ─── Item Card (somente leitura + seleção) ────────────────────────────────────
function ItemCard({ item, cartQty, onClick }) {
  const isInCart = cartQty > 0;

  return (
    <div
      onClick={onClick}
      style={{
        background: "#FFFDF9",
        borderRadius: "16px",
        border: `2px solid ${isInCart ? "#C9622A" : "#EDE8E0"}`,
        cursor: "pointer",
        transition: "transform .18s, box-shadow .18s, border-color .18s",
        overflow: "hidden",
        position: "relative",
        boxShadow: isInCart ? "0 4px 20px rgba(201,98,42,.15)" : "0 2px 8px rgba(0,0,0,.06)",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = isInCart
          ? "0 10px 32px rgba(201,98,42,.25)"
          : "0 10px 28px rgba(0,0,0,.1)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "";
        e.currentTarget.style.boxShadow = isInCart ? "0 4px 20px rgba(201,98,42,.15)" : "0 2px 8px rgba(0,0,0,.06)";
      }}
    >
      {/* Badge de quantidade no carrinho */}
      {isInCart && (
        <div style={{
          position: "absolute", top: "12px", right: "12px",
          background: "#C9622A", color: "#fff",
          borderRadius: "50%", width: 28, height: 28,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: ".8rem", fontWeight: 800, zIndex: 1,
          boxShadow: "0 2px 8px rgba(201,98,42,.4)",
        }}>{cartQty}</div>
      )}

      {/* Barra colorida no topo */}
      <div style={{
        height: "4px",
        background: isInCart
          ? "linear-gradient(90deg, #C9622A, #E8833A)"
          : "linear-gradient(90deg, #E8DDD0, #F0EAE2)",
      }} />

      <div style={{ padding: "1.1rem" }}>
        <div style={{ marginBottom: ".6rem" }}>
          <h6 style={{
            margin: 0, fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "1.05rem", fontWeight: 700, color: "#1a1a1a",
            paddingRight: isInCart ? "2rem" : 0,
          }}>{item.name}</h6>
          <span style={{
            fontSize: ".68rem", color: "#bbb", letterSpacing: "1px",
            textTransform: "uppercase",
          }}>#{String(item.product_id).padStart(3, "0")}</span>
        </div>

        <p style={{
          margin: "0 0 .75rem", fontSize: ".82rem", color: "#777",
          lineHeight: 1.5,
          display: "-webkit-box", WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {item.description || "Sem descrição"}
        </p>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{
            fontSize: "1.15rem", fontWeight: 800, color: "#C9622A", fontFamily: "monospace",
          }}>
            R$ {fmt(item.price)}
          </span>
          <span style={{
            fontSize: ".75rem",
            color: isInCart ? "#C9622A" : "#aaa",
            fontWeight: isInCart ? 700 : 400,
          }}>
            {isInCart ? "✓ No pedido" : "Toque para adicionar"}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ShopPage({ items = [] }) {
  const [cart, setCart] = useState({});           // { product_id: { qty, note } }
  const [selectedItem, setSelectedItem] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [search, setSearch] = useState("");

  const filteredItems = items.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    (i.description || "").toLowerCase().includes(search.toLowerCase())
  );

  const addToCart = (item, qty, note) => {
    setCart(prev => ({ ...prev, [item.product_id]: { qty, note } }));
  };

  const handleConfirm = () => {
    setCart({});
  };

  const totalInCart = Object.values(cart).reduce((s, { qty }) => s + qty, 0);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; font-family: 'DM Sans', sans-serif; }
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes pop { 0% { transform: scale(.5) } 70% { transform: scale(1.15) } 100% { transform: scale(1) } }
        ::-webkit-scrollbar { width: 6px }
        ::-webkit-scrollbar-thumb { background: #DDD3C8; border-radius: 3px }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#F7F2EC", paddingBottom: "6rem" }}>

        {/* Header */}
        <div style={{
          background: "#FFFDF9",
          borderBottom: "1px solid #EDE8E0",
          padding: "1rem 1.5rem",
          position: "sticky", top: 0, zIndex: 100,
          boxShadow: "0 2px 12px rgba(0,0,0,.05)",
        }}>
          <div style={{ maxWidth: "900px", margin: "0 auto", display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: "180px" }}>
              <p style={{ margin: 0, fontSize: ".65rem", letterSpacing: "3px", textTransform: "uppercase", color: "#C9622A" }}>
                Cardápio
              </p>
              <h1 style={{
                margin: 0, fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "1.4rem", fontWeight: 800, color: "#1a1a1a",
              }}>Fazer Pedido</h1>
            </div>

            {/* Busca */}
            <div style={{ position: "relative", flex: 2, minWidth: "200px", maxWidth: "340px" }}>
              <span style={{
                position: "absolute", left: ".75rem", top: "50%", transform: "translateY(-50%)",
                fontSize: ".9rem", color: "#bbb",
              }}>🔍</span>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar item..."
                style={{
                  width: "100%", padding: ".6rem .75rem .6rem 2.2rem",
                  border: "2px solid #EDE8E0", borderRadius: "999px",
                  fontSize: ".875rem", fontFamily: "inherit", outline: "none",
                  background: "#F7F2EC", transition: "border-color .15s",
                }}
                onFocus={e => e.target.style.borderColor = "#C9622A"}
                onBlur={e => e.target.style.borderColor = "#EDE8E0"}
              />
            </div>

            {/* Contador do carrinho (mini) */}
            {totalInCart > 0 && (
              <div style={{
                background: "#FEF3EC", border: "2px solid #C9622A",
                borderRadius: "999px", padding: ".4rem 1rem",
                fontSize: ".8rem", fontWeight: 700, color: "#C9622A",
                whiteSpace: "nowrap",
              }}>
                🛒 {totalInCart} {totalInCart === 1 ? "item" : "itens"}
              </div>
            )}
          </div>
        </div>

        {/* Grid de produtos */}
        <div style={{ maxWidth: "900px", margin: "0 auto", padding: "1.5rem 1rem" }}>
          <p style={{ fontSize: ".8rem", color: "#aaa", marginBottom: "1.25rem" }}>
            {filteredItems.length} {filteredItems.length === 1 ? "item disponível" : "itens disponíveis"}
            {search && ` para "${search}"`}
          </p>

          {filteredItems.length === 0 ? (
            <div style={{ textAlign: "center", padding: "4rem 0", color: "#aaa" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem", opacity: .4 }}>🔍</div>
              <p style={{ fontWeight: 600, color: "#888" }}>Nenhum item encontrado</p>
            </div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: "1rem",
            }}>
              {filteredItems.map(item => (
                <ItemCard
                  key={item.product_id}
                  item={item}
                  cartQty={cart[item.product_id]?.qty || 0}
                  onClick={() => setSelectedItem(item)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

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

      {/* Modal de pagamento */}
      {showPayment && (
        <PaymentModal
          cart={cart}
          items={items}
          onClose={() => setShowPayment(false)}
          onConfirm={handleConfirm}
        />
      )}
    </>
  );
}