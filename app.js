/**
 * DID90° Agency - Interactive Obsidian & Neon Lime Web Portal Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initCustomCursor();
  initActiveNavLink();
  initFAQAccordion();
  initBriefBuilder();
  initScrollAnimations();
  initProjectPreviews();
  initAllLowercaseCasing();
});

/**
 * 1. Custom Interactive Cursor with Neon Lime Glow
 */
function initCustomCursor() {
  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  document.body.appendChild(cursor);

  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateCursor() {
    const ease = 0.15;
    cursorX += (mouseX - cursorX) * ease;
    cursorY += (mouseY - cursorY) * ease;
    
    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;
    
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Highlight connections
  const interactiveSelector = 'a, button, input, textarea, select, .brief-opt-btn, .project-card, .faq-trigger';
  
  function addHoverEvents() {
    document.querySelectorAll(interactiveSelector).forEach(el => {
      if (el.dataset.hasCursorEvents) return;
      el.dataset.hasCursorEvents = 'true';

      el.addEventListener('mouseenter', () => {
        cursor.classList.add('hover');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');
      });
    });
  }

  addHoverEvents();

  // Watch for dynamic elements
  const observer = new MutationObserver(addHoverEvents);
  observer.observe(document.body, { childList: true, subtree: true });
}

/**
 * 2. Set Active Navigation Link Indicator based on URL
 */
function initActiveNavLink() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === 'index.html' && href === '#') || (currentPath === '' && href === '#')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/**
 * 3. FAQ Accordion Drawer Transitions
 */
function initFAQAccordion() {
  document.querySelectorAll('.faq-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const parent = trigger.parentElement;
      const isActive = parent.classList.contains('active');
      
      // Close all accordions
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
      });

      // Toggle clicked accordion
      if (!isActive) {
        parent.classList.add('active');
      }
    });
  });
}

/**
 * 4. Custom Project Brief Builder Logic
 */
function initBriefBuilder() {
  const selectedServices = new Set(['UI/UX & Digital Design']);
  const slider = document.getElementById('brief-slider');
  const sliderVal = document.getElementById('slider-value');
  const summaryBox = document.getElementById('brief-summary-text');
  const copyBtn = document.getElementById('copy-brief-btn');
  const submitBtn = document.getElementById('submit-brief-btn');

  // Verify form variables exist on the active page
  if (!slider || !summaryBox) return;

  updateSliderLabel(slider.value);

  // Service toggle buttons
  document.querySelectorAll('.brief-opt-btn[data-service]').forEach(btn => {
    const serviceName = btn.dataset.service;
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (selectedServices.has(serviceName)) {
        if (selectedServices.size > 1) {
          selectedServices.delete(serviceName);
          btn.classList.remove('active');
        }
      } else {
        selectedServices.add(serviceName);
        btn.classList.add('active');
      }
      generateBriefText();
    });
  });

  // Slider change
  slider.addEventListener('input', (e) => {
    updateSliderLabel(e.target.value);
    generateBriefText();
  });

  function updateSliderLabel(val) {
    let text = '';
    if (val <= 20) text = '2 XAFTA — TEZKOR LANDING (EXPRESS)';
    else if (val <= 50) text = '4-6 XAFTA — TO\'LIQ BRENDING & SAYT';
    else if (val <= 85) text = '8-10 XAFTA — MURAKKAB PLATFORMA & 3D';
    else text = '12+ XAFTA — MAKSIMAL MASHTAB & MOTION';
    
    sliderVal.textContent = text;
  }

  function generateBriefText() {
    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const msgInput = document.getElementById('contact-msg');

    const clientName = nameInput && nameInput.value ? nameInput.value : '[KIRITILMAGAN]';
    const clientEmail = emailInput && emailInput.value ? emailInput.value : '[KIRITILMAGAN]';
    const clientMsg = msgInput && msgInput.value ? msgInput.value : '[KIRITILMAGAN]';

    const servicesList = Array.from(selectedServices).map(s => `• ${s}`).join('\n');
    const timeline = sliderVal.textContent;
    
    const summary = `DID90° AGENCY — DIZAYN BRIFI
    --------------------------------------------------
    MIJOZ NOMİ: ${clientName}
    ALOQA EMASLİ: ${clientEmail}
    XABAR: ${clientMsg}
    
    TANLANGAN XIZMATLAR:
    ${servicesList}
    
    KUTILAYOTGAN VAQT & MASHTAB:
    ${timeline}
    
    SANASI: ${new Date().toLocaleDateString('uz-UZ')}
    --------------------------------------------------
    DID90.UZ // ORTHOGONAL AXIS [90°]`;

    summaryBox.textContent = summary;
  }

  // Bind inputs to regenerate brief text live
  ['contact-name', 'contact-email', 'contact-msg'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', generateBriefText);
    }
  });

  generateBriefText();

  // Copy to clipboard with success UI alert
  if (copyBtn) {
    copyBtn.addEventListener('click', (e) => {
      e.preventDefault();
      navigator.clipboard.writeText(summaryBox.textContent).then(() => {
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'NUSXALANDI [✓]';
        copyBtn.style.backgroundColor = 'var(--accent-color)';
        copyBtn.style.color = '#000000';
        copyBtn.style.borderColor = 'var(--accent-color)';
        
        setTimeout(() => {
          copyBtn.textContent = originalText;
          copyBtn.style.backgroundColor = 'transparent';
          copyBtn.style.color = 'var(--text-color)';
          copyBtn.style.borderColor = 'var(--border-light)';
        }, 2000);
      });
    });
  }

  // Prefill mailto parameters and redirect
  if (submitBtn) {
    submitBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const subject = encodeURIComponent('DID90° Agency — Yangi Loya Brifi');
      const body = encodeURIComponent(summaryBox.textContent);
      window.location.href = `mailto:hello@did90.uz?subject=${subject}&body=${body}`;
    });
  }
}

