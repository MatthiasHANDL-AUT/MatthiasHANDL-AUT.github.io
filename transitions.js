document.addEventListener('DOMContentLoaded', () => {
  requestAnimationFrame(() => document.body.classList.add('is-ready'));

  const links = Array.from(document.querySelectorAll('a[href]')).filter((link) => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
      return false;
    }

    const url = new URL(link.href, window.location.href);
    return url.origin === window.location.origin;
  });

  links.forEach((link) => {
    link.addEventListener('click', (event) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      event.preventDefault();
      const target = link.href;
      document.body.classList.remove('is-ready');
      document.body.classList.add('is-leaving');

      window.setTimeout(() => {
        window.location.href = target;
      }, 240);
    });
  });
});
