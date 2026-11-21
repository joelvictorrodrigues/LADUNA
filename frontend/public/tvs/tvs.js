(() => {
  const PHONE = '556696361345';
  // Fim da Promo Black: 10/12/2026, 23h59 no horário de Mato Grosso (UTC-4).
  const PROMO_END = new Date('2026-12-10T23:59:59-04:00').getTime();
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = s => document.querySelector(s);
  const waLink = text => `https://wa.me/${PHONE}?text=${encodeURIComponent(text)}`;

  const M12 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const PLANS = {
    promo: { name: 'Promo Black', perMonth: 94.5, months: [2, 4, 6, 8, 10, 12], def: 6 },
    essencial: { name: 'Essencial', perMonth: 200, months: M12, def: 3 },
    completo: { name: 'Completo', perMonth: 350, months: M12, def: 3 }
  };
  const state = { plan: 'promo', months: 6, pay: 'pacote' };

  const brl = n => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }).replace(/,00$/, '');
  // Quem cria o vídeo: Completo sempre; Promo Black a partir de 6 meses.
  const ladunaCria = () => state.plan === 'completo' || (state.plan === 'promo' && state.months >= 6);

  document.querySelectorAll('[data-wa]').forEach(a => { a.href = waLink(a.dataset.wa); a.target = '_blank'; a.rel = 'noopener'; });

  const root = document.documentElement, top = $('.top');
  const onScroll = () => {
    const max = root.scrollHeight - innerHeight;
    root.style.setProperty('--scroll', max > 0 ? (scrollY / max).toFixed(4) : 0);
    top.classList.toggle('scrolled', scrollY > 8);
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: .12, rootMargin: '0px 0px -30px 0px' }) : null;
  document.querySelectorAll('.reveal').forEach(el => io ? io.observe(el) : el.classList.add('in'));

  // Contagem regressiva da Promo Black
  const pad = n => String(n).padStart(2, '0');
  const tick = () => {
    const left = PROMO_END - Date.now();
    document.querySelectorAll('[data-countdown]').forEach(el => {
      if (left <= 0) { el.textContent = el.dataset.countdown === 'long' ? 'Promoção encerrada' : 'encerrada'; return; }
      const d = Math.floor(left / 864e5), h = Math.floor(left / 36e5) % 24, m = Math.floor(left / 6e4) % 60, s = Math.floor(left / 1e3) % 60;
      el.textContent = el.dataset.countdown === 'long'
        ? `${d} ${d === 1 ? 'dia' : 'dias'} ${pad(h)}h ${pad(m)}m ${pad(s)}s`
        : d > 0 ? `${d} ${d === 1 ? 'dia' : 'dias'} e ${h}h` : `${pad(h)}h ${pad(m)}m ${pad(s)}s`;
    });
    return left > 0;
  };
  if (tick()) { const t = setInterval(() => { if (!tick()) clearInterval(t); }, 1000); }

  // Valor total "correndo" até o número novo
  let lastTotal = 567, tweenId = 0;
  const tweenTotal = to => {
    const el = $('#sumTotal'), from = lastTotal; lastTotal = to;
    if (!el) return;
    if (reduce || from === to) { el.textContent = brl(to); return; }
    const id = ++tweenId, t0 = performance.now(), dur = 650;
    const step = now => {
      if (id !== tweenId) return;
      const k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      const v = from + (to - from) * e;
      el.textContent = k < 1 ? brl(Math.round(v)) : brl(to);
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const mesesBox = $('#meses'), outro = $('#outroMeses'), outroBox = $('#outroBox'), outroHint = $('#outroHint');

  const renderMonths = () => {
    const p = PLANS[state.plan];
    if (!state.custom && !p.months.includes(state.months)) state.months = p.def;
    if (state.custom && state.plan === 'promo' && state.months % 2) state.months += 1;
    mesesBox.innerHTML = p.months.map(m =>
      `<button class="chip-btn" type="button" role="radio" aria-checked="${!state.custom && m === state.months}" data-m="${m}">${m}<small>${m === 1 ? 'mês' : 'meses'}</small></button>`).join('');
    // Caixinha para digitar outra quantidade de meses (na Promo Black, de 2 em 2)
    const step = state.plan === 'promo' ? 2 : 1;
    outro.min = step; outro.step = step;
    outro.placeholder = state.plan === 'promo' ? 'ex.: 14' : 'ex.: 18';
    outro.value = state.custom ? state.months : '';
    outroBox.classList.toggle('on', !!state.custom);
    outroHint.textContent = state.plan === 'promo' ? 'Na Promo Black, de 2 em 2 meses.' : 'Quantos meses quiser.';
  };

  const render = () => {
    const p = PLANS[state.plan];
    if (state.plan === 'promo') state.pay = 'pacote';
    const mensal = state.pay === 'mensal';
    $('#payBox').hidden = state.plan === 'promo';
    $('#mesesBox').hidden = mensal;
    document.querySelectorAll('.pay-btn').forEach(b => b.setAttribute('aria-checked', String(b.dataset.pay === state.pay)));
    const total = mensal ? p.perMonth : p.perMonth * state.months;
    const period = `${state.months} ${state.months === 1 ? 'mês' : 'meses'}`;
    const video = ladunaCria() ? 'a LADUNA cria para você' : 'você envia o vídeo pronto';
    $('#sumName').textContent = p.name;
    $('#sumMode').textContent = mensal ? 'Assinatura mensal' : period;
    const lines = mensal ? [
      ['Valor por mês', brl(p.perMonth)],
      ['Cobrança', 'todo mês'],
      ['Vídeo', video],
      ['Hoje você paga', `<strong id="sumTotal">${brl(lastTotal)}</strong>`]
    ] : [
      ['Valor por mês', brl(p.perMonth)],
      ['Período', period],
      ['Vídeo', video],
      ['Valor total', `<strong id="sumTotal">${brl(lastTotal)}</strong>`]
    ];
    $('#sumLines').innerHTML = lines.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('');
    tweenTotal(total);
    $('#sumNote').textContent = state.plan === 'promo'
      ? (state.months >= 6 ? 'Com vídeo criado pela LADUNA. Pagamento seguro pelo Asaas: Pix, boleto ou cartão.' : 'Pagamento seguro pelo Asaas: Pix, boleto ou cartão. A partir de 6 meses, a LADUNA cria o seu vídeo.')
      : mensal ? 'Pagamento seguro pelo Asaas. Cancele quando quiser.' : 'Pagamento seguro pelo Asaas: Pix, boleto ou cartão.';
    const go = $('#sumGo');
    go.href = waLink(`Olá! Tenho uma dúvida sobre anunciar nas telas.\nPlano: ${p.name}\n${mensal ? 'Pagamento: assinatura mensal' : `Período: ${period}`}\nValor: ${brl(total)}${mensal ? ' por mês' : ` (${brl(p.perMonth)} por mês)`}`);
    go.target = '_blank'; go.rel = 'noopener';
    const s = $('.summary');
    if (!reduce) { s.classList.remove('flash'); void s.offsetWidth; s.classList.add('flash'); }
  };

  const setPlan = id => {
    state.plan = id;
    document.querySelectorAll('.modes .mode').forEach(b => b.setAttribute('aria-checked', String(b.dataset.plan === id)));
    renderMonths(); render();
  };

  document.querySelectorAll('.modes .mode').forEach(b => b.addEventListener('click', () => setPlan(b.dataset.plan)));
  document.querySelectorAll('.pick[data-plan]').forEach(a => a.addEventListener('click', () => setPlan(a.dataset.plan)));
  mesesBox.addEventListener('click', e => {
    const b = e.target.closest('.chip-btn'); if (!b) return;
    state.months = Number(b.dataset.m); state.custom = false;
    outro.value = ''; outroBox.classList.remove('on');
    mesesBox.querySelectorAll('.chip-btn').forEach(x => x.setAttribute('aria-checked', String(x === b)));
    render();
  });
  document.querySelectorAll('.pay-btn').forEach(b => b.addEventListener('click', () => { state.pay = b.dataset.pay; render(); }));

  // Comprar agora: o servidor monta o link de pagamento do Asaas com o preço certo
  const buy = $('#buyBtn');
  buy.hidden = true;
  fetch('/.netlify/functions/tvs-checkout', { cache: 'no-store' }).then(r => r.json()).then(d => { if (d && d.ready) buy.hidden = false; }).catch(() => {});
  buy.addEventListener('click', async () => {
    if (buy.disabled) return;
    const label = buy.textContent;
    buy.disabled = true; buy.textContent = 'Abrindo o pagamento…';
    try {
      const r = await fetch('/.netlify/functions/tvs-checkout', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: state.plan, months: state.months, mode: state.pay })
      });
      const data = await r.json().catch(() => ({}));
      if (r.ok && data.url) { location.href = data.url; return; }
      throw new Error(data.error || 'erro');
    } catch (e) {
      $('#sumNote').textContent = 'Não conseguimos abrir o pagamento agora. Toque em "Tirar dúvida no WhatsApp" que a gente fecha com você por lá.';
      buy.disabled = false; buy.textContent = label;
    }
  });

  outro.addEventListener('input', () => {
    let n = Math.floor(Number(outro.value));
    if (!n || n < 1) return;
    n = Math.min(n, 60);
    if (state.plan === 'promo' && n % 2) n += 1;
    state.months = n; state.custom = true;
    outroBox.classList.add('on');
    mesesBox.querySelectorAll('.chip-btn').forEach(x => x.setAttribute('aria-checked', 'false'));
    render();
  });
  outro.addEventListener('change', () => { if (state.custom) outro.value = state.months; });
  renderMonths(); render();

  // Motion: números contando, cards em sequência, foto acompanhando mouse e scroll
  if (!reduce && 'IntersectionObserver' in window) {
    const countIO = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      countIO.unobserve(e.target);
      const el = e.target, to = Number(el.dataset.count), suf = el.dataset.suffix || '', t0 = performance.now(), dur = 1400;
      const step = now => {
        const k = Math.min(1, (now - t0) / dur), v = Math.round(to * (1 - Math.pow(1 - k, 3)));
        el.textContent = v + suf;
        if (k < 1) requestAnimationFrame(step);
      };
      el.textContent = '0' + suf;
      requestAnimationFrame(step);
    }), { threshold: .6 });
    document.querySelectorAll('[data-count]').forEach(el => countIO.observe(el));

    const cardsEl = $('#cards');
    if (cardsEl) {
      cardsEl.querySelectorAll('.card').forEach((c, i) => c.style.setProperty('--i', i));
      cardsEl.classList.add('pre');
      const cardIO = new IntersectionObserver(es => es.forEach(e => {
        if (e.isIntersecting) { cardsEl.classList.remove('pre'); cardsEl.classList.add('enter'); cardIO.disconnect(); }
      }), { threshold: .15 });
      cardIO.observe(cardsEl);
    }

    const hero = $('.hero-live');
    if (hero) {
      if (matchMedia('(hover: hover)').matches) hero.addEventListener('pointermove', e => {
        const r = hero.getBoundingClientRect();
        hero.style.setProperty('--mx', ((e.clientX - r.left) / r.width - .5).toFixed(3));
        hero.style.setProperty('--my', ((e.clientY - r.top) / r.height - .5).toFixed(3));
      });
      addEventListener('scroll', () => { if (scrollY < innerHeight) hero.style.setProperty('--py', (scrollY * 0.08).toFixed(1) + 'px'); }, { passive: true });
    }
  }

  // Bolinhas abaixo dos cards no celular: mostram qual plano está na tela
  const cardsBox = $('#cards'), dots = [...document.querySelectorAll('#cardDots .dot-row i')];
  if (cardsBox && dots.length) {
    const cardsList = [...cardsBox.querySelectorAll('.card')];
    const sync = () => {
      const mid = cardsBox.scrollLeft + cardsBox.clientWidth / 2;
      let best = 0, dist = Infinity;
      cardsList.forEach((c, i) => { const d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid); if (d < dist) { dist = d; best = i; } });
      if (cardsBox.scrollLeft < 8) best = 0;
      dots.forEach((dot, i) => dot.classList.toggle('on', i === best));
    };
    cardsBox.addEventListener('scroll', () => requestAnimationFrame(sync), { passive: true });
    document.querySelectorAll('#cardDots .dot-arrow').forEach(b => b.addEventListener('click', () => {
      const cur = dots.findIndex(x => x.classList.contains('on'));
      const next = Math.max(0, Math.min(cardsList.length - 1, cur + Number(b.dataset.dir)));
      const c = cardsList[next];
      cardsBox.scrollTo({ left: c.offsetLeft - (cardsBox.clientWidth - c.offsetWidth) / 2, behavior: reduce ? 'auto' : 'smooth' });
    }));
  }

  // Vídeo das telas: só baixa e toca quando aparece na tela
  const clip = $('#clipVideo');
  if (clip) {
    const play = () => { const r = clip.play(); if (r && r.catch) r.catch(() => { clip.controls = true; }); };
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(es => es.forEach(e => {
        if (e.isIntersecting) { if (clip.preload === 'none') { clip.preload = 'auto'; clip.load(); } if (!reduce) play(); }
        else clip.pause();
      }), { threshold: .35 }).observe(clip);
    } else { clip.preload = 'auto'; clip.controls = true; }
    if (reduce) clip.controls = true;
  }
})();
