import React from 'react';

export const ClientLogos = () => {
  // Logos reais das empresas clientes da LADUNA STUDIO
  const clientLogos = [
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
      name: "Cliente 3",
      logo: "https://customer-assets.emergentagent.com/job_laduna-digital/artifacts/lroq5xg5_16.png"
    },
    {
      id: 4,
      name: "Cliente 4",
      logo: "https://customer-assets.emergentagent.com/job_laduna-digital/artifacts/jrzqircz_17.png"
    },
    {
      id: 5,
      name: "JH Smart",
      logo: "https://customer-assets.emergentagent.com/job_laduna-digital/artifacts/ahhdamnu_18.png"
    }
  ];

  // Duplicamos os logos para criar um loop infinito
  const duplicatedLogos = [...clientLogos, ...clientLogos];

  return (
    <section className="py-20 bg-gradient-to-b from-white via-gray-50 to-white">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="heading-3 text-black mb-6">
            Empresas que Confiam na LADUNA STUDIO
          </h2>
          <p className="body-large mb-6" style={{color: '#000000'}}>
            Orgulhosos de trabalhar com empresas inovadoras que transformaram sua presença digital conosco.
          </p>
        </div>

        {/* Animated Logos Carousel */}
        <div className="relative overflow-hidden py-8">
          <div className="logos-scroll flex items-center space-x-16">
            {duplicatedLogos.map((client, index) => (
              <div 
                key={`${client.id}-${index}`}
                className="flex-shrink-0 transition-all duration-300 hover:scale-110"
              >
                <img 
                  src={client.logo}
                  alt={client.name}
                  className="h-24 w-48 object-contain transition-all duration-300 hover:drop-shadow-lg"
                />
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <p className="body-large text-black mb-8">
            Sua empresa pode ser a próxima nessa linha de sucesso!
          </p>
          <button 
            onClick={() => {
              const element = document.getElementById('contact');
              if (element) element.scrollIntoView({ behavior: 'smooth' });
            }}
            className="btn-primary"
          >
            Quero Fazer Parte
          </button>
        </div>
      </div>

      {/* Stats Section with Black Background */}
      <div className="bg-black py-16 mt-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-brand-primary mb-3">50+</div>
              <div className="text-gray-300 text-base">Clientes Atendidos</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-brand-primary mb-3">200+</div>
              <div className="text-gray-300 text-base">Projetos Realizados</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-brand-primary mb-3">300%</div>
              <div className="text-gray-300 text-base">Aumento Médio de Vendas</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-brand-primary mb-3">5</div>
              <div className="text-gray-300 text-base">Anos de Experiência</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};