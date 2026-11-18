// Generates the service pages and the privacy page of the new LADUNA site from one template.
// Uso: node frontend/tools/build-site-pages.mjs frontend/public
import { writeFileSync } from 'node:fs';
const out = process.argv[2];
const HOME = '/';
const wa = text => `https://wa.me/556696361345?text=${encodeURIComponent(text)}`;
const wm = '<span class="wm" role="img" aria-label="LADUNA"></span>';

const head = ({ title, description, path, jsonld }) => `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
  <meta name="theme-color" content="#2D2D2D">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <link rel="canonical" href="https://ladunastudio.com.br${path}">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="pt_BR">
  <meta property="og:url" content="https://ladunastudio.com.br${path}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="https://ladunastudio.com.br/assets/laduna-cover.jpg">
  <meta name="twitter:card" content="summary_large_image">
  ${jsonld ? `<script type="application/ld+json">${JSON.stringify(jsonld)}</script>` : ''}
  <link rel="icon" href="/assets/laduna-emblem.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700&family=Quicksand:wght@500;600&display=swap" rel="stylesheet">
  <script>document.documentElement.classList.add('js');window.LADUNA_TRACKING={ga4:'',metaPixel:''};</script>
  <link rel="stylesheet" href="/nova-home/home.css?v=21">
  <script type="module" src="/nova-home/home.js?v=20"></script>
</head>
<body>
  <a class="skip" href="#conteudo">Pular para o conteúdo</a>
  <div class="progress" aria-hidden="true"></div>
  <header class="top">
    <div class="shell top-row">
      <a class="brand" href="${HOME}" aria-label="LADUNA Studio, início"><img src="/nova-home/media/logo-360.png" width="360" height="100" alt="LADUNA Studio"></a>
      <nav class="top-nav" id="menu" aria-label="Navegação principal">
        <a href="${HOME}#servicos">Serviços</a>
        <a href="${HOME}#metodo">Como funciona</a>
        <a href="${HOME}#sobre">Sobre</a>
        <a href="${HOME}#faq">Perguntas</a>
        <a class="nav-plan" href="/planos/" data-track="click_cta" data-place="menu-planos">Escolher meu plano</a>
        <a class="nav-client" href="https://clientes.ladunastudio.com.br" data-track="click_portal">Área do cliente</a>
      </nav>
      <a class="btn btn-solid top-client" href="https://clientes.ladunastudio.com.br" data-track="click_portal" data-place="menu">Área do cliente</a>
      <a class="btn btn-solid top-cta" href="${HOME}#contato" data-track="click_cta" data-place="menu"><span class="long">Solicitar </span><span class="short">Diagnóstico</span><span class="long-tail">diagnóstico de marketing</span></a>
      <button class="menu-toggle" type="button" aria-controls="menu" aria-expanded="false" aria-label="Abrir menu"><span></span><span></span></button>
    </div>
  </header>
`;

