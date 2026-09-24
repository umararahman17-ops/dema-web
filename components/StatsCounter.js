'use client';

import { useState, useEffect, useRef } from 'react';

export default function StatsCounter({ items }) {
  const [counts, setCounts] = useState(items.map(() => 0));
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          
          const duration = 1800; // ms duration
          const startTime = performance.now();

          const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease out cubic curve: 1 - (1 - progress)^3
            const easeProgress = 1 - Math.pow(1 - progress, 3);

            setCounts(items.map((item) => Math.floor(item.number * easeProgress)));

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCounts(items.map((item) => item.number));
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [items, hasAnimated]);

  const formatNumber = (num) => {
    return new Intl.NumberFormat('id-ID').format(num);
  };

  return (
    <section ref={sectionRef} className="stats-section">
      <div className="container">
        <div className="stats-card-wrapper">
          {items.map((item, index) => (
            <div key={index} className="stat-item">
              <div className={`stat-icon-wrap ${item.color === 'orange' ? 'orange' : ''}`}>
                {item.icon}
              </div>
              <div>
                <div className="stat-number">
                  {formatNumber(counts[index])}{item.suffix}
                </div>
                <div className="stat-label">{item.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
