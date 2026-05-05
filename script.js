// ===== MOBILE NAV TOGGLE =====
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');
const navClose  = document.getElementById('navClose');

function openNav() {
  navLinks.classList.add('open');
  document.body.style.overflow = 'hidden'; // prevent background scroll
}

function closeNav() {
  navLinks.classList.remove('open');
  document.body.style.overflow = '';
}

navToggle.addEventListener('click', openNav);
if (navClose) navClose.addEventListener('click', closeNav);

// Close when any nav link is tapped
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeNav);
});

// Close when tapping outside the menu (on overlay area)
document.addEventListener('click', (e) => {
  if (navLinks.classList.contains('open') &&
      !navLinks.contains(e.target) &&
      !navToggle.contains(e.target)) {
    closeNav();
  }
});

// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.style.background = window.scrollY > 50
    ? 'rgba(3,5,15,0.97)'
    : 'rgba(3,5,15,0.85)';
});

// ===== PARTICLE CANVAS =====
const canvas = document.getElementById('bg');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const COLORS = ['#38bdf8', '#818cf8', '#06b6d4', '#00f5d4'];

let particles = [];
function initParticles() {
  const count = Math.min(120, Math.floor(window.innerWidth / 12));
  particles = [];
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.5,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: Math.random() * 0.5 + 0.2
    });
  }
}
initParticles();
window.addEventListener('resize', initParticles);

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(56,189,248,${0.04 * (1 - dist / 120)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawConnections();

  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.globalAlpha = p.alpha;
    ctx.fill();
    ctx.globalAlpha = 1;

    p.x += p.dx;
    p.y += p.dy;

    if (p.x < 0 || p.x > canvas.width)  p.dx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
  });

  requestAnimationFrame(animate);
}
animate();

// ===== CONTACT FORM — EmailJS =====
// HOW TO SETUP (one-time, free):
// 1. Go to https://www.emailjs.com and create a free account
// 2. Add an Email Service (Gmail) → copy your SERVICE ID
// 3. Create an Email Template → copy your TEMPLATE ID
//    In the template body use: {{from_name}}, {{from_email}}, {{phone}}, {{message}}
//    Set "To Email" as: contact.junaidul@gmail.com
// 4. Go to Account → copy your PUBLIC KEY
// 5. Replace the 3 placeholder values below

const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';   // e.g. 'service_abc123'
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';  // e.g. 'template_xyz789'
// Public key is already set in index.html <head>

const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const btn = contactForm.querySelector('.submit-btn');

    // Merge country code + phone into one field
    const code  = document.getElementById('countryCode').value;
    const phone = document.getElementById('phone').value;
    const fullPhone = code ? `${code} ${phone}` : phone;

    const templateParams = {
      from_name:  contactForm.querySelector('[name="from_name"]').value,
      from_email: contactForm.querySelector('[name="from_email"]').value,
      phone:      fullPhone,
      message:    contactForm.querySelector('[name="message"]').value,
      to_email:   'contact.junaidul@gmail.com'
    };

    btn.textContent = 'Sending…';
    btn.disabled = true;

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
      .then(() => {
        btn.textContent = '✓ Message Sent!';
        btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        contactForm.reset();
        setTimeout(() => {
          btn.textContent = 'Send Message →';
          btn.style.background = '';
          btn.disabled = false;
        }, 4000);
      })
      .catch((err) => {
        console.error('EmailJS error:', err);
        btn.textContent = '✗ Failed — Try Again';
        btn.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
        btn.disabled = false;
        setTimeout(() => {
          btn.textContent = 'Send Message →';
          btn.style.background = '';
        }, 3500);
      });
  });
}

// ===== SCROLL REVEAL =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animation = 'fadeUp 0.6s ease both';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.card, .stat, .tech-item').forEach(el => {
  el.style.opacity = '0';
  observer.observe(el);
});
