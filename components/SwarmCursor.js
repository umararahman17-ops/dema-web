'use client';

import { useEffect, useRef, useState } from 'react';

const DESKTOP_CURSOR_COUNT = 8;
const MOBILE_CURSOR_COUNT = 4;
const DESKTOP_BOX_COUNT = 4;
const MOBILE_BOX_COUNT = 2;

// Vibrant multiplayer cursor accents with white stroke legibility across themes.
const CURSOR_COLORS = [
  '#38bdf8',
  '#34d399',
  '#f59e0b',
  '#fb7185',
  '#a78bfa',
  '#22c55e',
  '#e0631f',
  '#60a5fa',
];

const TARGET_SELECTOR = [
  '.solane-headline',
  '.solane-subtitle',
  '.btn-solane-green',
  '.btn-solane-ghost',
  '.solane-emblem-stage',
  '.solane-partner-item',
  '.solane-section-tag',
  '.solane-pillar-card',
  '.solane-bento-card',
  '.portfolio-card',
  '.alumni-highlight-item',
  '.alumni-card',
  '.cta-card-form',
  '.solane-nav-link',
].join(', ');

const OPEN_MODAL_SELECTOR =
  '.alumni-modal-overlay, .cabinet-modal-overlay, .portfolio-modal-overlay, .mobile-drawer.open';

/**
 * Renders animated multiplayer design-tool cursors that glide across visible UI
 * blocks with dashed wireframe outlines and live WxH dimension tags.
 */
