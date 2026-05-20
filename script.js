function openComingSoon() {
  document.getElementById('comingSoonModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeComingSoon(e) {
  if (e.target === document.getElementById('comingSoonModal')) closeModal();
}

// Product modal
function openProduct(img, name, desc, price, colours) {
  document.getElementById('modalImg').src = img;
  document.getElementById('modalName').textContent = name;
  document.getElementById('modalDesc').textContent = desc;
  document.getElementById('modalPrice').textContent = price;

  const coloursEl = document.getElementById('modalColours');
  coloursEl.innerHTML = '';

  if (colours && colours.length > 1) {
    colours.forEach((c, i) => {
      const btn = document.createElement('button');
      btn.className = 'colour-swatch' + (i === 0 ? ' active' : '');
      btn.textContent = c.label;
      btn.onclick = () => {
        document.getElementById('modalImg').src = c.img;
        coloursEl.querySelectorAll('.colour-swatch').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      };
      coloursEl.appendChild(btn);
    });
  }

  document.getElementById('productModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('productModal').classList.remove('open');
  document.body.style.overflow = '';
}

function closeProduct(e) {
  if (e.target === document.getElementById('productModal')) closeModal();
}

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// Search bar
const searchBtn = document.getElementById('searchBtn');
const searchWrap = document.getElementById('searchWrap');
const searchClose = document.getElementById('searchClose');
const searchInput = document.getElementById('searchInput');

searchBtn.addEventListener('click', () => {
  const isOpen = searchWrap.classList.toggle('open');
  if (isOpen) {
    searchInput.focus();
  } else {
    searchInput.value = '';
    clearSearch();
  }
});

searchInput.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    searchWrap.classList.remove('open');
    searchInput.value = '';
    clearSearch();
  }
});

searchInput.addEventListener('input', () => {
  const query = searchInput.value.trim().toLowerCase();
  if (!query) { clearSearch(); return; }

  // Search through gallery items
  document.querySelectorAll('.gallery-item[onclick]').forEach(item => {
    const onclick = item.getAttribute('onclick') || '';
    const match = onclick.toLowerCase().includes(query);
    item.style.opacity = match ? '1' : '0.2';
    item.style.transform = match ? 'scale(1)' : 'scale(0.95)';
  });

  // Search through collection cards
  document.querySelectorAll('.collection-card').forEach(card => {
    const text = card.innerText.toLowerCase();
    const match = text.includes(query);
    card.style.opacity = match ? '1' : '0.2';
    card.style.transform = match ? 'scale(1)' : 'scale(0.95)';
  });

  // Search through category cards
  document.querySelectorAll('.cat-card').forEach(card => {
    const text = card.innerText.toLowerCase();
    const match = text.includes(query);
    card.style.opacity = match ? '1' : '0.2';
    card.style.transform = match ? 'scale(1)' : 'scale(0.95)';
  });

  // Scroll to gallery if query matches a product
  const anyMatch = [...document.querySelectorAll('.gallery-item[onclick]')]
    .some(item => (item.getAttribute('onclick') || '').toLowerCase().includes(query));
  if (anyMatch) document.getElementById('gallery').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

function clearSearch() {
  document.querySelectorAll('.gallery-item, .collection-card, .cat-card').forEach(el => {
    el.style.opacity = '';
    el.style.transform = '';
  });
}

// Theme toggle
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

if (localStorage.getItem('theme') === 'light') {
  document.body.classList.add('light');
  themeIcon.className = 'fas fa-moon';
}

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light');
  const isLight = document.body.classList.contains('light');
  themeIcon.className = isLight ? 'fas fa-moon' : 'fas fa-sun';
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
});

// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// Mobile menu toggle
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// Scroll reveal
const revealEls = document.querySelectorAll(
  '#collections, #about, #gallery, #instagram, #reviews, #contact, .collection-card, .gallery-item, .review-card, .insta-item, .section-header'
);

revealEls.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Legacy local contact form fallback
function legacyHandleForm(e) {
  e.preventDefault();
  const note = document.getElementById('formNote');
  note.textContent = 'Message sent! We\'ll get back to you soon 💌';
  e.target.reset();
  setTimeout(() => note.textContent = '', 4000);
}

// Contact form
window.handleForm = async function handleForm(e) {
  e.preventDefault();
  const form = e.target;
  const note = document.getElementById('formNote');
  const submitButton = form.querySelector('button[type="submit"]');
  const originalButtonText = submitButton.textContent;
  const formData = new FormData(form);
  const payload = {
    name: String(formData.get('name') || '').trim(),
    email: String(formData.get('email') || '').trim(),
    message: String(formData.get('message') || '').trim()
  };

  const config = window.MUDULI_SUPABASE || {};

  if (
    !window.supabase
    || !config.url
    || !config.anonKey
    || config.url.includes('YOUR_PROJECT_ID')
    || config.anonKey.includes('YOUR_SUPABASE_ANON_KEY')
  ) {
    note.textContent = 'Supabase is not configured yet. Please add your project URL and anon key.';
    return;
  }

  note.textContent = 'Sending...';
  submitButton.disabled = true;
  submitButton.textContent = 'Sending...';

  try {
    const supabaseClient = window.supabase.createClient(config.url, config.anonKey);
    const { error } = await supabaseClient
      .from('messages')
      .insert([payload]);

    if (error) {
      throw error;
    }

    note.textContent = 'Message sent! We will get back to you soon.';
    form.reset();
    setTimeout(() => note.textContent = '', 4000);
  } catch (error) {
    note.textContent = error.message || 'Could not send message. Please try again.';
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = originalButtonText;
  }
};
