import React from "react";
import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, Route, Routes, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  ArrowDownRight, ArrowLeft, ArrowRight, Check, ChevronDown, ChevronRight,
  Heart, Menu, Minus, Plus, Search, ShoppingBag, SlidersHorizontal, Sparkles, X,
} from "lucide-react";
import { categories, formatPrice, getCategoryName, imageUrl, products } from "./data/config.js";
import { productService } from "./services/productService.js";
import { useStore } from "./context/StoreContext.jsx";

const fallbackImage = `${import.meta.env.BASE_URL}images/image-fallback.svg`;

function SafeImage({ src, alt = "", ...props }) {
  const [failedSrc, setFailedSrc] = useState("");
  const displaySrc = failedSrc === src ? fallbackImage : src;
  return <img {...props} src={displaySrc} alt={alt} onError={() => {
    if (displaySrc !== fallbackImage) setFailedSrc(src);
  }} />;
}

const navItems = [
  ["Shop", "/shop"], ["Collections", "/shop"], ["Kitchen & Dining", "/shop?category=kitchen-dining"],
  ["Home Décor", "/shop?category=home-decor"], ["Mirrors", "/shop?category=mirrors"], ["Storage", "/shop?category=storage"],
  ["Our Story", "/our-story"],
];

function Header() {
  const { cart, wishlist } = useStore();
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [announcement, setAnnouncement] = useState(true);
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products.filter((product) => `${product.name} ${getCategoryName(product.category)} ${product.description} ${product.tags.join(" ")}`.toLowerCase().includes(q)).slice(0, 5);
  }, [query]);
  const cartCount = cart.reduce((total, line) => total + line.quantity, 0);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") { setSearchOpen(false); setMenuOpen(false); }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return <>
    {announcement && <div className="announcement"><span>Thoughtfully chosen pieces for a more beautiful home.</span><button aria-label="Dismiss announcement" onClick={() => setAnnouncement(false)}><X size={13} /></button></div>}
    <header className="site-header">
      <button className="icon-button menu-toggle" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
      <Link className="wordmark" to="/" aria-label="Verdant Living home">VERDANT <span>LIVING</span><small>ELEVATE THE EVERYDAY.</small></Link>
      <nav className="desktop-nav" aria-label="Main navigation">
        {navItems.map(([label, to], index) => <NavLink key={`${label}-${index}`} to={to} end={to === "/shop"} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>{label}</NavLink>)}
      </nav>
      <div className="header-actions">
        <button className="icon-button" aria-label="Open search" onClick={() => setSearchOpen(true)}><Search /></button>
        <Link className="icon-button account-icon" to="/contact" aria-label="Contact customer support"><UserIcon /></Link>
        <Link className="icon-button count-icon" to="/wishlist" aria-label={`Wishlist, ${wishlist.length} saved items`}><Heart /><span>{wishlist.length}</span></Link>
        <Link className="icon-button count-icon" to="/cart" aria-label={`Shopping bag, ${cartCount} items`}><ShoppingBag /><span>{cartCount}</span></Link>
      </div>
      {menuOpen && <nav className="mobile-menu" id="mobile-navigation" aria-label="Mobile navigation">
        <p className="eyebrow">Explore VERDANT LIVING</p>
        {navItems.map(([label, to], index) => <Link key={`${label}-${index}`} to={to} onClick={() => setMenuOpen(false)}>{label}<ArrowRight size={16} /></Link>)}
        <div className="mobile-menu-bottom"><Link to="/wishlist" onClick={() => setMenuOpen(false)}>Wishlist ({wishlist.length})</Link><Link to="/contact" onClick={() => setMenuOpen(false)}>Customer care</Link></div>
      </nav>}
    </header>
    {searchOpen && <div className="search-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSearchOpen(false); }}>
      <section className="search-panel" role="dialog" aria-modal="true" aria-label="Product search">
        <div className="search-top"><span className="eyebrow">Find something considered</span><button className="icon-button" aria-label="Close search" onClick={() => setSearchOpen(false)}><X /></button></div>
        <label className="search-field"><Search size={20} /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search home, kitchen, and more" /><button aria-label="Clear search" onClick={() => setQuery("")}><X size={16} /></button></label>
        {!query.trim() ? <div className="search-suggestions"><p className="eyebrow">Popular categories</p>{categories.slice(0, 4).map((category) => <Link key={category.slug} to={`/shop?category=${category.slug}`} onClick={() => setSearchOpen(false)}>{category.name}<ArrowRight size={15} /></Link>)}</div> :
          <div className="search-results">{results.length ? results.map((product) => <Link className="search-result" key={product.id} to={`/product/${product.slug}`} onClick={() => setSearchOpen(false)}><SafeImage src={product.image} alt="" /><span>{product.name}<small>{getCategoryName(product.category)}</small></span><b>{formatPrice(product.price)}</b></Link>) : <p className="empty-note">No pieces found for “{query}”. Try another search.</p>}</div>}
        <Link className="text-link search-all" to={`/shop?q=${encodeURIComponent(query)}`} onClick={() => setSearchOpen(false)}>View all results <ArrowRight size={15} /></Link>
      </section>
    </div>}
  </>;
}

function UserIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="21" height="21"><circle cx="12" cy="8" r="3.5" /><path d="M4.5 20c.6-3.5 3.5-5.5 7.5-5.5s6.9 2 7.5 5.5" /></svg>;
}

function Footer() {
  return <footer className="site-footer">
    <div className="footer-main">
      <div className="footer-brand"><Link className="wordmark footer-wordmark" to="/">VERDANT <span>LIVING</span><small>ELEVATE THE EVERYDAY.</small></Link><p>Thoughtfully selected home essentials that bring beauty and function to everyday living.</p></div>
      <div><h3>Explore</h3><Link to="/shop">Shop all</Link><Link to="/shop?category=home-decor">Home décor</Link><Link to="/shop?category=kitchen-dining">Kitchen & dining</Link><Link to="/shop?category=mirrors">Mirrors</Link><Link to="/our-story">Our story</Link></div>
      <div><h3>Customer care</h3><Link to="/contact">Contact us</Link><Link to="/faq">Frequently asked questions</Link><Link to="/shipping">Shipping information</Link><Link to="/returns">Returns information</Link></div>
      <div><h3>Information</h3><Link to="/privacy">Privacy policy</Link><Link to="/terms">Terms & conditions</Link><p className="placeholder-contact">Contact details to be supplied by store owner.</p></div>
    </div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} Verdant Living · Demo storefront</span><span>Designed for considered living.</span></div>
  </footer>;
}

