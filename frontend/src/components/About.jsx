import React from 'react';
import { CheckCircle, Target, Eye, Heart } from 'lucide-react';
import { companyInfo, teamMembers } from '../data/mock';

export const About = () => {
  return (
    <section id="about" className="py-24 bg-gray-900">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="heading-2 text-brand-primary mb-6">
            Sobre a LADUNA
          </h2>
          <p className="body-large max-w-4xl mx-auto text-gray-300">
            {companyInfo.description}
          </p>
        </div>

        {/* Mission, Vision, Values Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {/* Mission */}
          <div className="bg-black p-8 rounded-lg border border-gray-800">
            <div className="bg-brand-primary/20 p-3 rounded-lg inline-block mb-6">
              <Target className="text-brand-primary" size={24} />
            </div>
            <h3 className="heading-5 text-white mb-4">Missão</h3>
            <p className="body-small text-gray-300">
              {companyInfo.mission}
            </p>
          </div>

          {/* Vision */}
          <div className="bg-black p-8 rounded-lg border border-gray-800">
            <div className="bg-brand-primary/20 p-3 rounded-lg inline-block mb-6">
              <Eye className="text-brand-primary" size={24} />
            </div>
            <h3 className="heading-5 text-white mb-4">Visão</h3>
            <p className="body-small text-gray-300">
              {companyInfo.vision}
            </p>
          </div>

          {/* Values */}
          <div className="bg-black p-8 rounded-lg border border-gray-800">
            <div className="bg-brand-primary/20 p-3 rounded-lg inline-block mb-6">
              <Heart className="text-brand-primary" size={24} />
            </div>
            <h3 className="heading-5 text-white mb-4">Valores</h3>
            <ul className="space-y-2">
              {companyInfo.values.map((value, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-300">
                  <CheckCircle size={16} className="text-brand-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Team Section */}
        <div className="text-center mb-12">
          <h3 className="heading-3 text-brand-primary mb-4">
            Nossa Equipe
          </h3>
          <p className="body-medium text-gray-300 max-w-2xl mx-auto">
            Conheça os especialistas por trás dos resultados excepcionais que entregamos aos nossos clientes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto justify-items-center">
          {teamMembers.map((member) => (
            <div 
              key={member.id}
              className="team-card bg-black border border-gray-800 rounded-lg overflow-hidden card-hover-effect w-full max-w-sm"
            >
              <div className="team-card-content p-6">
                <h4 className="heading-5 text-white mb-2">{member.name}</h4>
                <p className="text-brand-primary font-semibold mb-3">{member.position}</p>
                <p className="body-small text-gray-300 mb-4">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-brand-primary/10 p-12 rounded-lg border border-brand-primary/20">
            <h3 className="heading-4 text-white mb-4">
              Prontos para Trabalhar Juntos?
            </h3>
            <p className="body-medium text-gray-300 mb-8 max-w-2xl mx-auto">
              Nossa equipe está preparada para transformar sua presença digital e acelerar o crescimento do seu negócio.
            </p>
            <button 
              onClick={() => {
                const element = document.getElementById('contact');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn-primary"
            >
              Vamos Conversar
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};