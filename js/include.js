/*
  Lightweight HTML include loader.
  Keeps each section in its own file while rendering one complete static page.
*/
(function () {
  async function loadIncludes() {
    const placeholders = Array.from(document.querySelectorAll('[data-include]'));
    await Promise.all(placeholders.map(async (placeholder) => {
      const path = placeholder.dataset.include;
      const response = await fetch(path);
      if (!response.ok) {
        throw new Error(`Unable to load section: ${path}`);
      }
      placeholder.outerHTML = await response.text();
    }));
    document.dispatchEvent(new CustomEvent('sections:loaded'));
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadIncludes);
  } else {
    loadIncludes();
  }
}());
