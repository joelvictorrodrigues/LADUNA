import {
  DEMO_DASHBOARD,
  DEMO_ORGANIZATIONS,
  DEMO_PROFILES,
  DEMO_REQUESTS,
  emptyDashboard
} from './data.js';
import {portalLogin} from './login.js';

const SESSION_KEY = 'laduna_portal_firebase_session';
const clone = (value) => JSON.parse(JSON.stringify(value));

const firebaseError = (code = '') => {
  const messages = {
    EMAIL_NOT_FOUND: 'E-mail ou senha incorretos.',
    INVALID_PASSWORD: 'E-mail ou senha incorretos.',
    INVALID_LOGIN_CREDENTIALS: 'E-mail ou senha incorretos.',
    USER_DISABLED: 'Este acesso está pausado. Fale com a LADUNA.',
    TOO_MANY_ATTEMPTS_TRY_LATER: 'Muitas tentativas. Aguarde alguns minutos e tente novamente.',
  };
  return messages[code] || 'Não foi possível entrar agora. Tente novamente.';
};

export class PortalApi {
  constructor(config, demo = false) {
    this.config = config;
    this.demo = demo;
    this.session = this.readSession();
    this.demoOrganizations = clone(DEMO_ORGANIZATIONS);
    this.demoProfiles = clone(DEMO_PROFILES);
    this.demoDashboards = {'demo-org-1':clone(DEMO_DASHBOARD),'demo-org-2':emptyDashboard('Empresa Modelo')};
    this.demoRequests = clone(DEMO_REQUESTS);
    this.portal = null;
  }

  static async initialize() {
    const params = new URLSearchParams(window.location.search);
    const localPreview = ['localhost','127.0.0.1'].includes(window.location.hostname);
    const demo = params.get('demo') === '1' && localPreview;
    if (demo) return new PortalApi({ready:true},true);
    try {
      const response = await fetch('/.netlify/functions/portal-config',{headers:{Accept:'application/json'},cache:'no-store'});
      const config = await response.json();
      return new PortalApi(config,false);
    } catch {
      return new PortalApi({ready:false,message:'A conexão segura do portal ainda não foi configurada.'},false);
    }
  }

