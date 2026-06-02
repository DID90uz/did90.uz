/**
 * DID90° Agency - CMS Content Hydration Engine
 * Hydrates DOM elements dynamically with visual CMS updates from data/content.json
 */
document.addEventListener('DOMContentLoaded', () => {
  fetch('data/content.json', { cache: 'no-store' })
    .then(res => {
      if (!res.ok) throw new Error('CMS content database not found');
      return res.json();
    })
    .then(data => {
      hydrateDOM(data);
      if (window.initAllLowercaseCasing) {
        window.initAllLowercaseCasing();
      }
    })
    .catch(err => {
      // Skips silently if CMS JSON is missing, preserving default static HTML copy
      console.warn('CMS hydration skipped:', err.message);
    });
});

/**
 * Hydrates all elements with [data-cms] attributes
 */
function hydrateDOM(data) {
  document.querySelectorAll('[data-cms]').forEach(el => {
    const path = el.getAttribute('data-cms');
    const value = getNestedValue(data, path);
    
    if (value !== undefined && value !== null) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT') {
        el.value = value;
      } else {
        // If the path relates to pricing features, it's a comma-separated list, 
        // we can render them as list items inside pricing card container
        if (el.classList.contains('price-features-list')) {
          renderPricingFeatures(el, value);
        } else {
          // Render HTML (supporting bold, line-breaks, highlights)
          el.innerHTML = value.replace(/\n/g, '<br>');
        }
      }
    }
  });
}

/**
 * Parses comma-separated string features and renders list items
 */
function renderPricingFeatures(container, featuresString) {
  container.innerHTML = '';
  const features = featuresString.split(',').map(f => f.trim()).filter(f => f.length > 0);
  features.forEach(feature => {
    const li = document.createElement('li');
    li.textContent = feature;
    container.appendChild(li);
  });
}

/**
 * Utility: fetch nested object values safely via dot-notation path
 */
function getNestedValue(obj, path) {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}
