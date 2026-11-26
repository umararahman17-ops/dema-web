'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

const DESKTOP_CURSOR_COUNT = 6;
const MOBILE_CURSOR_COUNT = 3;
const DESKTOP_BOX_COUNT = 4;
const MOBILE_BOX_COUNT = 2;
const BUILD_DURATION_MS = 1850;
const FADE_IN_MS = 320;
const FADE_OUT_MS = 480;

// Theme-synchronized DEMA FST emerald & kabinet amber-orange cursor fills.
const THEME_CURSORS = {
  dark: ['#34d399', '#22c55e', '#f57e3d', '#10b981', '#86efac', '#e0631f'],
  light: ['#15803d', '#059669', '#e0631f', '#1e6b37', '#10b981', '#c2410c'],
};

const REVEAL_BOX_SELECTOR = [
  '#portofolio .solane-features-header .solane-section-tag',
  '#portofolio .solane-features-header .btn-solane-green',
  '.solane-bento-card',
  '.portfolio-card',
  '.philosophy-card',
  '.about-banner-card',
  '.alumni-highlight-item',
  '.alumni-card',
  '.alumni-banner-card',
  '.cta-card-form',
  '.profile-history-card',
  '.profile-logo-showcase',
  '.profile-philo-item',
  '.contact-info-grid > div',
  '.hover-card-rise',
].join(', ');

const OPEN_MODAL_SELECTOR =
  '.alumni-modal-overlay, .cabinet-modal-overlay, .portfolio-modal-overlay, .mobile-drawer.open';

const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);
const easeInOutSine = (t) => -(Math.cos(Math.PI * t) - 1) / 2;

/**
 * Plays a smooth, one-time UI-builder cursor reveal synced to the DEMA FST
 * emerald and orange theme palette for boxes below #portofolio, then exits cleanly.
 */
