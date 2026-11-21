// Cria (ou reaproveita) um link de pagamento do Asaas para os planos das TVs.
// O preço é calculado aqui no servidor; o navegador só informa plano, meses e forma de pagamento.
// Variáveis no Netlify: ASAAS_API_KEY (obrigatória) e ASAAS_ENV ("sandbox" para teste; padrão: produção).

const PLANS = {
  promo: { name: 'Promo Black', perMonth: 94.5, step: 2, min: 2, subscription: false, endDate: '2026-12-10' },
  essencial: { name: 'Essencial', perMonth: 200, step: 1, min: 1, subscription: true },
  completo: { name: 'Completo', perMonth: 350, step: 1, min: 1, subscription: true }
};
const MAX_MONTHS = 60;
const SITE = 'https://ladunastudio.com.br';

const json = (status, body) => new Response(JSON.stringify(body), {
  status,
  headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' }
});

const videoText = (planId, months) =>
  planId === 'completo' || (planId === 'promo' && months >= 6)
    ? 'A LADUNA cria o seu vídeo (até 2 dias úteis).'
    : 'Você envia o vídeo pronto, de até 1 minuto.';

export default async (req) => {
  const key = process.env.ASAAS_API_KEY;
  // GET só responde se o pagamento online está ligado (o site esconde o botão se não estiver)
  if (req.method === 'GET') return json(200, { ready: Boolean(key) });
  if (req.method !== 'POST') return json(405, { error: 'Use POST.' });

  if (!key) return json(503, { error: 'Pagamento online ainda não configurado.' });
  const base = process.env.ASAAS_ENV === 'sandbox' ? 'https://api-sandbox.asaas.com/v3' : 'https://api.asaas.com/v3';

  let input;
  try { input = await req.json(); } catch { return json(400, { error: 'Pedido inválido.' }); }
  const plan = PLANS[input?.plan];
  const months = Number(input?.months);
  const mode = input?.mode === 'mensal' ? 'mensal' : 'pacote';
  if (!plan) return json(400, { error: 'Plano inválido.' });
  if (!Number.isInteger(months) || months < plan.min || months > MAX_MONTHS || months % plan.step) return json(400, { error: 'Quantidade de meses inválida.' });
  if (mode === 'mensal' && !plan.subscription) return json(400, { error: 'Este plano não tem assinatura mensal.' });
  if (plan.endDate && Date.now() > new Date(`${plan.endDate}T23:59:59-04:00`).getTime()) return json(410, { error: 'A Promo Black já terminou.' });

  const headers = { access_token: key, 'Content-Type': 'application/json', 'User-Agent': 'LADUNA-Site/1.0' };
  // "v2": links criados depois da chave Pix (os antigos não mostram Pix)
  const ref = mode === 'mensal' ? `tvs2-${input.plan}-mensal-cartao` : `tvs2-${input.plan}-${months}m`;
  const period = `${months} ${months === 1 ? 'mês' : 'meses'}`;

  // Reaproveita o link se ele já existir (um por plano + período)
  try {
    const r = await fetch(`${base}/paymentLinks?active=true&externalReference=${encodeURIComponent(ref)}&limit=1`, { headers });
    if (r.ok) {
      const found = (await r.json())?.data?.[0];
      if (found?.url && !found.deleted) return json(200, { url: found.url });
    }
  } catch { /* segue e cria um novo */ }

  const value = mode === 'mensal' ? plan.perMonth : Math.round(plan.perMonth * months * 100) / 100;
  const body = mode === 'mensal'
    ? {
        name: `Anúncio nas TVs PowerFit · ${plan.name} · assinatura mensal`,
        description: `Seu vídeo nas 4 telas de 75 polegadas da academia PowerFit. Cobrança automática no cartão de crédito todo mês. Para cancelar, é só falar com a LADUNA no WhatsApp (66) 99636-1345. ${videoText(input.plan, months)}`,
        billingType: 'CREDIT_CARD', chargeType: 'RECURRENT', subscriptionCycle: 'MONTHLY', value, dueDateLimitDays: 3
      }
    : {
        name: `Anúncio nas TVs PowerFit · ${plan.name} · ${period}`,
        description: `Seu vídeo nas 4 telas de 75 polegadas da academia PowerFit por ${period}, a partir da data do pagamento. ${videoText(input.plan, months)}`,
        billingType: 'UNDEFINED', chargeType: 'INSTALLMENT', maxInstallmentCount: 12, value, dueDateLimitDays: 3
      };
  body.externalReference = ref;
  body.notificationEnabled = true;
  if (plan.endDate) body.endDate = plan.endDate;

  const create = async (withCallback) => {
    const b = withCallback ? { ...body, callback: { successUrl: `${SITE}/tvs/obrigado/`, autoRedirect: true } } : body;
    const r = await fetch(`${base}/paymentLinks`, { method: 'POST', headers, body: JSON.stringify(b) });
    return { ok: r.ok, status: r.status, data: await r.json().catch(() => ({})) };
  };

  try {
    let res = await create(true);
    // Se o Asaas recusar a página de obrigado (domínio não cadastrado na conta), cria sem ela.
    if (!res.ok && res.status === 400) res = await create(false);
    if (res.ok && res.data?.url) return json(200, { url: res.data.url });
    const msg = res.data?.errors?.[0]?.description || `Erro ${res.status}`;
    console.error('Asaas recusou o link:', res.status, msg);
    return json(502, { error: 'Não foi possível abrir o pagamento agora.' });
  } catch (e) {
    console.error('Falha ao falar com o Asaas:', e?.message);
    return json(502, { error: 'Não foi possível abrir o pagamento agora.' });
  }
};
