export const MODULES = [
  { id: 'overview', label: 'Visão geral', icon: 'layout-dashboard' },
  { id: 'sales', label: 'Vendas e receita', icon: 'chart-column' },
  { id: 'marketing', label: 'Leads e marketing', icon: 'megaphone' },
  { id: 'goals', label: 'Metas', icon: 'target' },
  { id: 'content', label: 'Calendário', icon: 'calendar' },
  { id: 'reports', label: 'Relatórios', icon: 'file-chart' },
  { id: 'requests', label: 'Solicitações', icon: 'messages' }
];

export const DEFAULT_MODULES = {
  overview: true,
  sales: true,
  marketing: true,
  goals: true,
  content: true,
  reports: true,
  requests: true
};

export const emptyDashboard = (name = 'Cliente') => ({
  periodLabel: 'Período atual',
  overview: {
    title: `Panorama de ${name}`,
    summary: 'Os dados deste painel ainda estão sendo preparados pela equipe LADUNA.',
    kpis: [
      { label: 'Receita', value: 'Não informado', context: 'Aguardando atualização', delta: '', tone: 'neutral' },
      { label: 'Vendas', value: 'Não informado', context: 'Aguardando atualização', delta: '', tone: 'neutral' },
      { label: 'Leads', value: 'Não informado', context: 'Aguardando atualização', delta: '', tone: 'neutral' },
      { label: 'Conversão', value: 'Não informado', context: 'Aguardando atualização', delta: '', tone: 'neutral' }
    ],
    series: [],
    alerts: []
  },
  sales: {
    title: 'Vendas e receita',
    summary: 'Acompanhamento comercial por categoria e canal.',
    kpis: [],
    categories: [],
    channels: [],
    team: []
  },
  marketing: {
    title: 'Leads e marketing',
    summary: 'Indicadores de aquisição, campanhas e conversão.',
    kpis: [],
    funnel: [],
    campaigns: []
  },
  goals: {
    title: 'Metas do período',
    summary: 'Acompanhamento das prioridades definidas para a empresa.',
    target: 'Não informado',
    achieved: 'Não informado',
    progress: 0,
    items: []
  },
  content: {
    title: 'Calendário de conteúdo',
    summary: 'Planejamento de publicações e campanhas.',
    items: []
  },
  reports: {
    title: 'Relatórios',
    summary: 'Documentos e análises disponibilizados pela LADUNA.',
    items: []
  }
});

export const DEMO_ORGANIZATIONS = [
  {
    id: 'demo-org-1',
    name: 'Cliente Demonstração',
    slug: 'cliente-demonstracao',
    segment: 'Varejo e serviços',
    logo_url: '',
    accent_color: '#5F6F62',
    status: 'active',
    modules: { ...DEFAULT_MODULES },
    updated_at: '2026-09-26T14:30:00-03:00'
  },
  {
    id: 'demo-org-2',
    name: 'Empresa Modelo',
    slug: 'empresa-modelo',
    segment: 'Serviços profissionais',
    logo_url: '',
    accent_color: '#6B4A7D',
    status: 'active',
    modules: { overview: true, sales: false, marketing: true, goals: true, content: true, reports: true, requests: true },
    updated_at: '2026-09-25T17:10:00-03:00'
  }
];

export const DEMO_PROFILES = [
  { id: 'demo-admin', full_name: 'Joel Rodrigues', email: 'admin@laduna.demo', role: 'admin', active: true },
  { id: 'demo-client', full_name: 'Cliente Demonstração', email: 'cliente@empresa.demo', role: 'client', active: true, organization_id: 'demo-org-1' }
];

