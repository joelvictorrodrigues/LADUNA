import React from 'react';
import { CheckCircle, Target, Eye, Heart, User, UserCheck, Smile } from 'lucide-react';
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
          <h3 className="text-white mb-4" style={{ 
            fontSize: '2.3rem',
            fontWeight: '700'
          }}>
            QUEM ESTÁ POR TRÁS DA LADUNA
          </h3>
          <p className="mx-auto" style={{ 
            color: '#E6E6E6',
            maxWidth: '820px',
            fontSize: '1.1rem',
            lineHeight: '1.5'
          }}>
            Conheça os especialistas por trás dos resultados excepcionais<br />que entregamos aos nossos clientes.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 justify-items-center mb-6">
            {/* Joel Rodrigues */}
            <div 
              className="w-full max-w-sm relative transition-colors duration-300" 
              style={{ 
                backgroundColor: '#0B0B0B',
                border: '1px solid #1E1E1E',
                borderRadius: '16px',
                padding: '32px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#888888'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = '#1E1E1E'}
            >
              <div className="absolute top-4 right-4">
                <User style={{ 
                  color: '#FFFFFF', 
                  opacity: 0.4 
                }} size={24} />
              </div>
              <h4 className="text-white mb-2" style={{ 
                fontSize: '1.375rem',
                fontWeight: '600'
              }}>{teamMembers[0].name}</h4>
              <p className="mb-4" style={{ 
                color: '#BDBDBD',
                fontSize: '14px',
                opacity: 1
              }}>{teamMembers[0].position}</p>
              <p style={{ 
                color: '#CFCFCF',
                fontSize: '0.95rem',
                lineHeight: '1.6'
              }}>{teamMembers[0].bio}</p>
            </div>

            {/* Talita Vieira */}
            <div 
              className="w-full max-w-sm relative transition-colors duration-300" 
              style={{ 
                backgroundColor: '#0B0B0B',
                border: '1px solid #1E1E1E',
                borderRadius: '16px',
                padding: '32px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#888888'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = '#1E1E1E'}
            >
              <div className="absolute top-4 right-4">
                <User style={{ 
                  color: '#FFFFFF', 
                  opacity: 0.4 
                }} size={24} />
              </div>
              <h4 className="text-white mb-2" style={{ 
                fontSize: '1.375rem',
                fontWeight: '600'
              }}>{teamMembers[1].name}</h4>
              <p className="mb-4" style={{ 
                color: '#BDBDBD',
                fontSize: '14px',
                opacity: 1
              }}>{teamMembers[1].position}</p>
              <p style={{ 
                color: '#CFCFCF',
                fontSize: '0.95rem',
                lineHeight: '1.6'
              }}>{teamMembers[1].bio}</p>
            </div>
          </div>
          
          {/* Amanda centralizada */}
          <div className="flex justify-center">
            <div 
              className="w-full max-w-sm relative transition-colors duration-300" 
              style={{ 
                backgroundColor: '#0B0B0B',
                border: '1px solid #1E1E1E',
                borderRadius: '16px',
                padding: '32px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#888888'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = '#1E1E1E'}
            >
              <div className="absolute top-4 right-4">
                <User style={{ 
                  color: '#FFFFFF', 
                  opacity: 0.4 
                }} size={24} />
              </div>
              <h4 className="text-white mb-2" style={{ 
                fontSize: '1.375rem',
                fontWeight: '600'
              }}>{teamMembers[2].name}</h4>
              <p className="mb-4" style={{ 
                color: '#BDBDBD',
                fontSize: '14px',
                opacity: 1
              }}>{teamMembers[2].position}</p>
              <p style={{ 
                color: '#CFCFCF',
                fontSize: '0.95rem',
                lineHeight: '1.6'
              }}>{teamMembers[2].bio}</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16" style={{ marginBottom: '80px' }}>
          <div className="p-12 rounded-lg relative overflow-hidden" style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1611829517505-0235064854fc?w=1200&h=600&fit=crop")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            filter: 'brightness(0.8)'
          }}>
            <div className="absolute inset-0 bg-black opacity-70 z-0"></div>
            <div className="relative z-10">
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
              style={{
                backgroundColor: '#FFFFFF',
                color: '#000000',
                borderRadius: '999px',
                height: '48px',
                width: '220px',
                border: '0px',
                fontWeight: '600',
                fontSize: '0.95rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              VAMOS CONVERSAR
            </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};