import React from 'react';
import { ArrowRight, Clock, TrendingUp, Users, Zap } from 'lucide-react';

export const Hero = () => {
  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToServices = () => {
    const element = document.getElementById('services');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="hero-section" style={{ paddingTop: '72px' }}>
      {/* Background Image */}
      <div className="hero-background">
        <img 
          src="https://images.unsplash.com/photo-1611829517505-0235064854fc?w=1920&h=1080&fit=crop"
          alt="Modern Business Architecture"
          className="hero-image"
        />
        <div className="hero-overlay"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start lg:items-center">
          {/* Left Content */}
          <div className="order-2 lg:order-1">
            <h1 className="hero-title mb-6" style={{ color: '#FFFFFF' }}>
              Marketing estratégico para empresas e profissionais que querem crescer de verdade.
            </h1>
            
            <p className="mb-8 max-w-2xl" style={{ 
              color: '#FFFFFF', 
              opacity: 1,
              fontSize: '1.375rem',
              lineHeight: '1.6',
              fontWeight: '400'
            }}>
              Cuidamos da sua presença digital para fortalecer sua marca, organizar sua comunicação e acelerar o crescimento do seu negócio.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button 
                onClick={scrollToContact}
                className="px-8 py-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center gap-2"
                style={{
                  backgroundColor: '#FFFFFF',
                  color: '#0B0B0B'
                }}
              >
                CONSULTORIA GRATUITA
                <ArrowRight size={20} />
              </button>
              <button 
                onClick={scrollToServices}
                className="px-8 py-4 rounded-lg font-semibold transition-colors duration-200"
                style={{
                  backgroundColor: 'transparent',
                  border: '1px solid #FFFFFF',
                  color: '#FFFFFF'
                }}
              >
                NOSSOS SERVIÇOS
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}>
                  <TrendingUp style={{ color: '#FFFFFF' }} size={20} />
                </div>
                <div>
                  <div className="text-xl font-bold" style={{ color: '#FFFFFF' }}>+300%</div>
                  <div className="text-xs" style={{ color: '#A0A0A0' }}>Aumento médio em vendas</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}>
                  <Users style={{ color: '#FFFFFF' }} size={20} />
                </div>
                <div>
                  <div className="text-xl font-bold" style={{ color: '#FFFFFF' }}>50+</div>
                  <div className="text-xs" style={{ color: '#A0A0A0' }}>Clientes atendidos</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}>
                  <Zap style={{ color: '#FFFFFF' }} size={20} />
                </div>
                <div>
                  <div className="text-xl font-bold" style={{ color: '#FFFFFF' }}>200+</div>
                  <div className="text-xs" style={{ color: '#A0A0A0' }}>Projetos realizados</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}>
                  <Clock style={{ color: '#FFFFFF' }} size={20} />
                </div>
                <div style={{ minWidth: '120px' }}>
                  <div className="text-xl font-bold" style={{ color: '#FFFFFF' }}>5 anos</div>
                  <div className="text-xs whitespace-nowrap" style={{ color: '#A0A0A0' }}>De experiência</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Logo */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-center lg:-mt-8 lg:-ml-16">
            <img 
              src="https://customer-assets.emergentagent.com/job_laduna-landing/artifacts/1u969ezp_Marketing%20estrate%CC%81gico%20para%20empresas%20e%20profissionais%20que%20querem%20crescer%20de%20verdade..png" 
              alt="LADUNA STUDIO Marketing" 
              className="h-56 lg:h-72 w-auto animate-float"
            />
          </div>
        </div>
      </div>
    </section>
  );
};