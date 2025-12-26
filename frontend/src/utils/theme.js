// Theme utility functions

const THEME_KEY = 'theme';

/**
 * Get the current theme from localStorage
 * @returns {'dark' | 'light'}
 */
export function getTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  return saved || 'dark'; // Default to dark
}

/**
 * Apply theme by setting/removing 'dark' class on document root
 * @param {'dark' | 'light'} theme
 */
export function applyTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

/**
 * Set and persist theme
 * @param {'dark' | 'light'} theme
 */
export function setTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
  applyTheme(theme);
}

/**
 * Apply saved theme (or default to dark) on app load
 */
export function applySavedTheme() {
  const theme = getTheme();
  applyTheme(theme);
}
