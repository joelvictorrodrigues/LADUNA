import React from 'react';

export const ClientLogos = () => {
  // Todas as logos organizadas em 6 linhas de 3
  // Tamanho base: 110px altura x 220px largura (+10%)
  // UpSmart, Churrascada, Carla Bianconi: 120px altura x 240px largura (+20%)
  const allLogos = [
    // Linha 1
    {
      id: 1,
      name: "V'Bella",
      logo: "https://customer-assets.emergentagent.com/job_laduna-digital/artifacts/nx4yc5f6_14.png",
      size: 'normal'
    },
    {
      id: 2,
      name: "Master Festa e Embalagens",
      logo: "https://customer-assets.emergentagent.com/job_laduna-digital/artifacts/bafi9m2h_15.png",
      size: 'normal'
    },
    {
      id: 3,
      name: "Churrascada",
      logo: "https://customer-assets.emergentagent.com/job_laduna-digital/artifacts/ltd4m338_17.png",
      size: 'larger' // +20%
    },
    // Linha 2
    {
      id: 4,
      name: "UpSmart",
      logo: "https://customer-assets.emergentagent.com/job_laduna-digital/artifacts/oerrm3tx_UpSmart%20-%20Logotipo.pdf.png",
      size: 'larger' // +20%
    },
    {
      id: 5,
      name: "Acqua & Sabão",
      logo: "https://customer-assets.emergentagent.com/job_laduna-digital/artifacts/gfr304xt_24.png",
      size: 'normal'
    },
    {
      id: 11,
      name: "Compagni Brasil",
      logo: "https://customer-assets.emergentagent.com/job_laduna-digital/artifacts/w47d6bez_25.png",
      size: 'normal'
    },
    // Linha 3
    {
      id: 6,
      name: "ME Fitness",
      logo: "https://customer-assets.emergentagent.com/job_laduna-digital/artifacts/qjqxbhnp_19.png",
      size: 'normal'
    },
    {
      id: 7,
      name: "Logo Caveira",
      logo: "https://customer-assets.emergentagent.com/job_laduna-digital/artifacts/yrylxbzp_20.png",
      size: 'normal'
    },
    {
      id: 8,
      name: "Brasil Gold",
      logo: "https://customer-assets.emergentagent.com/job_laduna-digital/artifacts/x5acsbsw_BRASIL%20GOLD.pdf.png",
      size: 'normal'
    },
    // Linha 4
    {
      id: 9,
      name: "Fisio Trate",
      logo: "https://customer-assets.emergentagent.com/job_laduna-digital/artifacts/gclb0fsn_22.png",
      size: 'normal'
    },
    {
      id: 10,
      name: "ME Mundo dos Esportes",
      logo: "https://customer-assets.emergentagent.com/job_laduna-digital/artifacts/jthie9bn_23.png",
      size: 'normal'
    },
    {
      id: 12,
      name: "Agronegócio Logo",
      logo: "https://customer-assets.emergentagent.com/job_laduna-digital/artifacts/v1fjs3s5_26.png",
      size: 'normal'
    },
    // Linha 5
    {
      id: 13,
      name: "Carla Bianconi",
      logo: "https://customer-assets.emergentagent.com/job_laduna-studio/artifacts/ih7f7k0m_2%20-%20SEM%20FUNDO.png",
      size: 'larger' // +20%
    },
    {
      id: 14,
      name: "Karine Alcantara",
      logo: "https://customer-assets.emergentagent.com/job_laduna-studio/artifacts/x2izh7hz_KARINE%20ALCANTARA%20POSTS.png",
      size: 'normal'
    },
    {
      id: 15,
      name: "Oliva",
      logo: "https://customer-assets.emergentagent.com/job_laduna-studio/artifacts/g00lqjl5_LOGO%20OLIVA.png",
      size: 'normal'
    },
    // Linha 6
    {
      id: 16,
      name: "UpSeg",
      logo: "https://customer-assets.emergentagent.com/job_laduna-studio/artifacts/ai9t4zy4_UPSEG%20LOGO.pdf.png",
      size: 'normal'
    },
    {
      id: 17,
      name: "Transparente",
      logo: "https://customer-assets.emergentagent.com/job_laduna-studio/artifacts/dmcx6hlg_TRANSPARENTE.png",
      size: 'normal'
    },
    {
      id: 18,
      name: "PowerFit",
      logo: "https://customer-assets.emergentagent.com/job_laduna-studio/artifacts/78aod8gw__POWEFIT%20Stories.png",
      size: 'normal'
    }
  ];

  // Dividir em 6 linhas de 3
  const rows = [];
  for (let i = 0; i < allLogos.length; i += 3) {
    rows.push(allLogos.slice(i, i + 3));
  }

  const getSize = (size) => {
    if (size === 'larger') {
      return { height: '132px', width: '264px' }; // +30% (original +10% + additional +10%)
    }
    return { height: '110px', width: '220px' }; // +10% base
  };

  return (
    <section className="py-16 bg-gradient-to-b from-white via-gray-50 to-white">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-black mb-6" style={{ 
            fontSize: '1.8rem', 
            fontWeight: '700',
            lineHeight: '1.2'
          }}>
            MARCAS QUE CONFIARAM NA NOSSA ESTRATÉGIA
          </h2>
          <p className="body-large mb-6" style={{color: '#000000'}}>
            Parcerias construídas com foco em estratégia, posicionamento e crescimento real.
          </p>
        </div>

        {/* Logos Grid - 6 Rows with 3 logos each */}
        <div className="space-y-12 max-w-5xl mx-auto">
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} className="flex items-center justify-center gap-16">
              {row.map((client, index) => (
                <div 
                  key={client.id}
                  className="transition-all duration-300 hover:scale-110 animate-float"
                  style={{ 
                    animationDelay: `${(rowIndex * 3 + index) * 0.15}s`,
                    animationDuration: '3s'
                  }}
                >
                  <img 
                    src={client.logo}
                    alt={client.name}
                    className="object-contain transition-all duration-300 hover:drop-shadow-lg"
                    style={getSize(client.size)}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <p className="body-large mb-8" style={{color: '#000000'}}>
            Sua empresa pode ser a próxima nessa linha de sucesso!
          </p>
          <button 
            onClick={() => {
              const element = document.getElementById('contact');
              if (element) element.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
            style={{
              backgroundColor: '#000000',
              color: '#FFFFFF',
              border: 'none'
            }}
          >
            QUERO FAZER PARTE
          </button>
        </div>
      </div>
    </section>
  );
};
