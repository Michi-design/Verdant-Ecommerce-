export const CURRENCY = import.meta.env.VITE_CURRENCY || "USD";

export const formatPrice = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: CURRENCY,
    maximumFractionDigits: 2,
  }).format(amount);

export const categories = [
  { slug: "home-decor", name: "Home Décor", image: "photo-1616486338812-3dadae4b4ace" },
  { slug: "kitchen-dining", name: "Kitchen & Dining", image: "photo-1600210492486-724fe5c67fb0" },
  { slug: "mirrors", name: "Mirrors", image: "photo-1618221195710-dd6b41faaea6" },
  { slug: "storage", name: "Storage & Organization", image: "photo-1600607687920-4e2a09cf159d" },
  { slug: "tableware", name: "Tableware", image: "photo-1615874694520-474822394e73" },
  { slug: "everyday-essentials", name: "Everyday Essentials", image: "photo-1600566753086-00f18fb6b3ea" },
];

export const imageUrl = (id, width = 1000) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=82`;

const galleryImages = {
  "home-decor": "photo-1600607687920-4e2a09cf159d",
  "kitchen-dining": "photo-1615874694520-474822394e73",
  mirrors: "photo-1600210492486-724fe5c67fb0",
  storage: "photo-1600566753190-17f0baa2a6c3",
  tableware: "photo-1615874694520-474822394e73",
  "everyday-essentials": "photo-1610701596007-11502861dcfa",
};

const item = (id, slug, name, category, price, image, description, options = {}) => ({
  id, slug, name, category, price, image: imageUrl(image, 1100),
  gallery: [imageUrl(image, 1400), imageUrl(options.secondImage || galleryImages[category] || image, 1000)],
  description,
  longDescription: options.longDescription || `${description} Thoughtfully chosen for its considered form and everyday usefulness, it brings a quiet sense of intention to your home.`,
  stockStatus: options.stockStatus || "in-stock",
  variants: options.variants || [],
  dimensions: options.dimensions || "Please refer to product packaging for exact measurements.",
  materials: options.materials || "Material details available on product packaging.",
  care: options.care || "Wipe clean with a soft, dry cloth.",
  tags: options.tags || [],
  featured: Boolean(options.featured),
  newArrival: Boolean(options.newArrival),
  createdAt: options.createdAt || (options.newArrival ? "2026-10-01" : "2026-08-01"),
});

export const products = [
  item("vl-001", "arc-ceramic-vase", "Arc Ceramic Vase", "home-decor", 68, "photo-1578749556568-bc2c40e68b61", "A softly sculpted ceramic vase with a naturally tactile finish.", { featured: true, newArrival: true, materials: "Glazed stoneware", dimensions: "H 28 × W 17 cm", variants: ["Chalk", "Moss"], tags: ["ceramic", "pottery", "flowers", "shelf decor"] }),
  item("vl-002", "forma-stoneware-bowl", "Forma Stoneware Bowl", "tableware", 42, "photo-1610701596007-11502861dcfa", "Hand-finished stoneware with a gentle, organic silhouette.", { featured: true, materials: "Stoneware", variants: ["Ivory", "Olive"], tags: ["ceramic", "decorative bowl", "serving", "pottery"] }),
  item("vl-003", "hearth-candleholders", "Hearth Candleholders", "home-decor", 54, "photo-1603006905003-be475563bc59", "A sculptural pair that brings a warm, considered glow to the table.", { featured: true, newArrival: true, materials: "Brushed metal", variants: ["Antique brass", "Forest"], tags: ["candle", "candle holder", "lighting", "decor"] }),
  item("vl-004", "oak-serving-board", "Oak Serving Board", "kitchen-dining", 76, "photo-1603199506016-b9a594b593c0", "A generous serving board crafted for relaxed gatherings.", { featured: true, materials: "Solid oak", care: "Hand wash and dry promptly. Treat periodically with food-safe oil.", tags: ["kitchen", "wood", "cheese board", "serving"] }),
  item("vl-005", "atelier-glass-set", "Atelier Glass Set", "tableware", 48, "photo-1547592180-85f173990554", "A set of four clear glasses with an understated, balanced profile.", { featured: true, newArrival: true, materials: "Mouth-blown borosilicate glass", variants: ["Set of 4"], tags: ["drinking glass", "glassware", "drinkware"] }),
  item("vl-006", "linen-table-runner", "Linen Table Runner", "kitchen-dining", 64, "photo-1600210492486-724fe5c67fb0", "Soft woven linen that brings an easy, natural layer to dining.", { featured: true, materials: "European flax linen", variants: ["Oat", "Sage"], tags: ["linen", "table linen", "dining", "textile"] }),
  item("vl-007", "form-wall-mirror", "Form Wall Mirror", "mirrors", 195, "photo-1618221195710-dd6b41faaea6", "A refined wall mirror with a softly rounded frame.", { featured: true, newArrival: true, materials: "Glass, oak veneer", dimensions: "H 80 × W 55 cm", tags: ["wall mirror", "oak", "entryway", "decor"] }),
  item("vl-008", "woven-storage-basket", "Woven Storage Basket", "storage", 58, "photo-1600607687920-4e2a09cf159d", "A softly structured basket for gathering everyday essentials.", { featured: true, materials: "Woven seagrass", variants: ["Small", "Large"], tags: ["woven", "basket", "organization", "natural"] }),
  item("vl-009", "ceramic-oil-bottle", "Ceramic Oil Bottle", "kitchen-dining", 36, "photo-1490312278390-ab64016e0aa9", "A useful countertop companion with a considered ceramic shape.", { newArrival: true, materials: "Glazed stoneware", variants: ["Cream", "Sage"], tags: ["oil dispenser", "kitchen storage", "ceramic"] }),
  item("vl-010", "everyday-serving-tray", "Everyday Serving Tray", "everyday-essentials", 52, "photo-1603199506016-b9a594b593c0", "A versatile tray for serving, styling, and keeping small things in order.", { featured: true, materials: "Oak wood", tags: ["tray", "wood", "serving", "organizer"] }),
  item("vl-011", "ribbed-glass-carafe", "Ribbed Glass Carafe", "tableware", 44, "photo-1547592180-85f173990554", "A clear glass carafe with subtle ribbing and an easy-pour shape.", { newArrival: true, materials: "Recycled glass", tags: ["glass", "carafe", "jug", "drinkware"] }),
  item("vl-012", "cast-iron-casserole", "Cast Iron Casserole", "kitchen-dining", 148, "photo-1556911220-bff31c812dba", "A dependable kitchen staple designed for slow, generous cooking.", { materials: "Enameled cast iron", variants: ["Sage", "Cream"], dimensions: "3.5 L capacity", tags: ["cookware", "pot", "cast iron", "cooking"] }),
  item("vl-013", "oval-decorative-mirror", "Oval Decorative Mirror", "mirrors", 168, "photo-1616486338812-3dadae4b4ace", "An elegant oval mirror that adds light and quiet character.", { newArrival: true, materials: "Glass, powder-coated metal", dimensions: "H 72 × W 42 cm", tags: ["oval mirror", "wall mirror", "decor"] }),
  item("vl-014", "stackable-pantry-jars", "Stackable Pantry Jars", "storage", 39, "photo-1600566753086-00f18fb6b3ea", "Clear, stackable jars that make pantry staples easy to see.", { materials: "Borosilicate glass, beech lid", variants: ["Set of 3"], tags: ["pantry", "jar", "kitchen storage", "glass"] }),
  item("vl-015", "cotton-kitchen-towels", "Cotton Kitchen Towels", "everyday-essentials", 32, "photo-1600210492486-724fe5c67fb0", "A practical set of soft, absorbent woven cotton towels.", { newArrival: true, materials: "Woven cotton", variants: ["Set of 2"], tags: ["kitchen linen", "tea towel", "cotton", "textile"] }),
  item("vl-016", "sculpted-bud-vase", "Sculpted Bud Vase", "home-decor", 34, "photo-1578749556568-bc2c40e68b61", "A small sculptural vase for a single stem or considered shelf styling.", { materials: "Glazed stoneware", variants: ["Chalk", "Moss"], tags: ["ceramic", "bud vase", "flowers", "pottery"] }),
  item("vl-017", "low-stoneware-platter", "Low Stoneware Platter", "tableware", 62, "photo-1610701596007-11502861dcfa", "A generous low platter made for sharing food and simple moments.", { materials: "Stoneware", dimensions: "Ø 32 cm", tags: ["ceramic", "serving dish", "platter", "pottery"] }),
  item("vl-018", "woven-catchall-bowl", "Woven Catchall Bowl", "storage", 46, "photo-1600607687920-4e2a09cf159d", "A tactile catchall for keys, linens, or small household objects.", { newArrival: true, materials: "Woven seagrass", tags: ["woven", "catchall", "organizer", "bowl"] }),
  item("vl-019", "olivewood-utensil-set", "Olivewood Utensil Set", "kitchen-dining", 49, "photo-1556911220-bff31c812dba", "A useful set of smooth wooden utensils for everyday kitchen preparation.", { materials: "Olivewood", care: "Hand wash and dry promptly. Do not soak.", variants: ["Set of 4"], tags: ["kitchen utensils", "wooden spoon", "cooking tools", "olivewood"] }),
];

export const getCategoryName = (slug) => categories.find((category) => category.slug === slug)?.name || slug;