export default function SwarmCursor() {
  const pathname = usePathname();
  const [eligible, setEligible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [themeMode, setThemeMode] = useState('dark');
  const layerRef = useRef(null);
  const cursorRefs = useRef([]);
  const boxRefs = useRef([]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobileQuery = window.matchMedia('(max-width: 768px)');

    const syncTheme = () => {
      const next = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      setThemeMode(next);
    };

    const syncEligibility = () => {
      const isAdminRoute = pathname?.startsWith('/program-kerja/kelola');
      if (motionQuery.matches || isAdminRoute) {
        setEligible(false);
        return;
      }
      setIsMobile(mobileQuery.matches);
      setEligible(true);
    };

    syncTheme();
    syncEligibility();

    const themeObserver = new MutationObserver(syncTheme);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    motionQuery.addEventListener?.('change', syncEligibility);
    mobileQuery.addEventListener?.('change', syncEligibility);
    window.addEventListener('resize', syncEligibility, { passive: true });

    return () => {
      themeObserver.disconnect();
      motionQuery.removeEventListener?.('change', syncEligibility);
      mobileQuery.removeEventListener?.('change', syncEligibility);
      window.removeEventListener('resize', syncEligibility);
    };
  }, [pathname]);

  const cursorCount = isMobile ? MOBILE_CURSOR_COUNT : DESKTOP_CURSOR_COUNT;
  const boxSlotCount = isMobile ? MOBILE_BOX_COUNT : DESKTOP_BOX_COUNT;
  const activePalette = THEME_CURSORS[themeMode];

  useEffect(() => {
    const cleanupAttributes = () => {
      document.querySelectorAll('[data-swarm-box]').forEach((el) => {
        el.style.transitionDelay = '';
        el.removeAttribute('data-swarm-box');
      });
    };

    if (!eligible) {
      cleanupAttributes();
      return undefined;
    }

    const mainEl = document.querySelector('main');
    if (!mainEl) return undefined;

    const portofolioSection = document.getElementById('portofolio');
    const isBelowBoundary = (el) => {
      if (el.closest('.solane-hero, #explore, .page-banner, header, nav, footer')) {
        return false;
      }
      if (pathname === '/' && portofolioSection) {
        return (
          Boolean(el.closest('#portofolio')) ||
          Boolean(portofolioSection.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING)
        );
      }
      return true;
    };

    const viewportH = () => window.innerHeight || 800;
    const viewportW = () => window.innerWidth || 1280;

    const isEligibleBox = (el) => {
      if (!isBelowBoundary(el)) return false;
      const r = el.getBoundingClientRect();
      return r.width >= 32 && r.height >= 16;
    };

    const allCandidates = Array.from(mainEl.querySelectorAll(REVEAL_BOX_SELECTOR)).filter(isEligibleBox);
    if (allCandidates.length === 0) return undefined;

    const builtSet = new WeakSet();
    let rafId = null;
    let buildStartAt = 0;
    let buildEndAt = 0;
    let activeSwarm = false;
    let currentBatch = [];

    const actors = Array.from({ length: cursorCount }, (_, i) => ({
      x: 0,
      y: 0,
      startX: 0,
      startY: 0,
      ctrlX: 0,
      ctrlY: 0,
      targetX: 0,
      targetY: 0,
      flightStartAt: 0,
      flightDurationMs: 640 + (i % 3) * 110,
      targetEl: null,
      anchorMode: i,
      rect: { left: 0, top: 0, width: 100, height: 40 },
      boxSlot: i < boxSlotCount ? i : -1,
      wobblePhase: i * 1.15,
    }));

    const pickAnchor = (rect, mode) => {
      const m = mode % 4;
      if (m === 0) return { x: rect.left + rect.width - 14, y: rect.top + rect.height - 8 };
      if (m === 1) return { x: rect.left + rect.width * 0.68, y: rect.top + rect.height * 0.45 };
      if (m === 2) return { x: rect.left + 16, y: rect.top + 12 };
      return { x: rect.left + rect.width * 0.85, y: rect.top + 10 };
    };

    const hideLayerImmediately = () => {
      activeSwarm = false;
      currentBatch = [];
      if (layerRef.current) {
        layerRef.current.style.opacity = '0';
        layerRef.current.style.display = 'none';
      }
      for (let s = 0; s < boxSlotCount; s++) {
        const boxEl = boxRefs.current[s];
        if (boxEl) boxEl.style.opacity = '0';
      }
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
        rafId = null;
      }
    };

    const finalizeBuiltElements = () => {
      for (let i = 0; i < currentBatch.length; i++) {
        const el = currentBatch[i];
        if (el.isConnected) {
          el.style.transitionDelay = '';
          el.removeAttribute('data-swarm-box');
        }
      }
      hideLayerImmediately();
    };

    const assignBatchToCursors = (newlyVisible) => {
      if (newlyVisible.length === 0) return;

      const vw = viewportW();
      const vh = viewportH();
      const now = performance.now();
      const wasIdle = !activeSwarm;

      for (let i = 0; i < newlyVisible.length; i++) {
        const el = newlyVisible[i];
        builtSet.add(el);
        // Stagger entrance smoothly per card so batches reveal fluidly instead of popping together.
        el.style.transitionDelay = `${Math.min(i * 75, 280)}ms`;
        el.setAttribute('data-swarm-box', 'building');
        currentBatch.push(el);
      }

      if (document.querySelector(OPEN_MODAL_SELECTOR)) {
        for (let i = 0; i < newlyVisible.length; i++) {
          newlyVisible[i].style.transitionDelay = '';
          newlyVisible[i].removeAttribute('data-swarm-box');
        }
        return;
      }

      activeSwarm = true;
      if (wasIdle) buildStartAt = now;
      buildEndAt = Math.max(buildEndAt, now + BUILD_DURATION_MS);

      if (layerRef.current) {
        layerRef.current.style.display = 'block';
        if (wasIdle) layerRef.current.style.opacity = '0';
      }

      for (let i = 0; i < actors.length; i++) {
        const a = actors[i];
        const targetEl = newlyVisible[i % newlyVisible.length];
        const rect = targetEl.getBoundingClientRect();
        const clampedRect = {
          left: rect.left,
          top: rect.top,
          width: Math.min(rect.width, vw - 24),
          height: rect.height,
        };
        const anchor = pickAnchor(clampedRect, i);

        a.targetEl = targetEl;
        a.rect = clampedRect;
        a.targetX = Math.max(18, Math.min(vw - 24, anchor.x));
        a.targetY = Math.max(76, Math.min(vh - 28, anchor.y));

        if (wasIdle) {
          const offsetSide = (i % 2 === 0 ? -1 : 1) * (88 + (i % 3) * 28);
          const offsetVert = (i % 3 === 0 ? -1 : 1) * (54 + (i % 2) * 26);
          a.startX = Math.max(20, Math.min(vw - 20, a.targetX + offsetSide));
          a.startY = Math.max(76, Math.min(vh - 24, a.targetY + offsetVert));
          a.x = a.startX;
          a.y = a.startY;
        } else {
          a.startX = a.x;
          a.startY = a.y;
        }

        // Arc control point creates natural sweeping wrist curvature into the target.
        const midX = (a.startX + a.targetX) * 0.5;
        const midY = (a.startY + a.targetY) * 0.5;
        const curveSign = i % 2 === 0 ? -1 : 1;
        a.ctrlX = midX + curveSign * 26;
        a.ctrlY = midY - 34;
        a.flightStartAt = now + (i % 4) * 55;
      }

      if (rafId === null) {
        rafId = window.requestAnimationFrame(tick);
      }
    };

    const tick = (now) => {
      rafId = null;

      if (!activeSwarm || document.hidden || document.querySelector(OPEN_MODAL_SELECTOR)) {
        finalizeBuiltElements();
        return;
      }

      const elapsed = Math.max(0, now - buildStartAt);
      const remaining = buildEndAt - now;
      if (remaining <= 0) {
        finalizeBuiltElements();
        return;
      }

      const vw = viewportW();
      const vh = viewportH();

      const fadeInAlpha = elapsed < FADE_IN_MS ? easeInOutSine(elapsed / FADE_IN_MS) : 1;
      const fadeOutProgress = remaining < FADE_OUT_MS ? 1 - remaining / FADE_OUT_MS : 0;
      const fadeOutAlpha = fadeOutProgress > 0 ? 1 - easeInOutSine(fadeOutProgress) : 1;
      const masterAlpha = Math.min(fadeInAlpha, fadeOutAlpha);

      if (layerRef.current) {
        layerRef.current.style.opacity = masterAlpha.toFixed(3);
      }

      for (let i = 0; i < actors.length; i++) {
        const a = actors[i];

        if (a.targetEl && a.targetEl.isConnected) {
          const liveRect = a.targetEl.getBoundingClientRect();
          if (liveRect.top < 76 || liveRect.top > vh - 20) {
            a.targetEl = null;
          } else {
            a.rect = {
              left: liveRect.left,
              top: liveRect.top,
              width: Math.min(liveRect.width, vw - 24),
              height: liveRect.height,
            };
            const anchor = pickAnchor(a.rect, a.anchorMode);
            a.targetX = Math.max(18, Math.min(vw - 24, anchor.x));
            a.targetY = Math.max(76, Math.min(vh - 28, anchor.y));
          }
        }

        const flightRaw = Math.max(0, Math.min(1, (now - a.flightStartAt) / a.flightDurationMs));
        const u = easeOutQuart(flightRaw);
        const inv = 1 - u;

        // Quadratic Bezier glide with gentle hover breathing and smooth exit drift.
        const curveX = inv * inv * a.startX + 2 * inv * u * a.ctrlX + u * u * a.targetX;
        const curveY = inv * inv * a.startY + 2 * inv * u * a.ctrlY + u * u * a.targetY;

        a.wobblePhase += 0.032;
        const settleAmp = u * 1.4;
        const driftX = Math.cos(a.wobblePhase) * settleAmp;
        const driftY = Math.sin(a.wobblePhase * 0.85) * settleAmp - fadeOutProgress * 10;

        a.x = curveX + driftX;
        a.y = curveY + driftY;

        const tangentX = (a.targetX - a.startX) * (1 - u);
        const tiltDeg = Math.max(-9, Math.min(9, tangentX * 0.06));
        const cursorScale = 0.88 + 0.12 * u - fadeOutProgress * 0.08;

        const cursorEl = cursorRefs.current[i];
        if (cursorEl) {
          cursorEl.style.transform = `translate3d(${a.x.toFixed(1)}px, ${a.y.toFixed(1)}px, 0) rotate(${tiltDeg.toFixed(1)}deg) scale(${cursorScale.toFixed(3)})`;
        }

        if (a.boxSlot >= 0) {
          const boxEl = boxRefs.current[a.boxSlot];
          if (boxEl) {
            // Wireframe fades in cleanly as its cursor lands on the card, then exits seamlessly.
            const arrivalAlpha = flightRaw > 0.25 ? easeInOutSine(Math.min(1, (flightRaw - 0.25) / 0.6)) : 0;
            const boxFadeOut = remaining < FADE_OUT_MS + 160
              ? 1 - easeInOutSine(Math.min(1, 1 - (remaining - 60) / (FADE_OUT_MS + 100)))
              : 1;
            const boxAlpha = a.targetEl ? Math.max(0, Math.min(arrivalAlpha, boxFadeOut)) : 0;

            if (boxAlpha < 0.015) {
              boxEl.style.opacity = '0';
            } else {
              boxEl.style.opacity = boxAlpha.toFixed(3);
              boxEl.style.transform = `translate3d(${Math.round(a.rect.left)}px, ${Math.round(a.rect.top)}px, 0)`;
              boxEl.style.width = `${Math.round(a.rect.width)}px`;
              boxEl.style.height = `${Math.round(a.rect.height)}px`;

              const badgeEl = boxEl.querySelector('.swarm-inspect-badge');
              if (badgeEl) {
                badgeEl.textContent = `${Math.round(a.rect.width)} x ${Math.round(a.rect.height)}`;
                const flipTop = a.rect.top + a.rect.height + 24 > vh;
                badgeEl.classList.toggle('is-top', flipTop);
              }
            }
          }
        }
      }

      rafId = window.requestAnimationFrame(tick);
    };

    const initialVisible = [];
    const pendingList = [];
    const currentVh = viewportH();

    for (let i = 0; i < allCandidates.length; i++) {
      const el = allCandidates[i];
      const rect = el.getBoundingClientRect();
      if (rect.bottom < 0) {
        builtSet.add(el);
      } else if (rect.top < currentVh * 0.94) {
        el.setAttribute('data-swarm-box', 'pending');
        initialVisible.push(el);
      } else {
        el.setAttribute('data-swarm-box', 'pending');
        pendingList.push(el);
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entered = [];
        for (let i = 0; i < entries.length; i++) {
          const entry = entries[i];
          const el = entry.target;
          if (builtSet.has(el)) {
            observer.unobserve(el);
            continue;
          }
          if (entry.isIntersecting) {
            observer.unobserve(el);
            entered.push(el);
          } else if (entry.boundingClientRect.bottom < 0) {
            builtSet.add(el);
            el.style.transitionDelay = '';
            el.removeAttribute('data-swarm-box');
            observer.unobserve(el);
          }
        }
        if (entered.length > 0) {
          assignBatchToCursors(entered);
        }
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -30px 0px',
      }
    );

    for (let i = 0; i < pendingList.length; i++) {
      observer.observe(pendingList[i]);
    }

    let initialTimer = null;
    if (initialVisible.length > 0) {
      initialTimer = window.setTimeout(() => {
        assignBatchToCursors(initialVisible);
      }, 60);
    }

    const revealAboveViewportOnFastScroll = () => {
      for (let i = 0; i < pendingList.length; i++) {
        const el = pendingList[i];
        if (builtSet.has(el)) continue;
        const rect = el.getBoundingClientRect();
        if (rect.bottom < 0) {
          builtSet.add(el);
          el.style.transitionDelay = '';
          el.removeAttribute('data-swarm-box');
          observer.unobserve(el);
        }
      }
    };

    window.addEventListener('scroll', revealAboveViewportOnFastScroll, { passive: true });

    return () => {
      if (initialTimer !== null) window.clearTimeout(initialTimer);
      observer.disconnect();
      window.removeEventListener('scroll', revealAboveViewportOnFastScroll);
      hideLayerImmediately();
      cleanupAttributes();
    };
  }, [eligible, pathname, cursorCount, boxSlotCount]);

  if (!eligible) return null;

  return (
    <div
      ref={layerRef}
      className="swarm-ui-layer"
      style={{ display: 'none', opacity: 0 }}
      aria-hidden="true"
    >
      {Array.from({ length: boxSlotCount }, (_, slot) => (
        <div
          key={`box-${slot}`}
          ref={(el) => { boxRefs.current[slot] = el; }}
          className={`swarm-inspect-box ${slot === 2 ? 'is-accent' : ''}`}
          style={{ opacity: 0 }}
        >
          <span className="swarm-inspect-handle tl" />
          <span className="swarm-inspect-handle tr" />
          <span className="swarm-inspect-handle bl" />
          <span className="swarm-inspect-handle br" />
          <span className="swarm-inspect-badge">0 x 0</span>
        </div>
      ))}

      {Array.from({ length: cursorCount }, (_, i) => (
        <div
          key={`cursor-${i}`}
          ref={(el) => { cursorRefs.current[i] = el; }}
          className="swarm-cursor-actor"
        >
          <svg
            width="20"
            height="22"
            viewBox="0 0 20 22"
            fill="none"
            className="swarm-cursor-svg"
          >
            <path
              d="M3 2.2L16.6 10.7L10.3 12.1L7.1 18.4L3 2.2Z"
              fill={activePalette[i % activePalette.length]}
              stroke="#ffffff"
              strokeWidth="1.45"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      ))}
    </div>
  );
}
