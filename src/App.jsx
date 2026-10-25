import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "./components/Header";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import Auth from "./pages/Auth";

function hasSession() {
  try { return Boolean(JSON.parse(localStorage.getItem("homehaven-session") || "null")); }
  catch { return false; }
}

function ProtectedRoute({ children }) {
  const location = useLocation();
  return hasSession() ? children : <Navigate to="/login" replace state={{ from: location.pathname }} />;
}

function AppRoutes() {
  const [authenticated, setAuthenticated] = useState(hasSession);
  const location = useLocation();

  useEffect(() => {
    setAuthenticated(hasSession());
  }, [location.pathname]);

  return (
    <>
      <Header authenticated={authenticated} onLogout={() => setAuthenticated(false)} />
      <Routes>
        <Route path="/login" element={hasSession() ? <Navigate to="/" replace /> : <Auth onAuthenticated={() => setAuthenticated(true)} />} />
        <Route path="/signup" element={hasSession() ? <Navigate to="/" replace /> : <Auth onAuthenticated={() => setAuthenticated(true)} />} />
        <Route path="/" element={<ProtectedRoute><ProductList /></ProtectedRoute>} />
        <Route path="/product/:id" element={<ProtectedRoute><ProductDetail /></ProtectedRoute>} />
        <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to={hasSession() ? "/" : "/login"} replace />} />
      </Routes>
    </>
  );
}

function App() {
  return <BrowserRouter><AppRoutes /></BrowserRouter>;
}

export default App;
