import React from 'react';
import { Mail, Phone } from 'lucide-react';
import { companyInfo } from '../data/mock';

export const Contact = () => {
  return (
    <section id="contact" className="py-24 bg-black relative overflow-hidden">
      {/* Giant Chess Knight Background - Left Side */}
      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 opacity-15 pointer-events-none" style={{ marginLeft: '-50px' }}>
        <svg width="280" height="400" viewBox="0 0 100 140" fill="#777777">
          {/* Knight/Cavalo Chess Piece */}
          <path d="M30 25 Q25 15 35 10 Q45 5 55 15 Q65 10 70 20 L75 35 Q80 45 70 55 L65 50 Q60 60 55 65 L55 75 Q65 80 70 90 L70 110 Q50 120 30 110 L30 90 Q35 80 45 75 L45 65 Q40 60 35 50 L30 55 Q20 45 25 35 Z" fill="#777777"/>
          <ellipse cx="50" cy="115" rx="25" ry="8" fill="#777777"/>
          <rect x="25" y="118" width="50" height="10" rx="2" fill="#777777"/>
          {/* Eye */}
          <circle cx="55" cy="30" r="3" fill="#333333"/>
        </svg>
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
