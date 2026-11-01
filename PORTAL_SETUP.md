# Portal LADUNA

O portal usa Supabase para autenticação, banco de dados e isolamento entre clientes. A chave secreta é utilizada somente na função segura do Netlify.

## 1. Criar o projeto

1. Crie um projeto no Supabase.
2. Abra o SQL Editor e execute `supabase/migrations/001_portal.sql`.
3. Em Authentication, crie o primeiro usuário administrativo.
4. Em Authentication, desative novos cadastros públicos. Os clientes serão criados somente pela administração da LADUNA.
5. No SQL Editor, transforme o primeiro usuário em administrador:

```sql
update public.profiles
set role = 'admin', full_name = 'Joel Rodrigues', active = true
where email = 'SEU_EMAIL_AQUI';
```

## 2. Configurar o Netlify

Adicione estas variáveis em Project configuration, Environment variables:

```text
SUPABASE_URL=https://SEU-PROJETO.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
SUPABASE_SECRET_KEY=sb_secret_...
```

`SUPABASE_SECRET_KEY` nunca deve ser adicionada a arquivos públicos, JavaScript do navegador ou mensagens.

## 3. Endereços

- Login do portal: `/portal/`
- Demonstração administrativa: `/portal/?demo=1`

Depois do primeiro login administrativo, cadastre a empresa, configure os módulos, publique os dados e crie o acesso do cliente.
