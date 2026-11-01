import {
  DEMO_DASHBOARD,
  DEMO_ORGANIZATIONS,
  DEMO_PROFILES,
  DEMO_REQUESTS,
  emptyDashboard
} from './data.js';

const SESSION_KEY = 'laduna_portal_session';

const clone = (value) => JSON.parse(JSON.stringify(value));

export class PortalApi {
  constructor(config, demo = false) {
    this.config = config;
    this.demo = demo;
    this.session = this.readSession();
    this.demoOrganizations = clone(DEMO_ORGANIZATIONS);
    this.demoProfiles = clone(DEMO_PROFILES);
    this.demoDashboards = {
      'demo-org-1': clone(DEMO_DASHBOARD),
      'demo-org-2': emptyDashboard('Empresa Modelo')
    };
    this.demoRequests = clone(DEMO_REQUESTS);
  }

  static async initialize() {
    const params = new URLSearchParams(window.location.search);
    const localPreview = ['localhost', '127.0.0.1'].includes(window.location.hostname);
    const demo = params.get('demo') === '1' && localPreview;
    if (demo) return new PortalApi({ ready: true }, true);

    try {
      const response = await fetch('/.netlify/functions/portal-config', { headers: { Accept: 'application/json' } });
      const config = await response.json();
      return new PortalApi(config, false);
    } catch (error) {
      return new PortalApi({ ready: false, message: 'A conexão segura do portal ainda não foi configurada.' }, false);
    }
  }

  readSession() {
    try {
      return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
    } catch (error) {
      return null;
    }
  }

  saveSession(session) {
    this.session = session;
    if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    else localStorage.removeItem(SESSION_KEY);
  }

  isConfigured() {
    return this.demo || Boolean(this.config?.ready && this.config?.supabaseUrl && this.config?.publishableKey);
  }

  async login(email, password) {
    if (this.demo) {
      const role = email.toLowerCase().includes('cliente') ? 'client' : 'admin';
      const profile = this.demoProfiles.find((item) => item.role === role);
      const session = { access_token: `demo-${role}`, refresh_token: '', user: { id: profile.id, email: profile.email } };
      this.saveSession(session);
      return session;
    }

    const response = await fetch(`${this.config.supabaseUrl}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        apikey: this.config.publishableKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    const payload = await response.json();
    if (!response.ok) throw new Error('E-mail ou senha incorretos.');
    this.saveSession(payload);
    return payload;
  }

  async logout() {
    if (!this.demo && this.session?.access_token) {
      try {
        await fetch(`${this.config.supabaseUrl}/auth/v1/logout`, {
          method: 'POST',
          headers: {
            apikey: this.config.publishableKey,
            Authorization: `Bearer ${this.session.access_token}`
          }
        });
      } catch (error) {
        // Local sign-out must still succeed when the remote session has expired.
      }
    }
    this.saveSession(null);
  }

  async refreshSession() {
    if (this.demo || !this.session?.refresh_token) return this.session;
    const response = await fetch(`${this.config.supabaseUrl}/auth/v1/token?grant_type=refresh_token`, {
      method: 'POST',
      headers: {
        apikey: this.config.publishableKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ refresh_token: this.session.refresh_token })
    });
    if (!response.ok) {
      this.saveSession(null);
      return null;
    }
    const payload = await response.json();
    this.saveSession(payload);
    return payload;
  }

  async rest(path, options = {}, retry = true) {
    if (!this.session?.access_token) throw new Error('Sua sessão expirou. Entre novamente.');
    const response = await fetch(`${this.config.supabaseUrl}/rest/v1/${path}`, {
      ...options,
      headers: {
        apikey: this.config.publishableKey,
        Authorization: `Bearer ${this.session.access_token}`,
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    });

    if (response.status === 401 && retry && this.session?.refresh_token) {
      const refreshed = await this.refreshSession();
      if (refreshed) return this.rest(path, options, false);
    }

    const text = await response.text();
    const payload = text ? JSON.parse(text) : null;
    if (!response.ok) throw new Error(payload?.message || payload?.hint || 'Não foi possível concluir a operação.');
    return payload;
  }

  async getProfile() {
    if (this.demo) {
      const role = this.session?.access_token?.includes('client') ? 'client' : 'admin';
      return clone(this.demoProfiles.find((item) => item.role === role));
    }
    const userId = this.session?.user?.id;
    if (!userId) return null;
    const rows = await this.rest(`profiles?id=eq.${encodeURIComponent(userId)}&select=*`);
    return rows?.[0] || null;
  }

  async getMembership(userId) {
    if (this.demo) {
      const profile = this.demoProfiles.find((item) => item.id === userId);
      return profile?.organization_id ? { user_id: userId, organization_id: profile.organization_id, role: 'client_admin' } : null;
    }
    const rows = await this.rest(`memberships?user_id=eq.${encodeURIComponent(userId)}&select=*&limit=1`);
    return rows?.[0] || null;
  }

  async listOrganizations() {
    if (this.demo) return clone(this.demoOrganizations);
    return this.rest('organizations?select=*&order=name.asc');
  }

  async getOrganization(id) {
    if (this.demo) return clone(this.demoOrganizations.find((item) => item.id === id));
    const rows = await this.rest(`organizations?id=eq.${encodeURIComponent(id)}&select=*`);
    return rows?.[0] || null;
  }

  async createOrganization(input) {
    if (this.demo) {
      const organization = {
        id: `demo-org-${Date.now()}`,
        ...input,
        status: 'active',
        updated_at: new Date().toISOString()
      };
      this.demoOrganizations.push(organization);
      this.demoDashboards[organization.id] = emptyDashboard(organization.name);
      return clone(organization);
    }

    const rows = await this.rest('organizations', {
      method: 'POST',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify(input)
    });
    const organization = rows[0];
    await this.rest('dashboard_content', {
      method: 'POST',
      headers: { Prefer: 'return=minimal' },
      body: JSON.stringify({ organization_id: organization.id, content: emptyDashboard(organization.name) })
    });
    return organization;
  }

  async updateOrganization(id, input) {
    if (this.demo) {
      const index = this.demoOrganizations.findIndex((item) => item.id === id);
      this.demoOrganizations[index] = { ...this.demoOrganizations[index], ...input, updated_at: new Date().toISOString() };
      return clone(this.demoOrganizations[index]);
    }
    const rows = await this.rest(`organizations?id=eq.${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify(input)
    });
    return rows[0];
  }

