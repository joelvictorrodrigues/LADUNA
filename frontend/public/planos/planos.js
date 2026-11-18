(() => {
  const PHONE = '5566996361345';
  const DIAG = 250;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const PLANS = {
    empresa: { label: 'Empresarial', sub: 'Planos para empresas com equipe', list: [
      { id: 'start', name: 'Start', title: 'Presença básica com o seu material', price: 999,
        items: ['1 rede (Instagram)', '2 posts por mês', '5 stories por semana, 1 de produtos por dia útil', 'Ajuste de bio e destaques', 'Suporte no WhatsApp em horário comercial'],
        note: 'Fotos e conteúdo enviados por você.' },
      { id: 'gold', name: 'Gold', title: 'Constância com planejamento', price: 1499, seats: 4,
        items: ['Planejamento estratégico', '2 redes (Instagram e Facebook)', '6 posts por mês: post, reels e carrossel', '10 stories por semana, 2 de produtos', '2 avisos ou artes de datas festivas', 'Social media parcial: criamos, você publica', '1 visita por mês para gravar, até 1h', 'Relatório a cada 3 meses'] },
      { id: 'premium', name: 'Premium', title: 'Sua empresa presente todo dia, sem você precisar postar', price: 2599, featured: true, seats: 2,
        items: ['Social media completo: criamos e publicamos', '3 redes (Instagram, Facebook e TikTok)', '8 posts por mês e 25 stories por semana', '1 campanha por mês', '4 avisos ou artes de datas festivas', 'Perfil refeito e consultoria de imagem', 'Visita a cada 15 dias para gravar, até 1h', 'Reunião e relatório a cada 2 meses', 'WhatsApp prioritário e cronograma'] },
      { id: 'black', name: 'Black', title: 'Domínio local, com vídeo e anúncios', price: 3699, seats: 1, plus: 'Tudo do Premium, mais:',
        items: ['12 posts por mês e 35 stories por semana', '2 campanhas por mês', 'Conteúdo de sábado e domingo, entregue na sexta', '1 vídeo cinematográfico por mês', 'Gestão de anúncios no Meta (verba à parte)', 'Google Meu Negócio', 'Visita semanal para gravar, até 1h', 'Reunião mensal e relatório completo', '30% de desconto em identidade visual'] },
      { id: 'enterprise', name: 'Enterprise', title: 'Seu departamento de marketing, sem contratar uma equipe', price: 7500, from: true, dark: true, seats: 2, plus: 'Tudo do Black, mais:',
        items: ['Anúncios no Meta e no Google', '2 vídeos cinematográficos por mês', 'Imagens com drone', 'Google Meu Negócio para cada unidade', 'Treinamento da equipe de vendas a cada 3 meses', 'Reunião mensal com a direção e relatório mensal'],
        note: 'Fechado por proposta, depois do diagnóstico.' }
    ]},
    pessoal: { label: 'Profissional', sub: 'Planos para quem é a cara do negócio', list: [
      { id: 'start', name: 'Start', title: 'Seu perfil arrumado e ativo', price: 900,
        items: ['1 rede (Instagram)', '4 posts por mês', 'Ajuste de bio e destaques', 'Suporte no WhatsApp em horário comercial'],
        note: 'Contrato mínimo de 2 meses.' },
      { id: 'gold', name: 'Gold', title: 'Constância com planejamento', price: 1199,
        items: ['Planejamento estratégico', '2 redes (Instagram e Facebook)', '6 posts por mês: post, reels e carrossel', '2 stories por semana', 'Ajuste de bio e destaques', '1 visita por mês para gravar, até 1h', 'Relatório a cada 3 meses'] },
      { id: 'premium', name: 'Premium', title: 'Autoridade construída post a post', price: 1999, featured: true,
        items: ['Social media parcial: criamos, você publica', '2 redes (Instagram e Facebook)', '8 posts por mês e 2 stories por semana', '1 campanha e 1 Reels com roteiro por mês', '2 avisos ou artes de datas festivas', 'Perfil refeito e consultoria de imagem', 'Visita a cada 15 dias para gravar, até 1h', 'Relatório a cada 2 meses e reunião a cada 3'] },
      { id: 'black', name: 'Black', title: 'Você em evidência, com vídeo e anúncios', price: 2799,
        items: ['Social media completo: criamos e publicamos', '3 redes (Instagram, Facebook e TikTok)', '12 posts por mês e 5 stories por semana', 'Campanhas e tendências do momento', '1 vídeo cinematográfico por mês', 'Gestão de anúncios no Meta (verba à parte)', 'Visita semanal para gravar, até 1h', 'Relatório mensal e reunião a cada 2 meses', 'WhatsApp prioritário e cronograma'] },
      { id: 'enterprise', name: 'Enterprise', title: 'Seu nome como referência no seu mercado', price: 4900, from: true, dark: true, seats: 1, plus: 'Tudo do Black, mais:',
        items: ['Reposicionamento da sua marca pessoal', '2 vídeos cinematográficos por mês', 'Sessão de fotos a cada 3 meses', 'Anúncios no Meta e no Google', 'Landing page para captar clientes', 'Reunião a cada 15 dias'],
        note: 'Fechado por proposta, depois do diagnóstico.' }
    ]}
  };

  const state = { line: 'empresa', plan: 'premium', months: 1, off: 0, touched: false };
  const $ = s => document.querySelector(s);
  const brl = n => 'R$ ' + Math.round(n).toLocaleString('pt-BR');
  const waLink = text => `https://wa.me/${PHONE}?text=${encodeURIComponent(text)}`;
  const modeName = m => ({ 1: 'Mensal', 3: 'Trimestral', 6: 'Semestral', 12: 'Anual' })[m];

  document.querySelectorAll('[data-wa]').forEach(a => { a.href = waLink(a.dataset.wa); a.target = '_blank'; a.rel = 'noopener'; });

  const root = document.documentElement, top = $('.top'), hero = $('.hero');
  const onScroll = () => {
    const max = root.scrollHeight - innerHeight;
    root.style.setProperty('--scroll', max > 0 ? (scrollY / max).toFixed(4) : 0);
    top.classList.toggle('scrolled', scrollY > 8);
    if (!reduce && scrollY < innerHeight) hero.style.setProperty('--py', (scrollY * 0.12).toFixed(1) + 'px');
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (!reduce && matchMedia('(hover:hover)').matches) {
    hero.addEventListener('pointermove', e => {
      const r = hero.getBoundingClientRect();
      hero.style.setProperty('--mx', ((e.clientX - r.left) / r.width - .5).toFixed(3));
      hero.style.setProperty('--my', ((e.clientY - r.top) / r.height - .5).toFixed(3));
    });
  }

  const count = (el, end) => {
    if (reduce) { el.textContent = end.toLocaleString('pt-BR'); return; }
    const t0 = performance.now(), dur = 800;
    const step = t => {
      const p = Math.min(1, (t - t0) / dur);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))).toLocaleString('pt-BR');
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in');
    io.unobserve(e.target);
  }), { threshold: .12, rootMargin: '0px 0px -30px 0px' }) : null;
  const watch = el => io ? io.observe(el) : el.classList.add('in');
  document.querySelectorAll('.reveal').forEach(watch);

  const cards = $('#cards');
  const current = () => PLANS[state.line].list.find(p => p.id === state.plan);

  const renderCards = animate => {
    const L = PLANS[state.line];
    $('[data-line-label]').textContent = L.sub;
    cards.innerHTML = L.list.map((p, i) => `
      <article class="card${p.featured ? ' card-featured' : ''}${p.dark ? ' card-dark' : ''}${p.id === state.plan ? ' is-on' : ''}" data-id="${p.id}" style="--i:${i}">
        ${p.featured ? '<span class="ribbon"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1.5l1.9 4 4.4.5-3.3 3 .9 4.3L8 11.1l-3.9 2.2.9-4.3-3.3-3 4.4-.5z"/></svg>Mais escolhido</span>' : ''}
        <div class="card-top">
          <p class="tier">${p.name}</p>
          ${p.seats ? `<span class="seats" title="Vagas abertas">${'<i></i>'.repeat(Math.min(p.seats, 3))}${p.seats} vaga${p.seats > 1 ? 's' : ''}</span>` : ''}
        </div>
        <h3>${p.title}</h3>
        <p class="price">${p.from ? '<small class="from">a partir de</small>' : ''}<small>R$</small><b data-n="${p.price}">${p.price.toLocaleString('pt-BR')}</b><small>/mês</small></p>
        ${p.plus ? `<p class="plus">${p.plus}</p>` : ''}
        <ul>${p.items.map(t => `<li>${t}</li>`).join('')}</ul>
        ${p.note ? `<p class="note">${p.note}</p>` : ''}
        <button class="btn ${p.dark ? 'btn-light' : p.featured ? 'btn-solid' : 'btn-outline'} pick" type="button" data-id="${p.id}">
          <span class="pick-off">Escolher ${p.name}</span><span class="pick-on">Escolhido</span>
        </button>
      </article>`).join('');
    cards.classList.toggle('enter', !!animate);
    cards.querySelectorAll('[data-n]').forEach(el => count(el, Number(el.dataset.n)));
    const on = cards.querySelector('.is-on');
    if (on && innerWidth <= 860) cards.scrollLeft = on.offsetLeft - (cards.clientWidth - on.clientWidth) / 2;
  };

  const renderSummary = () => {
    const L = PLANS[state.line], p = current();
    const name = `${p.name} ${L.label}`;
    $('#sumName').textContent = name;
    $('#sumMode').textContent = modeName(state.months) + (state.off ? ` · ${state.off}% de desconto` : '');
    const go = $('#sumGo'), note = $('#sumNote');
    let lines, msg, cartPrice;
    if (p.from) {
      lines = [['Investimento', `a partir de ${brl(p.price)}/mês`], ['Como funciona', 'Proposta sob medida depois do diagnóstico'], ['Diagnóstico de entrada', brl(DIAG)]];
      msg = `Olá! Quero conversar sobre o plano ${name}, no pagamento ${modeName(state.months).toLowerCase()}.`;
      go.textContent = 'Pedir proposta pelo WhatsApp';
      note.textContent = 'Vagas limitadas. Respondemos em horário comercial.';
      cartPrice = `a partir de ${brl(p.price)}/mês`;
    } else {
      const monthly = p.price * (1 - state.off / 100);
      const total = monthly * state.months;
      if (state.months === 1) {
        lines = [['Mensalidade', `${brl(p.price)}/mês`], ['Diagnóstico de entrada', `${brl(DIAG)} no 1º pagamento`], ['Primeiro pagamento', `<strong>${brl(p.price + DIAG)}</strong>`]];
        msg = `Olá! Quero contratar o plano ${name}, pagamento mensal de ${brl(p.price)}, mais o diagnóstico de entrada de ${brl(DIAG)} no primeiro pagamento.`;
      } else {
        lines = [
          ['Sai por', `${brl(monthly)}/mês <s>${brl(p.price)}</s>`],
          [`Valor dos ${state.months} meses`, brl(total)],
          ['Você economiza', brl(p.price * state.months - total)],
          ['Diagnóstico de entrada', brl(DIAG)],
          ['Total no cartão, de uma vez', `<strong>${brl(total + DIAG)}</strong>`]
        ];
        msg = `Olá! Quero contratar o plano ${name}, pagamento ${modeName(state.months).toLowerCase()} de uma vez no cartão: ${brl(total)} pelos ${state.months} meses (sai por ${brl(monthly)}/mês), mais o diagnóstico de entrada de ${brl(DIAG)}. Total: ${brl(total + DIAG)}.`;
      }
      go.textContent = 'Contratar pelo WhatsApp';
      note.innerHTML = 'Você confirma tudo com a gente antes de pagar. Depois, preenche o <a href="https://tally.so/r/GxKJbk" target="_blank" rel="noopener">formulário do diagnóstico</a>.';
      cartPrice = state.months === 1 ? `${brl(p.price)}/mês` : `${brl(total + DIAG)} no cartão`;
    }
    $('#sumLines').innerHTML = lines.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('');
    document.querySelectorAll('.mode').forEach(b => {
      const m = Number(b.dataset.months), off = Number(b.dataset.off);
      const per = b.querySelector('.mode-price') || b.appendChild(Object.assign(document.createElement('em'), { className: 'mode-price' }));
      const how = b.querySelector('.mode-how') || b.appendChild(Object.assign(document.createElement('small'), { className: 'mode-how' }));
      if (p.from) { per.textContent = 'sob proposta'; how.textContent = ''; return; }
      const v = p.price * (1 - off / 100);
      per.textContent = `${brl(v)}/mês`;
      how.textContent = m === 1 ? 'pago todo mês' : `${brl(v * m)} de uma vez no cartão`;
    });
    go.href = waLink(msg); go.target = '_blank'; go.rel = 'noopener';
    $('#cartName').textContent = `${name} · ${modeName(state.months)}`;
    $('#cartPrice').textContent = cartPrice;
    const s = $('.summary'); s.classList.remove('flash'); void s.offsetWidth; s.classList.add('flash');
  };

  const cart = $('#cart'), pay = $('#pagamento');
  const updateCart = () => {
    if (!state.touched) return;
    const r = pay.getBoundingClientRect();
    const inPay = r.top < innerHeight * .8 && r.bottom > innerHeight * .3;
    cart.hidden = false;
    cart.classList.toggle('show', !inPay);
  };
  addEventListener('scroll', updateCart, { passive: true });

  document.querySelectorAll('.who-card').forEach(b => b.addEventListener('click', () => {
    if (state.line === b.dataset.line) { $('#planos').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); return; }
    state.line = b.dataset.line;
    document.querySelectorAll('.who-card').forEach(x => x.setAttribute('aria-checked', String(x === b)));
    renderCards(true); renderSummary();
    setTimeout(() => $('#planos').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }), 250);
  }));

  cards.addEventListener('click', e => {
    const btn = e.target.closest('.pick'); if (!btn) return;
    state.plan = btn.dataset.id; state.touched = true;
    cards.querySelectorAll('.card').forEach(c => c.classList.toggle('is-on', c.dataset.id === state.plan));
    renderSummary(); updateCart();
    setTimeout(() => pay.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }), 200);
  });

  document.querySelectorAll('.mode').forEach(b => b.addEventListener('click', () => {
    state.months = Number(b.dataset.months); state.off = Number(b.dataset.off); state.touched = true;
    document.querySelectorAll('.mode').forEach(x => x.setAttribute('aria-checked', String(x === b)));
    renderSummary(); updateCart();
  }));

  const quote = $('#quote'), picked = new Set();
  document.querySelectorAll('.menu li').forEach((li, i) => {
    const name = li.querySelector('span').textContent, price = li.querySelector('b').textContent;
    li.innerHTML = `<label><input type="checkbox" value="${i}"><span class="box" aria-hidden="true"></span><span class="svc">${name}</span><b>${price}</b></label>`;
    li.querySelector('input').addEventListener('change', e => {
      e.target.checked ? picked.add(name) : picked.delete(name);
      li.classList.toggle('on', e.target.checked);
      const n = picked.size;
      quote.hidden = n === 0;
      $('#quoteCount').textContent = `${n} serviço${n > 1 ? 's' : ''} selecionado${n > 1 ? 's' : ''}`;
      $('#quoteList').textContent = [...picked].join(' · ');
      const go = $('#quoteGo');
      go.href = waLink(`Olá! Quero um orçamento para estes serviços avulsos:\n${[...picked].map(s => '• ' + s).join('\n')}`);
      go.target = '_blank'; go.rel = 'noopener';
      cart.classList.remove('show');
    });
  });
  const extras = $('#avulsos-sec');
  addEventListener('scroll', () => {
    const r = extras.getBoundingClientRect();
    if (r.top < innerHeight && r.bottom > 0) cart.classList.remove('show');
  }, { passive: true });

  if (location.hash === '#pessoal') state.line = 'pessoal';
  document.querySelectorAll('.who-card').forEach(x => x.setAttribute('aria-checked', String(x.dataset.line === state.line)));
  renderCards(false); renderSummary();
})();
