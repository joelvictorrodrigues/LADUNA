import React from 'react';
import { ArrowRight, TrendingUp, Users, Zap } from 'lucide-react';

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
    <section id="home" className="hero-section">
      {/* Background Image */}
      <div className="hero-background">
        <img 
          src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1920&h=1080&fit=crop"
          alt="Digital Marketing Team"
          className="hero-image"
        />
        <div className="hero-overlay"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start lg:items-center">
          {/* Left Content */}
          <div className="order-2 lg:order-1">
            <h1 className="hero-title mb-6 text-white">
              Marketing estratégico para empresas e profissionais que querem crescer de verdade.
            </h1>
            
            <p className="body-large mb-8 max-w-2xl text-gray-300">
              Cuidamos da sua presença digital para fortalecer sua marca, organizar sua comunicação e acelerar o crescimento do seu negócio.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button 
                onClick={scrollToContact}
                className="btn-primary flex items-center justify-center gap-2"
              >
                CONSULTORIA GRATUITA
                <ArrowRight size={20} />
              </button>
              <button 
                onClick={scrollToServices}
                className="btn-secondary"
              >
                NOSSOS SERVIÇOS
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="flex items-center gap-3">
                <div className="bg-brand-primary/20 p-3 rounded-lg">
                  <TrendingUp className="text-brand-primary" size={20} />
                </div>
                <div>
                  <div className="text-xl font-bold text-brand-primary">+300%</div>
                  <div className="text-gray-300 text-xs">Aumento médio em vendas</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-brand-primary/20 p-3 rounded-lg">
                  <Users className="text-brand-primary" size={20} />
                </div>
                <div>
                  <div className="text-xl font-bold text-brand-primary">50+</div>
                  <div className="text-gray-300 text-xs">Clientes atendidos</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-brand-primary/20 p-3 rounded-lg">
                  <Zap className="text-brand-primary" size={20} />
                </div>
                <div>
                  <div className="text-xl font-bold text-brand-primary">200+</div>
                  <div className="text-gray-300 text-xs">Projetos realizados</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-brand-primary/20 p-3 rounded-lg">
                  <Users className="text-brand-primary" size={20} />
                </div>
                <div>
                  <div className="text-xl font-bold text-brand-primary">5 anos</div>
                  <div className="text-gray-300 text-xs">De experiência comprovada</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Logo */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end lg:-mt-8">
            <img 
              src="https://customer-assets.emergentagent.com/job_laduna-digital/artifacts/2q3nlgbl_PRETO%20E%20BRANCO.pdf.png" 
              alt="LADUNA STUDIO Logo" 
              className="h-56 lg:h-72 w-auto animate-float"
            />
          </div>
        </div>
      </div>
    </section>
  );
};