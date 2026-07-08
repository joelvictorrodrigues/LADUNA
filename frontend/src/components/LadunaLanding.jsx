import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Check,
  ChevronRight,
  Film,
  Globe2,
  Instagram,
  Mail,
  Megaphone,
  Menu,
  Palette,
  PenTool,
  Phone,
  SearchCheck,
  Sparkles,
  Target,
  TrendingUp,
  X
} from 'lucide-react';

const asset = (path) => `${process.env.PUBLIC_URL}${path}`;

const whatsappNumber = '5566996361345';
const messages = {
  diagnostic: 'Olá, vim pelo site da LADUNA e quero solicitar um diagnóstico estratégico para minha marca.',
  plans: 'Olá, vim pelo site da LADUNA e quero entender qual plano faz mais sentido para minha marca.',
  portfolio: 'Olá, vi o portfólio da LADUNA no site e quero conversar sobre um projeto para minha marca.',
  general: 'Olá, vim pelo site da LADUNA e quero falar sobre minha marca.'
};

const whatsappLink = (message) => `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

const navItems = [
  { label: 'Início', target: 'inicio' },
  { label: 'Serviços', target: 'servicos' },
  { label: 'Portfólio', target: 'portfolio' },
  { label: 'Planos', target: 'planos' },
  { label: 'Sobre', target: 'sobre' },
  { label: 'Contato', target: 'contato' }
];

const stats = [
  { value: '10 marcas', label: 'na vitrine de projetos' },
  { value: '4 planos', label: 'para diferentes níveis de presença' },
  { value: 'Local e online', label: 'Peixoto de Azevedo, região e Brasil' },
  { value: 'Branding + tráfego', label: 'da percepção à conversão' }
];

const painPoints = [
  'Visual amador',
  'Conteúdo sem estratégia',
  'Perfil desorganizado',
  'Baixa percepção de valor',
  'Campanhas sem direção',
  'Tráfego sem criativo forte'
];

const pillars = [
  {
    icon: Target,
    title: 'Posicionamento',
    text: 'Definimos como sua marca deve ser percebida, para quem ela fala e o que faz ela ser escolhida.'
  },
  {
    icon: Palette,
    title: 'Identidade',
    text: 'Criamos uma estética coerente, profissional e memorável para fortalecer sua presença em todos os pontos de contato.'
  },
  {
    icon: BarChart3,
    title: 'Estratégia',
    text: 'Planejamos conteúdos, campanhas e criativos com intenção comercial, não apenas visual bonita.'
  }
];

const services = [
  {
    icon: Megaphone,
    tag: 'Social',
    title: 'Gestão de Redes Sociais',
    text: 'Planejamento, criação e organização da presença digital da sua marca.'
  },
  {
    icon: Sparkles,
    tag: 'Marca',
    title: 'Branding & Identidade Visual',
    text: 'Marcas mais profissionais, coerentes e memoráveis.'
  },
  {
    icon: PenTool,
    tag: 'Criativos',
    title: 'Conteúdo & Criativos',
    text: 'Posts, carrosséis, campanhas e peças que comunicam com intenção.'
  },
  {
    icon: Film,
    tag: 'Vídeo',
    title: 'Produção Audiovisual',
    text: 'Reels, vídeos, fotos e criativos para elevar a percepção da marca.'
  },
  {
    icon: TrendingUp,
    tag: 'Mídia',
    title: 'Tráfego Pago',
    text: 'Campanhas com estratégia, segmentação, criativos e análise.'
  },
  {
    icon: Globe2,
    tag: 'Web',
    title: 'Sites & Landing Pages',
    text: 'Páginas modernas para apresentar, captar e converter.'
  },
  {
    icon: SearchCheck,
    tag: 'Direção',
    title: 'Consultoria Estratégica',
    text: 'Diagnóstico de marca, plano de marketing e direção de crescimento para sair do improviso.'
  }
];

const projects = [
  {
    name: 'UPSMART',
    segment: 'Varejo tech',
    objective: 'Campanhas comerciais, tráfego e criativos de venda para varejo de tecnologia.',
    variant: 'tech'
  },
  {
    name: 'UPSMART Segurança',
    segment: 'Segurança eletrônica',
    objective: 'Conteúdo técnico, autoridade e campanhas para soluções de segurança.',
    variant: 'security'
  },
  {
    name: 'MESHOP',
    segment: 'Moda, esporte e pesca',
    objective: 'Promoções sazonais e campanhas de alto apelo visual para varejo.',
    variant: 'meshop'
  },
  {
    name: 'MEFITNESS',
    segment: 'Varejo fitness',
    objective: 'Campanhas comerciais, datas locais e presença visual para o segmento fitness.',
    variant: 'fitness'
  },
  {
    name: 'Wanjo Cell',
    segment: 'Assistência e acessórios',
    objective: 'Posicionamento para varejo local, assistência técnica e comunicação comercial.',
    variant: 'home'
  },
  {
    name: 'Laboratório São Sebastião',
    segment: 'Saúde',
    objective: 'Comunicação em saúde, confiança e conteúdo educativo para pacientes.',
    variant: 'health'
  }
];

const plans = [
  {
    name: 'Start',
    text: 'Para marcas que precisam começar com presença profissional.',
    items: ['Organização inicial de presença', 'Conteúdo essencial', 'Direção visual base']
  },
  {
    name: 'Gold',
    text: 'Para empresas que querem consistência, organização e estética.',
    items: ['Planejamento recorrente', 'Identidade aplicada ao conteúdo', 'Acompanhamento de presença']
  },
  {
    name: 'Premium',
    text: 'Para marcas que precisam de estratégia, volume e campanhas mais fortes.',
    items: ['Conteúdo com intenção comercial', 'Campanhas e criativos de venda', 'Análise e otimização'],
    featured: true
  },
  {
    name: 'Black',
    text: 'Para negócios que querem domínio digital completo.',
    items: ['Presença completa', 'Campanhas integradas', 'Direção estratégica avançada'],
    dark: true
  }
];

const brands = [
  ['UPSMART', 'Varejo tech'],
  ['UpSeg', 'Segurança'],
  ['MESHOP', 'Varejo'],
  ['MEFITNESS', 'Fitness'],
  ['CASA&CIA', 'Casa'],
  ['Wanjo Cell', 'Assistência'],
  ['São Sebastião', 'Saúde'],
  ['Karine Alcantara', 'Fisioterapia'],
  ['Churrascada', 'Eventos'],
  ['Master Embalagens', 'Comércio']
];

const testimonials = [
  {
    quote: 'A LADUNA organizou nossa comunicação e deixou nossa marca muito mais profissional.',
    author: 'Nome do cliente',
    company: 'Empresa'
  },
  {
    quote: 'A presença digital ficou mais clara, bonita e conectada com o que vendemos.',
    author: 'Nome do cliente',
    company: 'Empresa'
  },
  {
    quote: 'Conseguimos sair dos posts soltos e começar a comunicar com estratégia.',
    author: 'Nome do cliente',
    company: 'Empresa'
  }
];

function LogoMark({ dark = false }) {
  return (
    <a className={`ld-brand ${dark ? 'is-dark' : ''}`} href="#inicio" aria-label="LADUNA Studio, voltar ao início">
      <img src={asset('/assets/laduna-logo-horizontal.png')} alt="LADUNA Studio" />
    </a>
  );
}

function SectionHeading({ eyebrow, title, text, wide = false }) {
  return (
    <div className={`ld-section-heading ${wide ? 'is-wide' : ''} ld-reveal`}>
      <p className="ld-eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </div>
  );
}

function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (target) => {
    document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' });
    setIsOpen(false);
  };

  return (
    <header className="ld-header">
      <nav className="ld-nav" aria-label="Navegação principal">
        <LogoMark />
        <button
          className="ld-menu-button"
          type="button"
          aria-expanded={isOpen}
          aria-controls="ld-menu"
          onClick={() => setIsOpen((current) => !current)}
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
          <span>Menu</span>
        </button>
        <div className={`ld-menu ${isOpen ? 'is-open' : ''}`} id="ld-menu">
          {navItems.map((item) => (
            <button key={item.target} type="button" onClick={() => scrollToSection(item.target)}>
              {item.label}
            </button>
          ))}
        </div>
        <a className="ld-header-cta" href={whatsappLink(messages.diagnostic)} target="_blank" rel="noreferrer">
          Solicitar diagnóstico
        </a>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="ld-hero" id="inicio">
      <div className="ld-container ld-hero-grid">
        <div className="ld-hero-copy ld-reveal">
          <p className="ld-eyebrow ld-hero-kicker">LADUNA STUDIO</p>
          <h1>
            <span>Marcas fortes</span>
            <span>não nascem por acaso.</span>
            <span>Elas são construídas</span>
            <span>com direção.</span>
          </h1>
          <p className="ld-hero-text">
            A LADUNA Studio une posicionamento, identidade e estratégia para transformar marcas em presenças mais profissionais, desejadas e preparadas para vender.
          </p>
          <div className="ld-action-row">
            <a className="ld-button ld-button-primary" href={whatsappLink(messages.diagnostic)} target="_blank" rel="noreferrer">
              Solicitar diagnóstico
              <ArrowRight size={18} />
            </a>
            <a className="ld-button ld-button-secondary" href="#portfolio">
              Ver portfólio
            </a>
          </div>
          <p className="ld-signature">Posicionamento • Identidade • Estratégia</p>
        </div>

        <div className="ld-hero-visual ld-reveal">
          <img src={asset('/assets/laduna-hero.png')} alt="Identidade visual oficial da LADUNA Studio" />
        </div>
      </div>
    </section>
  );
}

function StatsBand() {
  return (
    <section className="ld-stats-band" aria-label="Provas rápidas">
      <div className="ld-container ld-stats-grid">
        {stats.map((item) => (
          <article key={item.value}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </article>
        ))}
      </div>
    </section>
  );
}

function PainSection() {
  return (
    <section className="ld-section ld-pain-section">
      <div className="ld-container ld-two-column">
        <div className="ld-section-copy ld-reveal">
          <p className="ld-eyebrow">O problema</p>
          <h2>Sua marca está postando, mas não está se posicionando?</h2>
          <p>
            Muitas empresas aparecem no Instagram, mas não constroem percepção. Publicam sem direção, usam artes inconsistentes, não têm linha editorial e acabam parecendo menores do que realmente são.
          </p>
          <strong className="ld-closing-line">É aqui que a LADUNA entra.</strong>
        </div>
        <div className="ld-pain-grid ld-reveal">
          {painPoints.map((point) => (
            <article key={point}>{point}</article>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section className="ld-section ld-about-section" id="sobre">
      <div className="ld-container ld-about-grid">
        <div className="ld-about-image ld-reveal">
          <img src={asset('/assets/laduna-emblem.png')} alt="Emblema oficial da LADUNA Studio" loading="lazy" />
        </div>
        <div className="ld-section-copy ld-reveal">
          <p className="ld-eyebrow">Sobre a LADUNA</p>
          <h2>Mais que presença digital. Construímos marcas com direção.</h2>
          <p>
            A LADUNA Studio é uma agência de marketing, posicionamento e mídia digital criada para transformar marcas em presenças fortes, profissionais e comercialmente estratégicas.
          </p>
          <p>Mais do que criar artes bonitas, construímos comunicação com direção, estética e intenção de venda.</p>
          <p className="ld-signature">Posicionamento • Identidade • Estratégia</p>
        </div>
      </div>
    </section>
  );
}

function PillarsSection() {
  return (
    <section className="ld-section">
      <div className="ld-container">
        <SectionHeading eyebrow="Método" title="O método LADUNA nasce de três pilares." />
        <div className="ld-cards-grid ld-three">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <article className="ld-feature-card ld-reveal" key={pillar.title}>
                <div className="ld-card-topline">
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <Icon size={22} />
                </div>
                <h3>{pillar.title}</h3>
                <p>{pillar.text}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ServicesSection() {
  return (
    <section className="ld-section ld-services-section" id="servicos">
      <div className="ld-container">
        <SectionHeading
          eyebrow="Soluções"
          title="Soluções para transformar presença em crescimento."
          text="Da identidade visual ao tráfego pago, criamos estruturas digitais para que sua marca seja vista, lembrada e escolhida."
          wide
        />
        <div className="ld-cards-grid ld-services-grid">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <article className={`ld-service-card ld-reveal ${service.title.includes('Consultoria') ? 'is-wide' : ''}`} key={service.title}>
                <div className="ld-service-icon">
                  <Icon size={22} />
                </div>
                <span>{service.tag}</span>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
                <a href={whatsappLink(messages.general)} target="_blank" rel="noreferrer">
                  Conversar sobre isso
                  <ChevronRight size={16} />
                </a>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function PortfolioSection() {
  return (
    <section className="ld-section ld-portfolio-section" id="portfolio">
      <div className="ld-container">
        <SectionHeading
          eyebrow="Portfólio"
          title="Projetos que saíram do improviso."
          text="Criativos, campanhas e identidades pensadas para gerar percepção, autoridade e venda."
          wide
        />
        <div className="ld-portfolio-grid">
          {projects.map((project) => (
            <article className="ld-project-card ld-reveal" key={project.name}>
              <div className={`ld-project-art is-${project.variant}`} aria-hidden="true">
                <span>{project.name}</span>
              </div>
              <div>
                <span>{project.segment}</span>
                <h3>{project.name}</h3>
                <p>{project.objective}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="ld-centered-action ld-reveal">
          <a className="ld-button ld-button-secondary" href={whatsappLink(messages.portfolio)} target="_blank" rel="noreferrer">
            Conversar sobre um projeto
          </a>
        </div>
      </div>
    </section>
  );
}

function BeforeAfterSection() {
  return (
    <section className="ld-section ld-before-after-section">
      <div className="ld-container ld-split-feature">
        <div className="ld-section-copy ld-reveal">
          <p className="ld-eyebrow">Antes e depois</p>
          <h2>Do improviso à presença profissional.</h2>
          <p>
            Uma marca forte não depende de post isolado. Ela precisa de linha visual, mensagem clara, oferta bem apresentada e campanha com intenção.
          </p>
        </div>
        <div className="ld-comparison ld-reveal" aria-label="Comparativo visual de presença digital antes e depois">
          <div className="ld-comparison-panel is-before">
            <span>Antes</span>
            <strong>Postagens soltas, visual sem padrão e pouca direção comercial.</strong>
          </div>
          <div className="ld-comparison-panel is-after">
            <span>Depois</span>
            <strong>Identidade consistente, conteúdo com intenção e campanhas conectadas.</strong>
          </div>
        </div>
      </div>
    </section>
  );
}

function PlansSection() {
  return (
    <section className="ld-section ld-plans-section" id="planos">
      <div className="ld-container">
        <SectionHeading
          eyebrow="Planos"
          title="Escolha o nível de presença que sua marca precisa."
          text="Planos pensados para diferentes estágios de maturidade digital, sempre com direção estratégica."
          wide
        />
        <div className="ld-plans-grid">
          {plans.map((plan) => (
            <article className={`ld-plan-card ld-reveal ${plan.featured ? 'is-featured' : ''} ${plan.dark ? 'is-dark' : ''}`} key={plan.name}>
              <span>Plano</span>
              <h3>{plan.name}</h3>
              <p>{plan.text}</p>
              <ul>
                {plan.items.map((item) => (
                  <li key={item}>
                    <Check size={15} />
                    {item}
                  </li>
                ))}
              </ul>
              <a href={whatsappLink(messages.plans)} target="_blank" rel="noreferrer">
                Esse plano é para mim
              </a>
            </article>
          ))}
        </div>
        <div className="ld-centered-action ld-reveal">
          <a className="ld-button ld-button-primary" href={whatsappLink(messages.plans)} target="_blank" rel="noreferrer">
            Descobrir plano ideal
            <ArrowRight size={18} />
          </a>
        </div>
      </div>
    </section>
  );
}

function DiagnosticSection() {
  const checks = ['Leitura de posicionamento e percepção', 'Análise de identidade visual e conteúdo', 'Mapa de oportunidades comerciais', 'Direção para próximos passos'];

  return (
    <section className="ld-section ld-diagnostic-section" id="diagnostico">
      <div className="ld-container ld-diagnostic-grid">
        <div className="ld-diagnostic-visual ld-reveal">
          <img src={asset('/assets/laduna-emblem.png')} alt="Emblema oficial da LADUNA Studio" loading="lazy" />
        </div>
        <div className="ld-section-copy ld-reveal">
          <p className="ld-eyebrow">Diagnóstico estratégico</p>
          <h2>Antes de criar mais conteúdo, descubra o que está travando sua marca.</h2>
          <p>
            O diagnóstico LADUNA analisa sua presença digital, identidade visual, comunicação, concorrência e oportunidades para criar uma direção clara de crescimento.
          </p>
          <ul className="ld-check-list">
            {checks.map((check) => (
              <li key={check}>
                <BadgeCheck size={18} />
                {check}
              </li>
            ))}
          </ul>
          <a className="ld-button ld-button-primary" href={whatsappLink(messages.diagnostic)} target="_blank" rel="noreferrer">
            Quero meu diagnóstico
            <ArrowRight size={18} />
          </a>
        </div>
      </div>
    </section>
  );
}

function BrandsSection() {
  return (
    <section className="ld-section ld-brands-section">
      <div className="ld-container">
        <SectionHeading eyebrow="Marcas atendidas" title="Marcas que confiaram na estratégia LADUNA." />
        <div className="ld-brands-grid ld-reveal">
          {brands.map(([brand, segment]) => (
            <article key={brand}>
              <strong>{brand}</strong>
              <span>{segment}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section className="ld-section ld-testimonials-section">
      <div className="ld-container">
        <SectionHeading eyebrow="Depoimentos" title="Quem já saiu do improviso com a LADUNA." />
        <div className="ld-cards-grid ld-three">
          {testimonials.map((item) => (
            <article className="ld-testimonial-card ld-reveal" key={item.quote}>
              <p>"{item.quote}"</p>
              <div>
                <strong>{item.author}</strong>
                <span>{item.company}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="ld-final-cta ld-section" id="contato">
      <div className="ld-container ld-final-cta-grid">
        <div className="ld-reveal">
          <p className="ld-eyebrow">Próximo passo</p>
          <h2>Sua marca já tem potencial. Falta direção.</h2>
          <p>Vamos construir uma presença digital mais profissional, estratégica e preparada para vender.</p>
        </div>
        <div className="ld-final-actions ld-reveal">
          <a className="ld-button ld-button-primary" href={whatsappLink(messages.general)} target="_blank" rel="noreferrer">
            Falar com a LADUNA
            <ArrowRight size={18} />
          </a>
          <a className="ld-button ld-button-secondary" href="#servicos">
            Ver serviços
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="ld-footer">
      <div className="ld-container ld-footer-grid">
        <div className="ld-footer-brand">
          <LogoMark dark />
          <p>Posicionamento • Identidade • Estratégia</p>
          <p>Atendimento local, regional e online.</p>
        </div>
        <div>
          <h3>Contato</h3>
          <a href="https://www.instagram.com/ladunastudio" target="_blank" rel="noreferrer">
            <Instagram size={16} />
            @ladunastudio
          </a>
          <a href="https://wa.me/5566996361345" target="_blank" rel="noreferrer">
            <Phone size={16} />
            (66) 9 9636-1345
          </a>
          <a href="mailto:ladunastudio@gmail.com">
            <Mail size={16} />
            ladunastudio@gmail.com
          </a>
          <span>Peixoto de Azevedo - MT</span>
        </div>
        <div>
          <h3>Links rápidos</h3>
          <a href="#servicos">Serviços</a>
          <a href="#portfolio">Portfólio</a>
          <a href="#planos">Planos</a>
          <a href="#diagnostico">Diagnóstico</a>
        </div>
        <div>
          <h3>Serviços</h3>
          <span>Social media</span>
          <span>Branding</span>
          <span>Tráfego pago</span>
          <span>Sites e landing pages</span>
        </div>
      </div>
      <div className="ld-container ld-footer-bottom">
        <span>© 2026 LADUNA Studio. Todos os direitos reservados.</span>
        <span>CNPJ: 64.110.259/0001-78</span>
      </div>
    </footer>
  );
}

function WhatsAppButton() {
  return (
    <a className="ld-whatsapp-float" href={whatsappLink(messages.diagnostic)} target="_blank" rel="noreferrer" aria-label="Chamar LADUNA no WhatsApp">
      WA
    </a>
  );
}

export function LadunaLanding() {
  const sections = useMemo(
    () => [
      <Hero key="hero" />,
      <StatsBand key="stats" />,
      <PainSection key="pain" />,
      <AboutSection key="about" />,
      <PillarsSection key="pillars" />,
      <ServicesSection key="services" />,
      <PortfolioSection key="portfolio" />,
      <BeforeAfterSection key="before-after" />,
      <PlansSection key="plans" />,
      <DiagnosticSection key="diagnostic" />,
      <BrandsSection key="brands" />,
      <TestimonialsSection key="testimonials" />,
      <FinalCTA key="final-cta" />
    ],
    []
  );

  useEffect(() => {
    document.title = 'LADUNA Studio | Posicionamento, Identidade e Estratégia Digital';

    const metaDescription = document.querySelector('meta[name="description"]');
    metaDescription?.setAttribute(
      'content',
      'A LADUNA Studio cria estratégias de marketing, social media, branding, vídeos, tráfego pago e sites para empresas e profissionais que querem crescer com presença digital forte.'
    );

    const revealItems = document.querySelectorAll('.ld-reveal');
    if (!('IntersectionObserver' in window)) {
      revealItems.forEach((item) => item.classList.add('is-visible'));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealItems.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="ld-site">
      <a className="ld-skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo">{sections}</main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
