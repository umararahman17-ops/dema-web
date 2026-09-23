'use client';

import { useState, useEffect } from 'react';

export default function StatsCounter({ items }) {
  const [counts, setCounts] = useState(items.map(() => 0));

  useEffect(() => {
    const duration = 1200;
    const steps = 30;
    const stepTime = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      setCounts(items.map((item) => {
        const progress = Math.min(step / steps, 1);
        return Math.floor(item.number * progress);
      }));

      if (step >= steps) {
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [items]);

  return (
    <section className="stats-section">
      <div className="container">
        <div className="stats-card-wrapper">
          {items.map((item, index) => (
            <div key={index} className="stat-item">
              <div className={`stat-icon-wrap ${item.color === 'orange' ? 'orange' : ''}`}>
                {item.icon}
              </div>
              <div>
                <div className="stat-number">
                  {counts[index]}{item.suffix}
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
