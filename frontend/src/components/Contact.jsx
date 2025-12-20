import React from 'react';
import { Mail, Phone } from 'lucide-react';
import { companyInfo } from '../data/mock';

export const Contact = () => {
  return (
    <section id="contact" className="py-24 bg-black relative overflow-hidden">
      {/* Giant Chess Queen Background */}
      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 opacity-20 pointer-events-none">
        <svg width="350" height="550" viewBox="0 0 100 150" fill="#777777">
          {/* Queen Chess Piece */}
          <circle cx="50" cy="8" r="4" fill="#777777"/>
          <circle cx="30" cy="15" r="3" fill="#777777"/>
          <circle cx="70" cy="15" r="3" fill="#777777"/>
          <circle cx="20" cy="25" r="3" fill="#777777"/>
          <circle cx="80" cy="25" r="3" fill="#777777"/>
          <path d="M20 28 L30 50 L50 40 L70 50 L80 28 L75 55 Q50 65 25 55 Z" fill="#777777"/>
          <ellipse cx="50" cy="60" rx="28" ry="8" fill="#777777"/>
          <path d="M22 60 L18 115 Q50 125 82 115 L78 60" fill="#777777"/>
          <ellipse cx="50" cy="120" rx="35" ry="10" fill="#777777"/>
          <rect x="15" y="125" width="70" height="12" rx="3" fill="#777777"/>
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-white mb-8" style={{ 
            fontSize: '1.8rem',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Consultoria de Diagnóstico Estratégico LADUNA
          </h2>
          <p className="body-large max-w-3xl mx-auto text-gray-300 mb-10" style={{ lineHeight: '1.8' }}>
            Pronto para transformar sua presença digital?<br />
            Vamos mapear seu próximo passo, responda a algumas perguntas rápidas<br />
            e a LADUNA entra em contato mostrando o melhor caminho.
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
        <div className="max-w-xl mx-auto">
          <h3 className="heading-4 text-white mb-6 text-center">Outras Formas de Contato</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col items-center text-center p-6 bg-gray-900 rounded-lg border border-gray-800">
              <div className="bg-white/10 p-3 rounded-lg mb-4">
                <Mail className="text-white" size={24} />
              </div>
              <h4 className="text-white font-semibold mb-2">E-mail</h4>
              <p className="text-gray-300 text-sm">{companyInfo.contact.email}</p>
            </div>

            <div className="flex flex-col items-center text-center p-6 bg-gray-900 rounded-lg border border-gray-800">
              <div className="bg-white/10 p-3 rounded-lg mb-4">
                <Phone className="text-white" size={24} />
              </div>
              <h4 className="text-white font-semibold mb-2">WhatsApp</h4>
              <a 
                href="https://linktr.ee/ladunastudio"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors text-sm"
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
