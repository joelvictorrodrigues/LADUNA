/* Briefing de logo — motor. Catálogo em logos-data.js. Uma pergunta por tela, rascunho só no aparelho (sem contato),
   quadro final, .txt e mensagem pronta para o WhatsApp. */
(() => {
  const D = window.LOGOS, C = D.CONFIG, N = D.TELAS.length;
  const stage = document.getElementById('stage'), nav = document.getElementById('nav'), prog = document.getElementById('prog'), live = document.getElementById('live');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const blank = () => ({ v: C.version, i: -1, a: { tom: {} } });
  let S = blank(), contact = { nome: '', fone: '' }, storageOk = true, note = '', timers = [], asked = false, mail = { st: '', id: '' };

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
  // O cartão "ponto de partida" redesenhado em imagem, igual ao da tela (2x, para ficar nítido no PDF e no e-mail).
  async function cardImage() {
    const f = letra(), c = cor(), x = a(), bg = c ? c.cores[0] : '#3F3F3F', fg = c ? c.cores[c.cores.length - 1] : '#F4F4F4', ac = c ? c.cores[c.cores.length - 2] : '#9F91A4';
    try { await document.fonts.load(`${f.weight} 60px ${f.font}`); await document.fonts.load('700 14px Montserrat'); } catch (e) { /* fonte padrão */ }
    const tipos = arr('tipo').map(id => by(D.TIPOS, id)).filter(Boolean), ajuda = 'A LADUNA ajuda a escolher';
    const loadLogo = async b => { const r = await fetch(C.logoCdn + b.slug + '.svg'); const svg = (await r.text()).replace('<svg ', `<svg fill="${fg}" width="120" height="120" `); const im = new Image(); im.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg); await im.decode(); return im; };
    const logos = tipos.length ? (await Promise.all(tipos[0].brands.slice(0, 3).map(b => loadLogo(b).catch(() => null)))).filter(Boolean) : [];
    const K = 2, W = 520, P = 18, IW = W - 2 * P, cv = document.createElement('canvas'), g = cv.getContext('2d');
    const font = (w, sz, fam) => { g.font = `${w} ${sz}px ${fam || 'Montserrat'}, sans-serif`; };
    const wrapT = (txt, max) => { const out = []; let l = ''; String(txt).split(/\s+/).filter(Boolean).forEach(w => { const tt = l ? l + ' ' + w : w; if (l && g.measureText(tt).width > max) { out.push(l); l = w; } else l = tt; }); out.push(l); return out; };
    const rr = (bx, by, bw, bh, r, fill, alpha, stroke) => { g.save(); g.globalAlpha = alpha == null ? 1 : alpha; g.beginPath(); if (g.roundRect) g.roundRect(bx, by, bw, bh, r); else g.rect(bx, by, bw, bh); if (stroke) { g.lineWidth = 1.5; g.strokeStyle = fill; g.stroke(); } else { g.fillStyle = fill; g.fill(); } g.restore(); };
    const spaced = v => { if ('letterSpacing' in g) g.letterSpacing = v; };
    // 1) mede o nome (até 2 linhas) para saber a altura da caixa
    const nameW = IW - 28; let size = f.big ? 64 : 52, nl;
    do { font(f.weight, size, f.font); nl = wrapT(shown(), nameW); size -= 1; } while (size > 14 && (nl.length > 2 || nl.some(l => g.measureText(l).width > nameW)));
    size += 1; const lineH = size * 1.08, nameH = Math.max(150, nl.length * lineH + 44);
    // 2) chips das palavras
    font(700, 12.5); const words = names('palavras', D.PALAVRAS), chips = []; let cx = 0, cy = 0;
    words.forEach(w => { const cw = g.measureText(w).width + 24; if (cx && cx + cw > IW) { cx = 0; cy += 34; } chips.push({ w, x: cx, y: cy, cw }); cx += cw + 6; });
    const chipsH = words.length ? cy + 28 : 0;
    // 3) blocos (2 colunas)
    const TW = (IW - 8) / 2, tiles = [
      { k: 'TIPO DE LOGO', v: tipos.length ? tipos.map(q => q.label).join(' · ') : ajuda, logos },
      { k: 'CORES', v: c ? names('cores', D.CORES).join(' · ') : ajuda, sw: c ? c.cores : null },
      { k: 'LETRAS', v: x.letrasAjuda || !arr('letras').length ? ajuda : names('letras', D.LETRAS).join(' · ') },
      { k: 'TOM', v: D.TOM.map(o => tomTxt(o, x.tom[o.id])).join(' · ') }];
    font(700, 13.5); tiles.forEach(tl => { tl.lines = wrapT(tl.v, TW - 24); tl.h = 12 + 14 + 6 + tl.lines.length * 17.5 + (tl.logos && tl.logos.length ? 40 : 0) + (tl.sw ? 28 : 0) + 12; });
    const row1 = Math.max(tiles[0].h, tiles[1].h), row2 = Math.max(tiles[2].h, tiles[3].h), tilesH = row1 + 8 + row2;
    // 4) usos
    font(700, 12.5); const usos = arr('usos').map(id => by(D.USOS, id)).filter(Boolean).map(u => ({ label: u.label, icon: u.icon })).concat(t('usoOutro') ? [{ label: t('usoOutro') }] : []), uchips = []; cx = 0; cy = 0;
    usos.forEach(u => { const cw = g.measureText(u.label).width + 24 + (u.icon ? 22 : 0); if (cx && cx + cw > IW) { cx = 0; cy += 36; } uchips.push(Object.assign({ x: cx, y: cy, cw }, u)); cx += cw + 6; });
    const usosH = usos.length ? cy + 30 : 0;
    const H = P + nameH + (chipsH ? 14 + chipsH : 0) + 14 + tilesH + (usosH ? 14 + usosH : 0) + P;
    cv.width = W * K; cv.height = Math.ceil(H * K); g.scale(K, K); g.textBaseline = 'middle';
    g.fillStyle = bg; g.fillRect(0, 0, W, H);
    let y = P;
    rr(P, y, IW, nameH, 20, fg, .1); font(f.weight, size, f.font); g.fillStyle = fg; g.textAlign = 'center';
    nl.forEach((l, n) => g.fillText(l, W / 2, y + nameH / 2 + (n - (nl.length - 1) / 2) * lineH)); g.textAlign = 'left'; y += nameH;
    if (chipsH) { y += 14; font(700, 12.5); chips.forEach(ch => { rr(P + ch.x, y + ch.y, ch.cw, 28, 14, ac); g.fillStyle = bg; g.fillText(ch.w, P + ch.x + 12, y + ch.y + 14.5); }); y += chipsH; }
    y += 14;
    tiles.forEach((tl, n) => { const tx = P + (n % 2) * (TW + 8), ty = y + (n < 2 ? 0 : row1 + 8), th = n < 2 ? row1 : row2; rr(tx, ty, TW, th, 16, fg, .1);
      let yy = ty + 12 + 7; font(700, 10); spaced('1.4px'); g.globalAlpha = .7; g.fillStyle = fg; g.fillText(tl.k, tx + 12, yy); g.globalAlpha = 1; spaced('0px');
      yy += 7 + 6; font(700, 13.5); tl.lines.forEach(l => { g.fillText(l, tx + 12, yy + 8.75); yy += 17.5; });
      if (tl.logos && tl.logos.length) { yy += 6; tl.logos.forEach((im, m) => g.drawImage(im, tx + 12 + m * 40, yy, 30, 30)); yy += 34; }
      if (tl.sw) { yy += 6; const sw = TW - 24, cw = sw / tl.sw.length; g.save(); g.beginPath(); if (g.roundRect) g.roundRect(tx + 12, yy, sw, 18, 6); else g.rect(tx + 12, yy, sw, 18); g.clip(); tl.sw.forEach((h, m) => { g.fillStyle = h; g.fillRect(tx + 12 + m * cw, yy, cw + 1, 18); }); g.restore(); rr(tx + 12, yy, sw, 18, 6, '#ffffff', .3, true); }
    });
    y += tilesH;
    if (usosH) { y += 14; font(700, 12.5); uchips.forEach(u => { rr(P + u.x, y + u.y, u.cw, 30, 15, fg, .35, true); let tx = P + u.x + 12; if (u.icon && window.Path2D) { g.save(); g.translate(tx, y + u.y + 7); g.scale(16 / 24, 16 / 24); g.strokeStyle = fg; g.lineWidth = 1.9; g.lineCap = 'round'; g.lineJoin = 'round'; g.stroke(new Path2D(u.icon)); g.restore(); tx += 22; } g.fillStyle = fg; g.fillText(u.label, tx, y + u.y + 15.5); }); }
    const b64 = cv.toDataURL('image/jpeg', .9).split(',')[1], bin = atob(b64), bytes = new Uint8Array(bin.length); for (let n = 0; n < bin.length; n++) bytes[n] = bin.charCodeAt(n);
    return { bytes, b64, w: cv.width, h: cv.height };
  }
  async function makePdf(img) {
    if (img === undefined) { try { img = await cardImage(); } catch (e) { img = null; } }
    return D.pdf({ marca: nome() || 'Nome em definição', contato: `${contact.nome.trim()} · WhatsApp ${contact.fone.trim()}`, data: 'Preenchido em ' + new Date().toLocaleDateString('pt-BR'), rows: lines().slice(1), nota: abertos().length ? 'A LADUNA orienta em: ' + abertos().join(', ') + '.' : '', cores: (cor() || {}).cores, img });
  }
  async function download() { const u = URL.createObjectURL(new Blob([await makePdf()], { type: 'application/pdf' })), l = document.createElement('a'); l.href = u; l.download = fileName(); document.body.appendChild(l); l.click(); l.remove(); setTimeout(() => URL.revokeObjectURL(u), 2000); }
  const endpoint = '/.netlify/functions/logos-briefing';
  async function send() {
    if (mail.st === 'sending' || mail.st === 'sent') return;
    if (!mail.id) mail.id = Array.from(crypto.getRandomValues(new Uint8Array(12)), b => b.toString(16).padStart(2, '0')).join('');
    mail.st = 'sending'; refresh('send');
    try {
      let img = null; try { img = await cardImage(); } catch (e) { img = null; }
      const bytes = await makePdf(img); let bin = ''; for (let i = 0; i < bytes.length; i += 8192) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 8192));
      const r = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: mail.id, site: '', marca: nome(), contato: { nome: contact.nome.trim(), fone: contact.fone.trim() }, linhas: lines(), pdf: btoa(bin), cartao: img ? img.b64 : '' }) });
      const d = await r.json().catch(() => ({}));
      mail.st = r.ok && d.ok ? 'sent' : 'fail';
    } catch (e) { mail.st = 'fail'; }
    refresh(mail.st === 'sent' ? 'title' : 'send'); live.textContent = mail.st === 'sent' ? 'Briefing enviado para a LADUNA.' : 'Não foi possível enviar agora.';
  }

  function board() {
    const f = letra(), c = cor(), x = a(), bg = c ? c.cores[0] : '#3F3F3F', fg = c ? c.cores[c.cores.length - 1] : '#F4F4F4', ac = c ? c.cores[c.cores.length - 2] : '#9F91A4';
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
      ${mail.st === 'sent' ? '<div class="sent" role="status"><b>Briefing enviado.</b> A LADUNA recebeu suas respostas e responde no seu WhatsApp.</div>'
        : `${mail.st === 'fail' ? '<p class="note" role="alert">Não conseguimos enviar agora. Suas respostas continuam aqui: tente de novo em instantes.</p>' : ''}<button type="button" class="btn btn-solid ${mail.st === 'sending' ? 'wait' : ''}" id="send" data-act="send" ${mail.st === 'sending' ? 'aria-disabled="true"' : ''}>${mail.st === 'sending' ? 'Enviando…' : mail.st === 'fail' ? 'Tentar enviar de novo' : 'Enviar para a LADUNA'}</button><p class="hint small">A LADUNA recebe este cartão e todas as suas respostas, e responde no seu WhatsApp.</p>`}
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
