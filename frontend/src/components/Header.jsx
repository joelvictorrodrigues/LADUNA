import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-black/90 backdrop-blur-md' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img 
              src="https://customer-assets.emergentagent.com/job_laduna-digital/artifacts/v9yix11f_1.png" 
              alt="LADUNA Logo" 
              className="h-10 w-auto"
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('home')}
              className="nav-link"
            >
              Início
            </button>
            <button 
              onClick={() => scrollToSection('about')}
              className="nav-link"
            >
              Sobre
            </button>
            <button 
              onClick={() => scrollToSection('services')}
              className="nav-link"
            >
              Serviços
            </button>
            <button 
              onClick={() => scrollToSection('portfolio')}
              className="nav-link"
            >
              Portfólio
            </button>
            <button 
              onClick={() => scrollToSection('blog')}
              className="nav-link"
            >
              Blog
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="btn-primary"
            >
              Consultoria Gratuita
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
          <div className="md:hidden absolute top-full left-0 w-full bg-black/95 backdrop-blur-md">
            <div className="flex flex-col space-y-4 p-6">
              <button 
                onClick={() => scrollToSection('home')}
                className="nav-link text-left"
              >
                Início
              </button>
              <button 
                onClick={() => scrollToSection('about')}
                className="nav-link text-left"
              >
                Sobre
              </button>
              <button 
                onClick={() => scrollToSection('services')}
                className="nav-link text-left"
              >
                Serviços
              </button>
              <button 
                onClick={() => scrollToSection('portfolio')}
                className="nav-link text-left"
              >
                Portfólio
              </button>
              <button 
                onClick={() => scrollToSection('blog')}
                className="nav-link text-left"
              >
                Blog
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="btn-primary w-full mt-4"
              >
                Consultoria Gratuita
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};