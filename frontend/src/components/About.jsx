import React from 'react';
import { CheckCircle, Target, Eye, Heart } from 'lucide-react';
import { companyInfo, teamMembers } from '../data/mock';

export const About = () => {
  return (
    <section id="about" className="py-24 bg-gray-900">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-white mb-6" style={{ 
            fontSize: '2.52rem', 
            fontWeight: '700', 
            letterSpacing: '0.025em' 
          }}>
            SOBRE A LADUNA
          </h2>
          <p className="mx-auto text-white" style={{ 
            maxWidth: '900px',
            lineHeight: '1.6',
            fontSize: '1.175rem'
          }}>
            {companyInfo.description}
          </p>
        </div>

        {/* Mission, Vision, Values Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20" style={{ height: 'auto' }}>
          {/* Mission */}
          <div className="p-8 flex flex-col transition-colors duration-300" style={{ 
            backgroundColor: '#0B0B0B',
            border: '1px solid #1E1E1E',
            borderRadius: '16px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            minHeight: '280px'
          }}
          onMouseEnter={(e) => e.target.style.borderColor = '#888888'}
          onMouseLeave={(e) => e.target.style.borderColor = '#1E1E1E'}>
            <div className="inline-block mb-6">
              <Target style={{ 
                color: '#FFFFFF', 
                opacity: 0.7 
              }} size={24} />
            </div>
            <h3 className="text-white mb-4" style={{ 
              fontSize: '1.375rem',
              fontWeight: '600'
            }}>Missão</h3>
            <p style={{ 
              color: '#CFCFCF',
              fontSize: '0.95rem',
              lineHeight: '1.5'
            }}>
              {companyInfo.mission}
            </p>
          </div>

          {/* Vision */}
          <div className="p-8 flex flex-col" style={{ 
            backgroundColor: '#0B0B0B',
            border: '1px solid #1E1E1E',
            borderRadius: '16px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            minHeight: '280px'
          }}>
            <div className="inline-block mb-6">
              <Eye style={{ 
                color: '#FFFFFF', 
                opacity: 0.7 
              }} size={24} />
            </div>
            <h3 className="text-white mb-4" style={{ 
              fontSize: '1.375rem',
              fontWeight: '600'
            }}>Visão</h3>
            <p style={{ 
              color: '#CFCFCF',
              fontSize: '0.95rem',
              lineHeight: '1.5'
            }}>
              {companyInfo.vision}
            </p>
          </div>

          {/* Values */}
          <div className="p-8 flex flex-col" style={{ 
            backgroundColor: '#0B0B0B',
            border: '1px solid #1E1E1E',
            borderRadius: '16px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            minHeight: '280px'
          }}>
            <div className="inline-block mb-6">
              <Heart style={{ 
                color: '#FFFFFF', 
                opacity: 0.7 
              }} size={24} />
            </div>
            <h3 className="text-white mb-4" style={{ 
              fontSize: '1.375rem',
              fontWeight: '600'
            }}>Valores</h3>
            <ul style={{ marginTop: '0' }}>
              {companyInfo.values.map((value, index) => (
                <li key={index} className="flex items-start gap-3" style={{ 
                  marginBottom: '12px',
                  color: '#CFCFCF',
                  fontSize: '0.95rem'
                }}>
                  <CheckCircle size={16} style={{ 
                    color: '#FFFFFF',
                    opacity: 0.7,
                    marginTop: '2px',
                    flexShrink: 0
                  }} />
                  <span>{value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Team Section */}
        <div className="text-center mb-12">
          <h3 className="heading-3 text-white mb-4">
            Quem está por trás da LADUNA
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
              VAMOS CONVERSAR
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};