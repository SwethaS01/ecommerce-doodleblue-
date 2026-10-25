
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { fetchProducts } from "../features/products/productsSlice";
import { addToCart } from "../features/cart/cartSlice";
import QuantityStepper from "../components/QuantityStepper";
import { CURRENCY, formatPrice } from "../utils/currency";
import { handleImageError } from "../utils/imageFallback";

function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { items, status, error } = useSelector(
    (state) => state.products
  );

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
    }
  }, [dispatch, status]);

  const product = items.find((item) => item.id === Number(id));

  const handleAddToCart = () => {
    if (!product) return;

    dispatch(addToCart({ product, quantity }));
    setAdded(true);
  };

  if (status === "idle" || status === "loading") {
    return (
      <main className="container">
        <p className="status-message">Loading product...</p>
      </main>
    );
  }

  if (status === "failed") {
    return (
      <main className="container">
        <div className="error-message">
          <p>Couldn't load product. {error}</p>
          <button
            className="button"
            onClick={() => dispatch(fetchProducts())}
          >
            Try again
          </button>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="container">
        <h2>Product not found</h2>
        <Link to="/" className="button">
          Back to products
        </Link>
      </main>
    );
  }

  return (
    <main className="container">
      <div className="breadcrumb">
        <Link to="/">Products</Link>
        <span>/</span>
        <span>{product.category}</span>
      </div>

      <section className="detail-panel">
      <section className="detail-layout">
        <div className="detail-image-column">
        <div className="detail-image-wrap">
          <img
            src={product.image}
            alt={product.title}
            className="detail-image"
            onError={handleImageError}
          />
          {product.images?.filter((image) => image && image !== product.image).length > 0 && (
            <div className="detail-image-gallery" aria-label="More product photos">
              {product.images.filter((image) => image && image !== product.image).map((image, index) => (
                <img key={`${image}-${index}`} src={image} alt={`${product.title} view ${index + 2}`} onError={handleImageError} loading="lazy" />
              ))}
            </div>
          )}
        </div>
        </div>

        <div className="detail-info">
          <p className="eyebrow">{product.category}</p>

          <h1 className="detail-title">{product.title}</h1>

          <div className="detail-rating">
            <span>★</span> {product.rating?.rate ?? "N/A"}
            <span className="rating-count">
              ({product.rating?.count ?? 0} reviews)
            </span>
          </div>

          <p className="detail-price">
            {formatPrice(product.price)}
          </p>

          <p className="detail-description">
            {product.description}
          </p>

          <div className="detail-quantity">
            <span className="field-label">Quantity</span>

            <QuantityStepper
              quantity={quantity}
              onIncrease={() => {
                setQuantity((current) => current + 1);
                setAdded(false);
              }}
              onDecrease={() => {
                setQuantity((current) => Math.max(1, current - 1));
                setAdded(false);
              }}
            />
          </div>

          <button
            className="button detail-add-button"
            onClick={handleAddToCart}
          >
            {added ? "Add more to cart" : "Add to cart"} ·{" "}
            {formatPrice(product.price * quantity)}
          </button>

          {added && (
            <p className="success-message">
              ✓ Added {quantity} item(s) to your cart!
              {" "}
              <Link to="/cart">View cart</Link>
            </p>
          )}

          <p className="shipping-note">
            Free shipping on orders of {CURRENCY}5,000 or more.
          </p>
        </div>
      </section>
      </section>

      <section className="recommendations-section">
        <div className="recommendations-heading">
          <div>
            <p className="eyebrow">MORE TO LOVE</p>
            <h2>You may also like</h2>
          </div>
          <Link to="/" className="recommendations-view-all">View all products</Link>
        </div>
        <div className="recommendations-grid">
          {items.filter((item) => item.id !== product.id).slice(0, 4).map((item) => (
            <Link to={`/product/${item.id}`} className="recommendation-card" key={item.id}>
              <div className="recommendation-image-wrap">
                <img src={item.image} alt={item.title} loading="lazy" onError={handleImageError} />
              </div>
              <div className="recommendation-info">
                <span className="product-category">{item.category}</span>
                <h3>{item.title}</h3>
                <p className="recommendation-price">{formatPrice(item.price)}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

export default ProductDetail;
