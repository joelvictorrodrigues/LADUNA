export function portalLogin(value){
  const login=String(value||'').trim().toLowerCase()
  if(login.includes('@')){
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(login)||login.length>254||login.endsWith('@clientes.laduna.invalid'))throw Error('Informe um e-mail válido ou um nome de usuário.')
    return {login,email:login,kind:'email'}
  }
  if(!/^[a-z0-9][a-z0-9._-]{2,39}$/.test(login))throw Error('O usuário deve ter de 3 a 40 caracteres: letras, números, ponto, hífen ou sublinhado.')
  return {login,email:`u.${login.replaceAll('.','+')}@clientes.laduna.invalid`,kind:'username'}
}
