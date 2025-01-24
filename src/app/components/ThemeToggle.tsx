"use client";
import { useState, useEffect } from "react";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    localStorage.setItem('darkMode', darkMode.toString());
    
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode, mounted]);

  if (!mounted) {
    return <div className="fixed top-4 right-4 w-10 h-10" />;
  }

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="fixed top-4 right-4 w-10 h-10 flex items-center justify-center rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors text-gray-800 dark:text-gray-200"
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {/* Show sun in light mode, moon in dark mode */}
      {darkMode ? '☾' : '☀'}
    </button>
  );
} 