function ProductCard({ product }) {
  const { wishlist, toggleWishlist, addToCart } = useStore();
  const saved = wishlist.includes(product.id);
  return <article className="product-card">
    <div className="product-image-wrap">
      <Link to={`/product/${product.slug}`} aria-label={`View ${product.name}`}><SafeImage loading="lazy" src={product.image} alt={product.name} /></Link>
      {product.newArrival && <span className="product-label">New arrival</span>}
      <button className={`wishlist-button ${saved ? "saved" : ""}`} aria-label={saved ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`} aria-pressed={saved} onClick={() => toggleWishlist(product.id)}><Heart size={18} fill={saved ? "currentColor" : "none"} /></button>
      <button className="quick-add" disabled={product.stockStatus !== "in-stock"} onClick={() => addToCart(product, 1, product.variants[0] || "")}><span>{product.stockStatus === "in-stock" ? "Add to bag" : "Unavailable"}</span><Plus size={16} /></button>
    </div>
    <div className="product-card-meta"><div><Link className="product-name" to={`/product/${product.slug}`}>{product.name}</Link><p>{getCategoryName(product.category)}</p></div><span className="product-price">{formatPrice(product.price)}</span></div>
  </article>;
}

function SectionHeading({ eyebrow, title, copy, link, linkText }) {
  return <div className="section-heading"><div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2>{copy && <p>{copy}</p>}</div>{link && <Link className="text-link section-link" to={link}>{linkText || "Explore all"} <ArrowRight size={16} /></Link>}</div>;
}

function HomePage() {
  const featured = products.filter((product) => product.featured).slice(0, 4);
  const arrivals = products.filter((product) => product.newArrival).slice(0, 4);
  return <main>
    <section className="hero">
      <div className="hero-copy"><span className="eyebrow hero-kicker"><span /> A quieter kind of home</span><h1>Make room for <em>beautiful</em> living.</h1><p>Thoughtfully selected home essentials that bring beauty, function, and a sense of calm to every corner.</p><div className="hero-actions"><Link className="button button-dark" to="/shop">Explore the collection <ArrowRight size={16} /></Link><Link className="underlined-link" to="/our-story">Discover our story</Link></div><div className="hero-note"><span>01</span><span>Considered pieces for everyday rituals</span></div></div>
      <div className="hero-image"><SafeImage src={imageUrl("photo-1600210492486-724fe5c67fb0", 1800)} alt="A calm living room with natural textures and warm neutral furnishings" /><div className="hero-image-caption"><span>Living, thoughtfully</span><ArrowDownRight size={18} /></div></div>
      <span className="hero-index">VERDANT LIVING&nbsp; — &nbsp;EST. IN EVERYDAY</span>
    </section>
    <section className="category-section page-section">
      <SectionHeading eyebrow="The considered edit" title="Find your feeling at home." link="/shop" linkText="Shop all pieces" />
      <div className="category-grid">{categories.map((category, index) => <Link className="category-card" key={category.slug} to={`/shop?category=${category.slug}`}><SafeImage src={imageUrl(category.image, 720)} alt="" loading="lazy" /><div><span>0{index + 1}</span><h3>{category.name}</h3><ArrowRight size={18} /></div></Link>)}</div>
    </section>
    <section className="bestsellers page-section">
      <SectionHeading eyebrow="Loved for a reason" title="Everyday favourites." copy="Pieces with thoughtful form, made to find their place in your home." link="/shop?sort=featured" />
      <ProductGrid list={featured} />
    </section>
    <section className="editorial">
      <div className="editorial-image"><SafeImage src={imageUrl("photo-1616486338812-3dadae4b4ace", 1400)} alt="Softly lit interior styled with natural materials and considered details" loading="lazy" /></div>
      <div className="editorial-copy"><span className="eyebrow">A little more intention</span><h2>Considered details.<br /><em>Beautifully lived in.</em></h2><p>We believe the things we use every day deserve a little thought. Explore timeless forms, natural textures, and useful pieces that make a house feel like yours.</p><Link className="button button-outline" to="/our-story">A note on our point of view <ArrowRight size={16} /></Link><span className="editorial-number">02 / A CONSIDERED HOME</span></div>
    </section>
    <section className="arrivals page-section">
      <SectionHeading eyebrow="Just found their way in" title="New to the collection." link="/shop?sort=newest" linkText="See new arrivals" />
      <ProductGrid list={arrivals} />
    </section>
    <section className="values-strip"><span className="eyebrow">The things we come back to</span><div className="value-items"><Value title="Thoughtful design" copy="A balance of form and function." /><Value title="Everyday usefulness" copy="Made to be lived with, every day." /><Value title="Quality first" copy="Considered materials and lasting forms." /><Value title="A sense of calm" copy="Quiet details for a more settled home." /></div></section>
    <Newsletter />
  </main>;
}

function ProductGrid({ list }) {
  return <div className="product-grid">{list.map((product) => <ProductCard key={product.id} product={product} />)}</div>;
}

function Value({ title, copy }) {
  return <article className="value-item"><Sparkles size={19} strokeWidth={1.4} /><h3>{title}</h3><p>{copy}</p></article>;
}

function Newsletter() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  function submit(event) {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setSuccess(false); setMessage("Please enter a valid email address."); return; }
    setSuccess(true);
    setMessage("Email format checked. This demo did not store or send your signup.");
    setEmail("");
  }
  return <section className="newsletter"><div><span className="eyebrow">A considered note, now and then</span><h2>A little inspiration<br />for the everyday.</h2></div><div className="newsletter-form-wrap"><p>Thoughtful ideas, new pieces, and small ways to make more of home.</p><form onSubmit={submit} noValidate><label className="sr-only" htmlFor="newsletter-email">Email address</label><input id="newsletter-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Your email address" aria-describedby="newsletter-message" /><button className="button button-dark" type="submit">Subscribe <ArrowRight size={16} /></button></form><small id="newsletter-message" className={success ? "form-success" : "form-message"} aria-live="polite">{message || "Demo signup only — no email will be sent."}</small></div></section>;
}

function Breadcrumbs({ items }) {
  return <nav className="breadcrumbs" aria-label="Breadcrumb"><Link to="/">Home</Link>{items.map((item, index) => <span key={`${item.label}-${index}`}><ChevronRight size={13} />{item.to ? <Link to={item.to}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}</span>)}</nav>;
}

function ShopPage() {
  const [params, setParams] = useSearchParams();
  const category = params.get("category") || "";
  const search = params.get("q") || "";
  const sort = params.get("sort") || "featured";
  const maxPrice = params.get("max") || "";
  const [mobileFilters, setMobileFilters] = useState(false);
  const filtered = useMemo(() => {
    let result = [...products];
    if (category) result = result.filter((product) => product.category === category);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((product) => `${product.name} ${getCategoryName(product.category)} ${product.description} ${product.tags.join(" ")}`.toLowerCase().includes(q));
    }
    if (maxPrice) result = result.filter((product) => product.price <= Number(maxPrice));
    if (sort === "newest") result.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    else if (sort === "price-low") result.sort((a, b) => a.price - b.price);
    else if (sort === "price-high") result.sort((a, b) => b.price - a.price);
    else result.sort((a, b) => Number(b.featured) - Number(a.featured));
    return result;
  }, [category, search, sort, maxPrice]);
  const update = (key, value) => setParams((current) => { const next = new URLSearchParams(current); value ? next.set(key, value) : next.delete(key); return next; });
  const clear = () => setParams({});
  const heading = search ? `Search results for “${search}”` : category ? getCategoryName(category) : "The collection";
  return <main className="shop-page">
    <div className="shop-heading"><Breadcrumbs items={[{ label: category ? getCategoryName(category) : "Shop" }]} /><span className="eyebrow">A home, considered</span><h1>{heading}</h1><p>Thoughtful pieces for everyday rituals, quiet corners, and everything in between.</p></div>
    <div className="shop-toolbar"><span>{filtered.length} {filtered.length === 1 ? "piece" : "pieces"}</span><div className="toolbar-controls"><button className="filter-toggle" onClick={() => setMobileFilters(true)}><SlidersHorizontal size={16} /> Filters</button><label className="sort-control">Sort by <select aria-label="Sort products" value={sort} onChange={(event) => update("sort", event.target.value)}><option value="featured">Featured</option><option value="newest">Newest</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option></select><ChevronDown size={15} /></label></div></div>
    <div className="shop-layout"><aside className="filter-sidebar"><FilterControls category={category} maxPrice={maxPrice} update={update} clear={clear} hasFilters={Boolean(category || maxPrice || search)} /></aside><div className="shop-results">{filtered.length ? <ProductGrid list={filtered} /> : <div className="empty-state"><span className="eyebrow">Nothing here just yet</span><h2>No pieces found.</h2><p>Try another search or clear your filters to explore the collection.</p><button className="button button-dark" onClick={clear}>Clear filters</button></div>}</div></div>
    {mobileFilters && <div className="drawer-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setMobileFilters(false); }}><aside className="filter-drawer" role="dialog" aria-modal="true" aria-label="Product filters"><div className="drawer-heading"><h2>Filters</h2><button className="icon-button" aria-label="Close filters" onClick={() => setMobileFilters(false)}><X /></button></div><FilterControls category={category} maxPrice={maxPrice} update={update} clear={clear} hasFilters={Boolean(category || maxPrice || search)} /><button className="button button-dark drawer-apply" onClick={() => setMobileFilters(false)}>Show {filtered.length} pieces</button></aside></div>}
  </main>;
}

function FilterControls({ category, maxPrice, update, clear, hasFilters }) {
  return <div className="filter-controls"><div className="filter-group"><h3>Category</h3>{categories.map((entry) => <label key={entry.slug} className="filter-option"><input type="radio" name="category" checked={category === entry.slug} onChange={() => update("category", category === entry.slug ? "" : entry.slug)} /><span>{entry.name}</span></label>)}</div><div className="filter-group"><h3>Price</h3><label className="filter-option"><input type="radio" name="price" checked={!maxPrice} onChange={() => update("max", "")} /><span>All prices</span></label><label className="filter-option"><input type="radio" name="price" checked={maxPrice === "50"} onChange={() => update("max", "50")} /><span>Under {formatPrice(50)}</span></label><label className="filter-option"><input type="radio" name="price" checked={maxPrice === "100"} onChange={() => update("max", "100")} /><span>Under {formatPrice(100)}</span></label></div>{hasFilters && <button className="clear-filters" onClick={clear}>Clear all filters <X size={14} /></button>}</div>;
}

function ProductPage() {
  const { slug } = useParams();
  const product = products.find((entry) => entry.slug === slug);
  const { wishlist, toggleWishlist, addToCart } = useStore();
  const [variant, setVariant] = useState(product?.variants[0] || "");
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [added, setAdded] = useState(false);
  const [related, setRelated] = useState([]);
  const saved = product && wishlist.includes(product.id);
  useEffect(() => { setVariant(product?.variants[0] || ""); setQuantity(1); setActiveImage(0); setAdded(false); }, [slug]);
  useEffect(() => {
    let current = true;
    setRelated([]);
    if (!product) return () => { current = false; };
    productService.getRelatedProducts(product.id).then((items) => {
      if (current) setRelated(items);
    }).catch((error) => {
      console.error("Could not load related demo products.", error);
    });
    return () => { current = false; };
  }, [product?.id]);
  if (!product) return <NotFoundPage />;
  return <main className="product-page page-section">
    <Breadcrumbs items={[{ label: "Shop", to: "/shop" }, { label: getCategoryName(product.category), to: `/shop?category=${product.category}` }, { label: product.name }]} />
    <div className="product-detail"><div className="product-gallery"><div className="gallery-main"><SafeImage src={product.gallery[activeImage]} alt={product.name} /></div><div className="gallery-thumbs">{product.gallery.map((image, index) => <button key={image + index} className={activeImage === index ? "selected" : ""} onClick={() => setActiveImage(index)} aria-label={`View product image ${index + 1}`}><SafeImage src={image} alt="" /></button>)}</div></div>
      <section className="product-info"><span className="eyebrow">{getCategoryName(product.category)}</span><h1>{product.name}</h1><div className="detail-price">{formatPrice(product.price)}</div><p className="detail-description">{product.longDescription}</p>
        {product.variants.length > 0 && <fieldset className="variant-field"><legend>Finish / option <span>{variant}</span></legend><div className="variant-options">{product.variants.map((option) => <button type="button" key={option} className={variant === option ? "chosen" : ""} aria-pressed={variant === option} onClick={() => setVariant(option)}>{option}</button>)}</div></fieldset>}
        <div className="stock-status"><span className="stock-dot" /> {product.stockStatus === "in-stock" ? "Available in demo catalogue" : "Currently unavailable"}</div>
        <div className="purchase-row"><div className="quantity-control"><button aria-label="Decrease quantity" onClick={() => setQuantity((current) => Math.max(1, current - 1))}><Minus size={15} /></button><span aria-live="polite">{quantity}</span><button aria-label="Increase quantity" onClick={() => setQuantity((current) => Math.min(99, current + 1))}><Plus size={15} /></button></div><button className="button button-dark add-to-bag" disabled={product.stockStatus !== "in-stock"} onClick={() => { addToCart(product, quantity, variant); setAdded(true); }}>{added ? <><Check size={17} /> Added to bag</> : <>Add to bag <ArrowRight size={16} /></>}</button><button className={`icon-button detail-wishlist ${saved ? "saved" : ""}`} onClick={() => toggleWishlist(product.id)} aria-label={saved ? "Remove from wishlist" : "Add to wishlist"} aria-pressed={saved}><Heart fill={saved ? "currentColor" : "none"} /></button></div>
        <p className="demo-disclaimer">Demo product information only. Pricing and availability are not live store data.</p>
        <div className="spec-list"><details open><summary>Details <ChevronDown size={16} /></summary><p>{product.description}</p><p><b>Dimensions</b> — {product.dimensions}</p><p><b>Materials</b> — {product.materials}</p></details><details><summary>Care <ChevronDown size={16} /></summary><p>{product.care}</p></details><details><summary>Shipping & returns <ChevronDown size={16} /></summary><p>Shipping and return policies are placeholders for this demo. See <Link to="/shipping">shipping information</Link> and <Link to="/returns">returns information</Link>.</p></details></div>
      </section>
    </div>
    {related.length > 0 && <section className="related-section"><SectionHeading eyebrow="In the same spirit" title="You may also like." link={`/shop?category=${product.category}`} /><ProductGrid list={related} /></section>}
  </main>;
}

function WishlistPage() {
  const { wishlist } = useStore();
  const saved = products.filter((product) => wishlist.includes(product.id));
  return <main className="standard-page page-section"><Breadcrumbs items={[{ label: "Wishlist" }]} /><div className="page-intro"><span className="eyebrow">Your considered list</span><h1>Saved for later.</h1><p>{saved.length} {saved.length === 1 ? "piece" : "pieces"} you have your eye on.</p></div>{saved.length ? <ProductGrid list={saved} /> : <EmptyPage icon={<Heart />} title="A little space for what you love." copy="Save the pieces that catch your eye and come back to them whenever you like." cta="Explore the collection" to="/shop" />}</main>;
}

function CartPage() {
  const { cart, changeQuantity, removeFromCart } = useStore();
  const lines = cart.map((line) => ({ ...line, product: products.find((product) => product.id === line.productId) })).filter((line) => line.product);
  const subtotal = lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0);
  return <main className="standard-page page-section"><Breadcrumbs items={[{ label: "Shopping bag" }]} /><div className="page-intro"><span className="eyebrow">A good place to pause</span><h1>Your shopping bag.</h1><p>Demo prices and availability are not live store data.</p></div>{lines.length ? <div className="cart-layout"><div className="cart-lines">{lines.map((line) => <article className="cart-line" key={line.key}><Link to={`/product/${line.product.slug}`}><SafeImage src={line.product.image} alt={line.product.name} /></Link><div className="cart-line-info"><Link to={`/product/${line.product.slug}`} className="product-name">{line.product.name}</Link><span>{getCategoryName(line.product.category)}{line.variant && ` · ${line.variant}`}</span><button className="remove-line" onClick={() => removeFromCart(line.key)}>Remove</button></div><div className="quantity-control"><button aria-label={`Decrease ${line.product.name} quantity`} onClick={() => line.quantity <= 1 ? removeFromCart(line.key) : changeQuantity(line.key, line.quantity - 1)}><Minus size={14} /></button><span>{line.quantity}</span><button aria-label={`Increase ${line.product.name} quantity`} onClick={() => changeQuantity(line.key, line.quantity + 1)}><Plus size={14} /></button></div><strong>{formatPrice(line.product.price * line.quantity)}</strong></article>)}</div><aside className="order-summary"><span className="eyebrow">A small summary</span><h2>Order summary</h2><div><span>Subtotal</span><b>{formatPrice(subtotal)}</b></div><p>Shipping and applicable taxes are calculated by the store at checkout.</p><Link className="button button-dark full-button" to="/checkout">Continue to checkout <ArrowRight size={16} /></Link><Link className="continue-link" to="/shop"><ArrowLeft size={15} /> Continue shopping</Link></aside></div> : <EmptyPage icon={<ShoppingBag />} title="Your bag is taking a quiet moment." copy="There are no pieces here just yet. Explore the collection and find something that feels like home." cta="Explore the collection" to="/shop" />}</main>;
}

function CheckoutPage() {
  const { cart } = useStore();
  const navigate = useNavigate();
  const lines = cart.map((line) => ({ ...line, product: products.find((product) => product.id === line.productId) })).filter((line) => line.product);
  const subtotal = lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0);
  const [errors, setErrors] = useState({});
  const [confirmed, setConfirmed] = useState(false);
  function submit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const nextErrors = {};
    ["name", "email", "address", "city", "postal", "country"].forEach((field) => {
      if (!String(form.get(field) || "").trim()) nextErrors[field] = "Please complete this field.";
    });
    if (form.get("email") && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(form.get("email")))) nextErrors.email = "Enter a valid email address.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) setConfirmed(true);
  }
  if (confirmed) return <main className="standard-page page-section"><div className="confirmation"><span className="confirmation-check"><Check /></span><span className="eyebrow">Demo journey complete</span><h1>Thank you for exploring.</h1><p>This is a demonstration only. No order has been placed and no payment was collected.</p><Link className="button button-dark" to="/shop">Return to the collection <ArrowRight size={16} /></Link></div></main>;
  if (!lines.length) return <main className="standard-page page-section"><Breadcrumbs items={[{ label: "Checkout" }]} /><div className="page-intro"><span className="eyebrow">Demonstration checkout</span><h1>Checkout.</h1><p>This prototype does not submit orders or collect payments.</p></div><EmptyPage icon={<ShoppingBag />} title="Your bag is empty." copy="Add a piece to your bag before continuing." cta="Explore the collection" to="/shop" /></main>;
  return <main className="standard-page page-section checkout-page"><Breadcrumbs items={[{ label: "Shopping bag", to: "/cart" }, { label: "Demo checkout" }]} /><div className="page-intro"><span className="eyebrow">Demonstration checkout</span><h1>A few details.</h1><p>This prototype does not take payment or submit a real order.</p></div><div className="checkout-layout"><form className="checkout-form" onSubmit={submit} noValidate><div className="checkout-section"><h2>Contact</h2><Field name="email" label="Email address" type="email" errors={errors} /><Field name="name" label="Full name" errors={errors} /></div><div className="checkout-section"><h2>Delivery address</h2><Field name="address" label="Street address" errors={errors} /><div className="form-two"><Field name="city" label="City" errors={errors} /><Field name="postal" label="Postal code" errors={errors} /></div><label className="form-field"><span>Country / region</span><select name="country" defaultValue="" aria-invalid={Boolean(errors.country)} aria-describedby={errors.country ? "country-error" : undefined}><option value="" disabled>Select a country</option><option>United States</option><option>United Kingdom</option><option>Canada</option><option>Australia</option><option>Other</option></select>{errors.country && <small className="field-error" id="country-error">{errors.country}</small>}</label><div className="delivery-placeholder"><span className="stock-dot" /><span><b>Standard delivery</b><small>Placeholder option · final rates set by the store</small></span></div></div><div className="checkout-warning"><b>Demo only — no payment details requested.</b><span>A real checkout must be securely handled by WooCommerce and a supported payment gateway.</span></div><button className="button button-dark full-button" type="submit">Review demo details <ArrowRight size={16} /></button><button className="checkout-back" type="button" onClick={() => navigate("/cart")}><ArrowLeft size={15} /> Return to bag</button></form><aside className="checkout-summary"><span className="eyebrow">Your selection</span><h2>Order summary</h2>{lines.map((line) => <div className="summary-line" key={line.key}><SafeImage src={line.product.image} alt="" /><span>{line.product.name}<small>{line.variant && `${line.variant} · `}Qty {line.quantity}</small></span><b>{formatPrice(line.product.price * line.quantity)}</b></div>)}<div className="summary-total"><span>Subtotal</span><b>{formatPrice(subtotal)}</b></div><p>Taxes and shipping are not calculated in this local demo.</p></aside></div></main>;
}

function Field({ name, label, type = "text", errors }) {
  return <label className="form-field"><span>{label}</span><input name={name} type={type} aria-invalid={Boolean(errors[name])} aria-describedby={errors[name] ? `${name}-error` : undefined} />{errors[name] && <small className="field-error" id={`${name}-error`}>{errors[name]}</small>}</label>;
}

function EmptyPage({ icon, title, copy, cta, to }) {
  return <div className="empty-state"><span className="empty-icon">{icon}</span><h2>{title}</h2><p>{copy}</p><Link className="button button-dark" to={to}>{cta} <ArrowRight size={16} /></Link></div>;
}

function StoryPage() {
  return <main className="story-page"><div className="story-hero"><SafeImage src={imageUrl("photo-1616486338812-3dadae4b4ace", 1800)} alt="A warm contemporary living room layered with natural materials" /><div className="story-hero-title"><span className="eyebrow">A point of view</span><h1>Living, with a little more <em>intention.</em></h1></div></div><section className="story-copy page-section"><span className="eyebrow">The VERDANT LIVING approach</span><h2>A home is made in the details.</h2><p>We believe the most meaningful spaces are not made all at once. They take shape through thoughtful choices: useful forms, natural textures, and objects that feel right in the rhythm of everyday life.</p><p>VERDANT LIVING is a considered edit of home and living essentials. From the kitchen table to a quiet corner, each piece is selected to bring function, ease, and a sense of beauty to the way we live.</p><Link className="button button-dark" to="/shop">Explore our collection <ArrowRight size={16} /></Link></section><section className="story-values"><Value title="Form with purpose" copy="Design that earns its place in your home." /><Value title="Everyday rituals" copy="Thoughtful pieces for the moments in between." /><Value title="A considered edit" copy="A calm point of view, with room for your own." /></section></main>;
}

function ContactPage() {
  const [message, setMessage] = useState("");
  function submit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (!String(data.get("contact-name")).trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.get("contact-email"))) || !String(data.get("message")).trim()) {
      setMessage("Please complete each field with a valid email address."); return;
    }
    setMessage("Your message passed demo validation, but it was not saved or sent.");
    event.currentTarget.reset();
  }
  return <main className="standard-page page-section"><Breadcrumbs items={[{ label: "Contact" }]} /><div className="split-page"><div className="page-intro"><span className="eyebrow">We’re here to help</span><h1>A note to us.</h1><p>Questions about a piece or the demo experience? Send a note using the form. This prototype does not deliver messages.</p><div className="contact-placeholder"><span className="eyebrow">Customer care</span><p>Contact email and business details to be supplied by store owner.</p></div></div><form className="contact-form" onSubmit={submit}><Field name="contact-name" label="Your name" errors={{}} /><Field name="contact-email" label="Email address" type="email" errors={{}} /><label className="form-field"><span>Your message</span><textarea name="message" rows="5" required /></label><button className="button button-dark">Validate demo message <ArrowRight size={16} /></button><small aria-live="polite" className="form-message">{message || "Demo form only — no message will be saved or sent."}</small></form></div></main>;
}

const faqs = [
  ["How do I place an order?", "This storefront is a local demo. In a live store, checkout would be securely handed to the connected WooCommerce checkout."],
  ["Are the listed prices current?", "No. Product pricing and availability are sample data and are not connected to a live store."],
  ["How long does shipping take?", "Shipping options and timeframes have not been supplied. This information is a placeholder for the store owner to complete."],
  ["What is your returns policy?", "Returns details are not yet defined. Please see the placeholder returns page; the store owner must add and review the real policy."],
  ["Can I save products for later?", "Yes. The prototype wishlist is stored in this browser only and is not connected to a customer account."],
];

function FAQPage() {
  return <main className="standard-page page-section"><Breadcrumbs items={[{ label: "FAQ" }]} /><div className="page-intro"><span className="eyebrow">A few useful things</span><h1>Frequently asked.</h1><p>Answers for this storefront prototype.</p></div><div className="faq-list">{faqs.map(([question, answer]) => <details key={question}><summary>{question}<Plus size={17} /></summary><p>{answer}</p></details>)}</div></main>;
}

function PolicyPage({ type }) {
  const copy = {
    shipping: { title: "Shipping information", intro: "Shipping details are placeholders and must be completed by the store owner.", sections: [["Delivery options", "Add the available delivery methods, delivery areas, estimated timeframes, and any restrictions."], ["Costs and timing", "Add accurate shipping charges, processing times, and delivery estimates before launch."], ["Questions", "Add the store's customer care email address and contact response expectations."]] },
    returns: { title: "Returns information", intro: "This page is a placeholder, not a live returns policy.", sections: [["Return eligibility", "The store owner must define eligible products, return conditions, and the period for requesting a return."], ["How to request a return", "Add the correct returns process and customer support contact details."], ["Refunds and exchanges", "Explain applicable refund timing, exchange availability, and any exclusions after legal review."]] },
    privacy: { title: "Privacy policy", intro: "Placeholder for a store-specific privacy notice. Legal review is required before launch.", sections: [["Information collected", "Describe the personal information collected by the live store and why it is needed."], ["How information is used", "Document store systems, processors, retention, customer rights, and applicable privacy law requirements."], ["Contact", "Add the business identity and privacy contact details."]] },
    terms: { title: "Terms & conditions", intro: "Placeholder terms for a future live store. Complete and review with qualified legal advice.", sections: [["About these terms", "Add the legal business identity, applicable jurisdiction, and terms governing purchases."], ["Products and orders", "Define accurate terms for product descriptions, pricing, order acceptance, and cancellations."], ["Contact", "Add verified business contact details and a process for customer enquiries."]] },
  }[type];
  return <main className="standard-page page-section"><Breadcrumbs items={[{ label: copy.title }]} /><div className="legal-page"><span className="eyebrow">Store information · needs owner review</span><h1>{copy.title}.</h1><p className="legal-intro">{copy.intro}</p>{copy.sections.map(([title, text]) => <section key={title}><h2>{title}</h2><p>{text}</p></section>)}<div className="policy-warning">Before this storefront is launched, replace this placeholder with accurate business information and complete legal review.</div></div></main>;
}

function NotFoundPage() {
  return <main className="standard-page page-section"><div className="empty-state not-found"><span className="eyebrow">404 · Not found</span><h1>This page wandered off.</h1><p>The page you’re looking for may have moved. Find your way back to the collection.</p><Link className="button button-dark" to="/">Return home <ArrowRight size={16} /></Link></div></main>;
}

function App() {
  return <><Header /><PageMetadata /><Routes>
    <Route path="/" element={<HomePage />} /><Route path="/shop" element={<ShopPage />} /><Route path="/product/:slug" element={<ProductPage />} />
    <Route path="/wishlist" element={<WishlistPage />} /><Route path="/cart" element={<CartPage />} /><Route path="/checkout" element={<CheckoutPage />} />
    <Route path="/our-story" element={<StoryPage />} /><Route path="/contact" element={<ContactPage />} /><Route path="/faq" element={<FAQPage />} />
    <Route path="/shipping" element={<PolicyPage type="shipping" />} /><Route path="/returns" element={<PolicyPage type="returns" />} />
    <Route path="/privacy" element={<PolicyPage type="privacy" />} /><Route path="/terms" element={<PolicyPage type="terms" />} /><Route path="*" element={<NotFoundPage />} />
  </Routes><Footer /></>;
}

function PageMetadata() {
  const { pathname, search } = useLocation();
  const params = new URLSearchParams(search);
  const product = pathname.startsWith("/product/")
    ? products.find((entry) => entry.slug === pathname.slice("/product/".length))
    : null;
  const category = params.get("category");
  const query = params.get("q");
  const pageTitles = {
    "/": "VERDANT LIVING — Elevate the Everyday",
    "/shop": query ? `Search: ${query} | Verdant Living` : category
      ? `${getCategoryName(category)} | Verdant Living`
      : "Shop | Verdant Living",
    "/wishlist": "Wishlist | Verdant Living",
    "/cart": "Shopping bag | Verdant Living",
    "/checkout": "Demo checkout | Verdant Living",
    "/our-story": "Our story | Verdant Living",
    "/contact": "Contact | Verdant Living",
    "/faq": "Frequently asked questions | Verdant Living",
    "/shipping": "Shipping information | Verdant Living",
    "/returns": "Returns information | Verdant Living",
    "/privacy": "Privacy policy | Verdant Living",
    "/terms": "Terms and conditions | Verdant Living",
  };
  const title = product ? `${product.name} | Verdant Living` : pageTitles[pathname] || "Page not found | Verdant Living";
  const description = product
    ? product.description
    : pathname === "/shop"
      ? query
        ? `Browse demo product search results for ${query}.`
        : category
          ? `Explore ${getCategoryName(category)} in the VERDANT LIVING demo collection.`
          : "Explore thoughtfully chosen home essentials in the VERDANT LIVING demo collection."
      : pathname === "/"
        ? "Thoughtfully chosen home essentials for a more beautiful everyday."
        : `${title.split("|")[0].trim()} at VERDANT LIVING. This is a demonstration storefront.`;

  useEffect(() => {
    document.title = title;
    const descriptionTag = document.querySelector('meta[name="description"]');
    if (descriptionTag) descriptionTag.setAttribute("content", description);
  }, [title, description]);

  return null;
}

export default App;