const foot = whatsappText => `
  <a class="float-wa" href="${wa(whatsappText)}" target="_blank" rel="noopener" data-track="click_whatsapp" data-place="flutuante" aria-label="Falar no WhatsApp">
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.6.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.7-1.2 2.2 2.2 0 0 0 .2-1.2c-.1-.1-.3-.2-.5-.3Z"/></svg>
    <span>WhatsApp</span>
  </a>
  <div class="consent" role="dialog" aria-label="Cookies de medição" hidden>
    <p>Usamos cookies de medição para entender como o site é usado e melhorar os anúncios. Você escolhe.</p>
    <div class="actions"><button class="btn btn-solid" type="button" data-consent="yes">Aceitar</button><button class="btn btn-outline" type="button" data-consent="no">Recusar</button></div>
  </div>
  <footer class="foot">
    <div class="shell foot-grid">
      <div>
        <img src="/nova-home/media/logo-360.png" width="360" height="100" alt="LADUNA Studio" loading="lazy">
        <p>Posicionamento • Identidade • Estratégia</p>
      </div>
      <div>
        <strong>Serviços</strong>
        <a href="/servicos/marca/">Marca</a>
        <a href="/servicos/conteudo/">Conteúdo</a>
        <a href="/servicos/crescimento/">Crescimento</a>
      </div>
      <div>
        <strong>Converse com a gente</strong>
        <a href="https://wa.me/556696361345" target="_blank" rel="noopener" data-track="click_whatsapp" data-place="rodape">(66) 9 9636-1345</a>
        <a href="https://www.instagram.com/ladunastudio/" target="_blank" rel="noopener">@ladunastudio</a>
        <a href="mailto:ladunastudio@gmail.com">ladunastudio@gmail.com</a>
        <a href="/links/">Todos os canais</a>
      </div>
      <div>
        <strong>Acessos</strong>
        <a href="https://clientes.ladunastudio.com.br" data-track="click_portal">Área do cliente</a>
        <a href="https://sistema.ladunastudio.com.br">Área ADM</a>
        <a href="/privacidade/">Privacidade</a>
      </div>
    </div>
    <div class="shell foot-base"><small>© <span id="year">2026</span> <span class="wm" role="img" aria-label="LADUNA"></span> Studio</small><small>CNPJ 64.110.259/0001-78</small></div>
  </footer>
</body>
</html>
`;

