'use strict';

/* ===== NAVBAR ===== */
const navbar = document.getElementById('navbar');
const navLinks = document.querySelector('.nav-links');
const hamburger = document.getElementById('hamburger');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  highlightActiveSection();
});

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close mobile menu on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ===== ACTIVE NAV LINK ===== */
const sections = document.querySelectorAll('section[id]');

function highlightActiveSection() {
  const scrollY = window.scrollY + window.innerHeight / 3;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    const link = navLinks.querySelector(`a[href="#${id}"]`);
    if (link) {
      link.classList.toggle('active', scrollY >= top && scrollY < top + height);
    }
  });
}

/* ===== THEME TOGGLE ===== */
const themeToggle = document.getElementById('theme-toggle');
const icon = themeToggle.querySelector('i');

const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
applyTheme(savedTheme);

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  applyTheme(current === 'dark' ? 'light' : 'dark');
});

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('portfolio-theme', theme);
  icon.className = theme === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
}

/* ===== TYPED TEXT ===== */
const typedEl = document.querySelector('.typed-text');
const phrases = [
  'CS & Applied Math Grad',
  'AI Agent Builder',
  'Unreal Engine 5 Developer',
  'Physics & Engineering Teacher',
  'VEX V5 Robotics Coach',
];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typeSpeed = 80;
const deleteSpeed = 40;
const pauseAfterType = 1800;
const pauseAfterDelete = 400;

function type() {
  const current = phrases[phraseIndex];
  if (isDeleting) {
    typedEl.textContent = current.slice(0, --charIndex);
  } else {
    typedEl.textContent = current.slice(0, ++charIndex);
  }

  let delay = isDeleting ? deleteSpeed : typeSpeed;

  if (!isDeleting && charIndex === current.length) {
    delay = pauseAfterType;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    delay = pauseAfterDelete;
  }

  setTimeout(type, delay);
}
type();

/* ===== PROJECT VIDEO PLACEHOLDERS =====
   Hide the placeholder once a video successfully loads its source.
   If the file is missing (404), keep the placeholder visible. */
document.querySelectorAll('.project-video').forEach(video => {
  video.addEventListener('loadeddata', () => video.classList.add('loaded'));
  video.addEventListener('error', () => {
    video.style.display = 'none';
  });
  // Probe: if no <source> resolves, keep placeholder
  const sources = video.querySelectorAll('source');
  let anyLoaded = false;
  sources.forEach(s => {
    s.addEventListener('error', () => {
      if (!anyLoaded) video.style.display = 'none';
    });
  });
});

/* ===== SCROLL REVEAL ===== */
const revealEls = document.querySelectorAll(
  '.skill-group, .project-card, .stat-card, .contact-item, .about-text, .about-stats, .contact-form, .timeline-item, .feature-card, .experience-item'
);

revealEls.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealEls.forEach(el => revealObserver.observe(el));

/* ===== ANIMATED COUNTERS ===== */
const counters = document.querySelectorAll('.stat-number');

const counterObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const duration = 1400;
      const start = performance.now();

      function tick(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        el.textContent = Math.floor(easeOut(progress) * target);
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = target;
      }
      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    });
  },
  { threshold: 0.5 }
);

counters.forEach(el => counterObserver.observe(el));

function easeOut(t) {
  return 1 - Math.pow(1 - t, 3);
}

/* ===== PROJECT FILTER ===== */
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;

    projectCards.forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('hidden', !match);
      // Re-trigger reveal for newly shown cards
      if (match) {
        card.classList.remove('visible');
        setTimeout(() => card.classList.add('visible'), 50);
      }
    });
  });
});

/* ===== CONTACT FORM ===== */
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

contactForm.addEventListener('submit', async e => {
  e.preventDefault();
  const name = contactForm.name.value.trim();
  const email = contactForm.email.value.trim();
  const message = contactForm.message.value.trim();

  if (!name || !email || !message) {
    setStatus('Please fill in all fields.', 'error');
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setStatus('Please enter a valid email address.', 'error');
    return;
  }

  const btn = contactForm.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Sending…';
  setStatus('', '');

  try {
    const res = await fetch(contactForm.action, {
      method: 'POST',
      body: new FormData(contactForm),
      headers: { 'Accept': 'application/json' }
    });

    if (res.ok) {
      setStatus("Message sent! I'll get back to you soon.", 'success');
      contactForm.reset();
    } else {
      const data = await res.json().catch(() => ({}));
      const msg = data.errors?.map(err => err.message).join(', ')
        || 'Something went wrong. Please try again or email me directly.';
      setStatus(msg, 'error');
    }
  } catch {
    setStatus('Network error. Please check your connection and try again.', 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
  }
});

function setStatus(text, type) {
  formStatus.textContent = text;
  formStatus.className = 'form-status ' + type;
}
