/* Briefing de logo — motor. Catálogo em logos-data.js. Uma pergunta por tela, rascunho só no aparelho (sem contato),
   quadro final, .txt e mensagem pronta para o WhatsApp. */
(() => {
  const D = window.LOGOS, C = D.CONFIG, N = D.TELAS.length;
  const stage = document.getElementById('stage'), nav = document.getElementById('nav'), prog = document.getElementById('prog'), live = document.getElementById('live');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const blank = () => ({ v: C.version, i: -1, a: { tom: {} } });
  let S = blank(), contact = { nome: '', fone: '' }, storageOk = true, note = '', timers = [], asked = false, mail = { ready: null, st: '', id: '' };

  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const a = () => S.a, arr = k => (Array.isArray(S.a[k]) ? S.a[k] : (S.a[k] = [])), t = k => (typeof S.a[k] === 'string' ? S.a[k].trim() : '');
  const by = (list, id) => list.find(x => x.id === id);
  const nome = () => (a().nomeIndef ? '' : t('nome'));
  const shown = () => nome() || 'Sua marca';

  /* ---------- rascunho ---------- */
  function load() {
    try {
      const raw = localStorage.getItem(C.draftKey); if (!raw) return;
      const d = JSON.parse(raw);
      if (!d || d.v !== C.version || typeof d.a !== 'object' || !d.a) throw 0;
      S = Object.assign(blank(), { a: Object.assign(blank().a, d.a), resume: Math.max(0, Math.min(N - 1, d.i | 0)) });
    } catch (e) { S = blank(); try { localStorage.removeItem(C.draftKey); note = 'O rascunho antigo não pôde ser aproveitado. Vamos começar de novo.'; } catch (e2) { storageOk = false; } }
  }
  function save() { try { localStorage.setItem(C.draftKey, JSON.stringify({ v: C.version, i: Math.min(S.i, N - 1), a: S.a })); storageOk = true; } catch (e) { storageOk = false; } }
  const hasDraft = () => S.resume != null && Object.keys(S.a).length > 1;

  /* ---------- peças ---------- */
  const logo = (b, tint) => `<i class="lg" role="img" aria-label="Logo ${esc(b.name)}" title="${esc(b.name)}" style="--u:url(${C.logoCdn}${b.slug}.svg)${tint && b.hex ? `;color:${b.hex}` : ''}"></i>`;
  const fit = (text, max, k) => { const w = Math.max(4, ...String(text).split(/\s+/).map(x => x.length * (x === x.toUpperCase() && /[A-Z]/.test(x) ? 1.3 : 1))); return `font-size:max(13px,min(${max}px,calc(100cqi / ${w} * ${k || 1.6})))`; };
  const opt = (k, v, on, inner, cls, i, extra) => `<button type="button" class="opt ${cls || ''} ${on ? 'on' : ''}" aria-pressed="${!!on}" data-k="${k}" data-v="${esc(v)}" id="o-${k}-${esc(v)}" style="--k:${i || 0}" ${extra || ''}>${inner}</button>`;
  const rank = (sel, id) => (sel.includes(id) && sel.length > 1 ? `<b class="rank">${sel.indexOf(id) + 1}ª</b>` : '<u></u>');
  const help = k => opt(k, '?', a()[k + 'Ajuda'], '<span>Não sei, me ajuda a escolher</span><u></u>', 'ghost', 9);
  const head = (kick, h, hint) => `<p class="kicker">${kick}</p><h1 id="title" tabindex="-1">${h}</h1>${hint ? `<p class="hint">${hint}</p>` : ''}`;
  const tomTxt = (x, v) => (v === 'a' ? x.a.toLowerCase() : v === 'b' ? x.b.toLowerCase() : `entre ${x.a.toLowerCase()} e ${x.b.toLowerCase()}`);
  const letra = () => by(D.LETRAS, arr('letras')[0]) || D.LETRAS[2];
  const cor = () => by(D.CORES, arr('cores')[0]);

  /* ---------- telas ---------- */
  const T = {
    nome: {
      html: () => `${head('Para começar', 'Qual é o <em>nome</em> da marca?', 'Escreva do jeito que ele deve aparecer.')}
        <input class="big" id="f-nome" data-f="nome" value="${esc(a().nome || '')}" maxlength="60" placeholder="Nome da marca" autocomplete="off" ${a().nomeIndef ? 'disabled' : ''} aria-label="Nome da marca">
        <div class="spec" aria-hidden="true"><span id="spec-t" style="${fit(shown(), 46)}">${esc(shown())}</span><small id="spec-l">Sem serifa</small></div>
        <div class="opts chips">${opt('nomeIndef', '1', a().nomeIndef, '<span>Ainda estou definindo o nome</span>', '', 2)}</div>`,
      ok: () => !!nome() || !!a().nomeIndef, msg: 'Digite o nome, ou marque que ainda está definindo.',
      mount() { let n = 2; const el = document.getElementById('spec-t'), lb = document.getElementById('spec-l'); if (reduce) return; timers.push(setInterval(() => { n = (n + 1) % D.LETRAS.length; const f = D.LETRAS[n]; el.classList.remove('swap'); void el.offsetWidth; el.style.fontFamily = f.font + ',sans-serif'; el.style.fontWeight = f.weight; lb.textContent = f.label; el.classList.add('swap'); }, 1500)); }
    },
    negocio: {
      html: () => `${head('O negócio', 'O que você <em>faz</em>, e para quem?', 'Uma frase basta. Ex.: doces por encomenda para festas em Sinop.')}
        <textarea id="f-descricao" data-f="descricao" rows="3" maxlength="240" placeholder="Eu faço…" aria-label="O que você faz e para quem">${esc(a().descricao || '')}</textarea>
        <p class="sub">É uma marca nova?</p><div class="opts chips">${D.MOMENTO.map((m, i) => opt('momento', m.id, a().momento === m.id, `<span>${m.label}</span>`, '', i)).join('')}</div>`,
      ok: () => t('descricao').length >= 6 && !!a().momento, msg: 'Conte o que você faz e marque se a marca é nova.'
    },
    palavras: {
      html: () => `${head('Personalidade', 'Em até três palavras, como ela deve <em>parecer</em>?', '')}
        <div class="opts chips big">${D.PALAVRAS.map((p, i) => opt('palavras', p.id, arr('palavras').includes(p.id), `<span>${p.label}</span>`, '', i)).join('')}</div><p class="count" id="count">${arr('palavras').length} de 3</p>`,
      ok: () => arr('palavras').length > 0, msg: 'Escolha pelo menos uma palavra.', max: { palavras: 3 }
    },
    tom: {
      html: () => `${head('Personalidade', 'Ela é mais <em>isto ou aquilo</em>?', 'Toque no lado que parece mais com a sua marca. Em dúvida, deixe em branco.')}
        <div class="stack">${D.TOM.map((x, n) => `<div class="duel" role="group" aria-label="${x.a} ou ${x.b}">${['a', 'b'].map((side, m) => opt('tom', x.id + ':' + side, a().tom[x.id] === side, `<span class="logos">${x['l' + side].map(b => logo(b)).join('')}</span><b>${x[side]}</b><u></u>`, 'side', n * 2 + m)).join('<i class="vs" aria-hidden="true">ou</i>')}</div>`).join('')}</div>
        <p class="tm">Marcas de terceiros, mostradas só como exemplo.</p>`,
      ok: () => true
    },
    tipo: {
      html: () => `${head('Formato', 'Que <em>tipo de logo</em> combina mais?', 'Toque em até dois. O primeiro é o favorito.')}
        <div class="opts cards">${D.TIPOS.map((x, i) => opt('tipo', x.id, arr('tipo').includes(x.id), `<span class="logos">${x.brands.map(b => logo(b)).join('')}</span><span class="txt"><b>${x.label}</b><small>${x.desc}</small></span>${rank(arr('tipo'), x.id)}`, 'card', i)).join('')}${help('tipo')}</div>
        <p class="tm">Marcas de terceiros, mostradas só como exemplo de cada tipo.</p>`,
      ok: () => arr('tipo').length > 0 || !!a().tipoAjuda, msg: 'Toque em um tipo, ou peça ajuda.', max: { tipo: 2 }
    },
    letras: {
      html: () => `${head('Letras', 'Qual <em>jeito de escrever</em> é mais a sua cara?', 'Toque em até dois.')}
        <div class="opts cards">${D.LETRAS.map((x, i) => opt('letras', x.id, arr('letras').includes(x.id), `<span class="word"><span style="font-family:${x.font},sans-serif;font-weight:${x.weight};${fit(shown(), x.big ? 46 : 36, x.big ? 1.45 : 1.6)}">${esc(shown())}</span></span><span class="txt"><b>${x.label}</b><small>${x.desc}</small></span><span class="who">${x.brands.map(b => logo(b)).join('')}</span>${rank(arr('letras'), x.id)}`, 'card type', i)).join('')}${help('letras')}</div>`,
      ok: () => arr('letras').length > 0 || !!a().letrasAjuda, msg: 'Toque em um estilo, ou peça ajuda.', max: { letras: 2 }
    },
    cores: {
      html: () => `${head('Cores', 'E as <em>cores</em>?', 'Toque em até dois caminhos.')}
        <div class="opts cards two">${D.CORES.map((x, i) => opt('cores', x.id, arr('cores').includes(x.id), `<span class="band" style="background:linear-gradient(90deg,${x.cores.map((c, n) => `${c} ${n * 25}% ${(n + 1) * 25}%`).join(',')})"></span><span class="txt"><b>${x.label}</b><small>${x.desc}</small></span><span class="who tint">${x.brands.map(b => logo(b, true)).join('')}</span>${rank(arr('cores'), x.id)}`, 'card color', i)).join('')}${help('cores')}</div>
        <input id="f-corRegra" data-f="corRegra" value="${esc(a().corRegra || '')}" maxlength="120" placeholder="Alguma cor obrigatória ou proibida? (opcional)" aria-label="Cor obrigatória ou proibida, opcional">`,
      ok: () => arr('cores').length > 0 || !!a().coresAjuda, msg: 'Toque em um caminho de cor, ou peça ajuda.', max: { cores: 2 }
    },
    usos: {
      html: () => `${head('No mundo real', 'Onde a marca vai <em>aparecer</em>?', 'Marque tudo o que vale. O primeiro é o mais importante.')}
        <div class="opts">${D.USOS.map((x, i) => opt('usos', x.id, arr('usos').includes(x.id), `<i class="ic"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="${x.icon}"/></svg></i><span>${x.label}</span>${rank(arr('usos'), x.id)}`, '', i)).join('')}</div>
        <input id="f-usoOutro" data-f="usoOutro" value="${esc(a().usoOutro || '')}" maxlength="100" placeholder="Outro lugar? (opcional)" aria-label="Outro lugar, opcional">`,
      ok: () => arr('usos').length > 0 || !!t('usoOutro'), msg: 'Marque pelo menos um lugar.'
    },
    extras: {
      html: () => `${head('Último detalhe', 'O que ela <em>não pode</em> parecer?', 'Opcional. Se quiser, conte também o que você admira.')}
        <div class="opts chips">${D.EVITAR.map((x, i) => opt('evitar', x.id, arr('evitar').includes(x.id), `<span>${x.label}</span>`, 'no', i)).join('')}</div>
        <textarea id="f-refs" data-f="refs" rows="3" maxlength="400" placeholder="Marcas que você admira, links, ideias, o que não quer de jeito nenhum…" aria-label="Referências e observações, opcional">${esc(a().refs || '')}</textarea>`,
      ok: () => true, optional: () => !arr('evitar').length && !t('refs')
    },
    contato: {
      html: () => `${head('Quase lá', 'Para quem a LADUNA <em>responde</em>?', '')}
        <input class="big" id="f-c-nome" data-c="nome" value="${esc(contact.nome)}" maxlength="60" placeholder="Seu nome" autocomplete="name" aria-label="Seu nome">
        <input class="big" id="f-c-fone" data-c="fone" value="${esc(contact.fone)}" maxlength="20" type="tel" inputmode="tel" autocomplete="tel" placeholder="WhatsApp com DDD" aria-label="Seu WhatsApp com DDD">
        <p class="hint small">Seu nome e WhatsApp vão para a LADUNA junto com o briefing, só para responder a você. Não ficam salvos neste aparelho. <a href="${C.privacyUrl}" target="_blank" rel="noopener">Privacidade</a></p>`,
      ok: () => contact.nome.trim().length > 1 && /^\d{10,13}$/.test(contact.fone.replace(/\D/g, '')), msg: 'Digite seu nome e o WhatsApp com DDD.'
    }
  };

  /* ---------- resumo ---------- */
  const names = (k, list) => arr(k).map(id => (by(list, id) || {}).label).filter(Boolean);
  function lines() {
    const x = a(), pick = (k, list) => (x[k + 'Ajuda'] ? 'Quer ajuda da LADUNA para escolher' : names(k, list).map((n, i, all) => (all.length > 1 && !i ? n + ' (favorito)' : n)).join(', '));
    return [
      ['Marca', nome() || 'Nome em definição'], ['Momento', (by(D.MOMENTO, x.momento) || {}).label], ['O que faz', t('descricao')],
      ['Deve parecer', names('palavras', D.PALAVRAS).join(', ')], ['Tom', D.TOM.map(o => tomTxt(o, x.tom[o.id])).join('; ')],
      ['Tipo de logo', pick('tipo', D.TIPOS)], ['Letras', pick('letras', D.LETRAS)], ['Cores', pick('cores', D.CORES)], ['Cor obrigatória ou proibida', t('corRegra')],
      ['Onde aparece', names('usos', D.USOS).map((n, i, all) => (all.length > 1 && !i ? n + ' (principal)' : n)).concat(t('usoOutro') ? [t('usoOutro')] : []).join(', ')],
      ['Não pode parecer', names('evitar', D.EVITAR).join(', ')], ['Referências e observações', t('refs')]
    ].filter(r => r[1]);
  }
  const abertos = () => [a().nomeIndef && 'nome', a().momento === 'definindo' && 'marca nova ou renovação', a().tipoAjuda && 'tipo de logo', a().letrasAjuda && 'letras', a().coresAjuda && 'cores'].filter(Boolean);
  function fullText() {
    const o = ['BRIEFING DE LOGO', '', `Contato: ${contact.nome.trim()} · WhatsApp ${contact.fone.trim()}`, ''];
    lines().forEach(([k, v]) => o.push(`${k}: ${v}`));
    if (abertos().length) o.push('', 'A LADUNA orienta em: ' + abertos().join(', ') + '.');
    return o.join('\n');
  }
  const slug = s => (s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40).replace(/^-+|-+$/g, '');
  const fileName = () => `briefing-logo-${slug(nome()) || 'marca'}.pdf`;
  function wa() {
    const link = s => `https://wa.me/${C.whatsapp}?text=${encodeURIComponent(s)}`, full = 'Olá, LADUNA! Fiz o briefing de logo no site.\n\n' + fullText();
    if (link(full).length <= C.waMaxUrl) return { url: link(full), short: false };
    const keep = ['Marca', 'O que faz', 'Deve parecer', 'Tipo de logo', 'Onde aparece'], cut = s => (s.length > 90 ? s.slice(0, 89) + '…' : s);
    const s = ['Olá, LADUNA! Fiz o briefing de logo no site.', '', `Contato: ${contact.nome.trim()} · WhatsApp ${contact.fone.trim()}`].concat(lines().filter(r => keep.includes(r[0])).map(([k, v]) => `${k}: ${cut(v)}`), ['', `O briefing completo está no arquivo ${fileName()}, que vou anexar aqui.`]).join('\n');
    return { url: link(s), short: true };
  }
  // O cartão "ponto de partida" desenhado em imagem, para ir dentro do PDF.
  async function cardImage() {
    const f = letra(), c = cor(), x = a(), bg = c ? c.cores[0] : '#3F3F3F', fg = c ? c.cores[c.cores.length - 1] : '#F4F4F4', ac = c ? c.cores[c.cores.length - 2] : '#9F91A4';
    try { await document.fonts.load(`${f.weight} 80px ${f.font}`); await document.fonts.load('700 24px Montserrat'); } catch (e) { /* segue com a fonte padrão */ }
    const Wc = 1040, P = 36, cv = document.createElement('canvas'), g = cv.getContext('2d'), IW = Wc - 2 * P, ajuda = 'A LADUNA ajuda a escolher';
    const wrapC = (txt, max) => { const out = []; let l = ''; String(txt).split(/\s+/).forEach(w => { const tt = l ? l + ' ' + w : w; if (l && g.measureText(tt).width > max) { out.push(l); l = w; } else l = tt; }); out.push(l); return out; };
    const box = (bx, by, bw, bh, r, fill, alpha) => { g.globalAlpha = alpha || 1; g.fillStyle = fill; g.beginPath(); if (g.roundRect) g.roundRect(bx, by, bw, bh, r); else g.rect(bx, by, bw, bh); g.fill(); g.globalAlpha = 1; };
    const words = names('palavras', D.PALAVRAS), usos = names('usos', D.USOS).concat(t('usoOutro') ? [t('usoOutro')] : []);
    const tiles = [['TIPO DE LOGO', x.tipoAjuda ? ajuda : names('tipo', D.TIPOS).join(' · ')], ['CORES', x.coresAjuda ? ajuda : names('cores', D.CORES).join(' · ')], ['LETRAS', x.letrasAjuda ? ajuda : names('letras', D.LETRAS).join(' · ')], ['TOM', D.TOM.map(o => tomTxt(o, x.tom[o.id])).join(' · ')]];
    cv.width = Wc; cv.height = P + 250 + 20 + (words.length ? 68 : 0) + 2 * 150 + 16 + (usos.length ? 70 : 0) + P;
    box(0, 0, Wc, cv.height, 0, bg); box(P, P, IW, 250, 28, fg, .1);
    let size = f.big ? 150 : 120, nl; g.textAlign = 'center'; g.textBaseline = 'middle';
    do { g.font = `${f.weight} ${size}px ${f.font}, sans-serif`; nl = wrapC(shown(), IW - 60); size -= 6; } while (size > 30 && (nl.length > 2 || nl.some(l => g.measureText(l).width > IW - 60)));
    g.fillStyle = fg; nl.slice(0, 3).forEach((l, i, all) => g.fillText(l, Wc / 2, P + 125 + (i - (all.length - 1) / 2) * (size + 6) * 1.1));
    let y = P + 270; g.textAlign = 'left'; g.font = '700 24px Montserrat, sans-serif';
    if (words.length) { let px = P; words.forEach(w => { const pw = g.measureText(w).width + 44; box(px, y, pw, 48, 24, ac); g.fillStyle = bg; g.fillText(w, px + 22, y + 25); px += pw + 12; }); y += 68; }
    tiles.forEach(([k, v], i) => { const tx = P + (i % 2) * (IW / 2 + 8), ty = y + Math.floor(i / 2) * 158, tw = IW / 2 - 8; box(tx, ty, tw, 142, 22, fg, .1); g.fillStyle = fg; g.globalAlpha = .7; g.font = '700 17px Montserrat, sans-serif'; g.fillText(k, tx + 22, ty + 32); g.globalAlpha = 1; g.font = '700 25px Montserrat, sans-serif'; wrapC(v, tw - 44).slice(0, 2).forEach((l, n) => g.fillText(l, tx + 22, ty + 70 + n * 32)); if (k === 'CORES' && c) c.cores.forEach((h, n) => { box(tx + 22 + n * 46 - 1, ty + 105, 42, 24, 6, '#fff'); box(tx + 22 + n * 46, ty + 106, 40, 22, 5, h); }); });
    y += 2 * 158 + 8;
    if (usos.length) { g.fillStyle = fg; g.globalAlpha = .9; g.font = '600 23px Montserrat, sans-serif'; wrapC('Onde aparece: ' + usos.join(' · '), IW).slice(0, 2).forEach((l, n) => g.fillText(l, P, y + 20 + n * 30)); g.globalAlpha = 1; }
    const b64 = cv.toDataURL('image/jpeg', .88).split(',')[1], bin = atob(b64), bytes = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return { bytes, w: cv.width, h: cv.height };
  }
  async function makePdf() {
    let img = null; try { img = await cardImage(); } catch (e) { /* PDF sai sem o cartão */ }
    return D.pdf({ marca: nome() || 'Nome em definição', contato: `${contact.nome.trim()} · WhatsApp ${contact.fone.trim()}`, data: 'Preenchido em ' + new Date().toLocaleDateString('pt-BR'), rows: lines().slice(1), nota: abertos().length ? 'A LADUNA orienta em: ' + abertos().join(', ') + '.' : '', cores: (cor() || {}).cores, img });
  }
  async function download() { const u = URL.createObjectURL(new Blob([await makePdf()], { type: 'application/pdf' })), l = document.createElement('a'); l.href = u; l.download = fileName(); document.body.appendChild(l); l.click(); l.remove(); setTimeout(() => URL.revokeObjectURL(u), 2000); }
  const endpoint = '/.netlify/functions/logos-briefing';
  function checkMail() { if (mail.ready !== null) return; mail.ready = false; fetch(endpoint).then(r => (r.ok ? r.json() : {})).then(d => { if (d && d.ready) { mail.ready = true; if (S.i >= N) refresh(); } }).catch(() => {}); }
  async function send() {
    if (mail.st === 'sending' || mail.st === 'sent') return;
    if (!mail.id) mail.id = Array.from(crypto.getRandomValues(new Uint8Array(12)), b => b.toString(16).padStart(2, '0')).join('');
    mail.st = 'sending'; refresh('send');
    try {
      const bytes = await makePdf(); let bin = ''; for (let i = 0; i < bytes.length; i += 8192) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 8192));
      const r = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: mail.id, site: '', marca: nome(), contato: { nome: contact.nome.trim(), fone: contact.fone.trim() }, linhas: lines(), pdf: btoa(bin) }) });
      const d = await r.json().catch(() => ({}));
      mail.st = r.ok && d.ok ? 'sent' : 'fail';
    } catch (e) { mail.st = 'fail'; }
    refresh(mail.st === 'sent' ? 'title' : 'wa'); live.textContent = mail.st === 'sent' ? 'Briefing enviado para a LADUNA.' : 'Não foi possível enviar por e-mail.';
  }

  function board() {
    const f = letra(), c = cor(), x = a(), w = wa(), bg = c ? c.cores[0] : '#3F3F3F', fg = c ? c.cores[c.cores.length - 1] : '#F4F4F4', ac = c ? c.cores[c.cores.length - 2] : '#9F91A4';
    const tipos = arr('tipo').map(id => by(D.TIPOS, id)).filter(Boolean);
    return `${head('Pronto', `O ponto de partida da <em>${esc(shown())}</em>`, 'É um retrato das suas escolhas, não a proposta de logo. A criação começa daqui.')}
      <div class="board" style="--bg:${bg};--fg:${fg};--ac:${ac}">
        <div class="b-name"><span style="font-family:${f.font},sans-serif;font-weight:${f.weight};${fit(shown(), f.big ? 64 : 52, f.big ? 1.45 : 1.6)}">${esc(shown())}</span></div>
        <div class="b-row">${names('palavras', D.PALAVRAS).map(p => `<b>${p}</b>`).join('')}</div>
        <div class="b-grid">
          <div class="b-tile"><small>Tipo de logo</small>${tipos.length ? `<p>${tipos.map(q => q.label).join(' · ')}</p><span class="logos">${tipos[0].brands.slice(0, 3).map(b => logo(b)).join('')}</span>` : '<p>A LADUNA ajuda a escolher</p>'}</div>
          <div class="b-tile"><small>Cores</small>${c ? `<p>${names('cores', D.CORES).join(' · ')}</p><span class="sw">${c.cores.map(h => `<i style="background:${h}"></i>`).join('')}</span>` : '<p>A LADUNA ajuda a escolher</p>'}</div>
          <div class="b-tile"><small>Letras</small><p>${x.letrasAjuda ? 'A LADUNA ajuda a escolher' : names('letras', D.LETRAS).join(' · ')}</p></div>
          <div class="b-tile"><small>Tom</small><p>${D.TOM.map(o => tomTxt(o, x.tom[o.id])).join(' · ')}</p></div>
        </div>
        <div class="b-row use">${arr('usos').map(id => by(D.USOS, id)).filter(Boolean).map(u => `<span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="${u.icon}"/></svg>${u.label}</span>`).join('')}</div>
      </div>
      ${mail.st === 'sent' ? `<div class="sent" role="status"><b>Briefing enviado.</b> A LADUNA recebeu suas respostas em PDF e responde no seu WhatsApp.</div><a class="btn btn-line" id="wa" href="${esc(w.url)}" target="_blank" rel="noopener">Avisar também pelo WhatsApp</a>`
        : mail.ready && mail.st !== 'fail' ? `<button type="button" class="btn btn-solid ${mail.st === 'sending' ? 'wait' : ''}" id="send" data-act="send" ${mail.st === 'sending' ? 'aria-disabled="true"' : ''}>${mail.st === 'sending' ? 'Enviando…' : 'Enviar para a LADUNA'}</button><p class="hint small">A LADUNA recebe um PDF com as suas respostas e responde no seu WhatsApp.</p>`
        : `${mail.st === 'fail' ? '<p class="note" role="alert">Não conseguimos enviar agora. Suas respostas continuam aqui: mande pelo WhatsApp, ou baixe o PDF.</p>' : ''}<a class="btn btn-solid" id="wa" href="${esc(w.url)}" target="_blank" rel="noopener">Enviar para a LADUNA no WhatsApp</a><p class="hint small">Revise a mensagem e toque em Enviar no WhatsApp: a LADUNA só recebe depois disso.${w.short ? ' Seu briefing ficou longo: baixe o PDF abaixo e anexe na conversa.' : ''}</p>`}
      <div class="end"><button type="button" class="link" id="dl" data-act="dl">Baixar meu briefing (PDF)</button><button type="button" class="link" id="edit" data-act="edit">Mudar respostas</button><button type="button" class="link" id="wipe" data-act="wipe">Apagar rascunho</button></div>
      <details class="more"><summary>Ver o texto do briefing</summary><pre id="full">${esc(fullText())}</pre></details>`;
  }

  function intro() {
    const all = D.TIPOS.flatMap(x => x.brands.map(b => ({ b, label: x.label })));
    return `<div class="hero"><div class="roulette" aria-hidden="true"><span id="rl-logo">${logo(all[0].b)}</span><small id="rl-cap">${all[0].label}</small></div>
      <p class="kicker">Briefing de logo</p><h1 id="title" tabindex="-1">Vamos descobrir como a sua marca pode se <em>apresentar</em>?</h1>
      <p class="hint">Dez toques, uns três minutos. Você compara logos que já conhece e a LADUNA entende o que faz sentido para o seu negócio.</p>
      ${note ? `<p class="note" role="status">${esc(note)}</p>` : ''}
      <button type="button" class="btn btn-solid" id="start" data-act="start">${hasDraft() ? 'Continuar meu briefing' : 'Começar meu briefing'}<span aria-hidden="true">→</span></button>
      ${hasDraft() ? (asked ? '<p class="confirm" role="alertdialog" aria-label="Apagar rascunho">Apagar o que você já respondeu? <button type="button" class="link" id="wipe-yes" data-act="wipe-yes">Sim, apagar</button><button type="button" class="link" id="wipe-no" data-act="wipe-no">Não</button></p>' : '<button type="button" class="link" id="restart" data-act="ask">Recomeçar do zero</button>') : ''}
      <p class="hint small">${storageOk ? 'O rascunho fica só neste aparelho.' : 'Não foi possível salvar rascunho neste aparelho; suas respostas valem enquanto a página estiver aberta.'}</p></div>`;
  }

  /* ---------- palco ---------- */
  const cur = () => T[D.TELAS[S.i] && D.TELAS[S.i].id];
  function paintNav() {
    const s = cur(); if (!s) { nav.hidden = true; return; }
    nav.hidden = false; const ok = s.ok(), skip = s.optional && s.optional();
    nav.innerHTML = `<button type="button" class="back" id="prev" data-act="prev" aria-label="Voltar"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 6l-6 6 6 6"/></svg></button><button type="button" class="btn btn-solid ${ok ? '' : 'wait'}" id="next" data-act="next" aria-describedby="msg"><span id="next-t">${S.i === N - 1 ? 'Ver meu resumo' : skip ? 'Pular' : 'Continuar'}</span><span aria-hidden="true">→</span></button><p class="msg" id="msg" role="alert"></p>`;
  }
  function paintProg() {
    if (S.i < 0) { prog.classList.add('off'); return; }
    prog.classList.remove('off'); const fase = S.i >= N ? 5 : D.TELAS[S.i].fase;
    prog.querySelectorAll('.segs i').forEach((el, n) => { const of = D.TELAS.filter(x => x.fase === n), done = S.i >= N ? of.length : of.filter(x => D.TELAS.indexOf(x) < S.i).length + (fase === n ? .5 : 0); el.style.setProperty('--f', Math.min(1, done / of.length)); });
    prog.querySelector('.prog-label').innerHTML = `<span>${D.FASES[fase]}</span><span>${S.i >= N ? 'Pronto' : `${S.i + 1} de ${N}`}</span>`;
    live.textContent = S.i >= N ? 'Resumo pronto.' : `Etapa ${S.i + 1} de ${N}: ${D.FASES[fase]}.`;
  }
  // Garante que o nome caiba na caixa, mesmo em letras largas (cursiva em maiúsculas, nomes longos).
  function fitNames() {
    document.querySelectorAll('.b-name span, .word span, .spec span').forEach(el => {
      const box = el.parentElement, cs = getComputedStyle(box), room = box.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      let fs = parseFloat(getComputedStyle(el).fontSize), n = 0;
      while (Math.max(el.scrollWidth, el.getBoundingClientRect().width) > room + 1 && fs > 12 && n++ < 40) { fs -= 1.5; el.style.fontSize = fs + 'px'; }
    });
  }
  function mount(dir, focus) {
    timers.forEach(clearInterval); timers = [];
    const s = cur(), html = S.i < 0 ? intro() : S.i >= N ? board() : s.html();
    stage.innerHTML = `<section class="step ${dir || 'still'} ${S.i < 0 ? 'is-intro' : S.i >= N ? 'is-end' : ''}" aria-labelledby="title">${html}</section>`;
    paintNav(); paintProg();
    if (s && s.mount) s.mount();
    if (S.i >= N) checkMail();
    if (S.i < 0 && !reduce) { const all = D.TIPOS.flatMap(x => x.brands.map(b => ({ b, label: x.label }))); let n = 0; const box = document.getElementById('rl-logo'), cap = document.getElementById('rl-cap'); timers.push(setInterval(() => { n = (n + 1) % all.length; box.classList.remove('swap'); void box.offsetWidth; box.innerHTML = logo(all[n].b); cap.textContent = all[n].label; box.classList.add('swap'); }, 1300)); }
    fitNames(); if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitNames);
    if (focus) { window.scrollTo(0, 0); const h = document.getElementById('title'); if (h) h.focus({ preventScroll: true }); }
  }
  function go(i, dir) {
    const old = stage.querySelector('.step'), run = () => { S.i = i; if (i >= 0) save(); mount(dir, true); };
    try { history.pushState({ i }, ''); } catch (e) { /* sem histórico */ }
    if (!old || reduce) return run();
    old.className = 'step leave-' + dir; setTimeout(run, 200);
  }
  function refresh(focusId) { const y = scrollY; mount('', false); const el = focusId && document.getElementById(focusId); if (el) el.focus({ preventScroll: true }); scrollTo(0, y); }
  function next() {
    const s = cur(); if (!s.ok()) { const b = document.getElementById('next'), m = document.getElementById('msg'); m.textContent = s.msg || ''; b.classList.remove('shake'); void b.offsetWidth; b.classList.add('shake'); const f = stage.querySelector('input:not([disabled]):not([type=range]),textarea'); if (f && !f.value.trim()) f.focus(); return; }
    go(S.i + 1, 'next');
  }

  /* ---------- eventos ---------- */
  document.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return; const { k, v, act } = b.dataset;
    if (k) {
      const s = cur(), multi = ['palavras', 'tipo', 'letras', 'cores', 'usos', 'evitar'].includes(k);
      if (v === '?') { a()[k + 'Ajuda'] = !a()[k + 'Ajuda']; if (a()[k + 'Ajuda']) a()[k] = []; }
      else if (multi) { const l = arr(k), at = l.indexOf(v), max = (s.max && s.max[k]) || 99; if (at >= 0) l.splice(at, 1); else { if (l.length >= max) l.shift(); l.push(v); } a()[k + 'Ajuda'] = false; }
      else if (k === 'nomeIndef') { a().nomeIndef = !a().nomeIndef; }
      else if (k === 'tom') { const [id, side] = v.split(':'); a().tom[id] = a().tom[id] === side ? '' : side; }
      else a()[k] = a()[k] === v ? '' : v;
      save(); refresh(b.id); const nb = document.getElementById(b.id); if (nb && nb.classList.contains('on')) nb.classList.add('bump');
    }
    else if (act === 'start') { note = ''; go(hasDraft() ? S.resume : 0, 'next'); }
    else if (act === 'next') next();
    else if (act === 'prev') go(S.i - 1, 'prev');
    else if (act === 'edit') { mail.st = ''; mail.id = ''; go(0, 'prev'); }
    else if (act === 'send') send();
    else if (act === 'dl') download();
    else if (act === 'ask' || act === 'wipe') { if (act === 'wipe') { S.resume = 0; S.i = -1; } asked = true; mount('', false); const n = document.getElementById('wipe-no'); if (n) n.focus(); }
    else if (act === 'wipe-no') { asked = false; refresh('restart'); }
    else if (act === 'wipe-yes') { try { localStorage.removeItem(C.draftKey); } catch (er) { /* sem armazenamento */ } S = blank(); contact = { nome: '', fone: '' }; mail.st = ''; mail.id = ''; asked = false; note = 'Rascunho apagado deste aparelho.'; mount('prev', true); }
  });
  document.addEventListener('input', e => {
    const el = e.target, d = el.dataset;
    if (d.f) { a()[d.f] = el.value; save(); if (d.f === 'nome') { const sp = document.getElementById('spec-t'); if (sp) { sp.textContent = shown(); sp.style.fontSize = fit(shown(), 46).slice(10); } } }
    else if (d.c) contact[d.c] = el.value;
    else return;
    const s = cur(), nb = document.getElementById('next'); if (!s || !nb) return;
    nb.classList.toggle('wait', !s.ok()); document.getElementById('msg').textContent = '';
    if (s.optional) document.getElementById('next-t').textContent = s.optional() ? 'Pular' : 'Continuar';
  });
  document.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.tagName === 'INPUT' && e.target.type !== 'range' && cur()) { e.preventDefault(); next(); } });
  document.addEventListener('focusin', e => document.body.classList.toggle('typing', /^(INPUT|TEXTAREA)$/.test(e.target.tagName) && e.target.type !== 'range'));
  document.addEventListener('focusout', () => document.body.classList.remove('typing'));
  window.addEventListener('popstate', e => { const i = e.state && e.state.i; if (typeof i !== 'number' || i > S.i || (i >= N && !T.contato.ok())) return; const dir = i < S.i ? 'prev' : 'next'; S.i = i; mount(dir, true); });

  const fonts = document.createElement('link'); fonts.rel = 'stylesheet'; fonts.href = C.fontsCss; document.head.appendChild(fonts);
  load();
  try { history.replaceState({ i: -1 }, ''); } catch (e) { /* sem histórico */ }
  mount('', false);
})();