const minis = {
  marca: '<div class="mini mini-brand"><i></i><i></i><i></i><b></b></div>',
  conteudo: '<div class="mini mini-content"><i></i><i></i><i></i><b></b></div>',
  crescimento: '<div class="mini mini-growth"><i></i><i></i><i></i><i></i><i></i><svg viewBox="0 0 120 70" preserveAspectRatio="none"><path d="M4 60 L30 46 L54 50 L82 26 L116 8"/></svg></div>',
};
// Line icons drawn on reveal (each shape has pathLength=1 so one CSS rule animates all of them).
const icon = shapes => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${shapes.replace(/<(path|circle|rect)/g, '<$1 pathLength="1"')}</svg>`;
const icons = {
  target: icon('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2"/>'),
  palette: icon('<path d="M12 3a9 9 0 1 0 0 18c1 0 1.6-.8 1.6-1.6 0-.9-.7-1.4-.7-2.2 0-.9.7-1.6 1.6-1.6H17a4 4 0 0 0 4-4C21 6.8 17 3 12 3Z"/><circle cx="7.5" cy="11" r="1.2"/><circle cx="10.5" cy="7.2" r="1.2"/><circle cx="15" cy="7.6" r="1.2"/>'),
  eye: icon('<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>'),
  calendar: icon('<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4M7.5 14h3M13.5 14h3M7.5 17.5h3"/>'),
  camera: icon('<path d="M4 8h3l2-3h6l2 3h3v11H4Z"/><circle cx="12" cy="13" r="3.5"/>'),
  phone: icon('<rect x="7" y="2" width="10" height="20" rx="2.5"/><path d="M11 18h2M10 6h4"/>'),
  megaphone: icon('<path d="M4 10v4h3l6 4V6l-6 4Z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19.5 5.5a9 9 0 0 1 0 13"/>'),
  window: icon('<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M7 13h7M7 16.5h4"/>'),
  chart: icon('<path d="M3 20h18M6 17v-4M11 17V9M16 17v-6"/><path d="M5 9.5l5-4 4 3 6-5"/>'),
};
const check = '<svg class="check" viewBox="0 0 24 24" aria-hidden="true"><path pathLength="1" d="M5 12.5l4.5 4.5L19 7.5"/></svg>';

const services = [
  {
    slug: 'marca', name: 'Marca',
    ba: { title: 'Como a sua marca é vista, antes e depois.', text: 'A mesma empresa, apresentada com direção.', changes: ['Uma frase que explica o que você faz e para quem', 'Logo, cores e letras que se repetem em tudo', 'Uma aparência à altura do que você cobra'] },
    image: '/nova-home/media/svc-marca.jpg', alt: 'Emblema em relevo sobre papel claro.',
    chips: ['Posicionamento', 'Logo', 'Estética'],
    title: 'Posicionamento e identidade visual | LADUNA Studio',
    description: 'Posicionamento, identidade visual, logo e direção de estética para a sua marca comunicar o valor do que você oferece.',
    h1: 'Marca: <em>deixar claro o valor do que você oferece.</em>',
    lead: 'Para quando o cliente não entende por que escolher você, ou quando a marca parece menor do que o negócio.',
    signals: ['Oferta pouco clara', 'Valor difícil de perceber', 'Marca sem diferenciação', 'Público errado'],
    deliver: [
      ['target', 'Posicionamento e diferenciais', 'Para quem a marca fala, o que promete e por que alguém deveria escolher você e não o concorrente.'],
      ['palette', 'Identidade visual e logo', 'Logo, cores, tipografia e as aplicações que a marca vai usar no dia a dia.'],
      ['eye', 'Direção de estética', 'Como a marca aparece em fotos, posts, materiais e ambientes, para ser reconhecida em qualquer lugar.'],
    ],
  },
  {
    slug: 'conteudo', name: 'Conteúdo',
    ba: { title: 'O seu perfil, antes e depois.', text: 'O mesmo trabalho, mostrado com regularidade e padrão.', changes: ['Calendário com temas ligados ao que você vende', 'Fotos e vídeos com o mesmo padrão visual', 'Publicação na frequência combinada'] },
    image: '/nova-home/media/svc-conteudo.jpg', alt: 'Câmera e fotografias impressas sobre uma mesa de produção.',
    chips: ['Planejamento', 'Fotos e vídeos', 'Redes sociais'],
    title: 'Conteúdo e gestão de redes sociais | LADUNA Studio',
    description: 'Planejamento de conteúdo, fotos, vídeos e gestão das redes sociais para uma presença regular, bem feita e ligada ao que você vende.',
    h1: 'Conteúdo: <em>uma presença regular e bem feita.</em>',
    lead: 'Para quando a marca posta sem direção, some por semanas ou não transmite a confiança que o trabalho merece.',
    signals: ['Conteúdo sem direção', 'Presença irregular', 'Difícil de encontrar', 'Pouca prova de confiança'],
    deliver: [
      ['calendar', 'Planejamento de conteúdo', 'Linha editorial, temas e calendário ligados ao que a marca quer vender.'],
      ['camera', 'Fotos, vídeos e gravações', 'Produção do material que mostra o seu trabalho com a qualidade que ele tem.'],
      ['phone', 'Gestão das redes sociais', 'Publicação com regularidade e acompanhamento do que gera resposta.'],
    ],
  },
  {
    slug: 'crescimento', name: 'Crescimento',
    ba: { title: 'Os seus contatos, antes e depois.', text: 'O mesmo interesse, transformado em conversa e acompanhado.', changes: ['Campanhas para quem tem chance de comprar', 'Uma página clara para o visitante chamar você', 'Cada contato com a origem registrada'] },
    image: '/nova-home/media/svc-crescimento.jpg', alt: 'Mão segurando um celular que recebe uma notificação.',
    chips: ['Anúncios', 'Site', 'Resultados'],
    title: 'Anúncios, site e acompanhamento de resultados | LADUNA Studio',
    description: 'Anúncios e tráfego pago, site ou landing page e acompanhamento de resultados para transformar interesse em cliente.',
    h1: 'Crescimento: <em>transformar interesse em cliente.</em>',
    lead: 'Para quando as pessoas até se interessam, mas não chamam, não compram ou ninguém sabe dizer de onde vieram.',
    signals: ['Interesse sem ação', 'Anúncios sem acompanhamento', 'Sem análise para melhorar', 'Contatos sem retorno'],
    deliver: [
      ['megaphone', 'Anúncios e tráfego pago', 'Campanhas para levar a marca até quem tem chance real de comprar.'],
      ['window', 'Site ou landing page', 'Um lugar claro para o visitante entender a oferta e entrar em contato.'],
      ['chart', 'Acompanhamento de resultados', 'Números acompanhados com você para decidir onde investir e o que ajustar.'],
    ],
  },
];


// Before/after illustrations, drawn in CSS. Same markup for both states; CSS changes it by data-state.
const mocks = {
  marca: `<div class="mock mock-brand"><div class="mb-logo"><i></i></div><div class="mb-name"><b></b><b></b></div><p class="mb-line"><span class="t-antes">Fazemos de tudo com qualidade</span><span class="t-depois">Clara sobre o que entrega e para quem</span></p><div class="mb-colors"><i></i><i></i><i></i><i></i></div><div class="mb-type"><span>Aa</span><span>Aa</span></div></div>`,
  conteudo: `<div class="mock mock-feed"><div class="mf-head"><i></i><span><span class="t-antes">Último post: há semanas</span><span class="t-depois">Novo post esta semana</span></span></div><div class="mf-grid">${'<i></i>'.repeat(9)}</div><span class="mf-heart" aria-hidden="true"></span></div>`,
  crescimento: `<div class="mock mock-dash"><div class="md-head"><span class="t-antes">Contatos do mês</span><span class="t-depois">Contatos do mês</span></div><svg class="md-chart" viewBox="0 0 200 80" preserveAspectRatio="none"><path class="md-flat" d="M0 62 C40 64 70 58 100 63 S160 60 200 62"/><path class="md-up" d="M0 70 C40 66 60 54 90 50 S150 26 200 10"/></svg><ul class="md-src"><li><span>Anúncios</span><i></i></li><li><span>Site</span><i></i></li><li><span>Instagram</span><i></i></li></ul><p class="md-note"><span class="t-antes">De onde vieram? Ninguém sabe.</span><span class="t-depois">Cada contato com a origem registrada.</span></p></div>`,
};

const steps = [
  ['/nova-home/media/step-entender.jpg', 'Diagnóstico', 'Você conta o momento da marca e a gente analisa o que já existe.'],
  ['/nova-home/media/step-direcao.jpg', 'Direção e proposta', 'Prioridades, escopo, prazo e investimento por escrito, antes de você decidir.'],
  ['/nova-home/media/step-pratica.jpg', 'Execução', 'O trabalho sai do papel, com aprovação sua em cada etapa importante.'],
  ['/nova-home/media/step-acompanhar.jpg', 'Acompanhamento', 'Quem conversou com você no começo acompanha até o resultado.'],
];

for(const s of services) {
  const path = `/servicos/${s.slug}/`;
  const text = `Olá! Vim do site e quero um diagnóstico. Tenho interesse na frente de ${s.name}.`;
  const others = services.map(o => o === s
    ? `<div class="other-card is-current" aria-current="page"><img src="${o.image}" width="1100" height="550" alt="" loading="lazy" decoding="async"><span><small>Você está aqui</small>${o.name}</span></div>`
    : `<a class="other-card" href="/servicos/${o.slug}/"><img src="${o.image}" width="1100" height="550" alt="" loading="lazy" decoding="async"><span><small>Ver a frente</small>${o.name}</span></a>`).join('');
  const html = head({
    title: s.title, description: s.description, path,
    jsonld: { '@context': 'https://schema.org', '@type': 'Service', name: s.title.split(' | ')[0], description: s.description, url: `https://ladunastudio.com.br${path}`, areaServed: 'BR', provider: { '@type': 'ProfessionalService', name: 'LADUNA Studio', url: 'https://ladunastudio.com.br/' } },
  }) + `
  <main id="conteudo">
    <section class="page-hero svc-hero">
      <div class="aurora" aria-hidden="true"><i></i><i></i></div>
      <div class="shell svc-hero-grid">
        <div class="svc-copy">
          <p class="crumbs"><a href="${HOME}">Início</a> / <a href="${HOME}#servicos">Serviços</a> / ${s.name}</p>
          <h1 class="kinetic" data-split>${s.h1}</h1>
          <p class="lead">${s.lead}</p>
          <div class="actions">
            <a class="btn btn-light" href="${HOME}#contato" data-track="click_cta" data-place="servico-${s.slug}">Solicitar diagnóstico</a>
            <a class="btn btn-ghost" href="${wa(text)}" target="_blank" rel="noopener" data-track="click_whatsapp" data-place="servico-${s.slug}">Falar no WhatsApp</a>
          </div>
        </div>
        <div class="svc-visual" data-parallax aria-hidden="true">
          <span class="svc-ring"></span><span class="svc-ring"></span>
          <figure class="svc-photo"><img src="${s.image}" width="1100" height="550" alt="" fetchpriority="high"></figure>
          <div class="svc-float">${minis[s.slug]}</div>
          ${s.chips.map((c, i) => `<span class="svc-chip svc-chip-${i}">${c}</span>`).join('')}
        </div>
      </div>
    </section>

    <section class="section pains">
      <div class="shell">
        <div class="section-head" data-reveal>
          <div><p class="eyebrow dark">Sinais</p><h2>Você reconhece algum destes?</h2></div>
          <p>São os pontos que esta frente resolve. Se um deles aparece no seu dia a dia, vale começar por aqui.</p>
        </div>
        <ul class="signals">${s.signals.map(x => `<li data-reveal>${check}<span>${x}</span></li>`).join('')}</ul>
      </div>
    </section>

    <section class="section ba">
      <div class="shell ba-grid">
        <div class="ba-copy" data-reveal>
          <p class="eyebrow dark">Antes e depois</p>
          <h2>${s.ba.title}</h2>
          <p>${s.ba.text}</p>
          <div class="ba-switch" role="group" aria-label="Comparar"><button type="button" data-ba="antes" aria-pressed="true">Sem direção</button><button type="button" data-ba="depois" aria-pressed="false">Com direção</button></div>
          <ul class="ba-changes">${s.ba.changes.map(c => `<li>${check}<span>${c}</span></li>`).join('')}</ul>
        </div>
        <figure class="ba-stage" data-state="antes" data-reveal aria-label="Ilustração: ${s.name.toLowerCase()} sem direção e com direção">${mocks[s.slug]}<figcaption>Ilustração</figcaption></figure>
      </div>
    </section>

    <section class="section">
      <div class="shell">
        <div class="section-head" data-reveal>
          <div><p class="eyebrow dark">O que entregamos</p><h2>O que está dentro de ${s.name}.</h2></div>
          <p>O escopo de cada projeto é definido no diagnóstico, conforme o momento da marca.</p>
        </div>
        <div class="deliver">${s.deliver.map(([ic, t, p], i) => `<article data-reveal><span class="deliver-num">0${i + 1}</span><span class="deliver-icon">${icons[ic]}</span><h3>${t}</h3><p>${p}</p></article>`).join('')}</div>
      </div>
    </section>

    <section class="section tint" id="metodo">
      <div class="shell method">
        <div class="method-head" data-reveal>
          <p class="eyebrow dark">Como funciona</p>
          <h2>Do diagnóstico ao resultado.</h2>
          <figure class="method-figure"><img data-step-image src="${steps[0][0]}" width="640" height="640" alt="" loading="lazy" decoding="async"></figure>
        </div>
        <ol class="steps" id="steps">${steps.map(([img, t, p], i) => `<li data-image="${img}"><span>0${i + 1}</span><h3>${t}</h3><p>${p}</p></li>`).join('')}</ol>
      </div>
    </section>

    <section class="section">
      <div class="shell" style="display:grid;gap:56px">
        <div class="page-cta" data-reveal>
          <div class="client-rings" aria-hidden="true"><i></i><i></i><b></b></div>
          <div><h2>Vamos ver se ${s.name} é o seu próximo passo?</h2><p style="margin-top:12px">O diagnóstico mostra por onde começar, mesmo que a resposta seja outra frente.</p></div>
          <a class="btn btn-light" href="${HOME}#contato" data-track="click_cta" data-place="servico-${s.slug}-fim">Solicitar diagnóstico</a>
        </div>
        <div class="other">${others}</div>
      </div>
    </section>
  </main>
` + foot(text);
  writeFileSync(`${out}/servicos/${s.slug}/index.html`, html);
}

