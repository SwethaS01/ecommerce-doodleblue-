
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../features/products/productsSlice";
import ProductCard from "../components/ProductCard";

function ProductList() {
  const dispatch = useDispatch();

  const { items, status, error } = useSelector(
    (state) => state.products
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState("default");

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
    }
  }, [dispatch, status]);

  const categories = useMemo(
    () => [...new Set(items.map((product) => product.category))],
    [items]
  );

  const filteredProducts = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    const result = items.filter((product) => {
      const matchesSearch =
        product.title.toLowerCase().includes(search) ||
        product.category.toLowerCase().includes(search);

      const matchesCategory =
        selectedCategory === "all" ||
        product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    if (sortOrder === "low-to-high") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "high-to-low") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortOrder === "name") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [items, searchTerm, selectedCategory, sortOrder]);

  if (status === "loading" && items.length === 0) {
    return (
      <main className="container">
        <p className="status-message">Loading products...</p>
      </main>
    );
  }

  if (status === "failed" && items.length === 0) {
    return (
      <main className="container">
        <p className="error-message">
          {error || "Unable to load products."}
        </p>
        <button
          className="button"
          onClick={() => dispatch(fetchProducts())}
        >
          Try again
        </button>
      </main>
    );
  }

  return (
    <main className="container">
      <section className="page-intro">
        <div>
          <p className="eyebrow">HOMEHAVEN · HOME ESSENTIALS</p>
          <h1>Make yourself at home.</h1>
          <p className="muted-text">
            Furniture, decor, and everyday essentials to make your space feel like you.
          </p>
        </div>

        <p className="result-count">
          {filteredProducts.length} products
        </p>
      </section>

      <section className="filter-toolbar">
        <div className="category-list">
          <button
            type="button"
            className={`category-chip ${
              selectedCategory === "all" ? "active" : ""
            }`}
            onClick={() => setSelectedCategory("all")}
          >
            All
          </button>

          {categories.map((category) => (
            <button
              type="button"
              key={category}
              className={`category-chip ${
                selectedCategory === category ? "active" : ""
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <input
          type="search"
          className="search-input"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          aria-label="Search products"
        />

        <select
          className="sort-select"
          value={sortOrder}
          onChange={(event) => setSortOrder(event.target.value)}
          aria-label="Sort products"
        >
          <option value="default">Featured</option>
          <option value="low-to-high">Price: Low to High</option>
          <option value="high-to-low">Price: High to Low</option>
          <option value="name">Name: A to Z</option>
        </select>
      </section>

      {filteredProducts.length > 0 ? (
        <section className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>
      ) : (
        <section className="search-empty">
          <h2>No products found</h2>
          <p>Try another search term or category.</p>

          <button
            type="button"
            className="button"
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("all");
              setSortOrder("default");
            }}
          >
            Reset filters
          </button>
        </section>
      )}
    </main>
  );
}

export default ProductList;
