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
          src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1920&h=1080&fit=crop"
          alt="Digital Marketing Team"
          className="hero-image"
        />
        <div className="hero-overlay"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl">
          <div className="mb-6">
            <img 
              src="https://customer-assets.emergentagent.com/job_laduna-digital/artifacts/04zo24ap_PRETO%20E%20BRANCO.pdf.png" 
              alt="LADUNA STUDIO Logo" 
              className="h-20 w-auto mb-8"
            />
          </div>
          
          <h1 className="hero-title mb-6">
            Elevando Sua Presença Digital
          </h1>
          
          <p className="body-large mb-8 max-w-2xl">
            Transformamos sua presença digital com estratégias comprovadas que geram resultados reais. 
            Mais leads, mais vendas, mais crescimento.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <button 
              onClick={scrollToContact}
              className="btn-primary flex items-center justify-center gap-2"
            >
              Consultoria Gratuita
              <ArrowRight size={20} />
            </button>
            <button 
              onClick={scrollToServices}
              className="btn-secondary"
            >
              Nossos Serviços
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="flex items-center gap-4">
              <div className="bg-brand-primary/20 p-3 rounded-lg">
                <TrendingUp className="text-brand-primary" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold text-brand-primary">+300%</div>
                <div className="text-gray-300 text-sm">Aumento médio em vendas</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-brand-primary/20 p-3 rounded-lg">
                <Users className="text-brand-primary" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold text-brand-primary">50+</div>
                <div className="text-gray-300 text-sm">Clientes satisfeitos</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-brand-primary/20 p-3 rounded-lg">
                <Zap className="text-brand-primary" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold text-brand-primary">5 anos</div>
                <div className="text-gray-300 text-sm">De experiência comprovada</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};