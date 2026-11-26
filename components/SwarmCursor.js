'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

const DESKTOP_CURSOR_COUNT = 6;
const MOBILE_CURSOR_COUNT = 3;
const BUILD_DURATION_MS = 1950;
const FADE_IN_MS = 240;
const FADE_OUT_MS = 420;

const PALETTE = {
  dark: {
    primary: '#34d399',
    primaryText: '#020703',
    orange: '#f57e3d',
    orangeText: '#020703',
    cursors: ['#34d399', '#22c55e', '#f57e3d', '#10b981', '#86efac', '#e0631f'],
  },
  light: {
    primary: '#15803d',
    primaryText: '#ffffff',
    orange: '#e0631f',
    orangeText: '#ffffff',
    cursors: ['#15803d', '#059669', '#e0631f', '#1e6b37', '#10b981', '#c2410c'],
  },
};

// Cursor geometry and hotspots adapted from swarm-rebuild/swarm.js.
const ARROW_D =
  'M4.6 3.9 C4.2 3.1 4.9 2.4 5.7 2.8 L20.6 9.4 C21.5 9.8 21.4 11.1 20.4 11.3 L13.9 12.9 C13.4 13 13 13.4 12.9 13.9 L11.3 20.4 C11.1 21.4 9.8 21.5 9.4 20.6 Z';

const HOTSPOTS = {
  arrow: [5, 3.5],
  dup: [5, 3.5],
  cross: [12, 12],
  ibeam: [12, 12],
};

function buildCursorSvg(shape, color) {
  const st = 'stroke="#ffffff" stroke-width="1.5" stroke-linejoin="round"';
  if (shape === 'dup') {
    return (
      `<path d="${ARROW_D}" transform="translate(4 3.5)" fill="#ffffff" stroke="${color}" stroke-width="1.3" stroke-linejoin="round"/>` +
      `<path d="${ARROW_D}" fill="${color}" ${st}/>`
    );
  }
  if (shape === 'cross') {
    return (
      `<g stroke-linecap="round"><path d="M12 3.5 V20.5 M3.5 12 H20.5" stroke="#ffffff" stroke-width="3.6"/>` +
      `<path d="M12 3.5 V20.5 M3.5 12 H20.5" stroke="${color}" stroke-width="1.6"/></g>`
    );
  }
  if (shape === 'ibeam') {
    const d =
      'M8.5 4.5 H10.5 Q12 4.5 12 6 Q12 4.5 13.5 4.5 H15.5 M12 6 V18 M8.5 19.5 H10.5 Q12 19.5 12 18 Q12 19.5 13.5 19.5 H15.5';
    return (
      `<g fill="none" stroke-linecap="round"><path d="${d}" stroke="#ffffff" stroke-width="3.6"/>` +
      `<path d="${d}" stroke="${color}" stroke-width="1.6"/></g>`
    );
  }
  return `<path d="${ARROW_D}" fill="${color}" ${st}/>`;
}

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

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeInOutSine = (t) => -(Math.cos(Math.PI * t) - 1) / 2;
const round1 = (n) => Math.round(n * 10) / 10;

function computeSpacingGap(a, b) {
  const overlapY = Math.min(a.top + a.height, b.top + b.height) - Math.max(a.top, b.top);
  if (overlapY > 8) {
    const y = Math.max(a.top, b.top) + overlapY * 0.5;
    const leftBox = a.left < b.left ? a : b;
    const rightBox = a.left < b.left ? b : a;
    const gap = rightBox.left - (leftBox.left + leftBox.width);
    if (gap >= 4 && gap <= 120) {
      return { x1: leftBox.left + leftBox.width, y1: y, x2: rightBox.left, y2: y, label: Math.round(gap) };
    }
  }
  return null;
}

/**
 * Orchestrates one-time Swarm Rebuild style cursor animations (crosshair box
 * drag, Alt-drag duplicate measurement, and I-beam reveal) below #portofolio,
 * then clears all overlays so the page stays untouched after entrance.
 */
