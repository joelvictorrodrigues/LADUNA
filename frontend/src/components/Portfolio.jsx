import React, { useState } from 'react';
import { ExternalLink, TrendingUp, Users, Zap, DollarSign } from 'lucide-react';
import { portfolioProjects } from '../data/mock';

export const Portfolio = () => {
  const [selectedProject, setSelectedProject] = useState(null);

  const openProject = (project) => {
    setSelectedProject(project);
  };

  const closeProject = () => {
    setSelectedProject(null);
  };

  return (
    <section id="portfolio" className="py-24 bg-black">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="heading-2 text-brand-primary mb-6">
            Nosso Portfólio
          </h2>
          <p className="body-large max-w-3xl mx-auto text-gray-300">
            Conheça alguns dos projetos que transformaram a presença digital dos nossos clientes e geraram resultados excepcionais.
          </p>
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {portfolioProjects.map((project) => (
            <div 
              key={project.id}
              className="group relative bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-brand-primary/50 transition-all duration-300 cursor-pointer"
              onClick={() => openProject(project)}
            >
              <div className="relative overflow-hidden">
                <img 
                  src={project.image}
                  alt={project.title}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300 brightness-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent"></div>
                <div className="absolute top-4 right-4">
                  <ExternalLink className="text-white bg-black/50 p-2 rounded-full" size={32} />
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-brand-primary text-sm font-semibold uppercase tracking-wide">
                    {project.category}
                  </span>
                </div>
                <h3 className="heading-5 text-white mb-3">{project.title}</h3>
                <p className="body-small text-gray-300 mb-4 line-clamp-3">{project.description}</p>
                
                {/* Services Used */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.services.map((service, index) => (
                    <span 
                      key={index}
                      className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded"
                    >
                      {service}
                    </span>
                  ))}
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(project.results).slice(0, 2).map(([key, value], index) => (
                    <div key={index} className="text-center">
                      <div className="text-lg font-bold text-brand-primary">{value}</div>
                      <div className="text-xs text-gray-400 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Project Modal */}
        {selectedProject && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="relative">
                <img 
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-64 object-cover"
                />
                <button 
                  onClick={closeProject}
                  className="absolute top-4 right-4 text-white bg-black/50 hover:bg-black/80 p-2 rounded-full transition-colors"
                >
                  <ExternalLink className="rotate-45" size={20} />
                </button>
              </div>
              
              <div className="p-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-brand-primary text-sm font-semibold uppercase tracking-wide">
                    {selectedProject.category}
                  </span>
                </div>
                <h3 className="heading-3 text-white mb-4">{selectedProject.title}</h3>
                <p className="body-medium text-gray-300 mb-8">{selectedProject.description}</p>

                {/* Results Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                  {Object.entries(selectedProject.results).map(([key, value], index) => {
                    const icons = [TrendingUp, Users, Zap, DollarSign];
                    const IconComponent = icons[index] || TrendingUp;
                    
                    return (
                      <div key={index} className="text-center bg-black p-4 rounded-lg">
                        <div className="bg-brand-primary/20 p-3 rounded-lg inline-block mb-3">
                          <IconComponent className="text-brand-primary" size={20} />
                        </div>
                        <div className="text-2xl font-bold text-brand-primary mb-1">{value}</div>
                        <div className="text-sm text-gray-400 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Services Used */}
                <div className="mb-8">
                  <h4 className="heading-6 text-white mb-4">Serviços Utilizados:</h4>
                  <div className="flex flex-wrap gap-3">
                    {selectedProject.services.map((service, index) => (
                      <span 
                        key={index}
                        className="bg-brand-primary/20 text-brand-primary px-3 py-2 rounded-full text-sm font-semibold"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => {
                      closeProject();
                      const element = document.getElementById('contact');
                      if (element) element.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="btn-primary flex-1"
                  >
                    Quero Resultados Assim
                  </button>
                  <button 
                    onClick={closeProject}
                    className="btn-secondary"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h3 className="heading-3 text-white mb-4">
            Seu Projeto Pode Ser o Próximo
          </h3>
          <p className="body-medium text-gray-300 mb-8 max-w-2xl mx-auto">
            Agende uma consultoria gratuita e descubra como podemos transformar sua presença digital.
          </p>
          <button 
            onClick={() => {
              const element = document.getElementById('contact');
              if (element) element.scrollIntoView({ behavior: 'smooth' });
            }}
            className="btn-primary"
          >
            Começar Meu Projeto
          </button>
        </div>
      </div>
    </section>
  );
};