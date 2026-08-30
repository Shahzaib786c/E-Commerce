import { Link } from "react-router";
import { useProducts } from "../../context/ProductsContext.jsx";
import ProductCard from "../../components/product/ProductCard.jsx";
import PromoBanner from "../../components/common/PromoBanner.jsx";
import HeroCarousel from "../../components/common/HeroCarousel.jsx";
import "./HomePage.css";
import pickboo from "./pickboo.mp4";
import FlashSaleTimer from "../../components/common/FlashSaleTimer.jsx";

const TESTIMONIALS = [
  {
    name: "Ayesha K.",
    quote: "Loved by parents across Pakistan for quality and quick delivery.",
  },
  {
    name: "Hassan R.",
    quote: "The personalized teddy was such a hit as a birthday gift.",
  },
];

export default function HomePage() {
  const { products, categories } = useProducts();
  const bestsellers = products.filter((p) => p.isBestseller).slice(0, 4);

  return (
    <div className="container home-page">
      <HeroCarousel />

      <section className="home-section">
        <p className="home-section-title">Shop by category</p>
        <div className="category-grid">
          {categories.map((c) => (
            <Link
              key={c.id}
              to={`/products?category=${c.slug}`}
              className="category-tile"
            >
              <i className={`ti ${c.icon}`} aria-hidden="true"></i>
              <span>{c.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-section">
        <div className="home-section-header">
          <p className="home-section-title">Bestsellers</p>
          <Link to="/products" className="home-view-all">
            View all
          </Link>
        </div>
        <div className="products-grid">
          {bestsellers.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <PromoBanner
        title="Made just for them"
        subtitle="Add a name, a note, or a keepsake touch — personalized gifts, from $14"
        videoSrc={pickboo}
        tone="sage"
        ctaLabel="Shop now"
      />

      <FlashSaleTimer />
      <section className="testimonial-strip">
        {TESTIMONIALS.map((t) => (
          <div key={t.name} className="testimonial-card card">
            <i className="ti ti-quote" aria-hidden="true"></i>
            <p>{t.quote}</p>
            <span>— {t.name}</span>
          </div>
        ))}
      </section>
    </div>
  );
}
