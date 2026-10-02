/**
 * Main Interactive Script for Soft & Dreamy Student Portfolio
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initWorksFilter();
  initCopyEmail();
  initSkillBars();
  initActiveNavHighlight();
  initLiveClock();
  initBackToTop();
  initFormHandler();
});

/* --------------------------------------------------------------------------
   1. Theme Toggle System
   -------------------------------------------------------------------------- */
function initThemeToggle() {
  const themeBtn = document.getElementById('theme-toggle-btn');
  if (!themeBtn) return;

  const savedTheme = localStorage.getItem('portfolio-theme') || 'light';
  document.body.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  themeBtn.addEventListener('click', () => {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('portfolio-theme', newTheme);
    updateThemeIcon(newTheme);
  });
}

function updateThemeIcon(theme) {
  const themeBtn = document.getElementById('theme-toggle-btn');
  if (themeBtn) {
    themeBtn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
    themeBtn.setAttribute('title', theme === 'dark' ? 'Switch to Dreamy Light Mode' : 'Switch to Ethereal Dark Mode');
  }
}

/* --------------------------------------------------------------------------
   2. Works Filter Tabs & Lightbox Modal (Click to Expand)
   -------------------------------------------------------------------------- */
function initWorksFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const workCards = document.querySelectorAll('.work-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      workCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          card.style.transform = 'translateY(16px)';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 40);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  initLightboxModal();
}

function initLightboxModal() {
  const modal = document.getElementById('works-modal');
  const modalImg = document.getElementById('modal-img');
  const modalVideo = document.getElementById('modal-video');
  const modalTitle = document.getElementById('modal-title');
  const modalCategory = document.getElementById('modal-category');
  const modalDesc = document.getElementById('modal-desc');
  const modalActions = document.getElementById('modal-actions');
  const closeBtn = document.getElementById('modal-close-btn');

  if (!modal || !modalImg) return;

  const workCards = document.querySelectorAll('.work-card');
  const projectCards = document.querySelectorAll('.project-card');

  workCards.forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('.work-thumb');
      const titleEl = card.querySelector('.work-title');
      const categoryEl = card.querySelector('.work-category-badge');
      const descEl = card.querySelector('.work-desc');
      const videoSrc = card.getAttribute('data-video');

      if (!img || !img.src) return;

      const imgSrc = img.getAttribute('src');
      const titleText = titleEl ? titleEl.textContent : 'Creative Work';
      const categoryText = categoryEl ? categoryEl.textContent : 'Portfolio Asset';
      const descText = descEl ? descEl.textContent : '';

      modalTitle.textContent = titleText;
      modalCategory.textContent = categoryText;
      modalDesc.textContent = descText;

      if (videoSrc && modalVideo) {
        modalImg.style.display = 'none';
        modalVideo.src = videoSrc;
        modalVideo.style.display = 'block';
        modalVideo.play().catch(e => console.log('Autoplay handled:', e));
      } else {
        if (modalVideo) {
          modalVideo.pause();
          modalVideo.src = '';
          modalVideo.style.display = 'none';
        }
        modalImg.src = imgSrc;
        modalImg.alt = titleText;
        modalImg.style.display = 'block';
      }

      if (modalActions) {
        modalActions.innerHTML = '';
        modalActions.style.display = 'none';
      }

      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');
    });
  });

  projectCards.forEach(card => {
    card.addEventListener('click', (e) => {
      // If user clicked directly on an action link (a tag), let the browser open the link normally
      if (e.target.closest('a')) return;

      const img = card.querySelector('.project-thumb');
      const titleEl = card.querySelector('.project-title');
      const roleEl = card.querySelector('.project-role-badge');
      const descEl = card.querySelector('.project-desc');
      const actionsEl = card.querySelector('.project-actions');

      if (!img || !img.src) return;

      const imgSrc = img.getAttribute('src');
      const titleText = titleEl ? titleEl.textContent : 'Team Project';
      const roleText = roleEl ? roleEl.textContent.trim() : 'Group Collaboration';
      const descText = descEl ? descEl.textContent : '';

      if (modalVideo) {
        modalVideo.pause();
        modalVideo.src = '';
        modalVideo.style.display = 'none';
      }

      modalImg.src = imgSrc;
      modalImg.alt = titleText;
      modalImg.style.display = 'block';
      modalTitle.textContent = titleText;
      modalCategory.textContent = roleText;
      modalDesc.textContent = descText;

      if (modalActions && actionsEl) {
        modalActions.innerHTML = actionsEl.innerHTML;
        modalActions.style.display = 'flex';
      } else if (modalActions) {
        modalActions.innerHTML = '';
        modalActions.style.display = 'none';
      }

      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');
    });
  });

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    if (modalVideo) {
      modalVideo.pause();
    }
    setTimeout(() => {
      modalImg.src = '';
      if (modalVideo) {
        modalVideo.src = '';
        modalVideo.style.display = 'none';
      }
    }, 200);
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeModal();
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-backdrop') || e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* --------------------------------------------------------------------------
   3. Copy Email to Clipboard with Toast
   -------------------------------------------------------------------------- */
