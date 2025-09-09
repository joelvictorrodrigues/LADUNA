import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Phone, Mail, Clock } from 'lucide-react';
import { companyInfo } from '../data/mock';

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      message: `Olá! 👋 Bem-vindo à ${companyInfo.name}! Como posso ajudá-lo hoje?`,
      timestamp: new Date(),
      options: [
        'Quero uma consultoria gratuita',
        'Falar sobre meus projetos',
        'Conhecer os serviços',
        'Falar com um especialista'
      ]
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = (message = inputMessage) => {
    if (!message.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      type: 'user',
      message: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      let botResponse = getBotResponse(message);
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        type: 'bot',
        message: botResponse.message,
        timestamp: new Date(),
        options: botResponse.options
      }]);
      setIsTyping(false);
    }, 1500);
  };

  const getBotResponse = (userMessage) => {
    const msg = userMessage.toLowerCase();
    
    if (msg.includes('consultoria') || msg.includes('consulta')) {
      return {
        message: '🎯 Excelente! Nossa consultoria gratuita inclui:\n\n✅ Auditoria completa da sua presença digital\n✅ Estratégia personalizada\n✅ Proposta sem compromisso\n\nGostaria de agendar agora?',
        options: ['Sim, quero agendar!', 'Contar mais sobre meu negócio', 'Ver horários disponíveis']
      };
    } else if (msg.includes('serviços') || msg.includes('serviço')) {
      return {
        message: '🚀 Nossos principais serviços:\n\n• Estratégia de Marketing Digital\n• Tráfego Pago (Google, Meta, TikTok)\n• SEO\n• Marketing de Conteúdo\n• Gestão de Redes Sociais\n• Desenvolvimento de Sites\n\nQual serviço te interessa mais?',
        options: ['Tráfego Pago', 'SEO', 'Redes Sociais', 'Todos os serviços']
      };
    } else if (msg.includes('preço') || msg.includes('valor') || msg.includes('investimento')) {
      return {
        message: '💰 Nossos valores são personalizados conforme suas necessidades e objetivos. Na consultoria gratuita, apresentamos uma proposta específica para seu negócio.\n\nVamos agendar?',
        options: ['Agendar consultoria', 'Falar sobre meu orçamento', 'Ver casos de sucesso']
      };
    } else if (msg.includes('especialista') || msg.includes('falar') || msg.includes('contato')) {
      return {
        message: '📞 Vamos conectá-lo diretamente com nosso time!\n\nEscolha a melhor forma:',
        options: ['WhatsApp', 'E-mail', 'Agendar ligação', 'Formulário completo']
      };
    } else if (msg.includes('whatsapp')) {
      return {
        message: `📱 Perfeito! Clique no link para falar diretamente conosco:\n\n${companyInfo.contact.whatsapp}\n\nNosso horário: ${companyInfo.contact.schedule}`,
        options: ['Abrir WhatsApp', 'Outras formas de contato']
      };
    } else {
      return {
        message: '😊 Entendi! Estou aqui para ajudar. Nossa equipe está pronta para transformar sua presença digital.\n\nO que gostaria de saber?',
        options: ['Agendar consultoria', 'Conhecer serviços', 'Ver resultados', 'Falar com especialista']
      };
    }
  };

  const handleOptionClick = (option) => {
    if (option === 'WhatsApp' || option === 'Abrir WhatsApp') {
      window.open(companyInfo.contact.whatsapp, '_blank');
      return;
    }
    if (option === 'E-mail') {
      window.location.href = `mailto:${companyInfo.contact.email}`;
      return;
    }
    if (option === 'Formulário completo') {
      const element = document.getElementById('contact');
      if (element) element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
      return;
    }
    if (option.includes('agendar') || option.includes('Agendar')) {
      const element = document.getElementById('contact');
      if (element) element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
      return;
    }
    
    handleSendMessage(option);
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 left-6 z-50 p-4 rounded-full transition-all duration-300 shadow-2xl ${
          isOpen 
            ? 'bg-gray-800 hover:bg-gray-700' 
            : 'bg-brand-primary hover:bg-brand-hover'
        }`}
      >
        {isOpen ? (
          <X size={24} className="text-white" />
        ) : (
          <MessageCircle size={24} className="text-black" />
        )}
      </button>

      {/* Chat Widget */}
      {isOpen && (
        <div className="fixed bottom-24 left-6 z-50 w-96 max-w-[calc(100vw-3rem)] h-[500px] bg-gray-900 rounded-lg shadow-2xl border border-gray-700 flex flex-col">
          {/* Header */}
          <div className="p-4 bg-brand-primary rounded-t-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                <MessageCircle size={16} className="text-brand-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-black">LADUNA STUDIO</h3>
                <p className="text-xs text-black/80">Normalmente responde em poucos minutos</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-lg ${
                  msg.type === 'user' 
                    ? 'bg-brand-primary text-black' 
                    : 'bg-gray-800 text-white'
                }`}>
                  <p className="text-sm whitespace-pre-line">{msg.message}</p>
                  
                  {msg.options && (
                    <div className="mt-3 space-y-2">
                      {msg.options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleOptionClick(option)}
                          className="block w-full text-left p-2 text-xs bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  <p className="text-xs opacity-70 mt-1">
                    {msg.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-800 text-white p-3 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Digite sua mensagem..."
                className="flex-1 p-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-brand-primary focus:outline-none text-sm"
              />
              <button
                onClick={() => handleSendMessage()}
                className="p-2 bg-brand-primary hover:bg-brand-hover text-black rounded-lg transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
            
            {/* Quick Actions */}
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => window.open(companyInfo.contact.whatsapp, '_blank')}
                className="flex items-center gap-1 px-2 py-1 text-xs bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
              >
                <Phone size={12} />
                WhatsApp
              </button>
              <button
                onClick={() => window.location.href = `mailto:${companyInfo.contact.email}`}
                className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
              >
                <Mail size={12} />
                E-mail
              </button>
              <button
                onClick={() => {
                  const element = document.getElementById('contact');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                  setIsOpen(false);
                }}
                className="flex items-center gap-1 px-2 py-1 text-xs bg-brand-primary hover:bg-brand-hover text-black rounded transition-colors"
              >
                <Clock size={12} />
                Agendar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};