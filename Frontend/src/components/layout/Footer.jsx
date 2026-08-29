import { Link } from "react-router-dom";
import { useToast } from "../../context/ToastContext.jsx";
import "./Footer.css";

export default function Footer() {
  const { showToast } = useToast();

  function handleSubscribe(e) {
    e.preventDefault();
    showToast("Subscribed to updates");
    e.target.reset();
  }

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <p className="footer-brand">Cuddle & co.</p>
          <p className="footer-text">Soft toys and gifts for the little ones you love.</p>
        </div>
        <div>
          <p className="footer-heading">Shop</p>
          <Link to="/products?category=teddy-bears">Teddy bears</Link>
          <Link to="/products?category=gift-hampers">Gift hampers</Link>
          <Link to="/products?category=personalized">Personalized</Link>
        </div>
        <div>
          <p className="footer-heading">Support</p>
          <Link to="/contact">Contact us</Link>
          <Link to="/contact">Return policy</Link>
          <Link to="/my-orders">Track order</Link>
        </div>
        <div>
          <p className="footer-heading">Stay updated</p>
          <form className="footer-newsletter" onSubmit={handleSubscribe}>
            <input type="email" required placeholder="name@example.com" className="input" />
            <button className="btn btn-primary btn-sm" type="submit">
              Join
            </button>
          </form>
        </div>
      </div>
      <div className="container footer-bottom">
        <p>© 2026 Cuddle & co. All rights reserved.</p>
        <div className="footer-payments">
          <i className="ti ti-brand-visa" aria-hidden="true"></i>
          <i className="ti ti-brand-mastercard" aria-hidden="true"></i>
          <span className="footer-safepay">Safepay</span>
        </div>
      </div>
    </footer>
  );
}
