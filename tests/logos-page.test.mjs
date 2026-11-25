import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';

const dir=new URL('../frontend/public/logos/',import.meta.url);
const read=name=>readFile(new URL(name,dir),'utf8');
const ctx={window:{}};
vm.createContext(ctx);
vm.runInContext(await read('logos-data.js'),ctx);
const D=ctx.window.LOGOS;
const unique=list=>assert.equal(new Set(list.map(o=>o.id)).size,list.length);

test('briefing curto: de 8 a 10 telas em 6 fases',()=>{
  assert.ok(D.TELAS.length>=8&&D.TELAS.length<=10);
  assert.equal(D.FASES.length,6);
  assert.deepEqual([...new Set(D.TELAS.map(t=>t.fase))],[0,1,2,3,4,5]);
});
test('oito tipos de logo, cada um com pelo menos dois logos reais',()=>{
  assert.equal(D.TIPOS.length,8);unique(D.TIPOS);
  for(const t of D.TIPOS){assert.ok(t.brands.length>=2,t.id);for(const b of t.brands) assert.match(b.slug,/^[a-z0-9]+$/);}
});
test('seis estilos de letra e seis caminhos de cor com marcas de exemplo',()=>{
  assert.equal(D.LETRAS.length,6);unique(D.LETRAS);
  for(const l of D.LETRAS){assert.ok(l.brands.length>=1);assert.ok(D.CONFIG.fontsCss.includes(l.font.replace(/'/g,'').replace(/ /g,'+')),l.font);}
  assert.equal(D.CORES.length,6);unique(D.CORES);
  for(const c of D.CORES){assert.ok(c.brands.length>=2,c.id);assert.equal(c.cores.length,4);for(const h of c.cores) assert.match(h,/^#[0-9A-F]{6}$/i);for(const b of c.brands) assert.match(b.hex,/^#[0-9A-F]{6}$/i);}
});
test('opções com IDs únicos',()=>{for(const k of ['MOMENTO','PALAVRAS','TOM','USOS','EVITAR']) unique(D[k]);});
test('contato do site, versão fixa da biblioteca de logos e rascunho sem contato',async()=>{
  const planos=await readFile(new URL('../planos/planos.js',dir),'utf8');
  assert.ok(planos.includes(`'${D.CONFIG.whatsapp}'`));
  assert.match(D.CONFIG.logoCdn,/^https:\/\/cdn\.jsdelivr\.net\/npm\/simple-icons@\d+\.\d+\.\d+\/icons\/$/);
  const js=await read('logos.js');
  assert.match(js,/setItem\(C\.draftKey, JSON\.stringify\(\{ v: C\.version, i: [^}]*a: S\.a \}\)\)/);
  assert.ok((await read('logos.css')).includes('prefers-reduced-motion'));
  assert.ok((await read('index.html')).includes('rel="canonical" href="https://www.ladunastudio.com.br/logos/"'));
});
