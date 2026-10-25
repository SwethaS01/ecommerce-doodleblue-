import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../features/cart/cartSlice";
import { toggleWishlist } from "../features/wishlist/wishlistSlice";
import { formatPrice } from "../utils/currency";
import { handleImageError } from "../utils/imageFallback";

function ProductCard({ product }) {
  const dispatch = useDispatch();
  const [toast, setToast] = useState("");
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const isWishlisted = wishlistItems.some((item) => item.id === product.id);

  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity: 1 }));
    setToast(`${product.title} added to cart`);
    window.setTimeout(() => setToast(""), 2600);
  };

  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <button type="button" className={`wishlist-button ${isWishlisted ? "active" : ""}`} onClick={() => dispatch(toggleWishlist(product))} aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"} aria-pressed={isWishlisted}>
          {isWishlisted ? "♥" : "♡"}
        </button>
        <Link to={`/product/${product.id}`} className="product-image-link">
          <img src={product.image} alt={product.title} className="product-image" loading="lazy" onError={handleImageError} />
        </Link>
      </div>
      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <Link to={`/product/${product.id}`} className="product-title-link"><span className="product-title">{product.title}</span></Link>
        <p className="product-rating"><span>★</span> {product.rating?.rate ?? "N/A"}<span className="rating-count"> ({product.rating?.count ?? 0} reviews)</span></p>
        <div className="product-card-bottom">
          <span className="product-price">{formatPrice(product.price)}</span>
          <button type="button" className="button button-small" onClick={handleAddToCart}>Add to cart</button>
        </div>
        {toast && <div className="toast-message" role="status"><span>✓</span>{toast}</div>}
      </div>
    </article>
  );
}

export default ProductCard;