  readSession() {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY)||'null'); }
    catch { return null; }
  }

  saveSession(session) {
    this.session=session;
    if(session) localStorage.setItem(SESSION_KEY,JSON.stringify(session));
    else localStorage.removeItem(SESSION_KEY);
  }

  isConfigured() {
    return this.demo || Boolean(this.config?.ready&&this.config?.apiKey&&this.config?.databaseURL);
  }

  async login(email,password) {
    if(this.demo){
      const profile=this.demoProfiles.find(item=>item.role==='client');
      const session={idToken:'demo-client',refreshToken:'',expiresAt:Date.now()+3600000,user:{id:profile.id,email:profile.email}};
      this.saveSession(session);
      return session;
    }
    email=portalLogin(email).email;
    const response=await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${encodeURIComponent(this.config.apiKey)}`,{
      method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password,returnSecureToken:true})
    });
    const payload=await response.json().catch(()=>({}));
    if(!response.ok) throw new Error(firebaseError(payload?.error?.message));
    const session={
      idToken:payload.idToken,
      refreshToken:payload.refreshToken,
      expiresAt:Date.now()+(Number(payload.expiresIn||3600)*1000),
      user:{id:payload.localId,email:payload.email}
    };
    this.saveSession(session);
    return session;
  }

  async logout() {
    this.portal=null;
    this.saveSession(null);
  }

  async refreshSession() {
    if(this.demo||!this.session?.refreshToken) return this.session;
    const response=await fetch(`https://securetoken.googleapis.com/v1/token?key=${encodeURIComponent(this.config.apiKey)}`,{
      method:'POST',
      headers:{'Content-Type':'application/x-www-form-urlencoded'},
      body:new URLSearchParams({grant_type:'refresh_token',refresh_token:this.session.refreshToken})
    });
    const payload=await response.json().catch(()=>({}));
    if(!response.ok){this.saveSession(null);return null;}
    const session={
      idToken:payload.id_token,
      refreshToken:payload.refresh_token,
      expiresAt:Date.now()+(Number(payload.expires_in||3600)*1000),
      user:{id:payload.user_id,email:this.session.user.email}
    };
    this.saveSession(session);
    return session;
  }

  async ensureSession() {
    if(!this.session) return null;
    if(this.demo) return this.session;
    if(Date.now()>=Number(this.session.expiresAt||0)-60000) return this.refreshSession();
    return this.session;
  }

  async database(path,options={},retry=true) {
    const session=await this.ensureSession();
    if(!session?.idToken) throw new Error('Sua sessão expirou. Entre novamente.');
    const clean=String(path||'').split('/').filter(Boolean).map(encodeURIComponent).join('/');
    const response=await fetch(`${String(this.config.databaseURL).replace(/\/$/,'')}/${clean}.json?auth=${encodeURIComponent(session.idToken)}`,{
      cache:'no-store',...options,
      headers:{...(options.body?{'Content-Type':'application/json'}:{}),...(options.headers||{})}
    });
    if(response.status===401&&retry&&this.session?.refreshToken){
      const refreshed=await this.refreshSession();
      if(refreshed) return this.database(path,options,false);
    }
    const text=await response.text();
    let payload=null;
    try{payload=text?JSON.parse(text):null;}catch{payload=null;}
    if(!response.ok) throw new Error(payload?.error||'Não foi possível carregar os dados do portal.');
    return payload;
  }

  async loadPortal() {
    if(this.demo) return null;
    if(this.portal) return this.portal;
    const uid=this.session?.user?.id;
    if(!uid) return null;
    this.portal=await this.database(`portalClientes/${uid}`);
    return this.portal;
  }

  async getProfile() {
    if(this.demo) return clone(this.demoProfiles.find(item=>item.role==='client'));
    const portal=await this.loadPortal();
    if(!portal) return null;
    return {
      id:this.session.user.id,
      full_name:portal.profile?.full_name||portal.empresa?.name||'Cliente LADUNA',
      email:this.session.user.email,
      role:'client',
      active:portal.status==='active'
    };
  }

  async getMembership(userId) {
    if(this.demo) return {user_id:userId,organization_id:'demo-org-1',role:'client'};
    const portal=await this.loadPortal();
    return portal?{user_id:userId,organization_id:userId,role:'client'}:null;
  }

  async getOrganization(id) {
    if(this.demo) return clone(this.demoOrganizations[0]);
    const portal=await this.loadPortal();
    if(!portal) return null;
    return {
      id,
      name:portal.empresa?.name||'Cliente LADUNA',
      segment:portal.empresa?.segment||'Cliente LADUNA',
      logo_url:portal.empresa?.logo_url||'',
      accent_color:portal.empresa?.accent_color||'#6B4A7D',
      status:portal.status||'paused',
      modules:portal.modules||{},
      updated_at:portal.atualizadoEm||portal.dashboard?.atualizadoEm||''
    };
  }

  async getDashboard() {
    if(this.demo) return clone(this.demoDashboards['demo-org-1']);
    const portal=await this.loadPortal();
    return portal?.dashboard||emptyDashboard(portal?.empresa?.name||'Cliente');
  }

  async listRequests() {
    if(this.demo) return clone(this.demoRequests);
    const uid=this.session?.user?.id;
    const payload=await this.database(`portalSolicitacoes/${uid}`);
    return Object.values(payload||{}).sort((a,b)=>String(b.created_at||'').localeCompare(String(a.created_at||'')));
  }

  async createRequest(input) {
    if(this.demo){
      const item={id:`request-${Date.now()}`,status:'open',created_at:new Date().toISOString(),...input};
      this.demoRequests.unshift(item);
      return clone(item);
    }
    const uid=this.session?.user?.id;
    const id=`solicitacao-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
    const item={
      id,
      organization_id:uid,
      created_by:uid,
      title:String(input?.title||'').trim().slice(0,120),
      message:String(input?.message||'').trim().slice(0,1500),
      status:'open',
      created_at:new Date().toISOString()
    };
    await this.database(`portalSolicitacoes/${uid}/${id}`,{method:'PUT',body:JSON.stringify(item)});
    return item;
  }
}

