'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Global GPU-accelerated scroll parallax & staggered reveal controller.
 * Tracks applied shift per element so bounding-rect calculations never
 * self-oscillate, and keeps rAF updates passive and lightweight.
 */
export default function ParallaxController() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const root = document.documentElement;
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let isReduced = reducedMotionQuery.matches;

    const revealElements = Array.from(document.querySelectorAll('[data-reveal]'));
    const parallaxElements = Array.from(document.querySelectorAll('[data-parallax]'));
    const appliedShifts = new WeakMap();

    revealElements.forEach((el) => {
      const delay = el.getAttribute('data-reveal-delay');
      if (delay) {
        el.style.transitionDelay = `${delay}ms`;
      }
    });

    const resetParallaxState = () => {
      root.style.setProperty('--scroll-y', '0');
      root.style.setProperty('--hero-scroll', '0');
      root.style.setProperty('--hero-progress', '0');
      root.style.setProperty('--scroll-progress', '0');
      parallaxElements.forEach((el) => {
        appliedShifts.set(el, 0);
        el.style.setProperty('--px-y', '0px');
        el.style.setProperty('--px-x', '0px');
        el.style.setProperty('--px-rot', '0deg');
        el.style.setProperty('--px-scale', '1');
      });
    };

    if (isReduced) {
      revealElements.forEach((el) => el.classList.add('is-revealed'));
      resetParallaxState();
      return;
    }

    // Immediate reveal for elements already in initial viewport
    const initialVh = window.innerHeight || 800;
    revealElements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < initialVh * 0.96) {
        el.classList.add('is-revealed');
      }
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -30px 0px',
      }
    );

    revealElements.forEach((el) => {
      if (!el.classList.contains('is-revealed')) {
        observer.observe(el);
      }
    });

    let rafId = null;
    let ticking = false;

    const updateParallax = () => {
      ticking = false;
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const viewportW = window.innerWidth || 1280;
      const viewportH = window.innerHeight || 800;
      const docHeight = Math.max(document.documentElement.scrollHeight - viewportH, 1);

      const heroFactor = viewportW <= 768 ? 0.55 : 1;
      const heroScroll = Math.min(scrollY, viewportH * 1.35) * heroFactor;
      const heroProgress = Math.min(Math.max(scrollY / Math.max(viewportH * 0.85, 420), 0), 1);
      const scrollProgress = Math.min(Math.max(scrollY / docHeight, 0), 1);

      root.style.setProperty('--scroll-y', String(Math.round(scrollY)));
      root.style.setProperty('--hero-scroll', heroScroll.toFixed(1));
      root.style.setProperty('--hero-progress', heroProgress.toFixed(4));
      root.style.setProperty('--scroll-progress', scrollProgress.toFixed(4));

      const viewCenter = viewportH * 0.5;
      const defaultMobileFactor = viewportW <= 768 ? 0.35 : 1;

      for (let i = 0; i < parallaxElements.length; i++) {
        const el = parallaxElements[i];
        const prevShift = appliedShifts.get(el) || 0;
        const rect = el.getBoundingClientRect();
        const layoutTop = rect.top - prevShift;
        const layoutBottom = rect.bottom - prevShift;

        if (layoutBottom < -320 || layoutTop > viewportH + 320) {
          continue;
        }

        const responsiveFactor =
          viewportW <= 768
            ? parseFloat(el.dataset.parallaxMobileScale || String(defaultMobileFactor))
            : 1;
        const speed = parseFloat(el.dataset.parallax || '0.06') * responsiveFactor;
        const maxShift = parseFloat(el.dataset.parallaxMax || '46') * responsiveFactor;
        const elCenter = layoutTop + rect.height * 0.5;
        const deltaCenter = elCenter - viewCenter;
        const rawShift = deltaCenter * speed;
        const clamped = Math.max(-maxShift, Math.min(maxShift, rawShift));

        appliedShifts.set(el, clamped);
        el.style.setProperty('--px-y', `${clamped.toFixed(2)}px`);

        const normOffset = Math.max(-1, Math.min(1, deltaCenter / Math.max(viewportH * 0.65, 360)));

        if (el.dataset.parallaxX) {
          const shiftX = normOffset * parseFloat(el.dataset.parallaxX) * responsiveFactor;
          el.style.setProperty('--px-x', `${shiftX.toFixed(2)}px`);
        }

        if (el.dataset.parallaxRotate) {
          const rot = normOffset * parseFloat(el.dataset.parallaxRotate) * responsiveFactor;
          el.style.setProperty('--px-rot', `${rot.toFixed(2)}deg`);
        }

        if (el.dataset.parallaxScale) {
          const scale = 1 - normOffset * parseFloat(el.dataset.parallaxScale) * responsiveFactor;
          el.style.setProperty('--px-scale', scale.toFixed(4));
        }
      }
    };

    const scheduleUpdate = () => {
      if (!ticking) {
        ticking = true;
        rafId = window.requestAnimationFrame(updateParallax);
      }
    };

    const handleMotionChange = (e) => {
      isReduced = e.matches;
      if (isReduced) {
        revealElements.forEach((el) => el.classList.add('is-revealed'));
        resetParallaxState();
      } else {
        scheduleUpdate();
      }
    };

    updateParallax();

    const resizeObserver =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => {
            scheduleUpdate();
          })
        : null;
    if (resizeObserver && document.body) {
      resizeObserver.observe(document.body);
    }

    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate, { passive: true });
    reducedMotionQuery.addEventListener?.('change', handleMotionChange);

    return () => {
      observer.disconnect();
      resizeObserver?.disconnect();
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      reducedMotionQuery.removeEventListener?.('change', handleMotionChange);
    };
  }, [pathname]);

  return <div className="scroll-progress-bar" aria-hidden="true" />;
}
