import React from 'react';
import { Mail, Phone, ArrowRight } from 'lucide-react';
import { companyInfo } from '../data/mock';

export const Contact = () => {
  return (
    <section id="contact" className="py-24 bg-black">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="heading-2 text-white mb-6">
            VAMOS CONVERSAR
          </h2>
          <p className="body-large max-w-3xl mx-auto text-gray-300 mb-8">
            Pronto para transformar sua presença digital? Agende uma consultoria gratuita e descubra como podemos acelerar o crescimento do seu negócio.
          </p>
          
          {/* CTA Button */}
          <a 
            href="https://tally.so/r/GxKJbk"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-semibold transition-all duration-200 hover:scale-105"
            style={{
              backgroundColor: '#FFFFFF',
              color: '#000000',
              border: 'none'
            }}
          >
            SOLICITE SUA CONSULTORIA GRATUITA
            <ArrowRight size={20} />
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
                href={companyInfo.contact.whatsapp}
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
