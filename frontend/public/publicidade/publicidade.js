(() => {
  const PHONE = '556696361345';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = s => document.querySelector(s);
  const waLink = text => `https://wa.me/${PHONE}?text=${encodeURIComponent(text)}`;

  const M12 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const CLIENT_OFF = 50;
  const PLANS = {
    essencial: { name: 'Essencial', perMonth: 200, months: M12, def: 3, client: true },
    completo: { name: 'Completo', perMonth: 250, months: M12, def: 3, client: true },
    dinamico: { name: 'Dinâmico', perMonth: 350, months: M12, def: 3, client: true },
    promo: { name: 'Promo Black', perMonth: 94.5, months: [2, 4, 6, 8, 10, 12], def: 6, client: false }
  };
  const state = { plan: 'promo', months: 6, client: false };

  const brl = n => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }).replace(/,00$/, '');
  const fmt = d => d.toLocaleDateString('pt-BR');
  const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  // Fim = início + N meses − 1 dia (20/11 + 6 meses = 19/05). Se o dia não existe no mês final (31/01 + 1 mês), vale o último dia dele.
  const endDate = (start, months) => {
    const target = new Date(start.getFullYear(), start.getMonth() + months, start.getDate());
    if (target.getDate() !== start.getDate()) return new Date(start.getFullYear(), start.getMonth() + months + 1, 0);
    target.setDate(target.getDate() - 1);
    return target;
  };

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

  const mesesBox = $('#meses');

  const renderMonths = () => {
    const p = PLANS[state.plan];
    if (!p.months.includes(state.months)) state.months = p.def;
    mesesBox.innerHTML = p.months.map(m =>
      `<button class="chip-btn" type="button" role="radio" aria-checked="${m === state.months}" data-m="${m}">${m === 12 ? '1 ano' : m}${m === 12 ? '' : `<small>${m === 1 ? 'mês' : 'meses'}</small>`}</button>`).join('');
  };

  const render = () => {
    const p = PLANS[state.plan];
    const isClient = state.client && p.client;
    const per = p.perMonth - (isClient ? CLIENT_OFF : 0);
    const total = per * state.months;
    $('#clienteBox').classList.toggle('off', !p.client);
    const period = state.months === 12 ? '1 ano (12 meses)' : `${state.months} ${state.months === 1 ? 'mês' : 'meses'}`;
    $('#sumName').textContent = p.name;
    $('#sumMode').textContent = period;
    const lines = [
      ['Valor por mês', brl(per) + (isClient ? ` <s>${brl(p.perMonth)}</s>` : '')],
      ['Período', period],
      ['Começa a valer', 'na data do pagamento'],
      ['Valor total', `<strong>${brl(total)}</strong>`]
    ];
    $('#sumLines').innerHTML = lines.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('');
    $('#sumNote').textContent = state.plan === 'promo' ? 'Promo Black: só até 30 de novembro.' : isClient ? 'Desconto de cliente LADUNA aplicado.' : 'Abre o WhatsApp da LADUNA com a sua escolha já escrita.';
    const go = $('#sumGo');
    go.href = waLink(`Olá! Quero anunciar a minha marca nas telas.\nPlano: ${p.name}${isClient ? ' (sou cliente LADUNA)' : ''}\nPeríodo: ${period}\nValor total: ${brl(total)} (${brl(per)} por mês)`);
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
    state.months = Number(b.dataset.m);
    mesesBox.querySelectorAll('.chip-btn').forEach(x => x.setAttribute('aria-checked', String(x === b)));
    render();
  });
  $('#cliente').addEventListener('change', e => { state.client = e.target.checked; render(); });
  renderMonths(); render();

  // No celular os planos deslizam: começa no plano em destaque.
  const cards = $('#cards'), feat = cards && cards.querySelector('.card-featured');
  if (feat && innerWidth <= 860) requestAnimationFrame(() => { cards.scrollLeft = feat.offsetLeft - (cards.clientWidth - feat.clientWidth) / 2; });
})();
