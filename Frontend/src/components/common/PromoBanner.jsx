import "./PromoBanner.css";

export default function PromoBanner({
  title,
  subtitle,
  icon = "ti-gift",
  tone = "rose",
  videoSrc,
  posterSrc,
  ctaLabel,
  onCtaClick,
}) {
  return (
    <div className={`promo-banner tone-${tone} ${videoSrc ? "has-video" : ""}`}>
      {videoSrc && (
        <video
          className="promo-video"
          src={videoSrc}
          poster={posterSrc}
          autoPlay
          muted
          loop
          playsInline
        />
      )}

      <div className="promo-overlay" />

      <div className="promo-content">
        <div className="promo-text">
          <p className="promo-title">{title}</p>
          {subtitle && <p className="promo-subtitle">{subtitle}</p>}
          {ctaLabel && (
            <button className="promo-cta" onClick={onCtaClick}>
              {ctaLabel}
              <i className="ti ti-arrow-right" aria-hidden="true"></i>
            </button>
          )}
        </div>

        {!videoSrc && (
          <i className={`ti ${icon} promo-icon`} aria-hidden="true"></i>
        )}
      </div>
    </div>
  );
}
