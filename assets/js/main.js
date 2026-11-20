// Header scroll state
const header = document.querySelector('.site-header');
const onScroll = () => header && header.classList.toggle('scrolled', window.scrollY > 40);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Mobile nav
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav');
burger && burger.addEventListener('click', () => nav.classList.toggle('open'));
nav && nav.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => nav.classList.remove('open')));

// Scroll reveal
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Lightbox gallery
const gallery = document.querySelectorAll('.gallery');
gallery.forEach(g => {
  const items = [...g.querySelectorAll('img')];
  const box = document.createElement('div');
  box.className = 'lightbox';
  box.innerHTML = `
    <button class="lb-close" aria-label="Schließen">&times;</button>
    <button class="lb-nav lb-prev" aria-label="Zurück">&#8249;</button>
    <img alt="">
    <button class="lb-nav lb-next" aria-label="Weiter">&#8250;</button>
    <div class="lb-cap"></div>`;
  document.body.appendChild(box);
  const img = box.querySelector('img');
  const cap = box.querySelector('.lb-cap');
  let idx = 0;
  const show = i => {
    idx = (i + items.length) % items.length;
    img.src = items[idx].src;
    cap.textContent = items[idx].alt || '';
  };
  items.forEach((it, i) => it.closest('figure').addEventListener('click', () => { show(i); box.classList.add('open'); }));
  box.querySelector('.lb-close').addEventListener('click', () => box.classList.remove('open'));
  box.querySelector('.lb-prev').addEventListener('click', e => { e.stopPropagation(); show(idx - 1); });
  box.querySelector('.lb-next').addEventListener('click', e => { e.stopPropagation(); show(idx + 1); });
  box.addEventListener('click', e => { if (e.target === box) box.classList.remove('open'); });
  document.addEventListener('keydown', e => {
    if (!box.classList.contains('open')) return;
    if (e.key === 'Escape') box.classList.remove('open');
    if (e.key === 'ArrowLeft') show(idx - 1);
    if (e.key === 'ArrowRight') show(idx + 1);
  });
});

// Inquiry form → mailto fallback
const inquiry = document.getElementById('inquiry-form');
inquiry && inquiry.addEventListener('submit', e => {
  e.preventDefault();
  const d = new FormData(inquiry);
  const lines = [];
  d.forEach((v, k) => { if (v) lines.push(`${k}: ${v}`); });
  const body = encodeURIComponent(lines.join('\n'));
  const subject = encodeURIComponent(`Anfrage ${d.get('Unterkunft') || ''}`.trim());
  window.location.href = `mailto:fam.feichtenhofer@gmx.at?subject=${subject}&body=${body}`;
});

// Simple contact form → mailto
const contact = document.getElementById('contact-form');
contact && contact.addEventListener('submit', e => {
  e.preventDefault();
  const d = new FormData(contact);
  const body = encodeURIComponent(
    `Name: ${d.get('name')} ${d.get('nachname') || ''}\nEmail: ${d.get('email')}\nBetreff: ${d.get('subject')}\n\n${d.get('message')}`);
  window.location.href = `mailto:fam.feichtenhofer@gmx.at?subject=${encodeURIComponent(d.get('subject') || 'Anfrage')}&body=${body}`;
});
