import React from 'react';

export const Portfolio = () => {
  return (
    <section id="portfolio" className="py-24 bg-black">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="heading-2 text-white mb-6">
            Nosso Portfólio
          </h2>
          <p className="body-large max-w-3xl mx-auto text-gray-300">
            Atuamos em projetos de tecnologia, varejo, imobiliário, agronegócio e serviços, sempre com foco em crescimento estratégico, posicionamento de marca e resultados sustentáveis.
          </p>
        </div>
      </div>
    </section>
  );
};