/**
 * 5. Scroll Staggered Intersection Reveals
 */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  
  const observerOptions = {
    root: null,
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => observer.observe(el));
}

/**
 * 6. Visual Theme Toggle Management
 */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;
  
  const currentTheme = localStorage.getItem('did90_theme') || 'dark';
  
  // Set initial theme attributes and update icon states
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateToggleIcons(currentTheme);
  
  toggleBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const activeTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = activeTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('did90_theme', newTheme);
    updateToggleIcons(newTheme);
  });
  
  function updateToggleIcons(theme) {
    const sunIcon = toggleBtn.querySelector('.sun-icon');
    const moonIcon = toggleBtn.querySelector('.moon-icon');
    if (!sunIcon || !moonIcon) return;
    
    if (theme === 'light') {
      sunIcon.style.display = 'none';
      moonIcon.style.display = 'block';
    } else {
      sunIcon.style.display = 'block';
      moonIcon.style.display = 'none';
    }
  }
}

/**
 * 7. Interactive projects list with floating image previews on hover
 */
function initProjectPreviews() {
  const projectRows = document.querySelectorAll('.project-row');
  const floatingPreview = document.getElementById('floating-preview');
  const floatingImg = document.getElementById('floating-img');

  if (!floatingPreview || !floatingImg) return;

  projectRows.forEach(row => {
    row.addEventListener('mouseenter', () => {
      const previewUrl = row.getAttribute('data-preview');
      if (previewUrl) {
        floatingImg.src = previewUrl;
        floatingPreview.classList.add('active');
      }
    });

    row.addEventListener('mousemove', (e) => {
      // position is fixed, align centered or slightly offset to cursor
      floatingPreview.style.left = `${e.clientX}px`;
      floatingPreview.style.top = `${e.clientY}px`;
    });

    row.addEventListener('mouseleave', () => {
      floatingPreview.classList.remove('active');
    });
  });
}

/**
 * 8. Dynamic Title Case Casing & Typography Enforcer for All Capitalized Elements
 */
function initAllLowercaseCasing() {
  // Traverse all text nodes in the entire document body
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
  let node;
  while (node = walker.nextNode()) {
    // Avoid scripts, styles, or hidden tags
    const parentTagName = node.parentNode ? node.parentNode.tagName : '';
    if (parentTagName === 'SCRIPT' || parentTagName === 'STYLE') continue;

    const text = node.nodeValue.trim();
    // Check if the text node is completely capitalized and contains letters
    if (text && text === text.toUpperCase() && /[A-Za-z\u0400-\u04FF]/.test(text)) {
      // Convert completely capitalized text nodes to sentence/title case beautifully
      node.nodeValue = node.nodeValue.replace(/([a-zA-Z\u0400-\u04FF\u00C0-\u00FF'’]+)/g, (match) => {
        // Preserving premium industry standard abbreviations in all caps
        const upper = match.toUpperCase();
        if (["UI", "UX", "MVP", "B2B", "B2C", "AI", "FAQ", "SaaS", "SASS", "DID90", "LOC"].includes(upper)) {
          return upper === "SASS" ? "SaaS" : upper;
        }
        return match.charAt(0).toUpperCase() + match.slice(1).toLowerCase();
      });
    }
  }
}

// Bind globally so other scripts like cms-core.js can invoke it after AJAX hydration
window.initAllLowercaseCasing = initAllLowercaseCasing;

