/**
 * DID90° Agency - Interactive Swiss Minimalism Engine
 * Exclusively supports Inter Variable font & pure black/white aesthetics
 */

document.addEventListener('DOMContentLoaded', () => {
  initCustomCursor();
  initThemeToggle();
  initCubeInteractions();
  initBriefBuilder();
  initPortfolioPreviews();
  initPerspectiveShifter();
  initScrollAnimations();
});

/**
 * 1. Custom Interactive Cursor
 * Renders an elegant bracket frame with "90°" text on hover
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

  // Smooth lerping cursor movement
  function animateCursor() {
    const ease = 0.15;
    cursorX += (mouseX - cursorX) * ease;
    cursorY += (mouseY - cursorY) * ease;
    
    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;
    
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Attach hover states to all buttons, links, and select fields
  const interactiveSelector = 'a, button, input, textarea, select, .brief-btn, .cube-wrapper, .portfolio-item';
  
  function addHoverEvents() {
    document.querySelectorAll(interactiveSelector).forEach(el => {
      // Avoid duplicate event attachments
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

  // Proactively run on dynamically added elements as well
  const observer = new MutationObserver(addHoverEvents);
  observer.observe(document.body, { childList: true, subtree: true });
}

/**
 * 2. Strict Theme Inversion Switcher
 * Swaps pure black and pure white
 */
function initThemeToggle() {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;

  // Retrieve saved system preference or stored theme
  const storedTheme = localStorage.getItem('did90-theme') || 'light';
  document.documentElement.setAttribute('data-theme', storedTheme);
  updateThemeButtonText(storedTheme);

  btn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('did90-theme', newTheme);
    updateThemeButtonText(newTheme);
  });

  function updateThemeButtonText(theme) {
    btn.textContent = theme === 'dark' ? 'INVERT TO LIGHT' : 'INVERT TO DARK';
  }
}

/**
 * 3. 3D CSS Wireframe Cube Interactions
 * Clicking pivots the cube by exactly 90 degrees on the Y-axis
 */
function initCubeInteractions() {
  const cube = document.getElementById('interactive-cube');
  if (!cube) return;

  let currentRotationY = 30;
  let currentRotationX = -20;
  let autoRotatePaused = false;

  cube.addEventListener('click', () => {
    // Shifting perspective by exactly 90 degrees
    currentRotationY += 90;
    autoRotatePaused = true;
    cube.classList.add('paused');
    
    cube.style.transform = `rotateX(${currentRotationX}deg) rotateY(${currentRotationY}deg)`;
    
    // Resume auto-rotation after a delay
    setTimeout(() => {
      // Snap to equivalent positive degrees under 360 to keep smooth rotation
      const currentMod = currentRotationY % 360;
      cube.style.transition = 'none';
      cube.style.transform = `rotateX(${currentRotationX}deg) rotateY(${currentMod}deg)`;
      
      // Force repaint
      cube.offsetHeight;
      
      cube.style.transition = 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)';
      cube.classList.remove('paused');
      autoRotatePaused = false;
    }, 5000);
  });
}

/**
 * 4. Interactive Project Brief Builder
 * Computes Swiss design agency requirements dynamically
 */
function initBriefBuilder() {
  const selectedServices = new Set(['UI/UX & Digital Design']); // Default active service
  const slider = document.getElementById('brief-slider');
  const sliderVal = document.getElementById('slider-value');
  const summaryBox = document.getElementById('brief-summary-text');
  const copyBtn = document.getElementById('copy-brief-btn');
  const submitBtn = document.getElementById('submit-brief-btn');

  if (!slider || !summaryBox) return;

  // Set initial slider label
  updateSliderLabel(slider.value);

  // Bind service selection buttons
  document.querySelectorAll('.brief-btn[data-service]').forEach(btn => {
    const serviceName = btn.dataset.service;
    
    // Toggle active state
    btn.addEventListener('click', () => {
      if (selectedServices.has(serviceName)) {
        if (selectedServices.size > 1) { // Keep at least one service
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

  // Bind range slider
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
    const servicesList = Array.from(selectedServices).map(s => `• ${s}`).join('\n');
    const timeline = sliderVal.textContent;
    
    const summary = `DID90° AGENCY — LOYIHA HUJJATI
    --------------------------------------------------
    TURI: Dizayn & Rivojlantirish Brifi
    SANASI: ${new Date().toLocaleDateString('uz-UZ')}
    
    TANLANGAN XIZMATLAR:
    ${servicesList}
    
    KUTILAYOTGAN VAQT & MASHTAB:
    ${timeline}
    
    SHIORIMIZ:
    "Loyihangizni to'g'ri darajaga burish uchun bizga bog'laning."
    --------------------------------------------------
    DID90.UZ // ORTHOGONAL PERSPECTIVES`;

    summaryBox.textContent = summary;
  }

  // Generate initial summary
  generateBriefText();

  // Copy to clipboard
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(summaryBox.textContent).then(() => {
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'NUSXALANDI [✓]';
        copyBtn.style.borderColor = 'var(--text-color)';
        
        setTimeout(() => {
          copyBtn.textContent = originalText;
        }, 2000);
      });
    });
  }

  // Submit/Contact button - opens mailto client prefilled with design brief
  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      const subject = encodeURIComponent('DID90° Agency — Yangi Loya Brifi');
      const body = encodeURIComponent(summaryBox.textContent);
      window.location.href = `mailto:hello@did90.uz?subject=${subject}&body=${body}`;
    });
  }
}

/**
 * 5. Portfolio Graphic Previews
 * Dynamic high-contrast geometric reveals that float with cursor movement
 */
function initPortfolioPreviews() {
  const items = document.querySelectorAll('.portfolio-item');
  
  // Create preview container
  const preview = document.createElement('div');
  preview.className = 'portfolio-preview-container';
  const graphic = document.createElement('div');
  graphic.className = 'preview-graphic';
  preview.appendChild(graphic);
  document.body.appendChild(preview);

  items.forEach(item => {
    const projName = item.querySelector('.port-title').textContent;
    
    item.addEventListener('mouseenter', (e) => {
      preview.classList.add('active');
      graphic.innerHTML = `<span style="font-size: 24px; font-weight: 900; z-index: 10; letter-spacing: -0.05em;">${projName}</span>`;
      positionPreview(e);
    });

    item.addEventListener('mousemove', (e) => {
      positionPreview(e);
    });

    item.addEventListener('mouseleave', () => {
      preview.classList.remove('active');
    });
  });

  function positionPreview(e) {
    // Follow mouse but offset to the side
    const offsetX = 180;
    const offsetY = -80;
    preview.style.left = `${e.clientX + offsetX}px`;
    preview.style.top = `${e.clientY + offsetY}px`;
  }
}

/**
 * 6. Perspective Layout Shifter
 * Toggles a 90-degree page tilt/shift layout to emphasize orthogonal branding
 */
function initPerspectiveShifter() {
  const toggle = document.getElementById('shifter-toggle');
  if (!toggle) return;

  toggle.addEventListener('click', () => {
    document.body.classList.toggle('rotated-state');
    
    if (document.body.classList.contains('rotated-state')) {
      toggle.textContent = 'DARAJANI TIKLASH [0°]';
    } else {
      toggle.textContent = 'PERSPEKTIVANI BURISH [90°]';
    }
  });
}

/**
 * 7. Scroll Animations
 * Clean, staggered Swiss reveals
 */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  
  const observerOptions = {
    root: null,
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Stop observing once animated
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => observer.observe(el));
}
