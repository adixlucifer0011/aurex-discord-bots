const nav = document.querySelector('[data-nav]');
const menuButton = document.querySelector('.clover-button');
const mobileMenu = document.querySelector('#mobile-menu');
const navLinks = [...document.querySelectorAll('.nav-link')];
const sections = [...document.querySelectorAll('main section[id]')];

menuButton?.addEventListener('click', () => {
  const open = nav.classList.toggle('menu-open');
  menuButton.setAttribute('aria-expanded', String(open));
  mobileMenu.setAttribute('aria-hidden', String(!open));
});

document.querySelectorAll('.mobile-menu a').forEach((link) => link.addEventListener('click', () => {
  nav.classList.remove('menu-open');
  menuButton.setAttribute('aria-expanded', 'false');
  mobileMenu.setAttribute('aria-hidden', 'true');
}));

const setActive = (id) => navLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${id}`));
const observer = new IntersectionObserver((entries) => {
  const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (visible) setActive(visible.target.id);
}, { rootMargin: '-35% 0px -55% 0px', threshold: [0, .25, .6] });
sections.forEach((section) => observer.observe(section));

window.addEventListener('hashchange', () => setActive(location.hash.slice(1) || 'home'));
setActive('home');
