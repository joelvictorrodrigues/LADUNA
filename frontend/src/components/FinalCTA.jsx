import React from 'react';

export const FinalCTA = () => {
  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-24 bg-black">
      <div className="container mx-auto px-6">
        <div className="text-center">
          <h2 className="heading-2 text-white mb-6">
            Seu projeto pode ser o próximo
          </h2>
          <p className="body-large max-w-2xl mx-auto text-gray-300 mb-8">
            Vamos entender seus objetivos e definir o melhor caminho para o crescimento do seu negócio.
          </p>
          <button 
            onClick={scrollToContact}
            className="btn-primary"
          >
            Começar meu projeto
          </button>
        </div>
      </div>
    </section>
  );
};