// HeroCarousel.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./HeroCarousel.css";

const SLIDES = [
  {
    id: 1,
    kicker: "This week's cub",
    title: "Meet Honey, our best-loved classic",
    copy: "Hand-finished with jointed limbs and an heirloom-soft coat — the bear people buy once and keep for decades.",
    price: "$28",
    cta: "Shop Honey Classic",
    to: "/products",
    image:
      "https://images.unsplash.com/photo-1562040506-a9b32cb51b94?w=900&q=80",
    alt: "Close-up of a honey-brown classic teddy bear",
    features: [
      "Hand-stitched seams",
      "Hypoallergenic filling",
      "Free gift wrap",
    ],
  },
  {
    id: 2,
    kicker: "Gift-ready",
    title: "A bear for every occasion",
    copy: "Bowties, ribbons, and roses — dressed-up bears that arrive gift-box ready, no wrapping required.",
    price: "$32",
    cta: "Shop special occasion",
    to: "/products",
    image:
      "https://images.unsplash.com/photo-1602734846297-9299fc2d4703?w=900&q=80",
    alt: "Teddy bear wearing a black and white bowtie",
    features: [
      "Hand-stitched seams",
      "Hypoallergenic filling",
      "Free gift wrap",
    ],
  },
  {
    id: 3,
    kicker: "Go big",
    title: "Giant bears, giant hugs",
    copy: "Our XXL cuddle bear is the surprise that steals the show — birthdays, nurseries, or just because.",
    price: "$89",
    cta: "Shop giant bears",
    to: "/products",
    image:
      "https://images.unsplash.com/photo-1549014285-5c0ca6a40e7f?w=900&q=80",
    alt: "A person carrying a life-size giant teddy bear",
    features: [
      "Hand-stitched seams",
      "Hypoallergenic filling",
      "Free gift wrap",
    ],
  },
];

const AUTO_ADVANCE_MS = 4500;

export default function HeroCarousel() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((i) => (i + 1) % SLIDES.length);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(timer);
  }, []);

  function prev() {
    setActive((i) => (i - 1 + SLIDES.length) % SLIDES.length);
  }
  function next() {
    setActive((i) => (i + 1) % SLIDES.length);
  }

  const slide = SLIDES[active];

  return (
    <div className="hero-carousel">
      <div className="hero-text-col">
        <p className="hero-kicker">{slide.kicker}</p>
        <h1 className="hero-title">{slide.title}</h1>
        <p className="hero-copy">{slide.copy}</p>

        <div className="hero-actions">
          <Link to={slide.to} className="btn btn-primary">
            {slide.cta}
          </Link>
          <span className="hero-price">from {slide.price}</span>
        </div>

        <div className="hero-features">
          {slide.features.map((f, i) => (
            <span key={f} className="hero-feature">
              {["🧵", "🌱", "🎁"][i % 3]} {f}
            </span>
          ))}
        </div>

        <div className="hero-dots">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              className={`hero-dot ${i === active ? "active" : ""}`}
              onClick={() => setActive(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="hero-image-col">
        <div className="hero-image-blob">
          <img src={slide.image} alt={slide.alt} />
          <span className="hero-price-badge">{slide.price}</span>

          <button
            className="hero-arrow hero-arrow-prev"
            onClick={prev}
            aria-label="Previous slide"
          >
            <i className="ti ti-chevron-left" aria-hidden="true"></i>
          </button>
          <button
            className="hero-arrow hero-arrow-next"
            onClick={next}
            aria-label="Next slide"
          >
            <i className="ti ti-chevron-right" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </div>
  );
}