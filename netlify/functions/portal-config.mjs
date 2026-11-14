export default async () => {
  const apiKey = process.env.FIREBASE_WEB_API_KEY || process.env.VITE_FIREBASE_API_KEY || 'AIzaSyAgm1elH6M1_LmzbpXzHoqKmcGJuJauCAw';
  const databaseURL = process.env.FIREBASE_DATABASE_URL || process.env.VITE_FIREBASE_DATABASE_URL || 'https://laduna-studio-default-rtdb.firebaseio.com';
  const ready = Boolean(apiKey && databaseURL);

  return new Response(JSON.stringify({
    ready,
    apiKey: ready ? apiKey : '',
    databaseURL: ready ? databaseURL : '',
    message: ready ? '' : 'A conexão do portal com o Firebase ainda não foi adicionada ao Netlify.'
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store, max-age=0',
      'X-Content-Type-Options': 'nosniff'
    }
  });
};
