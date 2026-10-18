(function () {
  var root = document.documentElement;
  // Static: we only use Primer's default light/dark variants, not e.g.
  // dark_dimmed or high-contrast ones.
  root.setAttribute('data-light-theme', 'light');
  root.setAttribute('data-dark-theme', 'dark');

  var theme = 'auto';
  try {
    var stored = localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark') theme = stored;
  } catch (e) {}

  if (theme === 'light' || theme === 'dark') {
    root.setAttribute('data-theme', theme);
  }
  root.setAttribute('data-color-mode', theme);
})();