export default function SwarmCursor() {
  const pathname = usePathname();
  const [eligible, setEligible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [themeMode, setThemeMode] = useState('dark');
  const layerRef = useRef(null);
  const placeholdersRef = useRef(null);
  const overlaySvgRef = useRef(null);
  const badgesRef = useRef(null);
  const cursorRefs = useRef([]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobileQuery = window.matchMedia('(max-width: 768px)');

    const syncTheme = () => {
      setThemeMode(document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark');
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
  const themeColors = PALETTE[themeMode];
  const themeRef = useRef(themeColors);
  themeRef.current = themeColors;

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
      id: i,
      x: 0,
      y: 0,
      prevX: 0,
      prevY: 0,
      startX: 0,
      startY: 0,
      ctrlX: 0,
      ctrlY: 0,
      angle: 0,
      press: 0,
      shape: 'arrow',
      renderedShape: '',
      renderedColor: '',
      hx: 5,
      hy: 3.5,
      taskType: 'draw',
      targetEl: null,
      masterEl: null,
      rect: { left: 0, top: 0, width: 100, height: 40 },
      masterRect: null,
      startedAt: 0,
      delayMs: 0,
      revealed: false,
      revealDelayMs: 0,
    }));

    const clampRect = (r, vw) => ({
      left: r.left,
      top: r.top,
      width: Math.min(r.width, vw - 24),
      height: r.height,
    });

    const hideLayerImmediately = () => {
      activeSwarm = false;
      currentBatch = [];
      if (placeholdersRef.current) placeholdersRef.current.innerHTML = '';
      if (overlaySvgRef.current) overlaySvgRef.current.innerHTML = '';
      if (badgesRef.current) badgesRef.current.innerHTML = '';
      if (layerRef.current) {
        layerRef.current.style.opacity = '0';
        layerRef.current.style.display = 'none';
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

    const detectTaskType = (el, idx, batch) => {
      if (el.matches('.solane-section-tag, .btn-solane-green')) return 'ibeam';
      if (idx > 0) {
        const prev = batch[0];
        if (prev && prev !== el && prev.className === el.className) {
          const rPrev = prev.getBoundingClientRect();
          const rEl = el.getBoundingClientRect();
          if (Math.abs(rPrev.top - rEl.top) < 30 && Math.abs(rPrev.width - rEl.width) < 40) {
            return 'dup';
          }
        }
      }
      return 'draw';
    };

    const assignBatchToCursors = (newlyVisible) => {
      if (newlyVisible.length === 0) return;

      const vw = viewportW();
      const now = performance.now();
      const wasIdle = !activeSwarm;

      for (let i = 0; i < newlyVisible.length; i++) {
        const el = newlyVisible[i];
        builtSet.add(el);
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
        const rawRect = targetEl.getBoundingClientRect();
        const rect = clampRect(rawRect, vw);
        const taskType = detectTaskType(targetEl, i, newlyVisible);

        a.targetEl = targetEl;
        a.masterEl = taskType === 'dup' ? newlyVisible[0] : null;
        a.rect = rect;
        a.masterRect = a.masterEl ? clampRect(a.masterEl.getBoundingClientRect(), vw) : null;
        a.taskType = taskType;
        a.startedAt = now;
        a.delayMs = (i % 4) * 75;
        a.revealDelayMs = 460 + a.delayMs;
        a.revealed = false;
        a.press = 0;

        const entrySide = i % 2 === 0 ? -70 : 70;
        const entryVert = i % 3 === 0 ? -48 : 48;
        a.startX = wasIdle
          ? Math.max(20, Math.min(vw - 20, rect.left + entrySide))
          : a.x;
        a.startY = wasIdle
          ? Math.max(76, Math.min(viewportH() - 24, rect.top + entryVert))
          : a.y;
        a.x = a.startX;
        a.y = a.startY;
        a.prevX = a.x;
        a.prevY = a.y;
        a.ctrlX = (a.startX + rect.left) * 0.5 + (i % 2 === 0 ? -24 : 24);
        a.ctrlY = (a.startY + rect.top) * 0.5 - 28;
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

      const elapsedTotal = Math.max(0, now - buildStartAt);
      const remaining = buildEndAt - now;
      if (remaining <= 0) {
        finalizeBuiltElements();
        return;
      }

      const vw = viewportW();
      const vh = viewportH();
      const palette = themeRef.current;

      const fadeIn = elapsedTotal < FADE_IN_MS ? easeInOutSine(elapsedTotal / FADE_IN_MS) : 1;
      const fadeOutRaw = remaining < FADE_OUT_MS ? 1 - remaining / FADE_OUT_MS : 0;
      const fadeOut = fadeOutRaw > 0 ? 1 - easeInOutSine(fadeOutRaw) : 1;
      const masterAlpha = Math.min(fadeIn, fadeOut);

      if (layerRef.current) {
        layerRef.current.style.opacity = masterAlpha.toFixed(3);
      }

      let phHtml = '';
      let svgHtml = '';
      let badgeHtml = '';
      const claimedOverlayEls = new Set();

      // Reveal remaining batch elements after the initial placeholder sweep completes.
      for (let i = 0; i < currentBatch.length; i++) {
        const el = currentBatch[i];
        if (el.getAttribute('data-swarm-box') === 'pending' && elapsedTotal >= 760 + Math.min(i * 75, 280)) {
          el.setAttribute('data-swarm-box', 'building');
        }
      }

      for (let i = 0; i < actors.length; i++) {
        const a = actors[i];
        a.prevX = a.x;
        a.prevY = a.y;

        if (a.targetEl && a.targetEl.isConnected) {
          const liveRect = a.targetEl.getBoundingClientRect();
          if (liveRect.top < 54 || liveRect.top > vh - 20) {
            const visibleFallback = currentBatch.find((cand) => {
              if (!cand.isConnected) return false;
              const cr = cand.getBoundingClientRect();
              return cr.top >= 54 && cr.top <= vh - 20;
            });
            if (visibleFallback) {
              a.targetEl = visibleFallback;
              a.rect = clampRect(visibleFallback.getBoundingClientRect(), vw);
            } else {
              a.targetEl = null;
            }
          } else {
            a.rect = clampRect(liveRect, vw);
          }
        }
        if (a.masterEl && a.masterEl.isConnected) {
          a.masterRect = clampRect(a.masterEl.getBoundingClientRect(), vw);
        }

        const localElapsed = Math.max(0, now - (a.startedAt + a.delayMs));
        const r = a.rect;
        const canDrawOverlay = i < (isMobile ? 2 : 4) && Boolean(a.targetEl) && !claimedOverlayEls.has(a.targetEl);
        if (canDrawOverlay) claimedOverlayEls.add(a.targetEl);
        const primaryTask = canDrawOverlay;

        // Phases per cursor: 0..320 approach, 320..960 drag/type/dup, 960.. settle.
        if (!a.targetEl) {
          a.shape = 'arrow';
          a.y -= fadeOutRaw * 6;
        } else if (a.taskType === 'draw') {
          if (localElapsed < 320) {
            const u = easeOutCubic(localElapsed / 320);
            const inv = 1 - u;
            a.shape = 'cross';
            a.x = inv * inv * a.startX + 2 * inv * u * a.ctrlX + u * u * r.left;
            a.y = inv * inv * a.startY + 2 * inv * u * a.ctrlY + u * u * r.top;
            a.press = u > 0.85 ? (u - 0.85) * 6 : 0;
          } else if (localElapsed < 960) {
            const u = easeInOutCubic((localElapsed - 320) / 640);
            a.shape = 'cross';
            a.press = 0.75 * (1 - u * 0.4);
            const dragW = round1(r.width * u);
            const dragH = round1(r.height * u);
            a.x = r.left + dragW;
            a.y = r.top + dragH;

            if (u >= 0.76 && !a.revealed && a.targetEl) {
              a.revealed = true;
              a.targetEl.setAttribute('data-swarm-box', 'building');
            }
            if (primaryTask && dragW > 4 && dragH > 4) {
              if (u < 0.86) {
                const phAlpha = (0.9 * (1 - Math.max(0, u - 0.55) / 0.35)).toFixed(2);
                phHtml += `<div class="swarm-ph-rect" style="transform:translate3d(${Math.round(r.left)}px,${Math.round(r.top)}px,0);width:${Math.round(dragW)}px;height:${Math.round(dragH)}px;opacity:${phAlpha}"></div>`;
              }
              svgHtml += renderSelectionSvg(r.left, r.top, dragW, dragH, palette.primary, true, true);
              badgeHtml += renderDimensionBadge(r.left, r.top, dragW, dragH, vh, palette.primary, palette.primaryText, `${Math.round(dragW)} × ${Math.round(dragH)}`);
            }
          } else {
            if (!a.revealed && a.targetEl) {
              a.revealed = true;
              a.targetEl.setAttribute('data-swarm-box', 'building');
            }
            a.shape = 'arrow';
            a.press = Math.max(0, a.press - 0.08);
            const settleU = Math.min(1, (localElapsed - 960) / 360);
            const fadeBox = remaining < FADE_OUT_MS + 120 ? Math.max(0, remaining / (FADE_OUT_MS + 120)) : 1;
            a.x = r.left + r.width - 14 - Math.sin(settleU * 1.6) * 8;
            a.y = r.top + r.height - 10 - settleU * 8 - fadeOutRaw * 12;

            if (primaryTask && fadeBox > 0.05) {
              svgHtml += `<g opacity="${fadeBox.toFixed(2)}">${renderSelectionSvg(r.left, r.top, r.width, r.height, palette.primary, true, false)}</g>`;
              badgeHtml += renderDimensionBadge(r.left, r.top, r.width, r.height, vh, palette.primary, palette.primaryText, `${Math.round(r.width)} × ${Math.round(r.height)}`, fadeBox);
            }
          }
        } else if (a.taskType === 'dup' && a.masterRect) {
          const mr = a.masterRect;
          const originX = mr.left + mr.width * 0.45;
          const originY = mr.top + mr.height * 0.4;
          const destX = r.left + r.width * 0.45;
          const destY = r.top + r.height * 0.4;

          if (localElapsed < 320) {
            const u = easeOutCubic(localElapsed / 320);
            const inv = 1 - u;
            a.shape = 'arrow';
            a.x = inv * inv * a.startX + 2 * inv * u * a.ctrlX + u * u * originX;
            a.y = inv * inv * a.startY + 2 * inv * u * a.ctrlY + u * u * originY;
            a.press = u > 0.85 ? 0.8 : 0;
          } else if (localElapsed < 960) {
            const u = easeInOutCubic((localElapsed - 320) / 640);
            a.shape = 'dup';
            a.press = 0.7;
            a.x = originX + (destX - originX) * u;
            a.y = originY + (destY - originY) * u;

            if (u >= 0.76 && !a.revealed && a.targetEl) {
              a.revealed = true;
              a.targetEl.setAttribute('data-swarm-box', 'building');
            }
            const ghostLeft = mr.left + (r.left - mr.left) * u;
            const ghostTop = mr.top + (r.top - mr.top) * u;
            if (primaryTask) {
              const phAlpha = (0.85 * (1 - Math.max(0, u - 0.55) / 0.35)).toFixed(2);
              if (u < 0.88) {
                phHtml += `<div class="swarm-ph-rect is-dup" style="transform:translate3d(${Math.round(ghostLeft)}px,${Math.round(ghostTop)}px,0);width:${Math.round(r.width)}px;height:${Math.round(r.height)}px;opacity:${phAlpha}"></div>`;
              }
              svgHtml += renderSelectionSvg(mr.left, mr.top, mr.width, mr.height, palette.orange, false, false);
              svgHtml += renderSelectionSvg(ghostLeft, ghostTop, r.width, r.height, palette.orange, false, false);
              const gap = computeSpacingGap(mr, { left: ghostLeft, top: ghostTop, width: r.width, height: r.height });
              if (gap) {
                svgHtml += `<line x1="${round1(gap.x1)}" y1="${round1(gap.y1)}" x2="${round1(gap.x2)}" y2="${round1(gap.y2)}" stroke="${palette.orange}" stroke-width="1.25"/>`;
                badgeHtml += `<div class="swarm-badge" style="left:${round1((gap.x1 + gap.x2) * 0.5)}px;top:${round1(gap.y1 + 6)}px;background:${palette.orange};color:${palette.orangeText}">${gap.label}</div>`;
              }
            }
          } else {
            if (!a.revealed && a.targetEl) {
              a.revealed = true;
              a.targetEl.setAttribute('data-swarm-box', 'building');
            }
            a.shape = 'arrow';
            a.press = Math.max(0, a.press - 0.08);
            const settleU = Math.min(1, (localElapsed - 960) / 360);
            const fadeBox = remaining < FADE_OUT_MS + 120 ? Math.max(0, remaining / (FADE_OUT_MS + 120)) : 1;
            a.x = destX + settleU * 14;
            a.y = destY - settleU * 6 - fadeOutRaw * 12;

            if (primaryTask && fadeBox > 0.05) {
              svgHtml += `<g opacity="${fadeBox.toFixed(2)}">${renderSelectionSvg(r.left, r.top, r.width, r.height, palette.primary, true, false)}</g>`;
              badgeHtml += renderDimensionBadge(r.left, r.top, r.width, r.height, vh, palette.primary, palette.primaryText, `${Math.round(r.width)} × ${Math.round(r.height)}`, fadeBox);
            }
          }
        } else {
          // I-beam text / button inspection task
          const p0x = r.left + 8;
          const p0y = r.top + r.height * 0.5;
          const p1x = r.left + Math.min(r.width - 10, r.width * 0.88);
          if (localElapsed < 320) {
            const u = easeOutCubic(localElapsed / 320);
            const inv = 1 - u;
            a.shape = 'ibeam';
            a.x = inv * inv * a.startX + 2 * inv * u * a.ctrlX + u * u * p0x;
            a.y = inv * inv * a.startY + 2 * inv * u * a.ctrlY + u * u * p0y;
          } else if (localElapsed < 980) {
            const u = easeInOutCubic((localElapsed - 320) / 660);
            a.shape = 'ibeam';
            a.x = p0x + (p1x - p0x) * u;
            a.y = p0y;
            if (u >= 0.45 && !a.revealed && a.targetEl) {
              a.revealed = true;
              a.targetEl.setAttribute('data-swarm-box', 'building');
            }
            if (primaryTask) {
              const baseLineY = r.top + r.height * 0.72;
              svgHtml += renderSelectionSvg(r.left, r.top, r.width, r.height, palette.primary, false, false);
              svgHtml += `<line x1="${round1(r.left + 6)}" x2="${round1(a.x)}" y1="${round1(baseLineY)}" y2="${round1(baseLineY)}" stroke="${palette.primary}" stroke-width="1.4"/>`;
              badgeHtml += renderDimensionBadge(r.left, r.top, r.width, r.height, vh, palette.primary, palette.primaryText, `${Math.round(r.width)} × ${Math.round(r.height)}`);
            }
          } else {
            if (!a.revealed && a.targetEl) {
              a.revealed = true;
              a.targetEl.setAttribute('data-swarm-box', 'building');
            }
            a.shape = 'arrow';
            const fadeBox = remaining < FADE_OUT_MS + 120 ? Math.max(0, remaining / (FADE_OUT_MS + 120)) : 1;
            a.x = p1x + 6;
            a.y = p0y - 6 - fadeOutRaw * 10;
            if (primaryTask && fadeBox > 0.05) {
              svgHtml += `<g opacity="${fadeBox.toFixed(2)}">${renderSelectionSvg(r.left, r.top, r.width, r.height, palette.primary, true, false)}</g>`;
            }
          }
        }

        const vx = a.x - a.prevX;
        const vy = a.y - a.prevY;
        const speed = Math.hypot(vx, vy);
        const targetAngle =
          a.shape === 'arrow' || a.shape === 'dup'
            ? speed > 0.6
              ? Math.max(-18, Math.min(18, vx * 0.85))
              : 0
            : 0;
        a.angle += (targetAngle - a.angle) * 0.22;

        // Hide cursor actor if its target scrolled offscreen behind navbar.
        const cursorEl = cursorRefs.current[i];
        if (cursorEl) {
          cursorEl.style.opacity = a.targetEl ? '1' : '0';
          const cursorColor = palette.cursors[i % palette.cursors.length];
          cursorEl.style.transform = `translate3d(${round1(a.x)}px,${round1(a.y)}px,0)`;
          const svgNode = cursorEl.firstElementChild;
          if (svgNode) {
            if (a.renderedShape !== a.shape || a.renderedColor !== cursorColor) {
              svgNode.innerHTML = buildCursorSvg(a.shape, cursorColor);
              a.renderedShape = a.shape;
              a.renderedColor = cursorColor;
              const [hx, hy] = HOTSPOTS[a.shape] || [5, 3.5];
              a.hx = hx;
              a.hy = hy;
              svgNode.style.transformOrigin = `${hx}px ${hy}px`;
            }
            const clickScale = 1 - a.press * 0.12;
            svgNode.style.transform = `translate(${-a.hx}px,${-a.hy}px) rotate(${round1(a.angle)}deg) scale(${clickScale.toFixed(3)})`;
          }
        }
      }

      if (placeholdersRef.current) placeholdersRef.current.innerHTML = phHtml;
      if (overlaySvgRef.current) overlaySvgRef.current.innerHTML = svgHtml;
      if (badgesRef.current) badgesRef.current.innerHTML = badgeHtml;

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
  }, [eligible, pathname, cursorCount, isMobile]);

  if (!eligible) return null;

  return (
    <div
      ref={layerRef}
      className="swarm-ui-layer"
      style={{ display: 'none', opacity: 0 }}
      aria-hidden="true"
    >
      <div ref={placeholdersRef} className="swarm-placeholders" />
      <svg ref={overlaySvgRef} className="swarm-ov-svg" />
      <div ref={badgesRef} className="swarm-badges" />
      {Array.from({ length: cursorCount }, (_, i) => (
        <div
          key={`cursor-${i}`}
          ref={(el) => { cursorRefs.current[i] = el; }}
          className="swarm-cursor-actor"
        >
          <svg width="28" height="28" viewBox="0 0 28 28" className="swarm-cursor-svg" />
        </div>
      ))}
    </div>
  );
}

function renderSelectionSvg(x, y, w, h, stroke, handles, rulerLines) {
  const rx = round1(x);
  const ry = round1(y);
  const rw = round1(Math.max(1, w));
  const rh = round1(Math.max(1, h));
  let out = `<rect x="${rx}" y="${ry}" width="${rw}" height="${rh}" fill="none" stroke="${stroke}" stroke-width="1"/>`;
  if (rulerLines && rw > 12 && rh > 12) {
    out += `<g stroke="${stroke}" stroke-width="1" stroke-dasharray="2 2" opacity="0.55">` +
      `<line x1="0" x2="${rx}" y1="${round1(ry + rh * 0.5)}" y2="${round1(ry + rh * 0.5)}"/>` +
      `<line x1="${round1(rx + rw * 0.5)}" x2="${round1(rx + rw * 0.5)}" y1="68" y2="${ry}"/>` +
      `</g>`;
  }
  if (handles && rw > 10 && rh > 10) {
    const corners = [
      [rx, ry],
      [rx + rw, ry],
      [rx, ry + rh],
      [rx + rw, ry + rh],
    ];
    for (const [hx, hy] of corners) {
      out += `<rect x="${round1(hx - 3.5)}" y="${round1(hy - 3.5)}" width="7" height="7" fill="#ffffff" stroke="${stroke}" stroke-width="1"/>`;
    }
  }
  return out;
}

function renderDimensionBadge(x, y, w, h, vh, bg, textColor, label, opacity = 1) {
  if (w < 8 || h < 8) return '';
  const cx = round1(x + w * 0.5);
  const placeTop = y + h + 26 > vh;
  const top = placeTop ? round1(y - 22) : round1(y + h + 7);
  return `<div class="swarm-badge" style="left:${cx}px;top:${top}px;background:${bg};color:${textColor};opacity:${opacity.toFixed(2)}">${label}</div>`;
}
