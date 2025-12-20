import React from 'react';
import { MessageCircle } from 'lucide-react';

export const ChatWidget = () => {
  const handleLinktreeRedirect = () => {
    window.open('https://linktr.ee/ladunastudio', '_blank');
  };

  return (
    <>
      {/* Linktree Direct Button */}
      <button
        onClick={handleLinktreeRedirect}
        className="fixed bottom-6 left-6 z-50 p-4 rounded-full transition-all duration-300 shadow-2xl hover:scale-110"
        style={{
          backgroundColor: '#000000',
          color: '#FFFFFF'
        }}
        onMouseEnter={(e) => e.target.style.backgroundColor = '#333333'}
        onMouseLeave={(e) => e.target.style.backgroundColor = '#000000'}
        title="Nossos Links"
      >
        <MessageCircle size={24} style={{ color: '#FFFFFF' }} />
      </button>
    </>
  );
};
