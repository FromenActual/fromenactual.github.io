(function () {
  var root = document.documentElement;
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
