import React from 'react';

export const ClientLogos = () => {
  // Primeiro carrossel - movendo para direita
  const firstCarouselLogos = [
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
      logo: "https://customer-assets.emergentagent.com/job_laduna-digital/artifacts/oerrm3tx_UpSmart%20-%20Logotipo.pdf.png"
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

  // Segundo carrossel - movendo para esquerda
  const secondCarouselLogos = [
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

  // Duplicamos os logos MAIS VEZES para ter mais logos por linha
  const duplicatedFirstCarousel = [...firstCarouselLogos, ...firstCarouselLogos, ...firstCarouselLogos];
  const duplicatedSecondCarousel = [...secondCarouselLogos, ...secondCarouselLogos, ...secondCarouselLogos];

  return (
    <section className="py-20 bg-gradient-to-b from-white via-gray-50 to-white">
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

        {/* Static Logos Grid - 2 Rows */}
        <div className="space-y-8">
          {/* Primeira Linha */}
          <div className="flex items-center justify-center gap-6">
            {firstCarouselLogos.map((client) => (
              <div 
                key={client.id}
                className="transition-all duration-300 hover:scale-110"
              >
                <img 
                  src={client.logo}
                  alt={client.name}
                  className="h-20 w-40 object-contain transition-all duration-300 hover:drop-shadow-lg"
                />
              </div>
            ))}
          </div>

          {/* Segunda Linha */}
          <div className="flex items-center justify-center gap-6">
            {secondCarouselLogos.map((client) => (
              <div 
                key={client.id}
                className="transition-all duration-300 hover:scale-110"
              >
                <img 
                  src={client.logo}
                  alt={client.name}
                  className="h-20 w-40 object-contain transition-all duration-300 hover:drop-shadow-lg"
                />
              </div>
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
            className="btn-primary"
          >
            QUERO FAZER PARTE
          </button>
        </div>
      </div>

      {/* Stats Section with White Background */}
      <div className="bg-white py-16 mt-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-black mb-3">50+</div>
              <div className="text-gray-600 text-base">Clientes Atendidos</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-black mb-3">200+</div>
              <div className="text-gray-600 text-base">Projetos Realizados</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-black mb-3">300%</div>
              <div className="text-gray-600 text-base">Aumento Médio de Vendas</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-black mb-3">5</div>
              <div className="text-gray-600 text-base">Anos de Experiência</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};