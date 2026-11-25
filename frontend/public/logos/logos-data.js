/* Briefing de logo — catálogo. Perguntas, opções, marcas de exemplo e contato ficam aqui.
   IDs são estáveis: mude rótulos à vontade, não mude IDs depois de publicar. */
(() => {
  const CONFIG = {
    version: 3,
    draftKey: 'laduna.logos.rascunho',
    whatsapp: '556696361345',                      // mesmo contato de /planos/ e /tvs/
    privacyUrl: '/privacidade/',
    waMaxUrl: 1800,
    // Logos de marcas famosas: biblioteca Simple Icons, servida pelo jsDelivr. São marcas de terceiros, usadas só como exemplo.
    logoCdn: 'https://cdn.jsdelivr.net/npm/simple-icons@9.21.0/icons/',
    fontsCss: 'https://fonts.googleapis.com/css2?family=Arvo:wght@700&family=Caveat:wght@600&family=Fredoka:wght@600&family=Great+Vibes&family=Montserrat:wght@300..800&family=Oswald:wght@600&family=Playfair+Display:ital,wght@0,500..800;1,500..700&family=Zilla+Slab:wght@500&display=swap'
  };
  const B = (slug, name, hex) => ({ slug, name, hex });

  const MOMENTO = [{ id: 'nova', label: 'Marca nova' }, { id: 'renovacao', label: 'Renovar a que já existe' }, { id: 'definindo', label: 'Ainda não sei' }];

  const PALAVRAS = ['Confiável', 'Acolhedora', 'Sofisticada', 'Ousada', 'Divertida', 'Artesanal', 'Tecnológica', 'Tradicional', 'Moderna', 'Acessível', 'Minimalista', 'Premium']
    .map(label => ({ id: label.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(), label }));

  const TOM = [
    { id: 'presenca', a: 'Discreta', b: 'Chamativa', la: [B('apple', 'Apple'), B('zara', 'Zara')], lb: [B('mcdonalds', 'McDonald\u2019s'), B('burgerking', 'Burger King')] },
    { id: 'epoca', a: 'Clássica', b: 'Moderna', la: [B('porsche', 'Porsche'), B('cocacola', 'Coca-Cola')], lb: [B('airbnb', 'Airbnb'), B('spotify', 'Spotify')] },
    { id: 'humor', a: 'Séria', b: 'Divertida', la: [B('ibm', 'IBM'), B('visa', 'Visa')], lb: [B('duolingo', 'Duolingo'), B('mailchimp', 'Mailchimp')] }
  ];

  const TIPOS = [
    { id: 'logotipo', label: 'Só o nome', desc: 'O nome é o próprio desenho.', brands: [B('cocacola', 'Coca-Cola'), B('visa', 'Visa'), B('sony', 'Sony'), B('zara', 'Zara')] },
    { id: 'monograma', label: 'Iniciais', desc: 'As letras viram a assinatura.', brands: [B('hp', 'HP'), B('ibm', 'IBM'), B('cnn', 'CNN'), B('nasa', 'NASA')] },
    { id: 'letra', label: 'Uma letra só', desc: 'Uma única letra carrega a marca.', brands: [B('netflix', 'Netflix'), B('mcdonalds', 'McDonald\u2019s'), B('google', 'Google'), B('pinterest', 'Pinterest')] },
    { id: 'pictorico', label: 'Figura', desc: 'Um desenho que você reconhece de cara.', brands: [B('apple', 'Apple'), B('twitter', 'Twitter'), B('shell', 'Shell'), B('puma', 'Puma')] },
    { id: 'abstrato', label: 'Forma abstrata', desc: 'Uma forma própria, que sugere uma ideia.', brands: [B('nike', 'Nike'), B('pepsi', 'Pepsi'), B('mitsubishi', 'Mitsubishi'), B('airbnb', 'Airbnb')] },
    { id: 'mascote', label: 'Personagem', desc: 'Um personagem representa a marca.', brands: [B('duolingo', 'Duolingo'), B('mailchimp', 'Mailchimp'), B('reddit', 'Reddit'), B('android', 'Android')] },
    { id: 'emblema', label: 'Selo', desc: 'O nome mora dentro do desenho.', brands: [B('starbucks', 'Starbucks'), B('bmw', 'BMW'), B('porsche', 'Porsche'), B('warnerbros', 'Warner Bros.')] },
    { id: 'combinada', label: 'Nome + símbolo', desc: 'Os dois juntos, e cada um pode andar sozinho.', brands: [B('adidas', 'Adidas'), B('thenorthface', 'The North Face'), B('burgerking', 'Burger King'), B('lg', 'LG')] }
  ];

  const LETRAS = [
    { id: 'serifada', label: 'Serifada', desc: 'Elegante, com tradição.', font: "'Playfair Display'", weight: 600, brands: [B('zara', 'Zara')] },
    { id: 'slab', label: 'Slab', desc: 'Firme, de presença.', font: 'Arvo', weight: 700, brands: [B('sony', 'Sony'), B('ibm', 'IBM')] },
    { id: 'sem-serifa', label: 'Sem serifa', desc: 'Limpa e direta.', font: 'Montserrat', weight: 600, brands: [B('samsung', 'Samsung'), B('ebay', 'eBay')] },
    { id: 'condensada', label: 'Condensada', desc: 'Alta, forte, de impacto.', font: 'Oswald', weight: 600, brands: [B('hbo', 'HBO'), B('cnn', 'CNN')] },
    { id: 'cursiva', label: 'Cursiva', desc: 'Com jeito de assinatura.', font: "'Great Vibes'", weight: 400, big: true, brands: [B('cocacola', 'Coca-Cola')] },
    { id: 'display', label: 'Expressiva', desc: 'Cheia de personalidade.', font: 'Fredoka', weight: 600, brands: [B('nasa', 'NASA'), B('fedex', 'FedEx')] }
  ];

  const CORES = [
    { id: 'neutra', label: 'Neutra', desc: 'Preto, branco e cinzas.', cores: ['#111111', '#5A5A5A', '#BDBDBD', '#F2F2F2'], brands: [B('apple', 'Apple', '#111111'), B('nike', 'Nike', '#111111'), B('zara', 'Zara', '#111111')] },
    { id: 'quente', label: 'Quente', desc: 'Vermelhos, laranjas, amarelos.', cores: ['#8E1B16', '#E4002B', '#F26B21', '#FFC72C'], brands: [B('cocacola', 'Coca-Cola', '#E4002B'), B('burgerking', 'Burger King', '#D62300'), B('mcdonalds', 'McDonald’s', '#F5B700')] },
    { id: 'fria', label: 'Fria', desc: 'Azuis e tons de água.', cores: ['#0A2A66', '#1A5FD0', '#6FB1E6', '#E6F2FB'], brands: [B('visa', 'Visa', '#1A1F71'), B('samsung', 'Samsung', '#1428A0'), B('playstation', 'PlayStation', '#003791')] },
    { id: 'natural', label: 'Natural', desc: 'Verdes e terrosos.', cores: ['#1E3932', '#00704A', '#B79268', '#EFE6D5'], brands: [B('starbucks', 'Starbucks', '#00704A'), B('android', 'Android', '#2E9E57')] },
    { id: 'suave', label: 'Suave', desc: 'Tons claros e delicados.', cores: ['#6E5560', '#F28B9B', '#F9D5C9', '#FBF4EF'], brands: [B('airbnb', 'Airbnb', '#FF5A5F'), B('twitter', 'Twitter', '#1DA1F2')] },
    { id: 'vibrante', label: 'Vibrante', desc: 'Cores fortes, alto contraste.', cores: ['#1B1B3A', '#6B2CF5', '#1ED760', '#FF4500'], brands: [B('spotify', 'Spotify', '#1DB954'), B('reddit', 'Reddit', '#FF4500'), B('duolingo', 'Duolingo', '#58CC02')] }
  ];

  const USOS = [
    { id: 'redes', label: 'Redes sociais', icon: 'M5 4h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1zM12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM16.8 7.2h.01' },
    { id: 'site', label: 'Site', icon: 'M3 5h18v14H3zM3 9h18M6.5 7h.01M9 7h.01' },
    { id: 'embalagem', label: 'Embalagem', icon: 'M12 3l8 4.5v9L12 21l-8-4.5v-9zM12 12l8-4.5M12 12v9M12 12L4 7.5' },
    { id: 'fachada', label: 'Fachada', icon: 'M4 10l1.5-5h13L20 10M5 10v10h14V10M9 20v-6h6v6M4 10h16' },
    { id: 'papelaria', label: 'Cartão e papelaria', icon: 'M3 6h18v12H3zM7 10h5M7 14h8' },
    { id: 'uniforme', label: 'Uniforme', icon: 'M8 3l-5 3 2 4 3-1.5V21h8V8.5L19 10l2-4-5-3c-1 2-7 2-8 0z' },
    { id: 'carimbo', label: 'Carimbo ou gravação', icon: 'M9 3h6v5l2 4v3H7v-3l2-4zM5 19h14M7 15v4M17 15v4' },
    { id: 'video', label: 'Vídeo', icon: 'M3 6h14v12H3zM17 10l4-2.5v9L17 14M8 10v4l3.5-2z' },
    { id: 'veiculo', label: 'Veículo', icon: 'M3 16v-4l2-5h11l3 5h2v4M3 16h18M7 16a2 2 0 1 0 0 .01M17 16a2 2 0 1 0 0 .01' },
    { id: 'anuncios', label: 'Anúncios e outdoor', icon: 'M4 10v4h3l6 4V6l-6 4H4zM16.5 9a4 4 0 0 1 0 6M7 14l1 5h2' }
  ];

  const EVITAR = ['Infantil', 'Fria', 'Genérica', 'Antiquada', 'Agressiva', 'Poluída', 'Séria demais', 'Barata']
    .map(label => ({ id: label.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\s+/g, '-'), label }));

  // Seis partes da barra de progresso; cada tela diz a qual pertence.
  const FASES = ['Sua marca', 'Personalidade', 'Formato', 'Letras e cores', 'No mundo real', 'Envio'];
  const TELAS = [
    { id: 'nome', fase: 0 }, { id: 'negocio', fase: 0 }, { id: 'palavras', fase: 1 }, { id: 'tom', fase: 1 }, { id: 'tipo', fase: 2 },
    { id: 'letras', fase: 3 }, { id: 'cores', fase: 3 }, { id: 'usos', fase: 4 }, { id: 'extras', fase: 4 }, { id: 'contato', fase: 5 }
  ];

  window.LOGOS = { CONFIG, MOMENTO, PALAVRAS, TOM, TIPOS, LETRAS, CORES, USOS, EVITAR, FASES, TELAS };
})();
