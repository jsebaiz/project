const hamburger = document.getElementById('hamburger');
const mainNav = document.getElementById('main-nav');
hamburger.addEventListener('click', () => mainNav.classList.toggle('open'));
mainNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => mainNav.classList.remove('open')));

const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.style.boxShadow = window.scrollY > 10 ? '0 4px 24px rgba(0,0,0,0.35)' : 'none';
});
