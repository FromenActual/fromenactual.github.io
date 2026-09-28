(function () {
  var STORAGE_KEY = 'theme';
  var ORDER = ['auto', 'light', 'dark'];
  var button = document.getElementById('theme-toggle');
  if (!button) return;

  function getStored() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function store(theme) {
    try {
      if (theme === 'auto') {
        localStorage.removeItem(STORAGE_KEY);
      } else {
        localStorage.setItem(STORAGE_KEY, theme);
      }
    } catch (e) {}
  }

  function apply(theme) {
    if (theme === 'light' || theme === 'dark') {
      document.documentElement.setAttribute('data-theme', theme);
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    button.setAttribute('data-active-theme', theme);
    button.setAttribute('aria-label', 'Color scheme: ' + theme + '. Click to change.');
  }

  var current = getStored() || 'auto';
  apply(current);

  button.addEventListener('click', function () {
    current = ORDER[(ORDER.indexOf(current) + 1) % ORDER.length];
    apply(current);
    store(current);
  });
})();
