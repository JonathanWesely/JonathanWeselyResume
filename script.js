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
  '.skill-group, .project-card, .stat-card, .contact-item, .about-text, .about-stats, .contact-form, .ttt-wrapper, .timeline-item, .feature-card, .experience-item'
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

/* ===== TIC TAC TOE ===== */
const tttBoard    = document.getElementById('ttt-board');
const tttStatus   = document.getElementById('ttt-status');
const tttReset    = document.getElementById('ttt-reset');
const scoreX      = document.getElementById('score-x');
const scoreO      = document.getElementById('score-o');
const scoreDraw   = document.getElementById('score-draw');
const tttCells    = Array.from(tttBoard.querySelectorAll('.ttt-cell'));

const WINS = [
  [0,1,2],[3,4,5],[6,7,8], // rows
  [0,3,6],[1,4,7],[2,5,8], // cols
  [0,4,8],[2,4,6],          // diags
];

let tttState, tttCurrent, tttOver, scores;
scores = { X: 0, O: 0, Draw: 0 };

function tttInit() {
  tttState   = Array(9).fill(null);
  tttCurrent = 'X';
  tttOver    = false;
  tttCells.forEach(c => {
    c.textContent = '';
    c.disabled = false;
    c.className = 'ttt-cell';
  });
  tttStatus.textContent = "Player X's turn";
  updateScoreHighlight();
}

function updateScoreHighlight() {
  document.querySelectorAll('.ttt-score-card').forEach(c => c.classList.remove('active'));
  if (!tttOver) {
    const idx = tttCurrent === 'X' ? 0 : 2;
    document.querySelectorAll('.ttt-score-card')[idx].classList.add('active');
  }
}

function checkWinner() {
  for (const [a, b, c] of WINS) {
    if (tttState[a] && tttState[a] === tttState[b] && tttState[a] === tttState[c]) {
      return { winner: tttState[a], line: [a, b, c] };
    }
  }
  if (tttState.every(Boolean)) return { winner: 'Draw', line: [] };
  return null;
}

tttCells.forEach(cell => {
  cell.addEventListener('click', () => {
    const i = parseInt(cell.dataset.index, 10);
    if (tttOver || tttState[i]) return;

    tttState[i] = tttCurrent;
    cell.textContent = tttCurrent;
    cell.classList.add(tttCurrent.toLowerCase());
    cell.disabled = true;

    const result = checkWinner();
    if (result) {
      tttOver = true;
      tttCells.forEach(c => c.disabled = true);
      if (result.winner === 'Draw') {
        tttStatus.textContent = "It's a draw!";
        scores.Draw++;
        scoreDraw.textContent = scores.Draw;
      } else {
        result.line.forEach(idx => tttCells[idx].classList.add('win'));
        tttStatus.textContent = `Player ${result.winner} wins!`;
        scores[result.winner]++;
        if (result.winner === 'X') scoreX.textContent = scores.X;
        else scoreO.textContent = scores.O;
      }
      document.querySelectorAll('.ttt-score-card').forEach(c => c.classList.remove('active'));
    } else {
      tttCurrent = tttCurrent === 'X' ? 'O' : 'X';
      tttStatus.textContent = `Player ${tttCurrent}'s turn`;
      updateScoreHighlight();
    }
  });
});

tttReset.addEventListener('click', tttInit);
tttInit();

/* ===== CONTACT FORM ===== */
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

contactForm.addEventListener('submit', e => {
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

  // Simulate sending (replace with a real endpoint or EmailJS)
  const btn = contactForm.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.textContent = 'Sending…';

  setTimeout(() => {
    setStatus('Message sent! I\'ll get back to you soon.', 'success');
    contactForm.reset();
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
  }, 1200);
});

function setStatus(text, type) {
  formStatus.textContent = text;
  formStatus.className = 'form-status ' + type;
}
