import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";

function Header({ authenticated, onLogout }) {
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const [session, setSession] = useState(null);

  useEffect(() => {
    try { setSession(JSON.parse(localStorage.getItem("homehaven-session") || "null")); }
    catch { setSession(null); }
  }, [authenticated]);

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  function logout() {
    localStorage.removeItem("homehaven-session");
    onLogout?.();
    setSession(null);
    navigate("/login", { replace: true });
  }

  return (
    <header className="header">
      <div className="header-inner">
        <Link to={authenticated ? "/" : "/login"} className="logo"><span>H</span>omeHaven</Link>
        <nav className="nav-links">
          {!authenticated ? (
            <NavLink to="/login" className="account-first">Account</NavLink>
          ) : (
            <>
              <NavLink to="/" end>Products</NavLink>
              <NavLink to="/wishlist">Wishlist <span className="cart-badge">{wishlistItems.length}</span></NavLink>
              <span className="header-user">{session?.name ? `Hi, ${session.name.split(" ")[0]}` : "Account"}</span>
              <NavLink to="/cart">Cart <span className="cart-badge">{cartCount}</span></NavLink>
              <button type="button" className="logout-button" onClick={logout}>Log out</button>
            </>
          )}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}

export default Header;
