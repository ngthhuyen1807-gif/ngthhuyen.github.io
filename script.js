/**
 * Bloomora — Nguyen Minh Anh Marketing Portfolio
 * Vanilla JavaScript (Interactivity, Smooth Scrolling, Modals, Dynamic Search)
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // DOM Elements
  const header = document.querySelector('.header');
  const navItems = document.querySelectorAll('.main-nav .nav-item');
  const sections = document.querySelectorAll('section[id], footer[id]');
  
  // Mobile Nav Elements
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileCloseBtn = document.getElementById('mobileCloseBtn');
  const mobileNavOverlay = document.getElementById('mobileNavOverlay');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  // Search Modal Elements
  const searchBtn = document.getElementById('searchBtn');
  const searchModal = document.getElementById('searchModal');
  const searchCloseBtn = document.getElementById('searchCloseBtn');
  const searchBackdrop = document.getElementById('searchBackdrop');
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');
  const suggestionTags = document.querySelectorAll('.suggestion-tag');

  // Cart Modal Elements
  const cartBtn = document.getElementById('cartBtn');
  const cartModal = document.getElementById('cartModal');
  const cartCloseBtn = document.getElementById('cartCloseBtn');
  const cartBackdrop = document.getElementById('cartBackdrop');
  const cartProceedBtn = document.getElementById('cartProceedBtn');

  // Copy Email Toast
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');

  /* ============================================================
     2. Header Background on Scroll
     ============================================================ */
  const handleScrollHeader = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScrollHeader, { passive: true });
  handleScrollHeader();

  /* ============================================================
     3. Active Nav Link on Scroll (Intersection Observer)
     ============================================================ */
  const observerOptions = {
    root: null,
    rootMargin: '-25% 0px -40% 0px',
    threshold: 0
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const currentId = entry.target.getAttribute('id');
        
        // Update desktop nav
        navItems.forEach(link => {
          if (link.getAttribute('href') === `#${currentId}`) {
            navItems.forEach(item => item.classList.remove('active'));
            link.classList.add('active');
          }
        });

        // Update mobile links
        mobileLinks.forEach(link => {
          if (link.getAttribute('href') === `#${currentId}`) {
            mobileLinks.forEach(item => item.classList.remove('active'));
            link.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => navObserver.observe(section));

  /* ============================================================
     4. Smooth Scroll for all Anchor Links
     ============================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        
        // Close mobile nav if open
        if (mobileNavOverlay && mobileNavOverlay.classList.contains('open')) {
          closeMobileNav();
        }

        // Close search & cart modals if open
        closeSearch();
        closeCart();

        const headerHeight = header.offsetHeight || 80;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - (headerHeight - 10);

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  /* ============================================================
     5. Mobile Menu Toggle
     ============================================================ */
  function openMobileNav() {
    mobileNavOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    mobileNavOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (mobileToggle) mobileToggle.addEventListener('click', openMobileNav);
  if (mobileCloseBtn) mobileCloseBtn.addEventListener('click', closeMobileNav);

  /* ============================================================
     6. Search Modal & Interactive Search Index
     ============================================================ */
  const searchableData = [
    { title: "PepsiCo Consumer Insight Project", category: "Market Research", link: "#projects", desc: "Simulated research project analyzing youth attitudes towards beverage products." },
    { title: "\"Refresh Your Day\" Social Campaign", category: "Digital Marketing", link: "#projects", desc: "TikTok and Instagram content plan targeting university students." },
    { title: "Rebranding a Local Coffee Brand", category: "Brand Strategy", link: "#projects", desc: "Brand positioning, persona, and messaging tailored for Gen Z consumers." },
    { title: "Instagram Content Series", category: "Content Marketing", link: "#projects", desc: "Five-post series for skincare brand with visual directions and captions." },
    { title: "Foreign Trade University (FTU)", category: "Education / About", link: "#about", desc: "Third-year International Business student focusing on Marketing." },
    { title: "Market Research & Surveys", category: "Skill / Competency", link: "#skills", desc: "Consumer research, survey design, trend analysis and needs assessment." },
    { title: "Campaign & Content Planning", category: "Skill / Competency", link: "#skills", desc: "Social media calendar, copywriting concepts, communication plans." },
    { title: "Marketing Club FTU", category: "Leadership & Activities", link: "#club-experience", desc: "Recruitment campaign, campus activations, workshops and surveys." },
    { title: "Marketing Case Competition", category: "Experience", link: "#experience", desc: "Solving real consumer brand challenges and pitching to judging panels." }
  ];

  function openSearch() {
    searchModal.classList.add('active');
    searchModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      searchInput.focus();
    }, 150);
  }

  function closeSearch() {
    searchModal.classList.remove('active');
    searchModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    searchInput.value = '';
    searchResults.innerHTML = '';
  }

  function performSearch(query) {
    const q = query.trim().toLowerCase();
    if (!q) {
      searchResults.innerHTML = '';
      return;
    }

    const matches = searchableData.filter(item => 
      item.title.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.desc.toLowerCase().includes(q)
    );

    if (matches.length === 0) {
      searchResults.innerHTML = `<div style="padding: 1rem; color: rgba(255,255,255,0.6); text-align: center;">No results found for "${query}"</div>`;
      return;
    }

    searchResults.innerHTML = matches.map(m => `
      <a href="${m.link}" class="search-result-item" onclick="document.getElementById('searchModal').classList.remove('active'); document.body.style.overflow = '';">
        <div class="search-result-title">${m.title}</div>
        <div class="search-result-meta">${m.category} · ${m.desc}</div>
      </a>
    `).join('');
  }

  if (searchBtn) searchBtn.addEventListener('click', openSearch);
  if (searchCloseBtn) searchCloseBtn.addEventListener('click', closeSearch);
  if (searchBackdrop) searchBackdrop.addEventListener('click', closeSearch);

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      performSearch(e.target.value);
    });
  }

  suggestionTags.forEach(tag => {
    tag.addEventListener('click', () => {
      const q = tag.getAttribute('data-query');
      searchInput.value = q;
      performSearch(q);
    });
  });

  /* ============================================================
     7. Cart Modal Functionality
     ============================================================ */
  function openCart() {
    cartModal.classList.add('active');
    cartModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    cartModal.classList.remove('active');
    cartModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (cartBtn) cartBtn.addEventListener('click', openCart);
  if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCart);
  if (cartBackdrop) cartBackdrop.addEventListener('click', closeCart);
  if (cartProceedBtn) {
    cartProceedBtn.addEventListener('click', () => {
      closeCart();
    });
  }

  /* ============================================================
     8. Copy Email to Clipboard & Toast Notification
     ============================================================ */
  function showToast(message) {
    if (toastMsg) toastMsg.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      const email = copyEmailBtn.getAttribute('data-email') || 'minhanh.marketing@example.com';
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(() => {
          showToast('Email copied to clipboard: ' + email);
        }).catch(() => {
          showToast('Email: ' + email);
        });
      } else {
        // Fallback for older browsers
        const tempInput = document.createElement('input');
        tempInput.value = email;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        showToast('Email copied to clipboard: ' + email);
      }
    });
  }

  /* ============================================================
     9. ESC Key listener to close active modals & menu
     ============================================================ */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeSearch();
      closeCart();
      closeMobileNav();
    }
  });

  /* ============================================================
     10. Scroll Reveal Animation for Glass Panels
     ============================================================ */
  const cards = document.querySelectorAll('.glass-panel');
  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        cardObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(24px)';
    card.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.35s ease, box-shadow 0.35s ease';
    cardObserver.observe(card);
  });
});
