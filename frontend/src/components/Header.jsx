import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed w-full z-50" style={{ backgroundColor: '#0B0B0B', height: '72px' }}>
      <div className="container mx-auto px-6 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <div className="flex items-center">
            <img 
              src="https://customer-assets.emergentagent.com/job_laduna-digital/artifacts/siw2m2vs_PRETO%20E%20BRANCO2.png" 
              alt="LADUNA STUDIO Logo" 
              className="h-10 w-auto"
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('home')}
              className="text-white hover:text-[#A0A0A0] transition-colors duration-200 font-medium"
            >
              Início
            </button>
            <button 
              onClick={() => scrollToSection('about')}
              className="text-white hover:text-[#A0A0A0] transition-colors duration-200 font-medium"
            >
              Sobre
            </button>
            <button 
              onClick={() => scrollToSection('services')}
              className="text-white hover:text-[#A0A0A0] transition-colors duration-200 font-medium"
            >
              Serviços
            </button>
            <button 
              onClick={() => scrollToSection('portfolio')}
              className="text-white hover:text-[#A0A0A0] transition-colors duration-200 font-medium"
            >
              Portfólio
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="text-white hover:text-[#A0A0A0] transition-colors duration-200 font-medium"
            >
              Contato
            </button>
            
            {/* CTA Button */}
            <button 
              onClick={() => scrollToSection('contact')}
              className="px-4 py-2 font-medium transition-colors duration-200 rounded-md text-sm"
              style={{ 
                backgroundColor: '#FFFFFF', 
                color: '#0B0B0B',
                border: '1px solid #1D1D1D'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#F2F2F2'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#FFFFFF'}
            >
              CONSULTORIA GRATUITA
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={toggleMenu}
            className="md:hidden text-white p-2"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full" style={{ backgroundColor: '#0B0B0B' }}>
            <div className="flex flex-col space-y-4 p-6">
              <button 
                onClick={() => scrollToSection('home')}
                className="text-white hover:text-[#A0A0A0] transition-colors duration-200 font-medium text-left"
              >
                Início
              </button>
              <button 
                onClick={() => scrollToSection('about')}
                className="text-white hover:text-[#A0A0A0] transition-colors duration-200 font-medium text-left"
              >
                Sobre
              </button>
              <button 
                onClick={() => scrollToSection('services')}
                className="text-white hover:text-[#A0A0A0] transition-colors duration-200 font-medium text-left"
              >
                Serviços
              </button>
              <button 
                onClick={() => scrollToSection('portfolio')}
                className="text-white hover:text-[#A0A0A0] transition-colors duration-200 font-medium text-left"
              >
                Portfólio
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="text-white hover:text-[#A0A0A0] transition-colors duration-200 font-medium text-left"
              >
                Contato
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="w-full mt-4 px-4 py-2 font-medium transition-colors duration-200 rounded-md text-sm"
                style={{ 
                  backgroundColor: '#FFFFFF', 
                  color: '#0B0B0B',
                  border: '1px solid #1D1D1D'
                }}
              >
                CONSULTORIA GRATUITA
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};