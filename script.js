/* Apertura e chiusura menu mobile */
const menuToggle = document.querySelector('.mobile-menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
  menuToggle.classList.toggle('open');
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 768) {
    navLinks.classList.remove('active');
    menuToggle.classList.remove('open');
  }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');

    // Ignore empty anchors
    if (href === '#') return;

    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const headerHeight = 80;
      const targetPosition = target.offsetTop - headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// Add fade-in animation for cards on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '0';
      entry.target.style.transform = 'translateY(20px)';

      setTimeout(() => {
        entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, 100);

      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1
});

// Observe destination cards and day cards
document.querySelectorAll('.destination-card, .day-card').forEach(card => {
  observer.observe(card);
});

// Add shadow on scroll
const header = document.querySelector('.header');
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll > 50) {
    header.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
  } else {
    header.style.boxShadow = '0 1px 0 rgba(0, 0, 0, 0.05)';
  }

  lastScroll = currentScroll;
});