// Destinations verified against the official Linktree on 2026-11-17.
// New original editorial renders; no homepage photography or client work.
const channels = [
  {id:'contato',title:'Fale com a LADUNA',subtitle:'Atendimento e orçamentos.',url:'https://wa.me/5566996361345?text=Ol%C3%A1!%20vim%20do%20site%20e%20queria%20falar%20com%20a%20LADUNA%20Studio!',image:'contato-v2.jpg',theme:'graphite',layout:'contact'},
  {id:'instagram',title:'Instagram',subtitle:'@ladunastudio',url:'https://www.instagram.com/ladunastudio/',image:'instagram-v2.jpg',theme:'light',layout:'reverse'},
  {id:'site',title:'Nosso site',subtitle:'Conheça a LADUNA Studio.',url:'https://ladunastudio.com.br/',image:'site-v2.jpg',theme:'light',layout:'architecture'},
  {id:'google',title:'LADUNA no Google',subtitle:'Encontre nossa empresa.',url:'https://share.google/WUKeROv8MriFWk22U',image:'google-v2.jpg',theme:'lilac',layout:'search'},
  {id:'email',title:'Email',subtitle:'ladunastudio@gmail.com',url:'mailto:ladunastudio@gmail.com',image:'email-v2.jpg',theme:'light',layout:'mail'},
  {id:'consultoria',title:'Consultoria LADUNA',subtitle:'Estratégia para marcas e negócios.',url:'https://tally.so/r/GxKJbk',image:'consultoria-v2.jpg',theme:'purple',layout:'strategy'},
  {id:'tiktok',title:'TikTok',subtitle:'Conteúdos e criatividade.',url:'https://www.tiktok.com/@laduna.studio?_r=1&_t=zs-92ahqtnsmzq',image:'tiktok-v2.jpg',theme:'graphite',layout:'video'},
  {id:'facebook',title:'Facebook',subtitle:'Acompanhe a LADUNA.',url:'https://www.facebook.com/ladunastudio',image:'facebook-v2.jpg',theme:'light',layout:'reverse'},
  {id:'pinterest',title:'Pinterest',subtitle:'Design e inspiração.',url:'https://www.pinterest.com/laduna_studio',image:'pinterest-v2.jpg',theme:'lilac',layout:'editorial'},
  {id:'avaliacao',title:'Avalie a LADUNA',subtitle:'Compartilhe sua experiência.',url:'https://g.page/r/CW-F8FnkdcPHEAI/review',image:'avaliacao-v2.jpg',theme:'graphite',layout:'reputation'},
];

const artwork = {
  contato:{art:'./media/classic/whatsapp.svg',vector:true,theme:'purple'},
  instagram:{art:'./media/classic/instagram.svg',vector:true,theme:'light'},
  site:{art:'./media/classic/site-real.png',visual:'laptop',theme:'light'},
  google:{art:'./media/classic/google.svg',vector:true,theme:'purple'},
  email:{art:'./media/classic/email.png',visual:'typographic',theme:'lilac'},
  consultoria:{art:'./media/classic/knight.png',theme:'graphite'},
  tiktok:{art:'./media/classic/tiktok.svg',vector:true,theme:'light'},
  facebook:{art:'./media/classic/facebook.svg',vector:true,theme:'purple'},
  pinterest:{art:'./media/classic/pinterest.svg',visual:'moodboard',theme:'lilac'},
  avaliacao:{art:'./media/classic/seal.png',visual:'comment',theme:'graphite'},
};
export const links = channels.map(item=>({...item,...artwork[item.id]}));
