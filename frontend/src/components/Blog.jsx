import React from 'react';
import { Calendar, Clock, ArrowRight, User } from 'lucide-react';
import { blogPosts } from '../data/mock';

export const Blog = () => {
  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="blog" className="py-24 bg-gray-900">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="heading-2 text-brand-primary mb-6">
            Blog & Insights
          </h2>
          <p className="body-large max-w-3xl mx-auto text-gray-300">
            Fique por dentro das últimas tendências em marketing digital com nossos artigos especializados e dicas práticas.
          </p>
        </div>

        {/* Featured Post */}
        <div className="mb-16">
          <div className="bg-black rounded-lg overflow-hidden border border-gray-800 hover:border-brand-primary/50 transition-all duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative">
                <img 
                  src={blogPosts[0].image}
                  alt={blogPosts[0].title}
                  className="w-full h-full min-h-[300px] object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-brand-primary text-black px-3 py-1 rounded-full text-sm font-semibold uppercase">
                    Destaque
                  </span>
                </div>
              </div>
              <div className="p-8 flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    <span>{new Date(blogPosts[0].date).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={16} />
                    <span>{blogPosts[0].readTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User size={16} />
                    <span>{blogPosts[0].author}</span>
                  </div>
                </div>
                <span className="text-brand-primary text-sm font-semibold uppercase tracking-wide mb-2">
                  {blogPosts[0].category}
                </span>
                <h3 className="heading-4 text-white mb-4">{blogPosts[0].title}</h3>
                <p className="body-small text-gray-300 mb-6">{blogPosts[0].excerpt}</p>
                <button className="btn-secondary w-fit">
                  Ler Artigo Completo
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {blogPosts.slice(1).map((post) => (
            <article 
              key={post.id}
              className="bg-black rounded-lg overflow-hidden border border-gray-800 hover:border-brand-primary/50 transition-all duration-300 card-hover-effect"
            >
              <div className="relative">
                <img 
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4 mb-3 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>{new Date(post.date).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{post.readTime}</span>
                  </div>
                </div>
                <span className="text-brand-primary text-sm font-semibold uppercase tracking-wide mb-2 block">
                  {post.category}
                </span>
                <h3 className="heading-6 text-white mb-3 line-clamp-2">{post.title}</h3>
                <p className="body-small text-gray-300 mb-4 line-clamp-3">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Por {post.author}</span>
                  <button className="text-brand-primary text-sm font-semibold flex items-center gap-2 hover:gap-3 transition-all">
                    Ler mais
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter Subscription */}
        <div className="bg-brand-primary/10 p-12 rounded-lg border border-brand-primary/20 text-center">
          <h3 className="heading-4 text-white mb-4">
            Receba Conteúdo Exclusivo
          </h3>
          <p className="body-medium text-gray-300 mb-8 max-w-2xl mx-auto">
            Assine nossa newsletter e receba as últimas tendências em marketing digital diretamente no seu e-mail.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input 
              type="email"
              placeholder="Seu melhor e-mail"
              className="flex-1 px-4 py-3 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-brand-primary focus:outline-none"
            />
            <button className="btn-primary whitespace-nowrap">
              Assinar Newsletter
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-4">
            Não enviamos spam. Você pode cancelar a qualquer momento.
          </p>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h3 className="heading-3 text-white mb-4">
            Precisa de Ajuda Especializada?
          </h3>
          <p className="body-medium text-gray-300 mb-8 max-w-2xl mx-auto">
            Nossa equipe de especialistas está pronta para transformar sua estratégia digital.
          </p>
          <button 
            onClick={scrollToContact}
            className="btn-primary"
          >
            Falar com Especialista
          </button>
        </div>
      </div>
    </section>
  );
};