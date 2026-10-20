import { products, categories } from "../data/config.js";

const demoProductService = {
  async getProducts() { return products; },
  async getProductBySlug(slug) { return products.find((product) => product.slug === slug) || null; },
  async getCategories() { return categories; },
  async getFeaturedProducts() { return products.filter((product) => product.featured); },
  async searchProducts(query) {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];
    return products.filter((product) =>
      [product.name, product.category, product.description, ...product.tags].join(" ").toLowerCase().includes(normalized),
    );
  },
  async getRelatedProducts(productId) {
    const product = products.find((entry) => entry.id === productId);
    return product ? products.filter((entry) => entry.id !== productId && entry.category === product.category).slice(0, 4) : [];
  },
};

export const productService = demoProductService;
