import React from 'react';

export const ClientLogos = () => {
  // Logos das empresas clientes (você pode adicionar mais conforme necessário)
  const clientLogos = [
    {
      id: 1,
      name: "EcoTech Solutions",
      logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=100&fit=crop"
    },
    {
      id: 2,
      name: "Bella Vida Spa",
      logo: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=100&fit=crop"
    },
    {
      id: 3,
      name: "TechStart Hub",
      logo: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200&h=100&fit=crop"
    },
    {
      id: 4,
      name: "Gourmet Express",
      logo: "https://images.unsplash.com/photo-1567443280446-0c9c5b5c6e1a?w=200&h=100&fit=crop"
    },
    {
      id: 5,
      name: "InnovaCorp",
      logo: "https://images.unsplash.com/photo-1560472355-536de3962603?w=200&h=100&fit=crop"
    },
    {
      id: 6,
      name: "Digital Solutions",
      logo: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=200&h=100&fit=crop"
    }
  ];

  return (
    <section className="py-16 bg-gray-900">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="heading-4 text-white mb-4">
            Empresas que Confiam na LADUNA STUDIO
          </h2>
          <p className="body-medium text-gray-300 max-w-2xl mx-auto">
            Orgulhosos de trabalhar com empresas inovadoras que transformaram sua presença digital conosco.
          </p>
        </div>

        {/* Logos Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
          {clientLogos.map((client) => (
            <div 
              key={client.id}
              className="group relative bg-white/5 p-6 rounded-lg border border-gray-800 hover:border-brand-primary/30 transition-all duration-300 hover:bg-white/10"
            >
              <img 
                src={client.logo}
                alt={client.name}
                className="w-full h-16 object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
              />
              <div className="absolute inset-0 bg-brand-primary/0 group-hover:bg-brand-primary/5 rounded-lg transition-all duration-300"></div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-gray-800">
          <div className="text-center">
            <div className="text-3xl font-bold text-brand-primary mb-2">50+</div>
            <div className="text-gray-300 text-sm">Clientes Atendidos</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-brand-primary mb-2">200+</div>
            <div className="text-gray-300 text-sm">Projetos Realizados</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-brand-primary mb-2">300%</div>
            <div className="text-gray-300 text-sm">Aumento Médio de Vendas</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-brand-primary mb-2">5</div>
            <div className="text-gray-300 text-sm">Anos de Experiência</div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="body-medium text-gray-300 mb-6">
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