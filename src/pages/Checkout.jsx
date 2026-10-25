import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../features/cart/cartSlice";
import { formatPrice } from "../utils/currency";

function Checkout() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const [receipt, setReceipt] = useState(null);
  const [customer, setCustomer] = useState({ name: "", email: "", address: "" });
  const [paymentMethod, setPaymentMethod] = useState("UPI");

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal === 0 || subtotal >= 5000 ? 0 : 99;
  const total = subtotal + shipping;

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!cartItems.length) return;
    const order = {
      orderId: `HH-${Date.now().toString().slice(-8)}`,
      date: new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }),
      customer: { ...customer },
      paymentMethod,
      items: cartItems.map((item) => ({ ...item })),
      subtotal,
      shipping,
      total,
    };
    setReceipt(order);
    dispatch(clearCart());
  };

  if (receipt) {
    return (
      <main className="container receipt-page">
        <section className="receipt-card" id="print-receipt">
          <div className="receipt-success-icon">✓</div>
          <p className="eyebrow">HOMEHAVEN ORDER CONFIRMED</p>
          <h1>Thank you for your order!</h1>
          <p className="muted-text">This is a demo order receipt. No real payment was processed.</p>
          <div className="receipt-meta">
            <div><span>Receipt number</span><strong>{receipt.orderId}</strong></div>
            <div><span>Date</span><strong>{receipt.date}</strong></div>
            <div><span>Payment method</span><strong>{receipt.paymentMethod} · Demo</strong></div>
          </div>
          <div className="receipt-customer">
            <h2>Delivery details</h2>
            <p><strong>{receipt.customer.name}</strong></p>
            <p>{receipt.customer.email}</p>
            <p>{receipt.customer.address}</p>
          </div>
          <div className="receipt-items">
            <h2>Items purchased</h2>
            {receipt.items.map((item) => (
              <div className="receipt-line" key={item.id}>
                <span>{item.title} × {item.quantity}</span>
                <strong>{formatPrice(item.price * item.quantity)}</strong>
              </div>
            ))}
          </div>
          <div className="receipt-totals">
            <div><span>Subtotal</span><span>{formatPrice(receipt.subtotal)}</span></div>
            <div><span>Shipping</span><span>{receipt.shipping === 0 ? "FREE" : formatPrice(receipt.shipping)}</span></div>
            <div className="receipt-grand-total"><strong>Total paid (demo)</strong><strong>{formatPrice(receipt.total)}</strong></div>
          </div>
          <p className="receipt-thanks">HomeHaven · Thoughtful essentials for a happier home.</p>
        </section>
        <div className="receipt-actions no-print">
          <button type="button" className="button" onClick={() => window.print()}>Print receipt</button>
          <Link to="/" className="button button-secondary">Continue shopping</Link>
        </div>
      </main>
    );
  }

  if (!cartItems.length) {
    return (
      <main className="container">
        <section className="empty-cart">
          <div className="empty-cart-icon">🧾</div>
          <h1>No items to checkout</h1>
          <p className="muted-text">Add something lovely for your home first.</p>
          <Link to="/" className="button">Explore HomeHaven</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="container checkout-page">
      <div className="page-intro">
        <div><p className="eyebrow">SAFE & SIMPLE CHECKOUT</p><h1>Complete your order</h1><p className="muted-text">Enter delivery details to create your demo receipt.</p></div>
      </div>
      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <h2>Delivery details</h2>
          <label>Full name<input required autoComplete="name" value={customer.name} onChange={(event) => setCustomer({ ...customer, name: event.target.value })} placeholder="Your full name" /></label>
          <label>Email address<input required type="email" autoComplete="email" value={customer.email} onChange={(event) => setCustomer({ ...customer, email: event.target.value })} placeholder="you@example.com" /></label>
          <label>Delivery address<textarea required rows="3" autoComplete="street-address" value={customer.address} onChange={(event) => setCustomer({ ...customer, address: event.target.value })} placeholder="House number, street, city, PIN code" /></label>
          <h2>Payment method</h2>
          <div className="payment-options">
            {[
              ["UPI", "UPI / QR"],
              ["Card", "Credit / debit card"],
              ["COD", "Cash on delivery"],
            ].map(([value, label]) => (
              <label className={`payment-option ${paymentMethod === value ? "selected" : ""}`} key={value}>
                <input type="radio" name="payment" value={value} checked={paymentMethod === value} onChange={() => setPaymentMethod(value)} />
                <span>{label}</span>
              </label>
            ))}
          </div>
          <p className="demo-payment-note">Demo checkout only: this project does not collect card details or process real payments.</p>
          <button className="button checkout-submit" type="submit">Confirm demo order · {formatPrice(total)}</button>
        </form>
        <aside className="order-summary checkout-summary">
          <h2>Your order</h2>
          {cartItems.map((item) => <div className="checkout-product" key={item.id}><span>{item.title} × {item.quantity}</span><strong>{formatPrice(item.price * item.quantity)}</strong></div>)}
          <div className="summary-divider" />
          <div className="summary-row"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
          <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? "FREE" : formatPrice(shipping)}</span></div>
          <div className="summary-divider" />
          <div className="summary-row summary-total"><span>Total</span><span>{formatPrice(total)}</span></div>
          <Link to="/cart" className="continue-shopping">← Back to cart</Link>
        </aside>
      </div>
    </main>
  );
}

export default Checkout;
