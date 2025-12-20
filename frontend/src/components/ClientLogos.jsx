import React from 'react';

export const ClientLogos = () => {
  // Primeira linha de logos (6 logos)
  const firstRowLogos = [
    {
      id: 1,
      name: "V'Bella",
      logo: "https://customer-assets.emergentagent.com/job_laduna-digital/artifacts/nx4yc5f6_14.png"
    },
    {
      id: 2,
      name: "Master Festa e Embalagens",
      logo: "https://customer-assets.emergentagent.com/job_laduna-digital/artifacts/bafi9m2h_15.png"
    },
    {
      id: 3,
      name: "Churrascada",
      logo: "https://customer-assets.emergentagent.com/job_laduna-digital/artifacts/ltd4m338_17.png"
    },
    {
      id: 4,
      name: "UpSmart",
      logo: "https://customer-assets.emergentagent.com/job_laduna-digital/artifacts/oerrm3tx_UpSmart%20-%20Logotipo.pdf.png",
      larger: true
    },
    {
      id: 5,
      name: "Acqua & Sabão",
      logo: "https://customer-assets.emergentagent.com/job_laduna-digital/artifacts/gfr304xt_24.png"
    },
    {
      id: 11,
      name: "Compagni Brasil",
      logo: "https://customer-assets.emergentagent.com/job_laduna-digital/artifacts/w47d6bez_25.png"
    }
  ];

  // Segunda linha de logos (6 logos)
  const secondRowLogos = [
    {
      id: 6,
      name: "ME Fitness",
      logo: "https://customer-assets.emergentagent.com/job_laduna-digital/artifacts/qjqxbhnp_19.png"
    },
    {
      id: 7,
      name: "Logo Caveira",
      logo: "https://customer-assets.emergentagent.com/job_laduna-digital/artifacts/yrylxbzp_20.png"
    },
    {
      id: 8,
      name: "Brasil Gold",
      logo: "https://customer-assets.emergentagent.com/job_laduna-digital/artifacts/x5acsbsw_BRASIL%20GOLD.pdf.png"
    },
    {
      id: 9,
      name: "Fisio Trate",
      logo: "https://customer-assets.emergentagent.com/job_laduna-digital/artifacts/gclb0fsn_22.png"
    },
    {
      id: 10,
      name: "ME Mundo dos Esportes",
      logo: "https://customer-assets.emergentagent.com/job_laduna-digital/artifacts/jthie9bn_23.png"
    },
    {
      id: 12,
      name: "Agronegócio Logo",
      logo: "https://customer-assets.emergentagent.com/job_laduna-digital/artifacts/v1fjs3s5_26.png"
    }
  ];

  // Terceira linha de logos (6 logos)
  const thirdRowLogos = [
    {
      id: 13,
      name: "Carla Bianconi",
      logo: "https://customer-assets.emergentagent.com/job_laduna-studio/artifacts/ih7f7k0m_2%20-%20SEM%20FUNDO.png",
      larger: true // +15%
    },
    {
      id: 14,
      name: "Karine Alcantara",
      logo: "https://customer-assets.emergentagent.com/job_laduna-studio/artifacts/x2izh7hz_KARINE%20ALCANTARA%20POSTS.png"
    },
    {
      id: 15,
      name: "Oliva",
      logo: "https://customer-assets.emergentagent.com/job_laduna-studio/artifacts/g00lqjl5_LOGO%20OLIVA.png"
    },
    {
      id: 16,
      name: "UpSeg",
      logo: "https://customer-assets.emergentagent.com/job_laduna-studio/artifacts/ai9t4zy4_UPSEG%20LOGO.pdf.png"
    },
    {
      id: 17,
      name: "Transparente",
      logo: "https://customer-assets.emergentagent.com/job_laduna-studio/artifacts/dmcx6hlg_TRANSPARENTE.png"
    },
    {
      id: 18,
      name: "PowerFit",
      logo: "https://customer-assets.emergentagent.com/job_laduna-studio/artifacts/78aod8gw__POWEFIT%20Stories.png"
    }
  ];

  const LogoItem = ({ client, index }) => (
    <div 
      className="transition-all duration-300 hover:scale-110 animate-float"
      style={{ 
        animationDelay: `${index * 0.2}s`,
        animationDuration: '3s'
      }}
    >
      <img 
        src={client.logo}
        alt={client.name}
        className={`object-contain transition-all duration-300 hover:drop-shadow-lg ${
          client.larger ? 'h-24 w-48' : 'h-20 w-40'
        }`}
      />
    </div>
  );

  return (
    <section className="py-12 bg-gradient-to-b from-white via-gray-50 to-white">
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

        {/* Static Logos Grid - 3 Rows with 6 logos each */}
        <div className="space-y-10">
          {/* Primeira Linha */}
          <div className="flex items-center justify-center gap-8 flex-wrap">
            {firstRowLogos.map((client, index) => (
              <LogoItem key={client.id} client={client} index={index} />
            ))}
          </div>

          {/* Segunda Linha */}
          <div className="flex items-center justify-center gap-8 flex-wrap">
            {secondRowLogos.map((client, index) => (
              <LogoItem key={client.id} client={client} index={index + 6} />
            ))}
          </div>

          {/* Terceira Linha */}
          <div className="flex items-center justify-center gap-8 flex-wrap">
            {thirdRowLogos.map((client, index) => (
              <LogoItem key={client.id} client={client} index={index + 12} />
            ))}
          </div>
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
