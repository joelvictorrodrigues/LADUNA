import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { companyInfo } from '../data/mock';

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
    service: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock form submission
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        message: '',
        service: ''
      });
    }, 3000);
  };

  const services = [
    'Estratégia de Marketing Digital',
    'Tráfego Pago (Google Ads, Meta Ads)',
    'SEO - Otimização para Motores de Busca',
    'Marketing de Conteúdo',
    'Gestão de Redes Sociais',
    'Desenvolvimento de Sites',
    'Consultoria Completa'
  ];

  return (
    <section id="contact" className="py-24 bg-black">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="heading-2 text-brand-primary mb-6">
            Vamos Conversar
          </h2>
          <p className="body-large max-w-3xl mx-auto text-gray-300">
            Pronto para transformar sua presença digital? Agende uma consultoria gratuita e descubra como podemos acelerar o crescimento do seu negócio.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-gray-900 p-8 rounded-lg border border-gray-800">
            <h3 className="heading-4 text-white mb-6">Solicite sua Consultoria Gratuita</h3>
            
            {isSubmitted ? (
              <div className="text-center py-12">
                <div className="bg-brand-primary/20 p-4 rounded-full inline-block mb-4">
                  <CheckCircle className="text-brand-primary" size={32} />
                </div>
                <h4 className="heading-5 text-white mb-2">Mensagem Enviada!</h4>
                <p className="body-small text-gray-300">
                  Obrigado pelo seu interesse! Entraremos em contato em até 24 horas.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-300 mb-2">
                      Nome Completo*
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-brand-primary focus:outline-none transition-colors"
                      placeholder="Seu nome completo"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-300 mb-2">
                      E-mail*
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-brand-primary focus:outline-none transition-colors"
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-300 mb-2">
                      Telefone*
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-brand-primary focus:outline-none transition-colors"
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                  <div>
                    <label htmlFor="company" className="block text-sm font-semibold text-gray-300 mb-2">
                      Empresa
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-brand-primary focus:outline-none transition-colors"
                      placeholder="Nome da sua empresa"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="service" className="block text-sm font-semibold text-gray-300 mb-2">
                    Serviço de Interesse
                  </label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white focus:border-brand-primary focus:outline-none transition-colors"
                  >
                    <option value="">Selecione um serviço</option>
                    {services.map((service, index) => (
                      <option key={index} value={service}>{service}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-300 mb-2">
                    Mensagem*
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-brand-primary focus:outline-none transition-colors resize-vertical"
                    placeholder="Conte-nos mais sobre seu projeto e objetivos..."
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  Enviar Mensagem
                  <Send size={20} />
                </button>

                <p className="text-xs text-gray-400 text-center">
                  Ao enviar este formulário, você concorda em ser contatado pela LADUNA sobre nossos serviços.
                </p>
              </form>
            )}
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="heading-4 text-white mb-6">Outras Formas de Contato</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-brand-primary/20 p-3 rounded-lg">
                    <Mail className="text-brand-primary" size={20} />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">E-mail</h4>
                    <p className="text-gray-300">{companyInfo.contact.email}</p>
                    <p className="text-sm text-gray-400">Respondemos em até 2 horas</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-brand-primary/20 p-3 rounded-lg">
                    <Phone className="text-brand-primary" size={20} />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Telefone / WhatsApp</h4>
                    <a 
                      href={companyInfo.contact.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-primary hover:text-brand-hover transition-colors"
                    >
                      {companyInfo.contact.phone}
                    </a>
                    <p className="text-sm text-gray-400">{companyInfo.contact.schedule}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-brand-primary/20 p-3 rounded-lg">
                    <MapPin className="text-brand-primary" size={20} />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Localização</h4>
                    <p className="text-gray-300">{companyInfo.contact.address}</p>
                    <p className="text-sm text-gray-400">Atendimento presencial mediante agendamento</p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Quick List */}
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
              <h4 className="heading-5 text-white mb-4">Perguntas Frequentes</h4>
              <div className="space-y-4">
                <div>
                  <h5 className="text-brand-primary font-semibold mb-1">Quanto tempo para ver resultados?</h5>
                  <p className="text-sm text-gray-300">Primeiros resultados em 30-60 dias, otimização contínua.</p>
                </div>
                <div>
                  <h5 className="text-brand-primary font-semibold mb-1">Qual investimento mínimo?</h5>
                  <p className="text-sm text-gray-300">Definimos o investimento após análise do seu negócio e objetivos.</p>
                </div>
                <div>
                  <h5 className="text-brand-primary font-semibold mb-1">Fazem contratos longos?</h5>
                  <p className="text-sm text-gray-300">Flexibilidade total, sem fidelidade obrigatória.</p>
                </div>
              </div>
            </div>

            {/* Social Proof */}
            <div className="bg-brand-primary/10 p-6 rounded-lg border border-brand-primary/20">
              <h4 className="text-white font-semibold mb-2">✨ Consultoria 100% Gratuita</h4>
              <p className="text-sm text-gray-300 mb-4">
                Análise completa da sua presença digital + estratégia personalizada. Sem compromisso.
              </p>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Auditoria completa gratuita</li>
                <li>• Estratégia personalizada</li>
                <li>• Proposta sem compromisso</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};