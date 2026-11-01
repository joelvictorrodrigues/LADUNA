export default async () => {
  const supabaseUrl = process.env.SUPABASE_URL || '';
  const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY || '';
  const ready = Boolean(supabaseUrl && publishableKey);

  return new Response(JSON.stringify({
    ready,
    supabaseUrl: ready ? supabaseUrl : '',
    publishableKey: ready ? publishableKey : '',
    message: ready ? '' : 'As variáveis públicas do Supabase ainda não foram adicionadas ao Netlify.'
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store, max-age=0',
      'X-Content-Type-Options': 'nosniff'
    }
  });
};
