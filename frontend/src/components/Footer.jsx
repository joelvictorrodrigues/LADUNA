import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Instagram, Facebook } from 'lucide-react';
import { companyInfo } from '../data/mock';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="dunes-footer">
      {/* Dunes Background */}
      <div className="dunes-background"></div>
      
      {/* Footer Content */}
      <div className="dunes-content">
        <div className="container mx-auto px-6">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <img 
                  src="https://customer-assets.emergentagent.com/job_laduna-digital/artifacts/04zo24ap_PRETO%20E%20BRANCO.pdf.png" 
                  alt="LADUNA STUDIO Logo" 
                  className="h-16 w-auto mb-4"
                />
                <p className="body-small text-gray-300 max-w-md">
                  {companyInfo.description}
                </p>
              </div>
              
              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-brand-primary" />
                  <span className="text-gray-300 text-sm">{companyInfo.contact.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={16} className="text-brand-primary" />
                  <span className="text-gray-300 text-sm">{companyInfo.contact.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin size={16} className="text-brand-primary" />
                  <span className="text-gray-300 text-sm">{companyInfo.contact.address}</span>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <div>
              <h4 className="heading-6 text-white mb-4">Navegação</h4>
              <ul className="space-y-3">
                <li>
                  <button 
                    onClick={() => scrollToSection('home')}
                    className="text-gray-300 hover:text-brand-primary transition-colors text-sm"
                  >
                    Início
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('about')}
                    className="text-gray-300 hover:text-brand-primary transition-colors text-sm"
                  >
                    Sobre Nós
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('services')}
                    className="text-gray-300 hover:text-brand-primary transition-colors text-sm"
                  >
                    Serviços
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('portfolio')}
                    className="text-gray-300 hover:text-brand-primary transition-colors text-sm"
                  >
                    Portfólio
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('blog')}
                    className="text-gray-300 hover:text-brand-primary transition-colors text-sm"
                  >
                    Blog
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('contact')}
                    className="text-gray-300 hover:text-brand-primary transition-colors text-sm"
                  >
                    Contato
                  </button>
                </li>
              </ul>
            </div>

            {/* Services Links */}
            <div>
              <h4 className="heading-6 text-white mb-4">Serviços</h4>
              <ul className="space-y-3">
                <li>
                  <button 
                    onClick={() => scrollToSection('services')}
                    className="text-gray-300 hover:text-brand-primary transition-colors text-sm text-left"
                  >
                    Estratégia Digital
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('services')}
                    className="text-gray-300 hover:text-brand-primary transition-colors text-sm text-left"
                  >
                    Tráfego Pago
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('services')}
                    className="text-gray-300 hover:text-brand-primary transition-colors text-sm text-left"
                  >
                    SEO
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('services')}
                    className="text-gray-300 hover:text-brand-primary transition-colors text-sm text-left"
                  >
                    Marketing de Conteúdo
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('services')}
                    className="text-gray-300 hover:text-brand-primary transition-colors text-sm text-left"
                  >
                    Redes Sociais
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('services')}
                    className="text-gray-300 hover:text-brand-primary transition-colors text-sm text-left"
                  >
                    Desenvolvimento Web
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Social Media & CTA */}
          <div className="border-t border-gray-800 pt-8 mb-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <span className="text-gray-300 text-sm">Siga-nos:</span>
                <div className="flex gap-3">
                  <a 
                    href={companyInfo.contact.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-800 hover:bg-brand-primary/20 p-2 rounded-lg transition-colors"
                  >
                    <Linkedin size={20} className="text-gray-300 hover:text-brand-primary" />
                  </a>
                  <a 
                    href={companyInfo.contact.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-800 hover:bg-brand-primary/20 p-2 rounded-lg transition-colors"
                  >
                    <Instagram size={20} className="text-gray-300 hover:text-brand-primary" />
                  </a>
                  <a 
                    href={companyInfo.contact.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-800 hover:bg-brand-primary/20 p-2 rounded-lg transition-colors"
                  >
                    <Facebook size={20} className="text-gray-300 hover:text-brand-primary" />
                  </a>
                </div>
              </div>
              
              <button 
                onClick={() => scrollToSection('contact')}
                className="btn-primary"
              >
                Consultoria Gratuita
              </button>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-800 pt-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-gray-400 text-sm">
                  © {currentYear} LADUNA Digital Marketing. Todos os direitos reservados.
                </p>
              </div>
              <div className="flex gap-6">
                <button className="text-gray-400 hover:text-brand-primary text-sm transition-colors">
                  Política de Privacidade
                </button>
                <button className="text-gray-400 hover:text-brand-primary text-sm transition-colors">
                  Termos de Uso
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};