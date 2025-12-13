import React from 'react';
import { MessageCircle } from 'lucide-react';
import { companyInfo } from '../data/mock';

export const ChatWidget = () => {
  const handleWhatsAppRedirect = () => {
    // Mensagem personalizada para WhatsApp
    const message = encodeURIComponent("Olá! Vim através do site da LADUNA STUDIO e gostaria de saber mais sobre os serviços de marketing digital.");
    const whatsappURL = `https://wa.me/5566996139483?text=${message}`;
    window.open(whatsappURL, '_blank');
  };

  return (
    <>
      {/* WhatsApp Direct Button */}
      <button
        onClick={handleWhatsAppRedirect}
        className="fixed bottom-6 left-6 z-50 p-4 rounded-full transition-all duration-300 shadow-2xl hover:scale-110"
        style={{
          backgroundColor: '#25D366',
          color: '#FFFFFF'
        }}
        onMouseEnter={(e) => e.target.style.backgroundColor = '#128C7E'}
        onMouseLeave={(e) => e.target.style.backgroundColor = '#25D366'}
        title="Falar via WhatsApp"
      >
        <MessageCircle size={24} style={{ color: '#FFFFFF' }} />
      </button>
    </>
  );
};