const API_ORIGIN = "https://dummyjson.com";
export const API_BASE = API_ORIGIN;

const MAX_PRODUCTS = 12;
const PER_CATEGORY_LIMIT = 4;
const HOME_CATEGORIES = [
  "home-decoration",
  "furniture",
  "kitchen-accessories",
];

async function getJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Product request failed (${response.status})`);
  return response.json();
}

function placeholderRating(id, rating) {
  return {
    rate: Number(rating || (4 + ((Number(id) || 1) % 10) / 10).toFixed(1)),
    count: 0,
  };
}

function toProduct(raw) {
  const id = Number(raw?.id);
  const title = String(raw?.title || raw?.name || "Home essential").trim();
  const price = Number(raw?.price);
  const images = Array.isArray(raw?.images) ? raw.images.filter(Boolean) : [];
  const image = raw?.thumbnail || images[0] || raw?.image || "";
  if (!Number.isFinite(id) || !Number.isFinite(price) || !title || !image) return null;

  const rawCategory = String(raw?.category || "home-essentials");
  const categoryNames = {
    "home-decoration": "Home Decor",
    furniture: "Furniture",
    "kitchen-accessories": "Kitchen",
  };

  return {
    id,
    title,
    price: Math.round(price * 83),
    category: categoryNames[rawCategory] || rawCategory.replaceAll("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase()),
    description: raw?.description || `A thoughtful everyday essential for your home. ${title} adds comfort and style to your space.`,
    image,
    images: images.length ? images : [image],
    rating: placeholderRating(id, raw?.rating),
  };
}

export async function fetchHomeEssentials() {
  const categoryResults = await Promise.allSettled(
    HOME_CATEGORIES.map((category) =>
      getJson(`${API_ORIGIN}/products/category/${category}?limit=${PER_CATEGORY_LIMIT}`)
    )
  );

  let rawProducts = categoryResults
    .filter((result) => result.status === "fulfilled")
    .flatMap((result) => result.value.products || []);

  if (rawProducts.length === 0) {
    const fallback = await getJson(`${API_ORIGIN}/products?limit=${MAX_PRODUCTS}`);
    rawProducts = fallback.products || [];
  }

  const uniqueProducts = [...new Map(rawProducts.map((product) => [product.id, product])).values()];
  const products = uniqueProducts.slice(0, MAX_PRODUCTS).map(toProduct).filter(Boolean);

  if (products.length === 0) throw new Error("Home essentials are unavailable right now. Please try again.");
  return products;
}
