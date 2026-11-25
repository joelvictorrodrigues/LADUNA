// Recebe o briefing de logo de /logos/ e envia para o e-mail da LADUNA, com o PDF em anexo.
// O PDF é gerado no navegador; aqui só se confere tamanho, formato e campos, e se repassa ao serviço de e-mail (Resend).
// Variáveis no Netlify (as duas primeiras são obrigatórias; sem elas a página segue pelo WhatsApp):
//   RESEND_API_KEY  chave do serviço de e-mail
//   BRIEFING_TO     endereço que recebe os briefings
//   BRIEFING_FROM   remetente (padrão: remetente de teste do Resend, que só entrega para o dono da conta)

const FROM = process.env.BRIEFING_FROM || 'Briefing de logo <onboarding@resend.dev>';
const ORIGINS = /^https:\/\/((www\.)?ladunastudio\.com\.br|laduna\.netlify\.app|[a-z0-9-]+--laduna\.netlify\.app)$/;
const MAX_PDF = 400 * 1024;

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

  const slug = marca.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40).replace(/^-+|-+$/g, '') || 'marca';
  const text = [`Novo briefing de logo: ${marca}`, '', `Contato: ${nome} · WhatsApp ${fone}`, '', ...linhas.map(([k, v]) => `${k}: ${v}`), '', 'O briefing completo está no PDF em anexo.'].join('\n');

  let r;
  try {
    r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', 'Idempotency-Key': `logos-${id}`, 'User-Agent': 'site-briefing/1.0' },
      body: JSON.stringify({ from: FROM, to: [to], subject: `Briefing de logo — ${marca}`, text, attachments: [{ filename: `briefing-logo-${slug}.pdf`, content: bytes.toString('base64') }] })
    });
  } catch { return json(502, { error: 'Não foi possível enviar agora.' }); }
  if (!r.ok) { console.error('logos-briefing: e-mail recusado', r.status); return json(502, { error: 'Não foi possível enviar agora.' }); }
  return json(200, { ok: true });
};
