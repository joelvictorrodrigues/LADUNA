import React from 'react';
import { Mail, Phone } from 'lucide-react';
import { companyInfo } from '../data/mock';

export const Contact = () => {
  return (
    <section id="contact" className="py-24 bg-black relative overflow-hidden">
      {/* Chess Queen Image - Left Side */}
      <div className="absolute left-20 top-1/2 transform -translate-y-1/2 opacity-20 pointer-events-none">
        <img 
          src="https://customer-assets.emergentagent.com/job_laduna-studio/artifacts/i1ad58xm_11111.png"
          alt="Chess Queen"
          style={{ width: '250px', height: 'auto' }}
        />
      </div>

      {/* Chess Piece Image - Right Side */}
      <div className="absolute right-20 top-1/2 transform -translate-y-1/2 opacity-20 pointer-events-none">
        <img 
          src="https://customer-assets.emergentagent.com/job_laduna-studio/artifacts/dcewi3ab_2222222.png"
          alt="Chess Piece"
          style={{ width: '300px', height: 'auto' }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-white mb-8" style={{ 
            fontSize: '2rem',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Consultoria de Diagnóstico Estratégico LADUNA
          </h2>
          <p className="max-w-3xl mx-auto text-gray-300 mb-10" style={{ lineHeight: '1.8' }}>
            <span style={{ fontSize: '1.35rem', display: 'block', marginBottom: '8px' }}>Pronto para transformar sua presença digital?</span>
            <span style={{ fontSize: '1.1rem' }}>Vamos mapear seu próximo passo, responda a algumas perguntas rápidas<br />
            e a LADUNA entra em contato mostrando o melhor caminho.</span>
          </p>
          
          {/* CTA Button with floating effect */}
          <a 
            href="https://tally.so/r/GxKJbk"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-12 py-5 rounded-lg font-bold text-xl transition-all duration-300 hover:scale-105 animate-float"
            style={{
              backgroundColor: '#FFFFFF',
              color: '#000000',
              border: 'none',
              boxShadow: '0 10px 40px rgba(255, 255, 255, 0.2)'
            }}
          >
            Começar agora →
          </a>
        </div>

        {/* Contact Information */}
        <div className="max-w-md mx-auto">
          <h3 className="heading-4 text-white mb-6 text-center">Outras Formas de Contato</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center justify-center text-center p-4 bg-gray-900 rounded-lg border border-gray-800 aspect-square">
              <div className="bg-white/10 p-2 rounded-lg mb-3">
                <Mail className="text-white" size={20} />
              </div>
              <h4 className="text-white font-semibold text-sm mb-1">E-mail</h4>
              <p className="text-gray-300 text-xs">{companyInfo.contact.email}</p>
            </div>

            <div className="flex flex-col items-center justify-center text-center p-4 bg-gray-900 rounded-lg border border-gray-800 aspect-square">
              <div className="bg-white/10 p-2 rounded-lg mb-3">
                <Phone className="text-white" size={20} />
              </div>
              <h4 className="text-white font-semibold text-sm mb-1">WhatsApp</h4>
              <a 
                href="https://linktr.ee/ladunastudio"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors text-xs"
              >
                {companyInfo.contact.phone}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
