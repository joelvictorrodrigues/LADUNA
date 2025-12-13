import React, { useState } from 'react';
import { Target, TrendingUp, Search, Edit3, Share2, Monitor, ArrowRight, Check } from 'lucide-react';
import { services } from '../data/mock';

const iconMap = {
  target: Target,
  'trending-up': TrendingUp,
  search: Search,
  'edit-3': Edit3,
  'share-2': Share2,
  monitor: Monitor
};

export const Services = () => {
  const [selectedService, setSelectedService] = useState(null);

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="services" className="py-24 bg-black">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="heading-2 text-brand-primary mb-6">
            Nossos Serviços
          </h2>
          <p className="body-large max-w-3xl mx-auto text-gray-300">
            Soluções completas para estruturar, fortalecer e escalar sua presença digital.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service) => {
            const IconComponent = iconMap[service.icon];
            return (
              <div 
                key={service.id}
                className="group relative bg-gray-900 p-8 rounded-lg border border-gray-800 hover:border-brand-primary/50 transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedService(selectedService === service.id ? null : service.id)}
              >
                <div className="mb-6">
                  <div className="bg-brand-primary/20 p-3 rounded-lg inline-block mb-4">
                    <IconComponent className="text-brand-primary" size={24} />
                  </div>
                  <h3 className="heading-4 text-white mb-3">{service.title}</h3>
                  <p className="body-small text-gray-300 mb-4">{service.description}</p>
                </div>

                {/* Expandable Features */}
                <div className={`overflow-hidden transition-all duration-300 ${
                  selectedService === service.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <div className="border-t border-gray-800 pt-4 mt-4">
                    <h4 className="text-brand-primary font-semibold mb-3">Incluí:</h4>
                    <ul className="space-y-2">
                      {service.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-gray-300">
                          <Check size={16} className="text-brand-primary" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6">
                  <button className="text-brand-primary text-sm font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                    {selectedService === service.id ? 'Ver menos' : 'Saiba mais'}
                    <ArrowRight size={16} className={`transition-transform ${
                      selectedService === service.id ? 'rotate-90' : ''
                    }`} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gray-900 p-12 rounded-lg border border-gray-800">
          <h3 className="heading-3 text-white mb-4">
            Pronto para Transformar Seu Negócio?
          </h3>
          <p className="body-medium text-gray-300 mb-8 max-w-2xl mx-auto">
            Agende uma consultoria gratuita e descubra como podemos acelerar o crescimento da sua empresa.
          </p>
          <button 
            onClick={scrollToContact}
            className="btn-primary inline-flex items-center gap-2"
          >
            Agendar Consultoria Gratuita
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
};