function initCopyEmail() {
  const copyBtn = document.getElementById('copy-email-btn');
  const toast = document.getElementById('toast-notification');

  if (!copyBtn || !toast) return;

  copyBtn.addEventListener('click', () => {
    const email = 'isabelanahaw.reira@gmail.com';
    navigator.clipboard.writeText(email).then(() => {
      const originalHTML = copyBtn.innerHTML;
      copyBtn.innerHTML = '<span>✓</span><span>Copied!</span>';
      copyBtn.classList.add('copied');

      toast.classList.add('active');
      setTimeout(() => {
        toast.classList.remove('active');
        copyBtn.innerHTML = originalHTML;
        copyBtn.classList.remove('copied');
      }, 2500);
    }).catch(err => {
      console.error('Failed to copy email:', err);
    });
  });
}

/* --------------------------------------------------------------------------
   4. Animated Skill Bars on Scroll
   -------------------------------------------------------------------------- */
function initSkillBars() {
  const skillSection = document.getElementById('skills');
  const skillBars = document.querySelectorAll('.skill-bar-fill');

  if (!skillSection || skillBars.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        skillBars.forEach(bar => {
          const targetWidth = bar.getAttribute('data-level');
          bar.style.width = targetWidth;
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });

  observer.observe(skillSection);
}

/* --------------------------------------------------------------------------
   5. Active Navbar Highlighting
   -------------------------------------------------------------------------- */
function initActiveNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveNav() {
    let current = '';
    const scrollY = window.pageYOffset;
    const isAtBottom = (window.innerHeight + scrollY) >= (document.documentElement.scrollHeight - 60);

    if (isAtBottom) {
      current = 'contact';
    } else {
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 140;
        const sectionHeight = section.offsetHeight;

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          current = section.getAttribute('id');
        }
      });
    }

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav);
  updateActiveNav();

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });
}

/* --------------------------------------------------------------------------
   6. Live Local Clock
   -------------------------------------------------------------------------- */
function initLiveClock() {
  const timeEl = document.getElementById('local-time-text');
  if (!timeEl) return;

  function updateClock() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    timeEl.textContent = `${timeStr} (Local Time)`;
  }

  updateClock();
  setInterval(updateClock, 1000);
}

/* --------------------------------------------------------------------------
   7. Back To Top Floating Button
   -------------------------------------------------------------------------- */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top-btn');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 380) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* --------------------------------------------------------------------------
   8. Form Submission Feedback
   -------------------------------------------------------------------------- */
function initFormHandler() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    submitBtn.disabled = true;
    submitBtn.innerHTML = `✨ Sending message...`;

    setTimeout(() => {
      submitBtn.innerHTML = `🌸 Message Sent!`;
      submitBtn.style.background = 'linear-gradient(135deg, var(--pastel-mint-dark), #10B981)';
      form.reset();

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        submitBtn.style.background = '';
      }, 4000);
    }, 1200);
  });
}
