import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import {links} from '../frontend/public/links/data.js';

const root=new URL('../frontend/public/',import.meta.url);
test('all ten channels have unique identities and real configured destinations',()=>{
  assert.equal(links.length,10);
  assert.equal(new Set(links.map(item=>item.id)).size,10);
  for(const item of links){
    assert.ok(item.title && item.subtitle);
    assert.ok(['https:','mailto:'].includes(new URL(item.url).protocol));
    assert.ok(!item.url.includes('example.com'));
  }
  assert.equal(links.find(item=>item.id==='site').url,'https://ladunastudio.com.br/');
});
test('every banner image exists',async()=>{
  assert.equal(new Set(links.map(item=>item.art)).size,10);
  for(const item of links) await access(new URL(item.art.startsWith('/')?item.art.slice(1):`links/${item.art}`,root));
});
test('all named identity colors match the existing site',async()=>{
  const css=await readFile(new URL('links/links.css',root),'utf8');
  const existing=await readFile(new URL('assets/site.css',root),'utf8');
  for(const [,name,value] of css.matchAll(/(--[a-z-]+):(#[a-f0-9]+)/gi)){
    assert.ok(existing.toLowerCase().includes(`${name}:${value}`.toLowerCase()),`${name} must match official theme`);
  }
  assert.ok(css.includes('prefers-reduced-motion'));
});
