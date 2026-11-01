const menu = document.querySelector('.menu');
const navigation = document.querySelector('#navigation');
const compactNavigation = matchMedia('(max-width:960px)');

function setMenu(open, restoreFocus = false) {
  navigation.classList.toggle('open', open);
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  if (restoreFocus) menu.focus();
}
menu.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') setMenu(false, true);
});
document.addEventListener('click', event => {
  if (!event.target.closest('header')) setMenu(false);
});
compactNavigation.addEventListener('change', () => setMenu(false));

const whatsappUrl = message => 'https://wa.me/5566996361345?text=' + encodeURIComponent(message);
document.querySelectorAll('[data-message]').forEach(link => {
  link.href = whatsappUrl('Olá, vim pelo site da LADUNA. ' + link.dataset.message);
});

document.querySelectorAll('dialog').forEach(dialog => {
  dialog.querySelector('.close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
});

const privacyDialog = document.querySelector('#privacyDialog');
document.querySelectorAll('[data-privacy]').forEach(link => link.addEventListener('click', event => {
  event.preventDefault();
  privacyDialog.showModal();
}));

const form = document.querySelector('#diagnosticForm');
const phoneInput = form.elements.phone;
function validatePhone() {
  const value = phoneInput.value.trim();
  const digits = value.replace(/\D/g, '');
  const valid = /^[+\d\s().-]+$/.test(value) && digits.length >= 10 && digits.length <= 15;
  phoneInput.setCustomValidity(valid || !value ? '' : 'Informe um telefone válido com DDD, entre 10 e 15 dígitos.');
  return valid;
}
phoneInput.addEventListener('input', validatePhone);
const messageDialog = document.querySelector('#messageDialog');
form.addEventListener('submit', event => {
  event.preventDefault();
  validatePhone();
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const message = [
    'Olá, vim pelo site da LADUNA e quero conversar sobre minha marca.', '',
    'Nome: ' + String(data.get('name')).trim(),
    'WhatsApp: ' + String(data.get('phone')).trim(),
    'Empresa: ' + String(data.get('brand')).trim(),
    'Necessidades: ' + (data.getAll('need').join(', ') || 'Preciso de orientação'),
    'Desafio: ' + (String(data.get('challenge')).trim() || 'A conversar.')
  ].join('\n');
  document.querySelector('#messagePreview').textContent = message;
  document.querySelector('#sendDiagnosis').href = whatsappUrl(message);
  document.querySelector('#formStatus').textContent = 'Mensagem preparada para revisão. Nada foi enviado.';
  messageDialog.showModal();
});
document.querySelector('#editDiagnosis').addEventListener('click', () => messageDialog.close());

const projectDialog = document.querySelector('#projectDialog');
document.querySelectorAll('[data-project]').forEach(button => button.addEventListener('click', () => {
  const image = button.querySelector('img');
  projectDialog.querySelector('.dialog-image').src = image.src;
  projectDialog.querySelector('.dialog-image').alt = image.alt;
  document.querySelector('#projectTitle').textContent = button.dataset.title || button.dataset.project;
  document.querySelector('#caseDescription').textContent = button.closest('.work').querySelector('.work-context').textContent;
  projectDialog.showModal();
}));

const reducedMotion = matchMedia('(prefers-reduced-motion:reduce)');
document.querySelectorAll('.method,.problems-grid,.service-paths').forEach(group => {
  [...group.children].filter(element => element.classList.contains('reveal')).forEach((element, index) => {
    element.style.setProperty('--reveal-delay', `${Math.min(index, 4) * 75}ms`);
  });
});
const portfolioVideos = [...document.querySelectorAll('.media-showcase video')];
portfolioVideos.forEach(video => video.addEventListener('play', () => {
  portfolioVideos.forEach(other => { if (other !== video) other.pause(); });
}));
document.addEventListener('visibilitychange', () => {
  if (document.hidden) portfolioVideos.forEach(video => video.pause());
});
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.remove('pending');
      observer.unobserve(entry.target);
    }
  }), { threshold: 0.05 });
  document.querySelectorAll('.reveal').forEach(element => {
    if (element.getBoundingClientRect().top > innerHeight) {
      element.classList.add('pending');
      observer.observe(element);
    }
  });
  const revealPassedElements = () => requestAnimationFrame(() => {
    document.querySelectorAll('.reveal.pending').forEach(element => {
      if (element.getBoundingClientRect().bottom < 0) {
        element.classList.remove('pending');
        observer.unobserve(element);
      }
    });
  });
  window.addEventListener('scroll', revealPassedElements, { passive: true });
  requestAnimationFrame(revealPassedElements);
  reducedMotion.addEventListener('change', event => {
    if (event.matches) {
      observer.disconnect();
      document.querySelectorAll('.reveal.pending').forEach(element => element.classList.remove('pending'));
    }
  });
}
