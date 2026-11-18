// New LADUNA home and service pages. No client names, logos or pieces appear here, by Joel's decision.
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const root = document.documentElement;
const $ = selector => document.querySelector(selector);

/* ---------- Measurement ---------- */
// Events always go to dataLayer; GA4 and the Meta Pixel load only when an ID is set and the visitor accepts.
window.dataLayer = window.dataLayer || [];
const config = window.LADUNA_TRACKING || {};
const consentKey = 'laduna-consent';
const readConsent = () => { try { return localStorage.getItem(consentKey); } catch { return null; } };
const loadScript = src => { const s = document.createElement('script'); s.async = true; s.src = src; document.head.append(s); };
const startTracking = () => {
  if(config.ga4) {
    loadScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(config.ga4)}`);
    window.gtag = function(){ dataLayer.push(arguments); };
    gtag('js', new Date());
    gtag('config', config.ga4);
  }
  if(config.metaPixel) {
    const f = window.fbq = function(){ f.callMethod ? f.callMethod.apply(f, arguments) : f.queue.push(arguments); };
    f.queue = []; f.loaded = true; f.version = '2.0';
    loadScript('https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', config.metaPixel);
    fbq('track', 'PageView');
  }
};
const track = (name, params = {}) => {
  dataLayer.push({ event: name, ...params });
  if(window.gtag) gtag('event', name, params);
  if(window.fbq) {
    if(name === 'generate_lead') fbq('track', 'Lead', params);
    else if(name === 'click_whatsapp') fbq('track', 'Contact', params);
    else fbq('trackCustom', name, params);
  }
};
if(config.ga4 || config.metaPixel) {
  const choice = readConsent();
  if(choice === 'yes') startTracking();
  else if(!choice) {
    const bar = $('.consent');
    if(bar) {
      bar.hidden = false;
      bar.addEventListener('click', event => {
        const button = event.target.closest('[data-consent]');
        if(!button) return;
        try { localStorage.setItem(consentKey, button.dataset.consent); } catch {}
        bar.hidden = true;
        if(button.dataset.consent === 'yes') startTracking();
      });
    }
  }
}
document.addEventListener('click', event => {
  const link = event.target.closest('[data-track]');
  if(link) track(link.dataset.track, { local: link.dataset.place || 'pagina' });
});

/* ---------- Visit origin (UTM, ad click IDs, referrer), kept for this tab only ---------- */
const originKey = 'laduna-origem';
const origin = (() => {
  try {
    const saved = sessionStorage.getItem(originKey);
    if(saved) return saved;
    const params = new URLSearchParams(location.search);
    const parts = ['utm_source','utm_medium','utm_campaign','utm_content','utm_term'].filter(key => params.get(key)).map(key => `${key.slice(4)}=${params.get(key)}`);
    if(params.get('gclid')) parts.push('google_ads');
    if(params.get('fbclid')) parts.push('meta');
    let value = parts.join(' | ');
    if(!value && document.referrer && !document.referrer.startsWith(location.origin)) value = `site: ${new URL(document.referrer).hostname}`;
    value = value || 'direto';
    sessionStorage.setItem(originKey, value);
    return value;
  } catch { return 'desconhecida'; }
})();

/* ---------- Kinetic headline ---------- */
for(const heading of document.querySelectorAll('[data-split]')) {
  let index = 0;
  const wrap = node => {
    for(const child of [...node.childNodes]) {
      if(child.nodeType === Node.TEXT_NODE) {
        const fragment = document.createDocumentFragment();
        for(const part of child.textContent.split(/(\s+)/)) {
          if(!part) continue;
          if(/^\s+$/.test(part)) { fragment.append(' '); continue; }
          const word = document.createElement('span');
          word.className = 'word';
          const inner = document.createElement('span');
          inner.textContent = part;
          inner.style.setProperty('--i', index++);
          word.append(inner);
          fragment.append(word);
        }
        child.replaceWith(fragment);
      } else if(child.nodeType === Node.ELEMENT_NODE) wrap(child);
    }
  };
  heading.setAttribute('aria-label', heading.textContent.replace(/\s+/g, ' ').trim());
  wrap(heading);
  for(const word of heading.querySelectorAll('.word')) word.setAttribute('aria-hidden', 'true');
  heading.classList.add('split');
}
// Skip the opening on click or key press.
const intro = $('.intro');
if(intro && root.classList.contains('intro-on')) {
  const skip = () => { root.classList.remove('intro-on'); removeEventListener('pointerdown', skip); removeEventListener('keydown', skip); };
  addEventListener('pointerdown', skip, { once: true });
  addEventListener('keydown', skip, { once: true });
  setTimeout(skip, 2600);
}

/* ---------- Mobile menu ---------- */
const toggle = $('.menu-toggle');
const menu = $('#menu');
if(toggle && menu) {
  const setMenu = open => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    menu.classList.toggle('open', open);
  };
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  menu.addEventListener('click', event => { if(event.target.closest('a')) setMenu(false); });
  addEventListener('keydown', event => { if(event.key === 'Escape') setMenu(false); });
}

/* ---------- Reveal on scroll and counters ---------- */
const count = element => {
  const target = Number(element.dataset.count);
  const prefix = element.dataset.prefix || '';
  if(reduced) { element.textContent = prefix + target; return; }
  const start = performance.now();
  const tick = now => {
    const progress = Math.min(1, (now - start) / 1400);
    element.textContent = prefix + Math.round(target * (1 - Math.pow(1 - progress, 3)));
    if(progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};
const targets = [...document.querySelectorAll('[data-reveal]')];
if('IntersectionObserver' in window && !reduced) {
  const observer = new IntersectionObserver(entries => {
    for(const entry of entries) if(entry.isIntersecting) {
      entry.target.classList.remove('waiting');
      const counter = entry.target.querySelector('[data-count]');
      if(counter) count(counter);
      observer.unobserve(entry.target);
    }
  }, { threshold: 0.15 });
  for(const element of targets) {
    const siblings = [...element.parentElement.children].filter(child => child.hasAttribute('data-reveal'));
    element.style.setProperty('--d', `${siblings.indexOf(element) * 110}ms`);
    if(element.getBoundingClientRect().top > innerHeight * .9) {
      element.classList.add('waiting');
      const counter = element.querySelector('[data-count]');
      if(counter) counter.textContent = (counter.dataset.prefix || '') + '0';
    }
    observer.observe(element);
  }
  // Pause looping animations of sections that are off screen.
  const sleeper = new IntersectionObserver(entries => {
    for(const entry of entries) entry.target.classList.toggle('off', !entry.isIntersecting);
  }, { rootMargin: '120px 0px' });
  document.querySelectorAll('main > section, .hero').forEach(section => sleeper.observe(section));
}

/* ---------- Scroll-driven pieces ---------- */
const steps = $('#steps');
const stage = $('.hero-stage');
const contact = $('#contato');
const dunes = $('.contact-bg');
const floatButton = $('.float-wa');
const stepImage = $('[data-step-image]');
let activeImage = stepImage ? stepImage.getAttribute('src') : '';
const setStepImage = src => {
  if(!stepImage || !src || src === activeImage) return;
  activeImage = src;
  stepImage.classList.add('swapping');
  setTimeout(() => { stepImage.src = src; stepImage.onload = () => stepImage.classList.remove('swapping'); }, 220);
};
if(steps && 'IntersectionObserver' in window) { const warm = new IntersectionObserver(entries => { if(entries.some(entry => entry.isIntersecting)) { steps.querySelectorAll('[data-image]').forEach(step => { new Image().src = step.dataset.image; }); warm.disconnect(); } }, { rootMargin: '600px 0px' }); warm.observe(steps); }
let ticking = false;
const onScroll = () => {
  ticking = false;
  const max = root.scrollHeight - innerHeight;
  root.style.setProperty('--scroll', max > 0 ? (scrollY / max).toFixed(4) : 0);
  if(!reduced) {
    root.style.setProperty('--lift', `${Math.min(scrollY, 700) * -0.12}px`);
    root.style.setProperty('--turn', `${Math.min(scrollY, 900) * 0.12}deg`);
  }
  if(steps) {
    const box = steps.getBoundingClientRect();
    const progress = Math.max(0, Math.min(1, (innerHeight * .62 - box.top) / box.height));
    steps.style.setProperty('--p', progress.toFixed(3));
    let current = null;
    [...steps.children].forEach((step, index, all) => {
      const on = progress >= (index + .15) / all.length;
      step.classList.toggle('on', on);
      if(on) current = step;
    });
    setStepImage((current || steps.children[0]).dataset.image);
  }
  if(contact) {
    const box = contact.getBoundingClientRect();
    if(dunes && !reduced && box.top < innerHeight && box.bottom > 0) dunes.style.setProperty('--dune', `${(box.top / innerHeight) * 40}px`);
    if(floatButton) floatButton.classList.toggle('show', scrollY > innerHeight * .8 && !(box.top < innerHeight * .8 && box.bottom > 0));
  } else if(floatButton) floatButton.classList.toggle('show', scrollY > innerHeight * .5);
};
addEventListener('scroll', () => { if(!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
addEventListener('resize', onScroll);
onScroll();

const parallax = stage || $('[data-parallax]');
if(parallax && !reduced && matchMedia('(hover:hover) and (pointer:fine)').matches) {
  const hero = parallax.closest('section');
  const stage = parallax;
  hero.addEventListener('pointermove', event => {
    const box = hero.getBoundingClientRect();
    stage.style.setProperty('--mx', ((event.clientX - box.left) / box.width - .5).toFixed(3));
    stage.style.setProperty('--my', ((event.clientY - box.top) / box.height - .5).toFixed(3));
  });
  hero.addEventListener('pointerleave', () => { stage.style.setProperty('--mx', 0); stage.style.setProperty('--my', 0); });
}

/* ---------- Diagnosis form ---------- */
// The lead is recorded first (Netlify Forms, by beacon so it survives the page change),
// then WhatsApp opens with the message ready. Nothing is sent to WhatsApp without the visitor pressing send.
const form = $('#form');
if(form) {
  const error = form.querySelector('.form-error');
  form.elements.origem.value = origin;
  form.elements.pagina.value = location.pathname;
  form.addEventListener('submit', event => {
    event.preventDefault();
    const name = form.elements.nome.value.trim();
    const phone = form.elements.whatsapp.value.replace(/\D/g, '');
    form.elements.nome.setAttribute('aria-invalid', String(!name));
    form.elements.whatsapp.setAttribute('aria-invalid', String(phone.length < 10));
    if(!name || phone.length < 10) {
      error.hidden = false;
      (!name ? form.elements.nome : form.elements.whatsapp).focus();
      return;
    }
    error.hidden = true;
    const data = new FormData(form);
    if(data.get('site_empresa')) return;
    const body = new URLSearchParams(data);
    let recorded = false;
    try { recorded = navigator.sendBeacon('/', body); } catch {}
    if(!recorded) fetch('/', { method: 'POST', body, keepalive: true }).catch(() => {});
    track('generate_lead', { local: 'formulario', objetivo: String(data.get('objetivo')) });
    const lines = [`Olá! Sou ${name} e quero um diagnóstico da minha marca.`];
    const brand = String(data.get('empresa') || '').trim();
    if(brand) lines.push(`Empresa ou perfil: ${brand}`);
    lines.push(`Quero melhorar: ${data.get('objetivo')}`);
    const message = String(data.get('mensagem') || '').trim();
    if(message) lines.push(message);
    window.open(`https://wa.me/556696361345?text=${encodeURIComponent(lines.join('\n'))}`, '_blank', 'noopener');
    form.querySelector('[type=submit]').textContent = 'Recebido. Continue no WhatsApp';
  });
}

const year = $('#year');
if(year) year.textContent = new Date().getFullYear();

/* ---------- Before / after: plays by itself while visible, until the visitor chooses ---------- */
for(const stage of document.querySelectorAll('.ba-stage')) {
  const section = stage.closest('section');
  const buttons = [...section.querySelectorAll('[data-ba]')];
  const set = state => {
    stage.dataset.state = state;
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.ba === state)));
  };
  let timer = null, touched = false;
  buttons.forEach(button => button.addEventListener('click', () => { touched = true; clearInterval(timer); set(button.dataset.ba); }));
  if(!reduced && 'IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      for(const entry of entries) {
        clearInterval(timer);
        if(entry.isIntersecting && !touched) {
          setTimeout(() => { if(!touched) set('depois'); }, 900);
          timer = setInterval(() => { if(!touched) set(stage.dataset.state === 'antes' ? 'depois' : 'antes'); }, 4200);
        }
      }
    }, { threshold: .4 }).observe(stage);
  }
}