// Privacy policy. Draft written by Claude; needs Joel's (and ideally a lawyer's) review before launch.
const privacy = head({ title: 'Política de privacidade | LADUNA Studio', description: 'Como a LADUNA Studio trata os dados enviados pelo site.', path: '/privacidade/' }) + `
  <main id="conteudo">
    <section class="page-hero">
      <div class="aurora" aria-hidden="true"><i></i><i></i></div>
      <div class="shell">
        <p class="crumbs"><a href="${HOME}">Início</a> / Privacidade</p>
        <h1>Política de privacidade</h1>
        <p class="lead">Como tratamos os dados que você envia pelo site. Atualizada em novembro de 2026.</p>
      </div>
    </section>
    <section class="section">
      <div class="shell legal">
        <h2>Quem somos</h2>
        <p>${wm} Studio, CNPJ 64.110.259/0001-78, responsável pelo site ladunastudio.com.br. Contato sobre privacidade: <a class="text-link" href="mailto:ladunastudio@gmail.com">ladunastudio@gmail.com</a>.</p>
        <h2>Quais dados coletamos</h2>
        <ul>
          <li>No formulário de diagnóstico: nome, WhatsApp, empresa ou perfil, objetivo e a mensagem que você escrever.</li>
          <li>Junto com o formulário: a página de onde veio o contato e a origem da visita (por exemplo, o nome de uma campanha), para sabermos quais canais funcionam.</li>
          <li>Se você aceitar os cookies de medição: dados de navegação coletados pelo Google Analytics e pelo Pixel da Meta, como páginas vistas e cliques.</li>
        </ul>
        <h2>Para que usamos</h2>
        <ul>
          <li>Responder ao seu contato, fazer o diagnóstico e enviar uma proposta.</li>
          <li>Entender quais páginas e campanhas trazem contatos, para melhorar o site e os anúncios.</li>
        </ul>
        <p>Não vendemos seus dados e não os usamos para outros fins sem avisar.</p>
        <h2>Com quem compartilhamos</h2>
        <p>Com os serviços que fazem o site funcionar: a hospedagem do site e dos formulários (Netlify), o WhatsApp, onde a conversa continua, e, se você aceitar os cookies, Google e Meta.</p>
        <h2>Por quanto tempo guardamos</h2>
        <p>Enquanto houver relação comercial ou interesse em retomar a conversa. Você pode pedir a exclusão a qualquer momento.</p>
        <h2>Seus direitos</h2>
        <p>Pela Lei Geral de Proteção de Dados (Lei 13.709/2018), você pode pedir acesso, correção, exclusão ou informação sobre o uso dos seus dados, e retirar o consentimento dos cookies. Basta escrever para o e-mail acima.</p>
        <h2>Cookies</h2>
        <p>Os cookies de medição só são ativados depois que você clica em "Aceitar". Se recusar, o site continua funcionando normalmente.</p>
      </div>
    </section>
  </main>
` + foot('Olá! Vim do site da LADUNA.');
writeFileSync(`${out}/privacidade/index.html`, privacy);
console.log('ok');
