'use client';

import { useState, useEffect } from 'react';
import { IconSun, IconMoon } from '@/components/Icons';

export default function ThemeToggle() {
  const [theme, setTheme] = useState('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check saved theme or system preference
    const savedTheme = localStorage.getItem('dema_theme');
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initial = prefersDark ? 'dark' : 'light';
      setTheme(initial);
      document.documentElement.setAttribute('data-theme', initial);
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('dema_theme', nextTheme);
  };

  if (!mounted) {
    return (
      <button className="theme-toggle-btn" aria-label="Toggle Theme" style={{ opacity: 0 }}>
        <IconMoon size={18} />
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle-btn"
      aria-label={theme === 'dark' ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
      title={theme === 'dark' ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      {theme === 'dark' ? <IconSun size={18} /> : <IconMoon size={18} />}
    </button>
  );
}
