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
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="heading-4 text-black mb-4">
            Empresas que Confiam na LADUNA STUDIO
          </h2>
          <p className="body-medium text-gray-600 max-w-2xl mx-auto">
            Orgulhosos de trabalhar com empresas inovadoras que transformaram sua presença digital conosco.
          </p>
        </div>

        {/* Animated Logos Carousel */}
        <div className="relative overflow-hidden">
          <div className="logos-scroll flex items-center space-x-12">
            {duplicatedLogos.map((client, index) => (
              <div 
                key={`${client.id}-${index}`}
                className="flex-shrink-0 bg-gray-50 p-6 rounded-lg border border-gray-200 hover:border-brand-primary/30 transition-all duration-300 hover:bg-gray-100"
              >
                <img 
                  src={client.logo}
                  alt={client.name}
                  className="h-16 w-32 object-contain grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-gray-200">
          <div className="text-center">
            <div className="text-3xl font-bold text-brand-primary mb-2">50+</div>
            <div className="text-gray-600 text-sm">Clientes Atendidos</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-brand-primary mb-2">200+</div>
            <div className="text-gray-600 text-sm">Projetos Realizados</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-brand-primary mb-2">300%</div>
            <div className="text-gray-600 text-sm">Aumento Médio de Vendas</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-brand-primary mb-2">5</div>
            <div className="text-gray-600 text-sm">Anos de Experiência</div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="body-medium text-gray-600 mb-6">
            Sua empresa pode ser a próxima success story!
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
    </section>
  );
};