export default function SwarmCursor() {
  const [active, setActive] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const cursorRefs = useRef([]);
  const boxRefs = useRef([]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobileQuery = window.matchMedia('(max-width: 768px)');

    const syncState = () => {
      if (motionQuery.matches) {
        setActive(false);
        return;
      }
      setIsMobile(mobileQuery.matches);
      setActive(true);
    };

    syncState();
    motionQuery.addEventListener?.('change', syncState);
    mobileQuery.addEventListener?.('change', syncState);
    window.addEventListener('resize', syncState, { passive: true });

    return () => {
      motionQuery.removeEventListener?.('change', syncState);
      mobileQuery.removeEventListener?.('change', syncState);
      window.removeEventListener('resize', syncState);
    };
  }, []);

  const cursorCount = isMobile ? MOBILE_CURSOR_COUNT : DESKTOP_CURSOR_COUNT;
  const inspectBoxCount = isMobile ? MOBILE_BOX_COUNT : DESKTOP_BOX_COUNT;

  useEffect(() => {
    if (!active) return undefined;

    let viewportW = window.innerWidth;
    let viewportH = window.innerHeight;
    let visibleTargets = [];
    let rafId = null;
    let pointerInfluence = null;
    let pointerInfluenceUntil = 0;

    const isRectVisible = (rect) =>
      rect.width >= 36 &&
      rect.height >= 16 &&
      rect.bottom >= 72 &&
      rect.top <= viewportH - 28 &&
      rect.right >= 12 &&
      rect.left <= viewportW - 12;

    const toClampedRect = (rect) => ({
      left: rect.left,
      top: rect.top,
      width: Math.min(rect.width, viewportW - 24),
      height: rect.height,
    });

    const collectVisibleTargets = () => {
      if (document.querySelector(OPEN_MODAL_SELECTOR)) {
        visibleTargets = [];
        return;
      }

      const nodes = document.querySelectorAll(TARGET_SELECTOR);
      const next = [];
      for (let i = 0; i < nodes.length; i++) {
        const el = nodes[i];
        const rect = el.getBoundingClientRect();
        if (isRectVisible(rect)) {
          next.push({ el, rect: toClampedRect(rect) });
        }
      }
      visibleTargets = next;
    };

    collectVisibleTargets();

    const pickTarget = (actorIndex, stepOffset = 0, excludeEls = null) => {
      if (visibleTargets.length === 0) {
        const padX = Math.max(24, viewportW * 0.1);
        const w = Math.min(240, viewportW * 0.44);
        const h = 36 + (actorIndex % 3) * 16;
        return {
          el: null,
          rect: {
            left: padX + ((actorIndex * 137) % Math.max(40, viewportW - padX * 2 - w)),
            top: 120 + ((actorIndex * 113) % Math.max(80, viewportH - 220)),
            width: w,
            height: h,
          },
        };
      }

      const len = visibleTargets.length;
      const start = (actorIndex + stepOffset) % len;
      for (let offset = 0; offset < len; offset++) {
        const candidate = visibleTargets[(start + offset) % len];
        if (!excludeEls || !excludeEls.has(candidate.el)) {
          return candidate;
        }
      }
      return visibleTargets[start];
    };

    const pickCursorAnchorOnRect = (rect, index) => {
      const mode = index % 4;
      if (mode === 0) return { x: rect.left + rect.width - 10, y: rect.top + rect.height - 6 };
      if (mode === 1) return { x: rect.left + rect.width * 0.62, y: rect.top + rect.height * 0.55 };
      if (mode === 2) return { x: rect.left + 14, y: rect.top + 10 };
      return { x: rect.left + rect.width * 0.84, y: rect.top + 8 };
    };

    const initialUsed = new Set();
    const actors = Array.from({ length: cursorCount }, (_, i) => {
      const picked = pickTarget(i, 0, initialUsed);
      if (picked.el) initialUsed.add(picked.el);
      const anchor = pickCursorAnchorOnRect(picked.rect, i);
      return {
        x: Math.max(20, Math.min(viewportW - 20, anchor.x + (i % 2 === 0 ? -42 : 42))),
        y: Math.max(80, Math.min(viewportH - 30, anchor.y + (i % 3 === 0 ? -32 : 32))),
        vx: 0,
        vy: 0,
        targetX: Math.max(18, Math.min(viewportW - 24, anchor.x)),
        targetY: Math.max(76, Math.min(viewportH - 28, anchor.y)),
        targetEl: picked.el,
        anchorMode: i,
        rect: picked.rect,
        switchCount: 1,
        nextSwitchAt: performance.now() + 1800 + i * 240,
        boxSlot: i < inspectBoxCount ? i : -1,
        inspectOpacity: 0.75,
        wobblePhase: i * 1.1,
        stiffness: 0.024 + (i % 3) * 0.006,
        damping: 0.8,
      };
    });

    const syncActorRectsAfterScroll = () => {
      const now = performance.now();
      for (let i = 0; i < actors.length; i++) {
        const a = actors[i];
        a.x = Math.max(20, Math.min(viewportW - 20, a.x));
        a.y = Math.max(76, Math.min(viewportH - 28, a.y));
        if (!a.targetEl || !a.targetEl.isConnected) continue;
        const liveRect = a.targetEl.getBoundingClientRect();
        if (!isRectVisible(liveRect)) {
          a.inspectOpacity = 0;
          a.targetEl = null;
          a.nextSwitchAt = now;
        } else {
          a.rect = toClampedRect(liveRect);
          const anchor = pickCursorAnchorOnRect(a.rect, a.anchorMode);
          a.targetX = Math.max(18, Math.min(viewportW - 24, anchor.x));
          a.targetY = Math.max(76, Math.min(viewportH - 28, anchor.y));
        }
      }
    };

    const handleResizeOrScroll = () => {
      viewportW = window.innerWidth;
      viewportH = window.innerHeight;
      collectVisibleTargets();
      syncActorRectsAfterScroll();
    };

    const handlePointerMove = (e) => {
      if (e.pointerType === 'touch') return;
      pointerInfluence = { x: e.clientX, y: e.clientY };
      pointerInfluenceUntil = performance.now() + 1800;
    };

    const handlePointerDown = (e) => {
      if (e.pointerType === 'touch') return;
      const now = performance.now();
      for (let i = 0; i < actors.length; i++) {
        const a = actors[i];
        const dx = a.x - e.clientX;
        const dy = a.y - e.clientY;
        const dist = Math.hypot(dx, dy) || 1;
        if (dist < 220) {
          a.vx += (dx / dist) * 5.2;
          a.vy += (dy / dist) * 5.2;
          a.nextSwitchAt = now + 400 + i * 120;
        }
      }
    };

    const targetRefreshTimer = window.setInterval(collectVisibleTargets, 1100);

    const tick = (now) => {
      if (document.hidden || document.querySelector(OPEN_MODAL_SELECTOR)) {
        for (let s = 0; s < inspectBoxCount; s++) {
          const boxEl = boxRefs.current[s];
          if (boxEl) boxEl.style.opacity = '0';
        }
        rafId = window.requestAnimationFrame(tick);
        return;
      }

      const pointerActive = pointerInfluence && now < pointerInfluenceUntil;

      for (let i = 0; i < actors.length; i++) {
        const a = actors[i];

        if (now >= a.nextSwitchAt) {
          a.switchCount += 1;
          const activeBoxEls = new Set();
          for (let k = 0; k < actors.length; k++) {
            if (k !== i && actors[k].boxSlot >= 0 && actors[k].targetEl) {
              activeBoxEls.add(actors[k].targetEl);
            }
          }

          let chosen = pickTarget(
            i,
            a.switchCount * 2 + Math.floor(Math.random() * 3),
            a.boxSlot >= 0 ? activeBoxEls : null
          );

          // Attract two cursors gently toward elements near the user's pointer.
          if (pointerActive && i % 4 === 0 && visibleTargets.length > 0) {
            let bestTarget = chosen;
            let bestDist = Infinity;
            for (let r = 0; r < visibleTargets.length; r++) {
              const cand = visibleTargets[r];
              if (a.boxSlot >= 0 && activeBoxEls.has(cand.el)) continue;
              const cx = cand.rect.left + cand.rect.width * 0.5;
              const cy = cand.rect.top + cand.rect.height * 0.5;
              const d = Math.hypot(cx - pointerInfluence.x, cy - pointerInfluence.y);
              if (d < bestDist) {
                bestDist = d;
                bestTarget = cand;
              }
            }
            chosen = bestTarget;
          }

          a.targetEl = chosen.el;
          a.rect = chosen.rect;
          a.anchorMode = i + a.switchCount;
          const anchor = pickCursorAnchorOnRect(a.rect, a.anchorMode);
          a.targetX = Math.max(18, Math.min(viewportW - 24, anchor.x));
          a.targetY = Math.max(76, Math.min(viewportH - 28, anchor.y));
          a.nextSwitchAt = now + 1700 + Math.random() * 1400;
        }

        a.wobblePhase += 0.035;
        const microDriftX = Math.cos(a.wobblePhase) * 3.5;
        const microDriftY = Math.sin(a.wobblePhase * 0.9) * 3.5;

        const destX = a.targetX + microDriftX;
        const destY = a.targetY + microDriftY;

        a.vx += (destX - a.x) * a.stiffness;
        a.vy += (destY - a.y) * a.stiffness;
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
            if (a.targetEl && a.targetEl.isConnected) {
              const liveRect = a.targetEl.getBoundingClientRect();
              if (isRectVisible(liveRect)) {
                a.rect = toClampedRect(liveRect);
                const anchor = pickCursorAnchorOnRect(a.rect, a.anchorMode);
                a.targetX = Math.max(18, Math.min(viewportW - 24, anchor.x));
                a.targetY = Math.max(76, Math.min(viewportH - 28, anchor.y));
              }
            }
            const distToTarget = Math.hypot(a.targetX - a.x, a.targetY - a.y);
            const targetInspectAlpha = distToTarget < 110 && visibleTargets.length > 0 ? 1 : 0;
            a.inspectOpacity += (targetInspectAlpha - a.inspectOpacity) * 0.16;

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
                const flipTop = a.rect.top + a.rect.height + 24 > viewportH;
                badgeEl.classList.toggle('is-top', flipTop);
              }
            }
          }
        }
      }

      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);

    window.addEventListener('scroll', handleResizeOrScroll, { passive: true });
    window.addEventListener('resize', handleResizeOrScroll, { passive: true });
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });

    return () => {
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      window.clearInterval(targetRefreshTimer);
      window.removeEventListener('scroll', handleResizeOrScroll);
      window.removeEventListener('resize', handleResizeOrScroll);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [active, cursorCount, inspectBoxCount]);

  if (!active) return null;

  return (
    <div className="swarm-ui-layer" aria-hidden="true">
      {Array.from({ length: inspectBoxCount }, (_, slot) => (
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
