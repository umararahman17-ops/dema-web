/**
 * Ambient DEMA logo watermark layer for section backgrounds.
 * Renders crisp, low-interference DEMA emblem artwork synced with multi-axis scroll parallax.
 */
export default function BgDemaWatermark({
  variant = 'right',
  speed = 0.14,
  maxShift = 75,
}) {
  const hasParallax = speed !== null && speed !== undefined;
  const effectiveSpeed = hasParallax ? Number((speed * 1.9).toFixed(3)) : 0;
  const effectiveMax = hasParallax ? Math.round(maxShift * 1.85) : 0;
  const driftX = variant === 'left' ? 28 : variant === 'right' ? -28 : 0;
  const rotateDeg = hasParallax ? (speed >= 0 ? 12 : -12) : 0;

  const parallaxProps = hasParallax
    ? {
        'data-parallax': String(effectiveSpeed),
        'data-parallax-max': String(effectiveMax),
        'data-parallax-x': String(driftX),
        'data-parallax-rotate': String(rotateDeg),
        'data-parallax-scale': '0.09',
        'data-parallax-mobile-scale': '0.65',
      }
    : {};

  return (
    <div
      className={`bg-dema-watermark bg-wm-${variant}`}
      aria-hidden="true"
      {...parallaxProps}
    >
      <img
        src="/logo.png"
        alt=""
        className="bg-dema-watermark-img"
        loading="lazy"
      />
    </div>
  );
}
