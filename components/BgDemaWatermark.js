/**
 * Subtle ambient DEMA logo watermark layer for section backgrounds.
 * Renders muted, low-opacity DEMA emblem artwork synced with scroll parallax.
 */
export default function BgDemaWatermark({
  variant = 'right',
  speed = 0.14,
  maxShift = 75,
}) {
  const parallaxProps =
    speed !== null && speed !== undefined
      ? { 'data-parallax': String(speed), 'data-parallax-max': String(maxShift) }
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
