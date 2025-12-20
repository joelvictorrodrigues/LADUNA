import React from 'react';
import { Target, TrendingUp, Edit3, Share2, Monitor, Palette, Video, FileText, Zap } from 'lucide-react';
import { services } from '../data/mock';

const iconMap = {
  target: Target,
  'trending-up': TrendingUp,
  'edit-3': Edit3,
  'share-2': Share2,
  monitor: Monitor,
  palette: Palette,
  video: Video,
  'file-text': FileText,
  zap: Zap
};

export const Services = () => {
  return (
    <section id="services" className="bg-black" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-white mb-6" style={{ 
            fontSize: '2.27rem',
            fontWeight: '700'
          }}>
            NOSSOS SERVIÇOS
          </h2>
          <p className="body-large max-w-3xl mx-auto text-gray-300">
            Soluções completas para estruturar, fortalecer e escalar sua presença digital.
          </p>
        </div>

        {/* Services Grid - 9 cards in 3x3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const IconComponent = iconMap[service.icon];
            return (
              <div 
                key={service.id}
                className="group relative bg-gray-900 p-6 rounded-lg border border-gray-800 transition-all duration-300 flex flex-col"
                style={{ transitionProperty: 'border-color', minHeight: '180px' }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#FFFFFF'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#374151'}
              >
                <div className="flex items-start gap-4">
                  <div className="bg-white/10 p-3 rounded-lg flex-shrink-0">
                    {IconComponent && <IconComponent style={{ color: '#FFFFFF', opacity: 0.6 }} size={22} />}
                  </div>
                  <div>
                    <h3 className="text-white mb-2" style={{ fontSize: '1.1rem', fontWeight: '600' }}>
                      {service.title}
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
