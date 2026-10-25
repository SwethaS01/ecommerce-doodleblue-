
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "../components/ProductCard";
import { clearWishlist } from "../features/wishlist/wishlistSlice";
import { Link } from "react-router-dom";

function Wishlist() {
  const dispatch = useDispatch();

  const wishlistItems = useSelector(
    (state) => state.wishlist.items
  );

  return (
    <main className="container wishlist-page">
      <div className="wishlist-heading">
        <div>
          <p className="eyebrow">YOUR FAVORITES</p>
          <h1>My Wishlist</h1>
          <p className="muted-text">{wishlistItems.length} {wishlistItems.length === 1 ? "saved product" : "saved products"}</p>
        </div>

        {wishlistItems.length > 0 && (
          <button
            type="button"
            className="secondary-btn"
            onClick={() => dispatch(clearWishlist())}
          >
            Clear Wishlist
          </button>
        )}
      </div>

      {wishlistItems.length > 0 ? (
        <section className="product-grid">
          {wishlistItems.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>
      ) : (
        <div className="wishlist-empty">
          <div className="wishlist-heart">♡</div>
          <h2>Your wishlist is empty</h2>
          <p>Save products you love and find them here later.</p>
          <Link to="/" className="button">
            Explore Home Essentials
          </Link>
        </div>
      )}
    </main>
  );
}

export default Wishlist;
