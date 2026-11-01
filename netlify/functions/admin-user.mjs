const json = (payload, status = 200) => new Response(JSON.stringify(payload), {
  status,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store, max-age=0',
    'X-Content-Type-Options': 'nosniff'
  }
});

const safeJson = async (response) => {
  const text = await response.text();
  try { return text ? JSON.parse(text) : {}; }
  catch (error) { return { message: text || 'Resposta inválida do serviço de autenticação.' }; }
};

export default async (request) => {
  if (!['POST', 'PATCH'].includes(request.method)) return json({ message: 'Método não permitido.' }, 405);

  const supabaseUrl = process.env.SUPABASE_URL || '';
  const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY || '';
  const secretKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  if (!supabaseUrl || !publishableKey || !secretKey) return json({ message: 'A infraestrutura do portal não está configurada.' }, 503);
  const elevatedHeaders = secretKey.startsWith('sb_secret_')
    ? { apikey: secretKey }
    : { apikey: secretKey, Authorization: `Bearer ${secretKey}` };

  const authorization = request.headers.get('authorization') || '';
  if (!authorization.startsWith('Bearer ')) return json({ message: 'Sessão administrativa ausente.' }, 401);

  const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: { apikey: publishableKey, Authorization: authorization }
  });
  const signedUser = await safeJson(userResponse);
  if (!userResponse.ok || !signedUser?.id) return json({ message: 'Sessão expirada ou inválida.' }, 401);

  const adminResponse = await fetch(`${supabaseUrl}/rest/v1/profiles?id=eq.${encodeURIComponent(signedUser.id)}&role=eq.admin&active=eq.true&select=id`, {
    headers: elevatedHeaders
  });
  const adminRows = await safeJson(adminResponse);
  if (!adminResponse.ok || !Array.isArray(adminRows) || !adminRows.length) return json({ message: 'Esta operação exige acesso administrativo.' }, 403);

  let body;
  try { body = await request.json(); }
  catch (error) { return json({ message: 'Dados inválidos.' }, 400); }

  if (request.method === 'PATCH') {
    const userId = String(body.userId || '');
    const password = String(body.password || '');
    if (!/^[0-9a-f-]{36}$/i.test(userId)) return json({ message: 'Usuário inválido.' }, 400);
    if (password.length < 10) return json({ message: 'A senha precisa ter pelo menos 10 caracteres.' }, 400);

    const updateResponse = await fetch(`${supabaseUrl}/auth/v1/admin/users/${encodeURIComponent(userId)}`, {
      method: 'PUT',
      headers: {
        ...elevatedHeaders,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ password })
    });
    const updated = await safeJson(updateResponse);
    if (!updateResponse.ok) return json({ message: updated.msg || updated.message || 'Não foi possível atualizar a senha.' }, updateResponse.status);
    return json({ success: true });
  }

  const email = String(body.email || '').trim().toLowerCase();
  const password = String(body.password || '');
  const fullName = String(body.fullName || '').trim();
  const organizationId = String(body.organizationId || '');
  if (!/^\S+@\S+\.\S+$/.test(email)) return json({ message: 'Informe um e-mail válido.' }, 400);
  if (password.length < 10) return json({ message: 'A senha precisa ter pelo menos 10 caracteres.' }, 400);
  if (fullName.length < 2) return json({ message: 'Informe o nome do usuário.' }, 400);
  if (!/^[0-9a-f-]{36}$/i.test(organizationId)) return json({ message: 'Selecione uma empresa válida.' }, 400);

  const organizationResponse = await fetch(`${supabaseUrl}/rest/v1/organizations?id=eq.${encodeURIComponent(organizationId)}&select=id&limit=1`, {
    headers: elevatedHeaders
  });
  const organizations = await safeJson(organizationResponse);
  if (!organizationResponse.ok || !organizations?.length) return json({ message: 'A empresa selecionada não existe.' }, 400);

  const createResponse = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
    method: 'POST',
    headers: {
      ...elevatedHeaders,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName }
    })
  });
  const createdPayload = await safeJson(createResponse);
  const createdUser = createdPayload.user || createdPayload;
  if (!createResponse.ok || !createdUser?.id) return json({ message: createdPayload.msg || createdPayload.message || 'Não foi possível criar o usuário.' }, createResponse.status);

  try {
    const profileResponse = await fetch(`${supabaseUrl}/rest/v1/profiles?on_conflict=id`, {
      method: 'POST',
      headers: {
        ...elevatedHeaders,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates,return=minimal'
      },
      body: JSON.stringify({ id: createdUser.id, email, full_name: fullName, role: 'client', active: true })
    });
    if (!profileResponse.ok) throw new Error('Falha ao registrar o perfil.');

    const membershipResponse = await fetch(`${supabaseUrl}/rest/v1/memberships?on_conflict=user_id,organization_id`, {
      method: 'POST',
      headers: {
        ...elevatedHeaders,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates,return=minimal'
      },
      body: JSON.stringify({ user_id: createdUser.id, organization_id: organizationId, role: 'client_admin' })
    });
    if (!membershipResponse.ok) throw new Error('Falha ao vincular o usuário à empresa.');
  } catch (error) {
    await fetch(`${supabaseUrl}/auth/v1/admin/users/${encodeURIComponent(createdUser.id)}`, {
      method: 'DELETE',
      headers: { ...elevatedHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ should_soft_delete: false })
    });
    return json({ message: 'O acesso não foi concluído. Nenhum usuário foi mantido.' }, 500);
  }

  return json({ id: createdUser.id, email, full_name: fullName, role: 'client', active: true, organization_id: organizationId }, 201);
};
