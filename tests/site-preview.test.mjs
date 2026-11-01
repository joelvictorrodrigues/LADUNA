import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../frontend/public');
const html = readFileSync(resolve(root, 'index.html'), 'utf8');
const js = readFileSync(resolve(root, 'assets/site.js'), 'utf8');
const css = readFileSync(resolve(root, 'assets/site.css'), 'utf8');

test('public identity and metadata use the new domain', () => {
  assert.match(html, /rel="canonical" href="https:\/\/ladunastudio\.com\.br\/"/);
  assert.doesNotMatch(html, /https:\/\/ladunastudio\.com\//);
  assert.doesNotMatch(html, /Peixoto de Azevedo|Wanjo|10 marcas|4 planos|—|dia.das.m[aã]es/i);
  assert.doesNotMatch(js, /dia.das.m[aã]es/i);
  assert.match(html, /assets\/laduna-logo-horizontal\.png/);
  const schema = JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
  assert.equal(schema.url, 'https://ladunastudio.com.br/');
});

test('local links, images, scripts and anchors resolve', () => {
  const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]));
  for (const match of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
    const value = match[1];
    if (value.startsWith('#')) assert.ok(ids.has(value.slice(1)), `Missing anchor ${value}`);
    if (value.startsWith('/')) {
      const path = value.split(/[?#]/)[0];
      assert.ok(existsSync(resolve(root, '.' + path, ...(path.endsWith('/') ? ['index.html'] : []))), `Missing file ${path}`);
    }
  }
});

test('content landmarks, forms and modal controls remain accessible', () => {
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.match(html, /<main id="conteudo">/);
  assert.match(html, /aria-controls="navigation"/);
  assert.match(html, /aria-expanded="false"/);
  assert.match(html, /<fieldset/);
  assert.match(html, /id="formStatus" role="status"/);
  assert.match(html, /id="messageDialog" aria-labelledby="messageTitle"/);
  assert.match(css, /prefers-reduced-motion:reduce/);
  assert.match(css, /transition-delay:var\(--reveal-delay,0ms\)/);
  assert.match(js, /Math\.min\(index, 4\) \* 75/);
  assert.match(js, /revealPassedElements/);
  assert.match(css, /translateY\(36px\) scale\(\.98\);filter:blur\(3px\)/);
  assert.match(html, /site\.js\?v=20261101-scroll-2/);
});

test('diagnosis requires review and does not auto-submit to WhatsApp', () => {
  assert.doesNotMatch(js, /window\.location|fetch\(|localStorage/);
  assert.match(js, /messageDialog\.showModal\(\)/);
  assert.match(js, /encodeURIComponent\(message\)/);
  assert.match(js, /data\.getAll\('need'\)/);
  assert.match(js, /setCustomValidity/);
  assert.match(html, /id="sendDiagnosis"/);
});

test('responsive menu shares its breakpoint with JavaScript', () => {
  assert.match(css, /@media\(max-width:960px\)/);
  assert.match(js, /matchMedia\('\(max-width:960px\)'\)/);
  assert.match(css, /width:calc\(100% - 40px\)/);
  assert.doesNotMatch(css, /font-size:[^;}]*vw/);
});

test('portal exists and demo cannot activate on a public hostname', () => {
  assert.ok(existsSync(resolve(root, 'portal/index.html')));
  const api = readFileSync(resolve(root, 'portal/api.js'), 'utf8');
  assert.match(api, /params\.get\('demo'\) === '1' && localPreview/);
  assert.match(api, /\['localhost', '127\.0\.0\.1'\]/);
});

