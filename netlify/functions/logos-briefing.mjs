// Recebe o briefing de logo de /logos/ e envia para o e-mail da LADUNA, com o PDF em anexo.
// O PDF é gerado no navegador; aqui só se confere tamanho, formato e campos, e se repassa ao serviço de e-mail (Resend).
// Variáveis no Netlify (as duas primeiras são obrigatórias; sem elas a página segue pelo WhatsApp):
//   RESEND_API_KEY  chave do serviço de e-mail
//   BRIEFING_TO     endereço que recebe os briefings
//   BRIEFING_FROM   remetente (padrão: remetente de teste do Resend, que só entrega para o dono da conta)

const FROM = process.env.BRIEFING_FROM || 'Briefing de logo <onboarding@resend.dev>';
const ORIGINS = /^https:\/\/((www\.)?ladunastudio\.com\.br|laduna\.netlify\.app|[a-z0-9-]+--laduna\.netlify\.app)$/;
const MAX_PDF = 900 * 1024, MAX_CARD = 700 * 1024;
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const json = (status, body) => new Response(JSON.stringify(body), {
  status,
  headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' }
});
const clean = (s, max) => String(s ?? '').replace(/[\u0000-\u0008\u000B-\u001F\u007F]/g, '').trim().slice(0, max);

export default async (req) => {
  const key = process.env.RESEND_API_KEY, to = process.env.BRIEFING_TO;
  // GET só diz se o envio por e-mail está ligado (a página cai no WhatsApp se não estiver)
  if (req.method === 'GET') return json(200, { ready: Boolean(key && to) });
  if (req.method !== 'POST') return json(405, { error: 'Use POST.' });
  if (!key || !to) return json(503, { error: 'Envio por e-mail ainda não configurado.' });
  const origin = req.headers.get('origin') || '';
  if (!ORIGINS.test(origin)) return json(403, { error: 'Origem não permitida.' });

  let input;
  try { input = await req.json(); } catch { return json(400, { error: 'Pedido inválido.' }); }
  if (input?.site) return json(200, { ok: true });                       // campo-isca preenchido: robô; finge sucesso

  const id = clean(input?.id, 40);
  const marca = clean(input?.marca, 80) || 'Nome em definição';
  const nome = clean(input?.contato?.nome, 60);
  const fone = clean(input?.contato?.fone, 20);
  if (!/^[a-z0-9-]{8,40}$/i.test(id)) return json(400, { error: 'Identificador inválido.' });
  if (nome.length < 2 || !/^\d{10,13}$/.test(fone.replace(/\D/g, ''))) return json(400, { error: 'Contato inválido.' });
  if (!Array.isArray(input?.linhas) || input.linhas.length < 3 || input.linhas.length > 20) return json(400, { error: 'Respostas inválidas.' });
  const linhas = input.linhas.map(l => [clean(l?.[0], 60), clean(l?.[1], 700)]).filter(l => l[0] && l[1]);

  const pdf = typeof input?.pdf === 'string' ? input.pdf : '';
  if (!/^[A-Za-z0-9+/]+=*$/.test(pdf) || pdf.length > MAX_PDF * 1.4) return json(400, { error: 'Arquivo inválido.' });
  const bytes = Buffer.from(pdf, 'base64');
  if (bytes.length > MAX_PDF || bytes.subarray(0, 5).toString('latin1') !== '%PDF-') return json(400, { error: 'Arquivo inválido.' });

  // Cartão "ponto de partida" (JPEG) vai dentro do corpo do e-mail; é opcional (sem ele, o e-mail sai só com o PDF).
  let card = null;
  if (typeof input?.cartao === 'string' && input.cartao) {
    if (!/^[A-Za-z0-9+/]+=*$/.test(input.cartao) || input.cartao.length > MAX_CARD * 1.4) return json(400, { error: 'Imagem inválida.' });
    const cb = Buffer.from(input.cartao, 'base64');
    if (cb.length > MAX_CARD || cb[0] !== 0xFF || cb[1] !== 0xD8) return json(400, { error: 'Imagem inválida.' });
    card = cb;
  }

  const slug = marca.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40).replace(/^-+|-+$/g, '') || 'marca';
  const html = `<div style="font-family:Arial,Helvetica,sans-serif;color:#3F3F3F;max-width:560px;margin:0 auto">
    <p style="font-size:12px;letter-spacing:2px;color:#644370;font-weight:bold;margin:0 0 6px">NOVO BRIEFING DE LOGO</p>
    <h1 style="font-size:24px;margin:0 0 4px">${esc(marca)}</h1>
    <p style="margin:0 0 18px;font-size:14px">${esc(nome)} · WhatsApp ${esc(fone)}</p>
    ${card ? '<img src="cid:cartao" alt="Cartão do briefing" width="520" style="display:block;width:100%;max-width:520px;height:auto;border-radius:24px;margin:0 0 20px">' : ''}
    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;font-size:14px">${linhas.map(([k, v]) => `<tr><td style="padding:8px 12px 8px 0;border-top:1px solid #e2e2e2;color:#644370;font-size:11px;font-weight:bold;text-transform:uppercase;vertical-align:top;width:150px">${esc(k)}</td><td style="padding:8px 0;border-top:1px solid #e2e2e2;vertical-align:top">${esc(v)}</td></tr>`).join('')}</table>
    <p style="margin:20px 0 0;font-size:12px;color:#777">O briefing completo está no PDF em anexo.</p></div>`;
  const text = [`Novo briefing de logo: ${marca}`, '', `Contato: ${nome} · WhatsApp ${fone}`, '', ...linhas.map(([k, v]) => `${k}: ${v}`), '', 'O briefing completo está no PDF em anexo.'].join('\n');

  let r;
  try {
    r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', 'Idempotency-Key': `logos-${id}`, 'User-Agent': 'site-briefing/1.0' },
      body: JSON.stringify({ from: FROM, to: [to], subject: `Briefing de logo — ${marca}`, html, text, attachments: [{ filename: `briefing-logo-${slug}.pdf`, content: bytes.toString('base64') }].concat(card ? [{ filename: `cartao-${slug}.jpg`, content: card.toString('base64'), content_id: 'cartao' }] : []) })
    });
  } catch { return json(502, { error: 'Não foi possível enviar agora.' }); }
  if (!r.ok) { console.error('logos-briefing: e-mail recusado', r.status); return json(502, { error: 'Não foi possível enviar agora.' }); }
  return json(200, { ok: true });
};
