'use client';

import { useState, useEffect } from 'react';
import { IconSun, IconMoon } from '@/components/Icons';

export default function ThemeToggle() {
  const [theme, setTheme] = useState('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('dema_theme');
    const current = document.documentElement.getAttribute('data-theme') || saved || 'dark';
    setTheme(current);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    try {
      localStorage.setItem('dema_theme', nextTheme);
    } catch (e) {}
  };

  if (!mounted) {
    return (
      <button 
        type="button" 
        className="solane-theme-btn" 
        aria-label="Toggle Theme" 
        style={{ opacity: 0 }}
      >
        <span style={{ width: 18, height: 18 }} />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="solane-theme-btn"
      aria-label={theme === 'dark' ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
      title={theme === 'dark' ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
    >
      {theme === 'dark' ? <IconSun size={17} /> : <IconMoon size={17} />}
    </button>
  );
}
