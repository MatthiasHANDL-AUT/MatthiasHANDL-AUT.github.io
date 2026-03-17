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

  const routeButtons = Array.from(document.querySelectorAll('[data-route]'));
  routeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const target = button.getAttribute('data-route');
      if (!target) return;
      document.body.classList.remove('is-ready');
      document.body.classList.add('is-leaving');
      window.setTimeout(() => {
        window.location.href = target;
      }, 240);
    });
  });


  let wobbleValue = 0;
  let wobbleTarget = 0;
  let lastScrollY = window.scrollY;

  const wobbleTick = () => {
    wobbleValue += (wobbleTarget - wobbleValue) * 0.16;
    wobbleTarget *= 0.84;
    if (Math.abs(wobbleValue) < 0.02 && Math.abs(wobbleTarget) < 0.02) {
      wobbleValue = 0;
      wobbleTarget = 0;
    }
    document.body.style.setProperty('--scroll-wobble', `${wobbleValue.toFixed(2)}px`);
    requestAnimationFrame(wobbleTick);
  };

  window.addEventListener('scroll', () => {
    const currentY = window.scrollY;
    const delta = currentY - lastScrollY;
    lastScrollY = currentY;
    const nextTarget = wobbleTarget + delta * 0.16;
    wobbleTarget = Math.max(-8, Math.min(8, nextTarget));
  }, { passive: true });

  requestAnimationFrame(wobbleTick);

  const overlay = document.getElementById('welcome-overlay');
  const panel = document.getElementById('welcome-panel');
  const closeButton = document.getElementById('welcome-close');
  const infoLink = document.querySelector('.menu-info-link');

  if (!overlay || !panel || !closeButton || !infoLink) {
    return;
  }

  const markInfoVisible = () => {
    infoLink.classList.add('is-visible');
    infoLink.setAttribute('aria-hidden', 'false');
  };

  const showOverlay = () => {
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
  };

  const hideOverlay = () => {
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
  };

  const hasSeenWelcome = localStorage.getItem('seenWelcomeOverlay') === '1';
  if (hasSeenWelcome) {
    markInfoVisible();
  } else {
    showOverlay();
  }

  closeButton.addEventListener('click', () => {
    const panelRect = panel.getBoundingClientRect();
    const targetRect = infoLink.getBoundingClientRect();
    const deltaX = targetRect.left - panelRect.left;
    const deltaY = targetRect.top - panelRect.top;
    const scaleX = targetRect.width / panelRect.width;
    const scaleY = targetRect.height / panelRect.height;

    panel.classList.add('is-flying');
    panel.style.transformOrigin = 'top left';
    panel.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${scaleX}, ${scaleY})`;
    panel.style.opacity = '0.15';

    window.setTimeout(() => {
      panel.style.transform = '';
      panel.style.opacity = '';
      panel.classList.remove('is-flying');
      hideOverlay();
      markInfoVisible();
      localStorage.setItem('seenWelcomeOverlay', '1');
    }, 660);
  });

  infoLink.addEventListener('click', (event) => {
    event.preventDefault();
    showOverlay();
  });
});
