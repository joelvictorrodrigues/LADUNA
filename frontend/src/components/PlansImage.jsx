import React from 'react';

export const PlansImage = () => {
  return (
    <section className="bg-white">
      <img 
        src="https://customer-assets.emergentagent.com/job_laduna-studio/artifacts/41eba671_444.png"
        alt="Qual plano é ideal para você?"
        className="w-full"
        style={{ display: 'block' }}
      />
      
      {/* CTA Button */}
      <div className="bg-white py-12 text-center">
        <a 
          href="https://linktr.ee/ladunastudio"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-10 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105 animate-float"
          style={{
            backgroundColor: '#000000',
            color: '#FFFFFF',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
          }}
        >
          Fazer a consultoria e escolher saber mais sobre os planos agora
        </a>
      </div>
    </section>
  );
};
