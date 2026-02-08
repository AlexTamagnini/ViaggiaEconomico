// Mobile size
const menuToggle = document.querySelector('.mobile-menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
  menuToggle.classList.toggle('open');
});

window.addEventListener('resize', () => {
  // Set nav menu
  if (window.innerWidth > 768) {
    navLinks.classList.remove('active');
    menuToggle.classList.remove('open');
  }

  // Set max width with a single card with filters
  updateSingleCardLayout();
});

// Removed index.html 
if (location.pathname.endsWith('index.html')) {
  const newURL = location.origin + location.pathname.replace(/index\.html$/, '');
  location.replace(newURL);
}

//#region animation on-scroll
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
  const observerCard = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '0';
        entry.target.style.transform = 'translateY(20px)';
        setTimeout(() => {
          entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, 100);
        observerCard.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });

  // Observe destination cards and day cards
  document.querySelectorAll('.destination-card, .day-card').forEach(card => {
    observerCard.observe(card);
  });

  // Add fade-in animation for filters on scroll
  const observerFilters = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observerFilters.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  // Observe filters
  document.querySelectorAll('.destination-card, .day-card, .filters').forEach(el => observerFilters.observe(el));

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
//#endregion

//#region filters
  const searchInput = document.getElementById('searchName');
  const priceRange = document.getElementById('priceRange');
  const priceValue = document.getElementById('priceValue');
  const sortOptions = document.getElementById('sortOptions');
  const grid = document.querySelector('.destinations-grid');
  const cards = Array.from(document.querySelectorAll('.destination-card'));
  priceValue.textContent = priceRange.value + '€';

  function applyFilters() {
    const searchText = searchInput.value.toLowerCase();
    const maxPrice = parseInt(priceRange.value);
    const sortBy = sortOptions.value;

    let result = cards.filter(card => {
      const title = card.querySelector('.card-title').textContent.toLowerCase();
      const priceText = card.querySelector('.card-cost').textContent;
      const cardMinPrice = parseInt(priceText.split('-')[0].replace('€', ''));
      return title.includes(searchText) && cardMinPrice <= maxPrice;
    });

    result.sort((a, b) => {
      const priceA = parseInt(a.querySelector('.card-cost').textContent.split('-')[0].replace('€', ''));
      const priceB = parseInt(b.querySelector('.card-cost').textContent.split('-')[0].replace('€', ''));
      const nameA = a.querySelector('.card-title').textContent;
      const nameB = b.querySelector('.card-title').textContent;
      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      if (sortBy === 'name') return nameA.localeCompare(nameB);
    });

    grid.innerHTML = '';
    result.forEach(card => grid.appendChild(card));

    // Set max width with a single card
    updateSingleCardLayout();

    // Show no card found
    const noResults = document.getElementById('noResults');
    const count = result.length;
    if (count === 0) {
      noResults.style.opacity = '0';
      noResults.style.transform = 'translateY(20px)';
      noResults.style.display = 'block';

      setTimeout(() => {
        noResults.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        noResults.style.opacity = '1';
        noResults.style.transform = 'translateY(0)';
      }, 50);
    } else {
      noResults.style.display = 'none';
      noResults.style.transition = 'none';
    }
  }

  // Reset card animation on sorting only 
  function resetCardAnimations() {
    document.querySelectorAll('.destination-card').forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'none';
      observerCard.observe(card);
    });
  }

  searchInput.addEventListener('input', applyFilters);

  priceRange.addEventListener('input', () => {
    priceValue.textContent = priceRange.value + '€';
    applyFilters();
  });

  sortOptions.addEventListener('change', () => {
    applyFilters();
    resetCardAnimations();
  });

  // Set max width with a single card
  function updateSingleCardLayout() {
    const cardsInGrid = Array.from(grid.children);
    if (cardsInGrid.length === 1 && window.innerWidth > 790) {
      cardsInGrid[0].style.width = '50%';
      cardsInGrid[0].style.margin = '0 auto';
    } else {
      cardsInGrid.forEach(card => {
        card.style.width = '';
        card.style.margin = '';
      });
    }
  }

  // Default sort on load
  applyFilters();
//#endregion