export const DEMO_DASHBOARD = {
  periodLabel: 'Setembro de 2026',
  overview: {
    title: 'A operação segue em crescimento, com atenção à conversão',
    summary: 'A receita está próxima do ritmo esperado. O volume de leads avançou, mas o aproveitamento comercial ainda pode crescer com respostas mais rápidas e campanhas mais específicas.',
    kpis: [
      { label: 'Receita', value: 'R$ 128.400', context: 'Meta do mês: R$ 150.000', delta: '+8,4%', tone: 'success' },
      { label: 'Vendas', value: '612', context: 'Esperado até hoje: 590', delta: '+3,7%', tone: 'success' },
      { label: 'Leads', value: '438', context: 'Origem paga e orgânica', delta: '+12,1%', tone: 'success' },
      { label: 'Conversão', value: '24,6%', context: 'Meta definida: 28%', delta: '-3,4 p.p.', tone: 'warning' }
    ],
    series: [
      { label: 'Sem 1', value: 24, target: 23 },
      { label: 'Sem 2', value: 29, target: 27 },
      { label: 'Sem 3', value: 34, target: 32 },
      { label: 'Sem 4', value: 41, target: 45 }
    ],
    alerts: [
      { title: 'Conversão abaixo da meta', description: 'O volume de oportunidades cresceu, mas a taxa de fechamento recuou na última semana.', status: 'Atenção', tone: 'warning' },
      { title: 'Campanha institucional em alta', description: 'A campanha gerou 31% mais visitas qualificadas que a média do período.', status: 'Positivo', tone: 'success' },
      { title: 'Tempo de resposta', description: '18 contatos aguardaram mais de uma hora para receber o primeiro atendimento.', status: 'Prioridade', tone: 'danger' }
    ]
  },
  sales: {
    title: 'Vendas e receita',
    summary: 'Desempenho comercial consolidado por categoria, canal e equipe.',
    kpis: [
      { label: 'Receita', value: 'R$ 128.400', context: '85,6% da meta', delta: '+8,4%', tone: 'success' },
      { label: 'Pedidos', value: '612', context: 'Ticket médio de R$ 209,80', delta: '+3,7%', tone: 'success' },
      { label: 'Ticket médio', value: 'R$ 209,80', context: 'Meta: R$ 220,00', delta: '-4,6%', tone: 'warning' },
      { label: 'Recorrência', value: '32%', context: 'Clientes que voltaram a comprar', delta: '+2,1 p.p.', tone: 'success' }
    ],
    categories: [
      { name: 'Categoria A', value: 'R$ 48.900', progress: 91, target: 'R$ 54.000' },
      { name: 'Categoria B', value: 'R$ 42.600', progress: 82, target: 'R$ 52.000' },
      { name: 'Categoria C', value: 'R$ 36.900', progress: 84, target: 'R$ 44.000' }
    ],
    channels: [
      { name: 'Loja física', value: 'R$ 72.300', share: '56%' },
      { name: 'WhatsApp', value: 'R$ 34.100', share: '27%' },
      { name: 'Instagram', value: 'R$ 22.000', share: '17%' }
    ],
    team: [
      { name: 'Equipe comercial 1', sales: '228', revenue: 'R$ 48.200', ticket: 'R$ 211,40' },
      { name: 'Equipe comercial 2', sales: '207', revenue: 'R$ 43.800', ticket: 'R$ 211,60' },
      { name: 'Equipe comercial 3', sales: '177', revenue: 'R$ 36.400', ticket: 'R$ 205,60' }
    ]
  },
  marketing: {
    title: 'Leads e marketing',
    summary: 'Acompanhamento do investimento, aquisição e retorno das campanhas.',
    kpis: [
      { label: 'Conversas iniciadas', value: '438', context: 'Meta: 470', delta: '+12,1%', tone: 'success' },
      { label: 'Investimento', value: 'R$ 3.840', context: '74% do orçamento mensal', delta: '', tone: 'neutral' },
      { label: 'Custo por lead', value: 'R$ 8,77', context: 'Meta: até R$ 10,00', delta: '-11,2%', tone: 'success' },
      { label: 'Receita atribuída', value: 'R$ 38.600', context: 'Retorno estimado: 10,1x', delta: '+18,6%', tone: 'success' }
    ],
    funnel: [
      { label: 'Alcance', value: '62.400', percent: 100 },
      { label: 'Cliques', value: '3.820', percent: 72 },
      { label: 'Conversas', value: '438', percent: 51 },
      { label: 'Orçamentos', value: '206', percent: 34 },
      { label: 'Vendas', value: '108', percent: 20 }
    ],
    campaigns: [
      { name: 'Campanha institucional', status: 'Ativa', investment: 'R$ 1.420', leads: '164', result: 'R$ 15.900', return: '11,2x' },
      { name: 'Oferta do mês', status: 'Ativa', investment: 'R$ 1.680', leads: '191', result: 'R$ 18.400', return: '11,0x' },
      { name: 'Remarketing', status: 'Em análise', investment: 'R$ 740', leads: '83', result: 'R$ 4.300', return: '5,8x' }
    ]
  },
  goals: {
    title: 'Metas do ciclo atual',
    summary: 'Prioridades comerciais e de marketing acompanhadas pela LADUNA.',
    target: 'R$ 150.000',
    achieved: 'R$ 128.400',
    progress: 86,
    items: [
      { label: 'Receita', value: 'R$ 150 mil', progress: 86 },
      { label: 'Novos clientes', value: '120', progress: 78 },
      { label: 'Conversão', value: '28%', progress: 88 },
      { label: 'Conteúdos', value: '24 peças', progress: 75 }
    ]
  },
  content: {
    title: 'Calendário de conteúdo',
    summary: 'Próximas publicações, campanhas e entregas planejadas.',
    items: [
      { date: '28 SET', title: 'Carrossel educativo', channel: 'Instagram', status: 'Aprovado' },
      { date: '30 SET', title: 'Campanha de encerramento do mês', channel: 'Instagram e WhatsApp', status: 'Em produção' },
      { date: '02 OUT', title: 'Vídeo de posicionamento', channel: 'Reels', status: 'Aguardando aprovação' },
      { date: '05 OUT', title: 'Abertura da campanha mensal', channel: 'Mídia paga', status: 'Planejado' }
    ]
  },
  reports: {
    title: 'Relatórios',
    summary: 'Documentos e análises publicados pela equipe LADUNA.',
    items: [
      { title: 'Relatório de performance', period: 'Setembro de 2026', url: '#' },
      { title: 'Plano de ação comercial', period: 'Ciclo atual', url: '#' },
      { title: 'Análise de campanhas', period: 'Agosto de 2026', url: '#' }
    ]
  }
};

export const DEMO_REQUESTS = [
  {
    id: 'request-1',
    organization_id: 'demo-org-1',
    title: 'Atualização de campanha',
    message: 'Precisamos alterar a data final da campanha do mês.',
    status: 'open',
    created_at: '2026-09-25T09:20:00-03:00'
  },
  {
    id: 'request-2',
    organization_id: 'demo-org-1',
    title: 'Novo material comercial',
    message: 'Solicitação recebida e encaminhada para a equipe de criação.',
    status: 'in_progress',
    created_at: '2026-09-22T15:40:00-03:00'
  }
];
