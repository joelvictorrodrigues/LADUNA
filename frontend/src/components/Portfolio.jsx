import React from 'react';

export const Portfolio = () => {
  return (
    <section id="portfolio" className="py-24 relative overflow-hidden" style={{
      backgroundImage: 'url("https://images.unsplash.com/photo-1593980560142-2840a8a7dff9?w=1920&h=800&fit=crop")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      filter: 'brightness(0.7)'
    }}>
      <div className="absolute inset-0 bg-black opacity-60 z-0"></div>
      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="heading-2 text-white mb-6">
            NOSSO PORTFÓLIO
          </h2>
          <p className="body-large max-w-3xl mx-auto text-gray-300">
            Atuamos em projetos de tecnologia, varejo, imobiliário, agronegócio e serviços, sempre com foco em crescimento estratégico, posicionamento de marca e resultados sustentáveis.
          </p>
        </div>
      </div>
    </section>
  );
};