import React from 'react';

export const CTAIntermediate = () => {
  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-24 bg-gradient-to-r from-brand-primary via-brand-primary to-yellow-400">
      <div className="container mx-auto px-6">
        <div className="text-center">
          <h2 className="heading-2 text-black mb-6 font-bold">
            PRONTO PARA TRANSFORMAR SEU NEGÓCIO?
          </h2>
          <p className="body-large max-w-3xl mx-auto text-black mb-8">
            Agende uma consultoria gratuita e descubra como podemos acelerar o crescimento da sua empresa.
          </p>
          <button 
            onClick={scrollToContact}
            className="bg-black text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
          >
            AGENDAR CONSULTORIA GRATUITA
          </button>
        </div>
      </div>
    </section>
  );
};