(() => {
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) canonical.href = location.origin + location.pathname;
})();
