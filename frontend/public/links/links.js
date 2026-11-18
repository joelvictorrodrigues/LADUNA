import {links} from './data.js?v=cenas-4';

// One scene per banner: a surface tone and the markup of its protagonist.
// Everything is drawn from the project's own assets; nothing here is a client's work.
const bars = '<span class="scene-bars"><i></i><i></i></span>';
const dots = '<i></i><i></i><i></i>';
const scenes = {
  contato: {tone:'purple', html:'<span class="floor"></span><span class="scene-mark"></span><span class="typing shadowed">' + dots + '</span>'},
  instagram: {tone:'deep', html:'<span class="floor"></span><span class="scene-mark ig-echo"></span><span class="scene-mark ig-main"></span><span class="like shadowed"><i></i></span>'},
  site: {tone:'light', html:'<span class="laptop"><span class="laptop-lid"></span><span class="laptop-deck"></span></span>'},
  google: {tone:'purple', html:'<span class="scene-mark"></span><span class="map-pin shadowed"><i></i></span><span class="search shadowed"><i></i><span class="wordmark"></span><b></b></span>'},
  email: {tone:'light', html:'<span class="trail"></span><span class="plane"><i></i><b></b><span></span></span>'},
  consultoria: {tone:'graphite', html:''},
  tiktok: {tone:'deep', html:'<span class="tk-ring"></span><span class="tk-ring"></span><span class="floor"></span><span class="scene-mark tk-a"></span><span class="scene-mark tk-b"></span><span class="scene-mark tk-main"></span><span class="play shadowed"><i></i></span>'},
  facebook: {tone:'purple', html:'<span class="disc"></span><span class="scene-mark"></span>'},
  pinterest: {tone:'light', html:'<span class="board"><span class="pin pin-type">Aa</span><span class="pin pin-pattern"></span><span class="pin pin-mark"><span class="scene-mark"></span></span><span class="pin pin-palette"></span><span class="pin pin-emblem"></span></span>'},
  avaliacao: {tone:'graphite', html:'<span class="talk-back shadowed">' + dots + '</span><span class="talk-front shadowed">“</span>'},
};

// The brand name is never typeset: it is drawn from the official logo file.
const branded = (element,text) => {
  for(const [index,part] of text.split('LADUNA').entries()) {
    if(index) {
      const mark = document.createElement('span');
      mark.className = 'wordmark';
      mark.setAttribute('role','img');
      mark.setAttribute('aria-label','LADUNA');
      element.append(mark);
    }
    if(part) element.append(part);
  }
};

const nav = document.querySelector('#canais');
for(const [index,item] of links.entries()) {
  const scene = scenes[item.id] ?? {tone:'purple', html:''};
  const anchor = document.createElement('a');
  anchor.className = `banner tone-${scene.tone} art-${item.id} ${index%2 ? 'art-left' : 'art-right'}`;
  anchor.href = item.url;
  anchor.dataset.linkId = item.id;
  anchor.addEventListener('pointerdown',()=>anchor.classList.add('is-pressed'));
  for(const event of ['pointerup','pointercancel','pointerleave']) anchor.addEventListener(event,()=>anchor.classList.remove('is-pressed'));

  const visual = document.createElement('span');
  visual.className = 'scene';
  visual.setAttribute('aria-hidden','true');
  visual.innerHTML = bars + scene.html;
  if(item.art.endsWith('.svg')) visual.style.setProperty('--mark',`url("${item.art}")`);
  if(item.id === 'site' || item.id === 'consultoria') {
    const image = document.createElement('img');
    image.src = item.art;
    image.alt = '';
    image.loading = index < 3 ? 'eager' : 'lazy';
    image.decoding = item.id === 'site' ? 'sync' : 'async';
    if(item.id === 'site') {
      image.className = 'site-capture';image.width = 1280;image.height = 900;
      visual.querySelector('.laptop-lid').append(image);
    } else {
      image.className = 'scene-object';image.width = 466;image.height = 700;
      visual.append(image);
    }
  }

  const copy = document.createElement('span');
  copy.className = 'banner-copy';
  const title = document.createElement('span');
  title.className = 'banner-title';
  branded(title,item.title);
  const subtitle = document.createElement('span');
  subtitle.className = 'banner-subtitle';
  branded(subtitle,item.subtitle);
  copy.append(title,subtitle);

  anchor.append(visual,copy);
  anchor.addEventListener('click',()=>{
    // No tracking request is sent. Future consent-aware analytics can listen here.
    window.dispatchEvent(new CustomEvent('laduna:link-click',{detail:{id:item.id}}));
  });
  nav.append(anchor);
}
document.querySelector('#year').textContent = new Date().getFullYear();
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
if('IntersectionObserver' in window && !reduced.matches) {
  const observer = new IntersectionObserver(entries=>{
    for(const entry of entries) if(entry.isIntersecting) {
      entry.target.classList.remove('waiting');
      observer.unobserve(entry.target);
    }
  },{threshold:0.08});
  document.querySelectorAll('.banner').forEach(element=>{
    if(element.getBoundingClientRect().top > innerHeight) element.classList.add('waiting');
    observer.observe(element);
  });
  reduced.addEventListener('change',()=>{
    if(reduced.matches){observer.disconnect();document.querySelectorAll('.waiting').forEach(el=>el.classList.remove('waiting'));}
  });
}
