/* ============ PRELOADER ============ */
window.addEventListener('load', () => {
  setTimeout(() => document.getElementById('preloader').classList.add('hide'), 1400);
});

/* ============ NAVBAR ============ */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const links = navLinks.querySelectorAll('a:not(.btn)');
const sections = document.querySelectorAll('main section[id]');
const progress = document.getElementById('scrollProgress');
const toTop = document.getElementById('toTop');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  hamburger.classList.remove('open');
  navLinks.classList.remove('open');
}));

function onScroll() {
  const y = window.scrollY;
  navbar.classList.toggle('scrolled', y > 40);
  const h = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = (y / h) * 100 + '%';
  toTop.classList.toggle('show', y > 600);

  let current = 'home';
  sections.forEach(s => { if (y >= s.offsetTop - 160) current = s.id; });
  links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + current));
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();
toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ============ TYPING EFFECT ============ */
const roles = ['Aspiring Software Developer', 'Web Developer', 'Python Programmer', 'Problem Solver'];
const typedEl = document.getElementById('typed');
let r = 0, c = 0, deleting = false;
function type() {
  const word = roles[r];
  typedEl.textContent = word.substring(0, c);
  if (!deleting && c < word.length) { c++; setTimeout(type, 85); }
  else if (!deleting) { deleting = true; setTimeout(type, 1700); }
  else if (c > 0) { c--; setTimeout(type, 45); }
  else { deleting = false; r = (r + 1) % roles.length; setTimeout(type, 350); }
}
setTimeout(type, 1600);

/* ============ SCROLL REVEAL (with stagger) ============ */
const revealEls = document.querySelectorAll('.reveal');
revealEls.forEach(el => {
  const siblings = [...el.parentElement.children].filter(n => n.classList.contains('reveal'));
  el.style.setProperty('--d', (siblings.indexOf(el) * 0.12) + 's');
});
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => io.observe(el));

/* ============ COUNTERS ============ */
const counters = document.querySelectorAll('.count');
const co = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, target = +el.dataset.target;
    let n = 0;
    const step = Math.max(1, Math.ceil(target / 50));
    const t = setInterval(() => {
      n += step;
      if (n >= target) { n = target; clearInterval(t); }
      el.textContent = n;
    }, 28);
    co.unobserve(el);
  });
}, { threshold: 0.6 });
counters.forEach(c => co.observe(c));

/* ============ 3D TILT ============ */
const isTouch = window.matchMedia('(hover: none)').matches;
if (!isTouch) {
  document.querySelectorAll('[data-tilt]').forEach(card => {
    const base = card.classList.contains('polaroid') ? ' rotate(7deg)' : '';
    card.addEventListener('mousemove', e => {
      const b = card.getBoundingClientRect();
      const x = (e.clientX - b.left) / b.width - 0.5;
      const y = (e.clientY - b.top) / b.height - 0.5;
      card.style.transition = 'transform .1s';
      card.style.transform = `perspective(800px) rotateX(${-y * 10}deg) rotateY(${x * 12}deg) translateY(-6px)${base}`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform .6s cubic-bezier(.22,.8,.3,1)';
      card.style.transform = '';
    });
  });

  /* magnetic buttons */
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const b = btn.getBoundingClientRect();
      const x = e.clientX - b.left - b.width / 2;
      const y = e.clientY - b.top - b.height / 2;
      btn.style.transform = `translate(${x * 0.18}px, ${y * 0.25}px)`;
    });
    btn.addEventListener('mouseleave', () => btn.style.transform = '');
  });

  /* cursor glow */
  const glow = document.getElementById('cursorGlow');
  window.addEventListener('mousemove', e => {
    glow.style.opacity = 1;
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });
}

/* ============ PARTICLE BACKGROUND ============ */
(function () {
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let w, h, pts = [];
  const mouse = { x: null, y: null };

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    const count = Math.min(70, Math.floor(w / 22));
    pts = Array.from({ length: count }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - .5) * .4, vy: (Math.random() - .5) * .4,
      r: Math.random() * 1.8 + .6
    }));
  }
  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  resize();

  function draw() {
    ctx.clearRect(0, 0, w, h);
    pts.forEach((p, i) => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(196,181,253,.7)';
      ctx.fill();
      for (let j = i + 1; j < pts.length; j++) {
        const q = pts[j], d = Math.hypot(p.x - q.x, p.y - q.y);
        if (d < 120) {
          ctx.strokeStyle = `rgba(139,92,246,${.16 * (1 - d / 120)})`;
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
        }
      }
      if (mouse.x !== null) {
        const d = Math.hypot(p.x - mouse.x, p.y - mouse.y);
        if (d < 150) {
          ctx.strokeStyle = `rgba(192,132,252,${.3 * (1 - d / 150)})`;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
      }
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ============ CONTACT FORM (opens email app) ============ */
const form = document.getElementById('contactForm');
const note = document.getElementById('formNote');
// Get a free access key at https://web3forms.com (enter your email, key arrives in your inbox)
const WEB3FORMS_KEY = 'PASTE_YOUR_ACCESS_KEY_HERE';

form.addEventListener('submit', async e => {
  e.preventDefault();
  const btn = form.querySelector('button[type="submit"]');
  const name = document.getElementById('cName').value.trim();
  const email = document.getElementById('cEmail').value.trim();
  const msg = document.getElementById('cMsg').value.trim();

  if (WEB3FORMS_KEY.startsWith('PASTE')) {
    note.style.color = '#fca5a5';
    note.textContent = 'Form not set up yet: add your Web3Forms access key in script.js';
    return;
  }

  const original = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: WEB3FORMS_KEY,
        subject: 'New portfolio message from ' + name,
        from_name: 'Portfolio Website',
        name, email, message: msg
      })
    });
    const data = await res.json();
    if (data.success) {
      note.style.color = '#86efac';
      note.textContent = '✓ Message sent! I will reply soon.';
      form.reset();
    } else {
      throw new Error(data.message);
    }
  } catch (err) {
    note.style.color = '#fca5a5';
    note.textContent = 'Sorry, something went wrong. Please email me directly.';
  }
  btn.disabled = false;
  btn.innerHTML = original;
  setTimeout(() => note.textContent = '', 6000);
});

/* ============ FOOTER YEAR ============ */
document.getElementById('year').textContent = new Date().getFullYear();