'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

const DESKTOP_CURSOR_COUNT = 6;
const MOBILE_CURSOR_COUNT = 3;
const DESKTOP_BOX_COUNT = 4;
const MOBILE_BOX_COUNT = 2;
const BUILD_DURATION_MS = 1350;
const FADE_OUT_MS = 280;

// Vibrant multiplayer cursor accents with white stroke legibility across themes.
const CURSOR_COLORS = [
  '#38bdf8',
  '#34d399',
  '#f59e0b',
  '#fb7185',
  '#a78bfa',
  '#e0631f',
];

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

/**
 * Plays a one-time UI-builder cursor swarm animation as content boxes from
 * #portofolio downward scroll into view, then removes all cursors cleanly.
 */
export default function SwarmCursor() {
  const pathname = usePathname();
  const [eligible, setEligible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const layerRef = useRef(null);
  const cursorRefs = useRef([]);
  const boxRefs = useRef([]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobileQuery = window.matchMedia('(max-width: 768px)');

    const syncEligibility = () => {
      const isAdminRoute = pathname?.startsWith('/program-kerja/kelola');
      if (motionQuery.matches || isAdminRoute) {
        setEligible(false);
        return;
      }
      setIsMobile(mobileQuery.matches);
      setEligible(true);
    };

    syncEligibility();
    motionQuery.addEventListener?.('change', syncEligibility);
    mobileQuery.addEventListener?.('change', syncEligibility);
    window.addEventListener('resize', syncEligibility, { passive: true });

    return () => {
      motionQuery.removeEventListener?.('change', syncEligibility);
      mobileQuery.removeEventListener?.('change', syncEligibility);
      window.removeEventListener('resize', syncEligibility);
    };
  }, [pathname]);

  const cursorCount = isMobile ? MOBILE_CURSOR_COUNT : DESKTOP_CURSOR_COUNT;
  const boxSlotCount = isMobile ? MOBILE_BOX_COUNT : DESKTOP_BOX_COUNT;

  useEffect(() => {
    // Ensure all cards return to normal visibility if disabled or navigating.
    const cleanupAttributes = () => {
      document.querySelectorAll('[data-swarm-box]').forEach((el) => {
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
    let buildEndAt = 0;
    let activeSwarm = false;
    let currentBatch = [];

    const actors = Array.from({ length: cursorCount }, (_, i) => ({
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      targetX: 0,
      targetY: 0,
      targetEl: null,
      anchorMode: i,
      rect: { left: 0, top: 0, width: 100, height: 40 },
      boxSlot: i < boxSlotCount ? i : -1,
      inspectOpacity: 0,
      wobblePhase: i * 1.15,
      stiffness: 0.032 + (i % 3) * 0.008,
      damping: 0.78,
    }));

    const pickAnchor = (rect, mode) => {
      const m = mode % 4;
      if (m === 0) return { x: rect.left + rect.width - 10, y: rect.top + rect.height - 6 };
      if (m === 1) return { x: rect.left + rect.width * 0.65, y: rect.top + rect.height * 0.5 };
      if (m === 2) return { x: rect.left + 12, y: rect.top + 8 };
      return { x: rect.left + rect.width * 0.84, y: rect.top + 8 };
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
        el.setAttribute('data-swarm-box', 'building');
        currentBatch.push(el);
      }

      if (document.querySelector(OPEN_MODAL_SELECTOR)) {
        for (let i = 0; i < newlyVisible.length; i++) {
          newlyVisible[i].removeAttribute('data-swarm-box');
        }
        return;
      }

      activeSwarm = true;
      buildEndAt = Math.max(buildEndAt, now + BUILD_DURATION_MS);

      if (layerRef.current) {
        layerRef.current.style.display = 'block';
        layerRef.current.style.opacity = '1';
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
          const offsetSide = i % 2 === 0 ? -56 : 56;
          const offsetVert = i % 3 === 0 ? -40 : 40;
          a.x = Math.max(20, Math.min(vw - 20, a.targetX + offsetSide));
          a.y = Math.max(76, Math.min(vh - 24, a.targetY + offsetVert));
          a.vx = 0;
          a.vy = 0;
          a.inspectOpacity = 0.8;
        }
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

      const remaining = buildEndAt - now;
      if (remaining <= 0) {
        finalizeBuiltElements();
        return;
      }

      const vw = viewportW();
      const vh = viewportH();
      const layerOpacity = remaining < FADE_OUT_MS ? Math.max(0, remaining / FADE_OUT_MS) : 1;

      if (layerRef.current) {
        layerRef.current.style.opacity = layerOpacity.toFixed(3);
      }

      for (let i = 0; i < actors.length; i++) {
        const a = actors[i];

        if (a.targetEl && a.targetEl.isConnected) {
          const liveRect = a.targetEl.getBoundingClientRect();
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

        a.wobblePhase += 0.055;
        const driftX = Math.cos(a.wobblePhase) * 3;
        const driftY = Math.sin(a.wobblePhase * 0.9) * 3;

        a.vx += (a.targetX + driftX - a.x) * a.stiffness;
        a.vy += (a.targetY + driftY - a.y) * a.stiffness;
        a.vx *= a.damping;
        a.vy *= a.damping;
        a.x += a.vx;
        a.y += a.vy;

        const cursorEl = cursorRefs.current[i];
        if (cursorEl) {
          cursorEl.style.transform = `translate3d(${a.x.toFixed(1)}px, ${a.y.toFixed(1)}px, 0)`;
        }

        if (a.boxSlot >= 0) {
          const boxEl = boxRefs.current[a.boxSlot];
          if (boxEl) {
            const boxFade = remaining < FADE_OUT_MS + 140 ? Math.max(0, (remaining - 100) / FADE_OUT_MS) : 1;
            const targetAlpha = a.targetEl ? Math.min(1, boxFade) : 0;
            a.inspectOpacity += (targetAlpha - a.inspectOpacity) * 0.25;

            if (a.inspectOpacity < 0.02) {
              boxEl.style.opacity = '0';
            } else {
              boxEl.style.opacity = a.inspectOpacity.toFixed(3);
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
        // Already scrolled past above viewport; keep permanently visible without animating.
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
            // Skipped past during fast scroll: reveal silently so nothing stays blank.
            builtSet.add(el);
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

    // Small delay allows layout paints to settle before building currently visible deep-linked targets.
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
          className="swarm-inspect-box"
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
              fill={CURSOR_COLORS[i % CURSOR_COLORS.length]}
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