test('hero CTAs and process visuals are present while client list stays private', () => {
  assert.doesNotMatch(html, /Marcas atendidas|UPSEG Distribuidora|UPSMART Segurança|MESHOP|Laboratório São Sebastião|ME FITNESS|Karine Alcantara|Churrascada|Master Embalagens|Todos os perfis|#portfolio/);
  assert.match(html, /class="btn" href="#diagnostico"><span>Solicitar diagnóstico de marketing<\/span>/);
  assert.match(html, /class="btn btn-secondary" href="https:\/\/www\.instagram\.com\/ladunastudio\//);
  assert.match(html, /Como trabalhamos/);
  assert.match(html, /site\.css\?v=20261101-scroll-2/);
  assert.match(html, /assets\/process-understand-v3\.jpg[\s\S]*assets\/process-direction\.jpg[\s\S]*assets\/method-communicate-v2\.jpg[\s\S]*assets\/process-review\.jpg/);
  assert.ok(existsSync(resolve(root, 'assets/process-understand-v3.jpg')));
  assert.ok(existsSync(resolve(root, 'assets/method-communicate-v2.jpg')));
  assert.match(css, /width:260px;min-width:0;min-height:42px;padding:8px 10px;border:1px solid var\(--laduna-purple\);border-radius:4px;background:var\(--laduna-off-white\);color:var\(--laduna-purple\);font-size:13px;white-space:nowrap;box-shadow:none/);
  assert.match(css, /\.hero-actions \.btn::before\{content:none\}/);
  assert.match(css, /\.hero-actions \.btn:hover\{transform:translateY\(-1px\);background:var\(--laduna-purple\);color:var\(--white\);border-color:var\(--laduna-purple\);box-shadow:none\}/);
  assert.doesNotMatch(css, /\.hero-actions \.btn-secondary\{/);
  assert.match(css, /\.method-visual img\{width:100%;height:100%;object-fit:cover/);
});

test('marketing challenges follow the process section and include twelve illustrated issues', () => {
  const process = html.indexOf('id="metodo"');
  const challenges = html.indexOf('id="desafios"');
  const services = html.indexOf('id="servicos"');
  assert.ok(process < challenges && challenges < services);
  const section = html.slice(challenges, services);
  assert.equal((section.match(/class="problem reveal"/g) || []).length, 12);
  assert.equal((section.match(/data-scene="\d+"/g) || []).length, 12);
  assert.ok(existsSync(resolve(root, 'assets/marketing-problems-sprite.jpg')));
  assert.ok(existsSync(resolve(root, 'assets/problem-trust.jpg')));
  assert.ok(existsSync(resolve(root, 'assets/problem-followup.jpg')));
  for (const title of ['Oferta pouco clara', 'Valor difícil de perceber', 'Marca sem diferenciação', 'Público errado', 'Conteúdo sem direção', 'Difícil de encontrar', 'Presença irregular', 'Interesse sem ação', 'Anúncios sem acompanhamento', 'Sem análise para melhorar', 'Pouca prova de confiança', 'Contatos sem retorno']) {
    assert.ok(section.includes(title), `Missing marketing challenge: ${title}`);
  }
  assert.match(html, /site\.css\?v=20261101-scroll-2/);
  assert.match(css, /--laduna-lilac:#F1EDF4/);
  assert.match(css, /\.problem-image\{aspect-ratio:4\/3;margin:0 0 16px;background-image:url\('\/assets\/marketing-problems-sprite\.jpg'\);background-size:400% 300%/);
  assert.match(css, /\.problems\{background:var\(--laduna-lilac\)\}/);
  assert.match(css, /@media\(max-width:960px\)\{\.problems-grid\{grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
  assert.match(css, /@media\(max-width:700px\)\{\.problems-grid\{grid-template-columns:repeat\(3,minmax\(0,1fr\)\)/);
  assert.match(css, /@media\(max-width:360px\)\{\.problems-grid\{grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
  assert.match(section, /Isso acontece com você\?/);
  assert.match(section, /Atendemos empresas e profissionais de todas as áreas/);
  assert.doesNotMatch(section, /sua empresa|sua empresa oferece/i);
});

test('services explain three client needs with inclusive copy and direct WhatsApp paths', () => {
  const section = html.slice(html.indexOf('id="servicos"'), html.indexOf('id="contato"'));
  assert.match(section, /O que sua marca precisa para avançar\?/);
  assert.match(section, /Atendemos empresas e profissionais/);
  assert.equal((section.match(/class="service-path(?: service-path-reverse)? reveal"/g) || []).length, 3);
  assert.match(section, /Ser reconhecido pelo valor do seu trabalho/);
  assert.match(section, /Manter uma presença que aproxima as pessoas/);
  assert.match(section, /Atrair clientes e facilitar o próximo passo/);
  for (const image of ['services-recognition-building.jpg', 'services-communication.jpg', 'services-growth-social.jpg']) {
    assert.ok(section.includes(image), `Missing service image: ${image}`);
    assert.ok(existsSync(resolve(root, 'assets', image)), `Missing service image asset: ${image}`);
  }
  assert.doesNotMatch(section, /process-(?:direction|create|review)\.jpg|laduna-dunes-editorial\.png/);
  for (const service of ['identidade visual', 'redes sociais', 'produção audiovisual', 'tráfego pago', 'sites e landing pages']) {
    assert.ok(section.toLowerCase().includes(service), `Missing service: ${service}`);
  }
  assert.equal((section.match(/href="https:\/\/wa\.me\/5566996361345"/g) || []).length, 3);
  assert.doesNotMatch(section, /<details class="service-detail"/);
  assert.match(css, /#servicos\{scroll-margin-top:108px\}/);
  assert.match(css, /\.services-section\{padding-bottom:24px\}/);
  assert.match(css, /\.services-section\+\.contact\{padding-top:24px\}/);
  assert.match(css, /\.service-path-reverse \.service-path-image\{grid-column:2;grid-row:1\}/);
  assert.match(css, /@media\(max-width:800px\)[\s\S]*\.service-path,.service-path-reverse\{grid-template-columns:minmax\(0,1fr\);gap:22px\}/);
});

test('footer highlights Instagram and contact methods without decorative arrows', () => {
  const footer = html.slice(html.indexOf('<footer>'));
  assert.match(footer, /class="footer-contact" href="https:\/\/www\.instagram\.com\/ladunastudio\//);
  assert.match(footer, /class="footer-icon" viewBox="0 0 24 24" aria-hidden="true"/);
  assert.match(footer, /<span>@ladunastudio<\/span>/);
  assert.doesNotMatch(footer, /↗|→|➜|⟶|⇢/);
  assert.doesNotMatch(css, /\.arrow\{/);
  assert.match(css, /\.footer-contact\{gap:10px\}\.footer-icon\{width:18px;height:18px/);
});

test('contact section pairs the diagnostic form with a human visual and clear next steps', () => {
  const start = html.indexOf('<section class="contact"');
  const end = html.indexOf('<section class="section faq"', start);
  const section = html.slice(start, end);
  assert.match(section, /src="\/assets\/contact-conversation\.jpg"/);
  assert.ok(existsSync(resolve(root, 'assets/contact-conversation.jpg')));
  for (const step of ['Você conta', 'A gente orienta', 'Você decide']) assert.ok(section.includes(step));
  assert.match(section, /id="diagnosticForm"/);
  assert.match(css, /\.contact-visual\{margin:26px 0 20px;aspect-ratio:16\/9/);
  assert.match(css, /\.contact-steps\{display:grid;grid-template-columns:repeat\(3,minmax\(0,1fr\)\)/);
});

test('FAQ section uses the shared lilac background and a dedicated image', () => {
  const start = html.indexOf('<section class="section faq"');
  const end = html.indexOf('</section>', start);
  const section = html.slice(start, end);
  assert.match(section, /src="\/assets\/faq-dunes\.jpg"/);
  assert.ok(existsSync(resolve(root, 'assets/faq-dunes.jpg')));
  assert.match(css, /\.faq\{padding-top:32px;border-top:1px solid var\(--line\)\}/);
  assert.match(css, /\.faq h2\{margin-top:0\}@media\(max-width:700px\)\{\.faq\{padding-top:28px\}\}/);
  assert.match(css, /\.faq-visual\{margin:24px 0 0;aspect-ratio:4\/3/);
});