  async getDashboard(organizationId) {
    if (this.demo) return clone(this.demoDashboards[organizationId] || emptyDashboard('Cliente'));
    const rows = await this.rest(`dashboard_content?organization_id=eq.${encodeURIComponent(organizationId)}&select=*`);
    return rows?.[0]?.content || emptyDashboard('Cliente');
  }

  async saveDashboard(organizationId, content) {
    if (this.demo) {
      this.demoDashboards[organizationId] = clone(content);
      return clone(content);
    }
    await this.rest('dashboard_content?on_conflict=organization_id', {
      method: 'POST',
      headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
      body: JSON.stringify({ organization_id: organizationId, content, updated_at: new Date().toISOString() })
    });
    return content;
  }

  async listProfiles() {
    if (this.demo) return clone(this.demoProfiles);
    const profiles = await this.rest('profiles?select=*,memberships(organization_id)&order=full_name.asc');
    return profiles.map((profile) => ({
      ...profile,
      organization_id: profile.memberships?.[0]?.organization_id || null
    }));
  }

  async createClientUser(input) {
    if (this.demo) {
      const profile = {
        id: `demo-user-${Date.now()}`,
        full_name: input.fullName,
        email: input.email,
        role: 'client',
        active: true,
        organization_id: input.organizationId
      };
      this.demoProfiles.push(profile);
      return clone(profile);
    }
    const response = await fetch('/.netlify/functions/admin-user', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.session.access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(input)
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload?.message || 'Não foi possível criar o acesso.');
    return payload;
  }

  async resetClientPassword(userId, password) {
    if (this.demo) return { success: true };
    const response = await fetch('/.netlify/functions/admin-user', {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${this.session.access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId, password })
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload?.message || 'Não foi possível redefinir a senha.');
    return payload;
  }

  async setUserActive(userId, active) {
    if (this.demo) {
      const profile = this.demoProfiles.find((item) => item.id === userId);
      if (profile) profile.active = active;
      return profile;
    }
    const rows = await this.rest(`profiles?id=eq.${encodeURIComponent(userId)}`, {
      method: 'PATCH',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify({ active })
    });
    return rows[0];
  }

  async listRequests(organizationId = '') {
    if (this.demo) {
      return clone(organizationId ? this.demoRequests.filter((item) => item.organization_id === organizationId) : this.demoRequests);
    }
    const filter = organizationId ? `&organization_id=eq.${encodeURIComponent(organizationId)}` : '';
    return this.rest(`client_requests?select=*&order=created_at.desc${filter}`);
  }

  async createRequest(input) {
    if (this.demo) {
      const item = { id: `request-${Date.now()}`, status: 'open', created_at: new Date().toISOString(), ...input };
      this.demoRequests.unshift(item);
      return clone(item);
    }
    const rows = await this.rest('client_requests', {
      method: 'POST',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify(input)
    });
    return rows[0];
  }

  async updateRequest(id, status) {
    if (this.demo) {
      const item = this.demoRequests.find((request) => request.id === id);
      if (item) item.status = status;
      return clone(item);
    }
    const rows = await this.rest(`client_requests?id=eq.${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify({ status })
    });
    return rows[0];
  }
}
