const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.desktop-nav');
let scrollFrame;

const syncScrollState = () => {
  document.documentElement.style.setProperty('--scroll-y', `${window.scrollY}px`);
  document.documentElement.style.setProperty('--hero-shift', `${window.scrollY * -0.04}px`);
  document.body.classList.toggle('is-scrolled', window.scrollY > 30);
  scrollFrame = undefined;
};

window.addEventListener('scroll', () => {
  if (!scrollFrame) scrollFrame = requestAnimationFrame(syncScrollState);
}, { passive: true });
syncScrollState();

menuToggle?.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('is-open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
});

document.querySelectorAll('.desktop-nav a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    menuToggle?.setAttribute('aria-label', 'Open navigation');
  });
});

const selectedBot = document.querySelector('#selected-bot');
const launchDescription = document.querySelector('#launch-description');
const botDescriptions = {
  Level: 'Reward participation with XP, ranks, and reasons to come back.',
  Ping: 'Route the right signal to the right people without waking the whole server.',
  Ticket: 'Give support a private, human-feeling handoff.',
  Greet: 'Give every new member a warm first step into your culture.',
  Music: 'Keep the room moving with reliable playback and atmosphere.',
  Guard: 'Protect the vibe with fast, quiet moderation.'
};

document.querySelectorAll('[data-select-bot]').forEach((link) => {
  link.addEventListener('click', () => {
    const bot = link.dataset.selectBot;
    if (selectedBot) selectedBot.textContent = `${bot}.`;
    if (launchDescription) launchDescription.textContent = botDescriptions[bot] || 'Choose a bot above and send your server into a cleaner, calmer flow.';
  });
});

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

document.querySelectorAll('.bot-card').forEach((card) => {
  card.addEventListener('pointermove', (event) => {
    if (window.matchMedia('(max-width: 620px)').matches) return;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(900px) rotateX(${y * -3}deg) rotateY(${x * 3}deg) translateY(-9px)`;
  });
  card.addEventListener('pointerleave', () => { card.style.transform = ''; });
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (event) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
