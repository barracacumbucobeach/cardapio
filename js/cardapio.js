/* Cardápio Cumbuco Beach
   Monta a página a partir de js/dados.js (nomes, descrições e preços) e cuida dos idiomas,
   da busca e dos efeitos. Para mudar item ou preço, edite só js/dados.js. */
(function(){
'use strict';

/* ---------- ajustes rápidos ---------- */
var CFG={
  url:'',                         // endereço final desta página, usado no QR Code e no compartilhar. Vazio = endereço atual
  pdf:'cardapio.pdf',             // arquivo do botão "Baixar cardápio agora"
  pdfNome:'cardapio-cumbuco-beach.pdf',
  abre:9, fecha:17,               // horário de funcionamento (hora de Fortaleza)
  fuso:'America/Fortaleza'
};

var W=window,D=document,R=D.documentElement,C=W.CARDAPIO;
if(!C||!D.querySelector)return;
function $(s,c){return (c||D).querySelector(s)}
function $$(s,c){return [].slice.call((c||D).querySelectorAll(s))}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function fold(s){s=String(s).toLowerCase();return s.normalize?s.normalize('NFD').replace(/[̀-ͯ]/g,''):s}
function guarda(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){}return null}
function mq(q){return !!(W.matchMedia&&W.matchMedia(q).matches)}
var calm=R.classList.contains('calm');
var SVGNS='http://www.w3.org/2000/svg';

/* ---------- textos da interface ---------- */
var UI={
pt:{titulo:'Cardápio | Barraca Cumbuco Beach',cardapio:'Cardápio',
  aberto:'Aberto agora, até as 17h',aberto_c:'Aberto agora',abre_hoje:'Fechado agora. Abre hoje às 9h',abre_amanha:'Fechado agora. Abre amanhã às 9h',fechado_c:'Fechado agora',
  buscar:'Buscar no cardápio',buscar_ph:'Buscar: camarão, peixada, gin…',
  ver:'Ver cardápio',ver_s:'Todos os itens e preços',
  baixar:'Baixar cardápio agora',baixar_s:'PDF igual ao cardápio da mesa',baixar_c:'Baixar',baixar_r:' cardápio agora',
  compartilhar:'Compartilhar',comp_s:'Envie o link para quem vai com você',
  qr_s:'Abrir no celular',qr_t:'Cardápio no celular',qr_p:'Aponte a câmera para o código e abra o cardápio no seu aparelho.',
  fechar:'Fechar',n1:'1 item',nN:'{n} itens',duas:'Pratos para 2 pessoas',
  achou1:'1 item encontrado para “{q}”',achouN:'{n} itens encontrados para “{q}”',nada:'Nada encontrado para “{q}”. Tente outra palavra.',limpar:'Limpar busca',
  bil:'',brinde:'Hora de brindar',brinde_s:'Bebidas, drinks, cervejas e whiskies',faixa:['Sol','Mar','Sabor','Alegria'],
  vem:'Vem pra cá!',horario:'Todos os dias, das 9h às 17h',whats:'Falar no WhatsApp',
  ilus:'Imagens ilustrativas.',ilus1:'Imagem ilustrativa',topo:'Voltar ao topo',
  letra:'Tamanho da letra',letras:['Letra normal','Letra maior','Letra grande'],
  copiado:'Link copiado',share_txt:'Cardápio da Barraca Cumbuco Beach',
  foto:'Foto ampliada',ant:'Foto anterior',prox:'Próxima foto',ampliar:'Ampliar foto',
  idioma:'Idioma',categorias:'Categorias do cardápio',avisos:'Avisos do cardápio',pular:'Ir para o cardápio',
  baixando:'Preparando o cardápio…',baixado:'Cardápio baixado',baixa_erro:'Não deu para baixar agora. Tente de novo.'},
en:{titulo:'Menu | Barraca Cumbuco Beach',cardapio:'Menu',
  aberto:'Open now, until 5 pm',aberto_c:'Open now',abre_hoje:'Closed now. Opens today at 9 am',abre_amanha:'Closed now. Opens tomorrow at 9 am',fechado_c:'Closed now',
  buscar:'Search the menu',buscar_ph:'Search: shrimp, fish, gin…',
  ver:'See the menu',ver_s:'Every item and price',
  baixar:'Download the menu now',baixar_s:'PDF, same as the menu on the table',baixar_c:'Download',baixar_r:' the menu now',
  compartilhar:'Share',comp_s:'Send the link to whoever is coming with you',
  qr_s:'Open on your phone',qr_t:'Menu on your phone',qr_p:'Point your camera at the code to open the menu on your phone.',
  fechar:'Close',n1:'1 item',nN:'{n} items',duas:'Dishes for 2 people',
  achou1:'1 item found for “{q}”',achouN:'{n} items found for “{q}”',nada:'Nothing found for “{q}”. Try another word.',limpar:'Clear search',
  bil:'In English, with the original Portuguese name under each item. Show the Portuguese name when you order.',
  brinde:'Time for a toast',brinde_s:'Drinks, cocktails, beers and whiskies',faixa:['Sun','Sea','Flavour','Joy'],
  vem:'Come on over!',horario:'Every day, 9 am to 5 pm',whats:'Message us on WhatsApp',
  ilus:'Photos are for illustration only.',ilus1:'Illustrative photo',topo:'Back to top',
  letra:'Text size',letras:['Normal text','Larger text','Largest text'],
  copiado:'Link copied',share_txt:'Barraca Cumbuco Beach menu',
  foto:'Enlarged photo',ant:'Previous photo',prox:'Next photo',ampliar:'Enlarge photo',
  idioma:'Language',categorias:'Menu categories',avisos:'Menu notes',pular:'Skip to the menu',
  baixando:'Getting the menu ready…',baixado:'Menu downloaded',baixa_erro:'Could not download right now. Try again.'},
es:{titulo:'Menú | Barraca Cumbuco Beach',cardapio:'Menú',
  aberto:'Abierto ahora, hasta las 17 h',aberto_c:'Abierto ahora',abre_hoje:'Cerrado ahora. Abre hoy a las 9 h',abre_amanha:'Cerrado ahora. Abre mañana a las 9 h',fechado_c:'Cerrado ahora',
  buscar:'Buscar en el menú',buscar_ph:'Buscar: camarón, pescado, gin…',
  ver:'Ver el menú',ver_s:'Todos los platos y precios',
  baixar:'Descargar el menú ahora',baixar_s:'PDF igual al menú de la mesa',baixar_c:'Descargar',baixar_r:' el menú ahora',
  compartilhar:'Compartir',comp_s:'Envía el enlace a quien va contigo',
  qr_s:'Abrir en el celular',qr_t:'Menú en el celular',qr_p:'Apunta la cámara al código y abre el menú en tu teléfono.',
  fechar:'Cerrar',n1:'1 opción',nN:'{n} opciones',duas:'Platos para 2 personas',
  achou1:'1 resultado para “{q}”',achouN:'{n} resultados para “{q}”',nada:'No encontramos “{q}”. Prueba con otra palabra.',limpar:'Borrar búsqueda',
  bil:'En español, con el nombre original en portugués debajo de cada plato. Muestra el nombre en portugués al pedir.',
  brinde:'Hora de brindar',brinde_s:'Bebidas, tragos, cervezas y whiskies',faixa:['Sol','Mar','Sabor','Alegría'],
  vem:'¡Te esperamos!',horario:'Todos los días, de 9 a 17 h',whats:'Escribir por WhatsApp',
  ilus:'Imágenes ilustrativas.',ilus1:'Imagen ilustrativa',topo:'Volver arriba',
  letra:'Tamaño de letra',letras:['Letra normal','Letra más grande','Letra grande'],
  copiado:'Enlace copiado',share_txt:'Menú de la Barraca Cumbuco Beach',
  foto:'Foto ampliada',ant:'Foto anterior',prox:'Foto siguiente',ampliar:'Ampliar foto',
  idioma:'Idioma',categorias:'Categorías del menú',avisos:'Avisos del menú',pular:'Ir al menú',
  baixando:'Preparando el menú…',baixado:'Menú descargado',baixa_erro:'No se pudo descargar ahora. Inténtalo de nuevo.'}
};
/* nomes curtos para a barra de categorias */
var NAV={
pt:{entradas:'Entradas',peixes:'Peixes',frutos:'Frutos do mar',carnes:'Carnes',kids:'Kids',guarnicoes:'Guarnições',bebidas:'Bebidas',drinks:'Drinks',longneck:'Long neck',cervejas:'Cervejas 600 ml',whiskies:'Whiskies'},
en:{entradas:'Starters',peixes:'Fish',frutos:'Seafood',carnes:'Meat',kids:'Kids',guarnicoes:'Sides',bebidas:'Drinks',drinks:'Cocktails',longneck:'Long neck',cervejas:'Beers 600 ml',whiskies:'Whiskies'},
es:{entradas:'Entradas',peixes:'Pescados',frutos:'Mariscos',carnes:'Carnes',kids:'Kids',guarnicoes:'Guarniciones',bebidas:'Bebidas',drinks:'Tragos',longneck:'Long neck',cervejas:'Cervezas 600 ml',whiskies:'Whiskies'}
};
/* legendas das fotos nos outros idiomas (em português vêm de dados.js) */
var ALT={
en:{'camarao-crocante':'Breaded shrimp','skol-bolinhos':'Fried bites with ice-cold beer','peixada':'Fish stew with pirão and rice','peixe-frito':'Fried fish with shrimp and fries','peixe-delicia':'Fish au gratin','peixe-camarao':'Fried fish with shrimp','carne-farofa':'Diced beef with farofa and fries','coco-praia':'Coconut water on the beach','caipirinha':'Lime caipirinha','gin-tonica':'Gin and tonic','drink-sunset':'Layered cocktail','cervejas':'Ice-cold beers'},
es:{'camarao-crocante':'Camarones empanados','skol-bolinhos':'Bolitas fritas con cerveza helada','peixada':'Guiso de pescado con pirão y arroz','peixe-frito':'Pescado frito con camarones y papas fritas','peixe-delicia':'Pescado gratinado','peixe-camarao':'Pescado frito con camarones','carne-farofa':'Carne en cubos con farofa y papas fritas','coco-praia':'Agua de coco en la playa','caipirinha':'Caipirinha de lima','gin-tonica':'Gin tonic','drink-sunset':'Trago en capas','cervejas':'Cervezas heladas'}
};
/* palavras que também encontram a categoria inteira na busca */
var CHAVES={
entradas:'entrada petisco tira-gosto starter snack appetizer picada',
peixes:'peixe fish pescado',
frutos:'frutos do mar marisco seafood',
carnes:'carne ave meat poultry',
kids:'kids crianca infantil children ninos',
guarnicoes:'guarnicao salada acompanhamento side salad guarnicion ensalada',
bebidas:'bebida beverage',
drinks:'drink coquetel cocktail trago',
longneck:'cerveja long neck beer cerveza',
cervejas:'cerveja 600 ml beer cerveza garrafa',
whiskies:'whisky whiskey uisque dose'
};
var IC={entradas:[123,103],peixes:[143,104],frutos:[115,103],carnes:[171,102],kids:[118,109],guarnicoes:[115,103],bebidas:[133,166],drinks:[120,166],longneck:[57,166],cervejas:[134,166],whiskies:[118,138]};
var BR=['M2 13C80 5 200 2 298 5C200 8 80 12 2 15Z','M3 6C90 1 210 4 297 10C205 9 95 9 3 12Z','M2 10C70 3 190 1 298 7C215 7 110 9 4 14Z'];

/* ---------- idioma ---------- */
var LANGS=['pt','en','es'];
var lang=(function(){
  var m=/[?&]lang=(pt|en|es)\b/i.exec(location.search),s;
  if(m)return m[1].toLowerCase();
  s=guarda('cb_lang'); if(LANGS.indexOf(s)>=0)return s;
  s=String(navigator.language||'pt').slice(0,2).toLowerCase();
  return LANGS.indexOf(s)>=0?s:'pt';
})();
function t(k){var v=UI[lang][k];return v==null?UI.pt[k]:v}
function fmt(s,o){return s.replace(/\{(\w+)\}/g,function(_,k){return o[k]})}

/* ---------- referências ---------- */
var bar=$('#bar'),capa=$('#capa'),cats=$('#cats'),sc=$('#cats-sc'),ind=$('#ind'),menu=$('#menu'),
    find=$('#find'),q=$('#q'),findB=$('#find-b'),res=$('#res'),resT=$('#res-t'),vazio=$('#vazio'),bil=$('#bil'),
    prog=$('#prog'),psun=$('#psun'),por=$('#por'),selo=$('#selo'),topo=$('#topo'),toastEl=$('#toast'),
    lb=$('#lb'),lbImg=$('#lb-img'),lbCap=$('#lb-cap'),dlgQr=$('#dlg-qr'),brinde=null,faixaT=null,sep=null;
var CATS=[],ITEMS=[],FOTOS=[],query='',atual=null,forcado=null,rolando=false,tmFim=0;

/* ---------- montagem ---------- */
function secHTML(c,i,mini){
  var ic=IC[c.id]||[120,104],h='<div class="'+(mini?'':'wrap ')+'sec__g"><div class="sec__side"><header class="sec__h">';
  h+='<img class="sec__ic" src="img/ic-'+c.id+'.png" alt="" width="'+ic[0]+'" height="'+ic[1]+'" style="--w:'+ic[0]+'">';
  h+='<div><h2 id="h-'+c.id+'"></h2><p class="sec__o" lang="pt-BR" hidden></p>';
  h+='<svg class="brush" viewBox="0 0 300 16" preserveAspectRatio="none" aria-hidden="true"><path d="'+BR[i%3]+'"/></svg>';
  h+='<p class="sec__meta"><span class="sec__n"></span>'+(c.duas?'<span class="tag"><img src="img/ic-duas.png" alt="" width="86" height="59"><span data-t="duas"></span></span>':'')+'</p></div></header>';
  if(c.fotos&&c.fotos.length){
    h+='<div class="pics" style="--n:'+c.fotos.length+'">'+c.fotos.map(function(f,j){
      return '<button class="pic" type="button" data-f="'+f+'" style="--i:'+j+'"><img src="img/fotos/'+f+'.jpg" alt="" loading="lazy" decoding="async"></button>'}).join('')+'</div>';
  }
  h+='</div><ul class="sec__list">'+c.itens.map(function(it,j){
    return '<li class="it" data-k="'+c.id+':'+j+'"><div class="it__row"><h3 class="it__n"></h3><span class="it__l" aria-hidden="true"></span><span class="it__p">'+esc(it[1])+'</span></div><p class="it__o" lang="pt-BR" hidden></p><p class="it__d" hidden></p><p class="it__od" lang="pt-BR" hidden></p></li>'}).join('')+'</ul></div>';
  return h;
}
function build(){
  var frag=D.createDocumentFragment(),chips=D.createDocumentFragment(),trio=null,beber=false;
  C.cats.forEach(function(c,i){
    var mini=c.layout==='mini',o={id:c.id,c:c,items:[]},s=D.createElement('section'),a=D.createElement('a');
    if(c.grupo==='beber'&&!beber){
      beber=true;
      sep=D.createElement('span');sep.className='cats__sep';sep.setAttribute('aria-hidden','true');chips.appendChild(sep);
      brinde=D.createElement('div');brinde.className='brinde escuro';brinde.id='brinde';
      brinde.innerHTML='<img class="folha folha--2" src="img/folha2.webp" alt="" width="454" height="654" loading="lazy">'+
        '<svg class="borda borda--t" viewBox="0 0 4320 40" preserveAspectRatio="none" aria-hidden="true"></svg>'+
        '<div class="wrap brinde__in"><p class="brinde__t" data-t="brinde"></p><p class="brinde__s" data-t="brinde_s"></p></div>'+
        '<div class="faixa" aria-hidden="true"><div class="faixa__t"><ul></ul><ul aria-hidden="true"></ul></div></div>'+
        '<svg class="borda borda--b" viewBox="0 0 4320 40" preserveAspectRatio="none" aria-hidden="true"></svg>';
      frag.appendChild(brinde);
    }
    a.className='chip';a.href='#'+c.id;chips.appendChild(a);
    s.className='sec'+(mini?' sec--mini':'')+(c.layout==='cols'?' sec--cols':'');
    s.id=c.id;s.setAttribute('aria-labelledby','h-'+c.id);
    s.innerHTML=secHTML(c,i,mini);
    if(mini){
      if(!trio){trio=D.createElement('div');trio.className='wrap trio';frag.appendChild(trio)}
      trio.appendChild(s);trio.classList.toggle('trio--3',trio.children.length===3);
    }else{trio=null;frag.appendChild(s)}
    o.sec=s;o.chip=a;o.h=$('.sec__h',s);o.h2=$('h2',s);o.o=$('.sec__o',s);o.n=$('.sec__n',s);o.list=$('.sec__list',s);o.side=$('.sec__side',s);o.pics=$('.pics',s);
    $$('.it',s).forEach(function(li,j){
      var it={k:c.id+':'+j,pt:c.itens[j],cat:o,li:li,eN:$('.it__n',li),eO:$('.it__o',li),eD:$('.it__d',li),eOD:$('.it__od',li)};
      o.items.push(it);ITEMS.push(it);
    });
    $$('.pic',s).forEach(function(b){FOTOS.push({id:b.getAttribute('data-f'),btn:b,img:$('img',b)})});
    CATS.push(o);
  });
  menu.appendChild(frag);sc.appendChild(chips);
  faixaT=$('.faixa__t',brinde);
}

/* letras soltas (título da capa e "Vem pra cá!") */
function letras(e,txt){
  var i=0,h='<span class="sr">'+esc(txt)+'</span><span aria-hidden="true">';
  h+=txt.split(' ').map(function(w){
    return '<span style="white-space:nowrap">'+w.split('').map(function(ch){return '<span class="ch" style="--i:'+(i++)+'">'+esc(ch)+'</span>'}).join('')+'</span>';
  }).join(' ');
  e.innerHTML=h+'</span>';
}
function palavras(txt,toks){
  return txt.split(' ').map(function(w,i){return '<span class="w"><span style="--i:'+i+'">'+(toks&&toks.length?hl(w,toks):esc(w))+'</span></span>'}).join(' ');
}
function alt(id){return lang==='pt'?(C.alt[id]||''):((ALT[lang]||{})[id]||C.alt[id]||'')}
function lead(s){var m=/^([^a-zà-ÿ:]{3,40}:)(.*)$/.exec(s);return m?'<b>'+esc(m[1])+'</b>'+esc(m[2]):esc(s)}

/* ---------- pinta os textos no idioma escolhido ---------- */
function paint(){
  var tr=lang==='pt'?null:C.tr[lang],nt=tr&&tr.notas,L=$('#lang');
  R.lang=lang==='pt'?'pt-BR':lang;
  D.title=t('titulo');
  $$('[data-t]').forEach(function(e){var v=t(e.getAttribute('data-t'));if(e.hasAttribute('data-letras'))letras(e,v);else e.textContent=v});
  $$('[data-ta]').forEach(function(e){e.setAttribute('aria-label',t(e.getAttribute('data-ta')))});
  $$('[data-tp]').forEach(function(e){e.setAttribute('placeholder',t(e.getAttribute('data-tp')))});
  L.setAttribute('data-l',lang);
  $$('button',L).forEach(function(b){b.setAttribute('aria-pressed',b.getAttribute('data-l')===lang?'true':'false')});
  bil.textContent=t('bil');bil.hidden=!t('bil');
  CATS.forEach(function(o){
    var nome=tr?(tr.cats[o.id]||o.c.nome):o.c.nome,chave=fold([o.c.nome,nome,NAV.pt[o.id],NAV[lang][o.id],CHAVES[o.id]||''].join(' '));
    o.chip.textContent=NAV[lang][o.id]||o.c.nome;
    o.nome=nome;
    o.o.textContent=o.c.nome;o.o.hidden=!tr||fold(nome)===fold(o.c.nome);
    o.items.forEach(function(it){
      var x=tr&&tr.itens[it.k];
      it.n=x&&x[0]?x[0]:it.pt[0];
      it.o=x&&x[0]&&x[0]!==it.pt[0]?it.pt[0]:'';
      it.d=x&&x[1]?x[1]:it.pt[2];
      it.od=x&&x[1]&&it.pt[2]?it.pt[2]:'';
      it.p=fold([it.pt[0],it.pt[2],it.n,it.d].join(' '));
      it.f=it.p+' '+chave;
    });
  });
  FOTOS.forEach(function(f){f.img.alt=alt(f.id);f.btn.setAttribute('aria-label',t('ampliar')+': '+alt(f.id))});
  /* avisos: no outro idioma a tradução fica em destaque e o original menor */
  var cap=$('#selo-tr');cap.hidden=!nt;cap.textContent=nt?nt[0]:'';
  [['#nota1',1,2],['#nota2',3,4]].forEach(function(a){
    var n=$(a[0]),e=$('.nota__tr',n);
    n.classList.toggle('is-tr',!!nt);e.hidden=!nt;
    e.innerHTML=nt?'<p>'+lead(nt[a[1]])+'</p><p>'+esc(nt[a[2]])+'</p>':'';
  });
  /* faixa que corre */
  var li=[],i;for(i=0;i<4;i++)t('faixa').forEach(function(w){li.push('<li>'+esc(w)+'</li>')});
  $$('ul',faixaT).forEach(function(u){u.innerHTML=li.join('')});
  faixaW=0;
  status();
  apply();
}

/* ---------- busca ---------- */
function hl(txt,toks){
  if(!toks.length)return esc(txt);
  var f='',map=[],i,j,fc,marks=[],any=false,out='',on=false;
  for(i=0;i<txt.length;i++){fc=fold(txt.charAt(i));for(j=0;j<fc.length;j++){f+=fc.charAt(j);map.push(i)}}
  toks.forEach(function(tk){
    var p=-1,k;
    while((p=f.indexOf(tk,p+1))>=0){
      if(p&&/[a-z0-9]/.test(f.charAt(p-1)))continue;
      for(k=map[p];k<=map[p+tk.length-1];k++)marks[k]=1;any=true;
    }
  });
  if(!any)return esc(txt);
  for(i=0;i<txt.length;i++){
    if(marks[i]&&!on){out+='<mark>';on=true}
    if(!marks[i]&&on){out+='</mark>';on=false}
    out+=esc(txt.charAt(i));
  }
  return out+(on?'</mark>':'');
}
function poe(e,txt,toks){e.hidden=!txt;if(txt)e.innerHTML=hl(txt,toks)}
function tem(f,tk){
  var p=-1;
  while((p=f.indexOf(tk,p+1))>=0)if(!p||!/[a-z0-9]/.test(f.charAt(p-1)))return true;
  return false;
}
function variantes(tk){
  var v=[tk],b;
  if(/(oes|aes)$/.test(tk))v.push(tk.slice(0,-3)+'ao');
  else if(tk.length>3&&/s$/.test(tk))v.push(tk.slice(0,-1));
  if(/ao$/.test(tk)){b=tk.slice(0,-2);v.push(b+'oes',b+'aes')}
  return v;
}
function tokens(){var s=fold(query).replace(/\s+/g,' ').trim();return s.length<2?[]:s.split(' ').map(variantes)}
function apply(){
  var grupos=tokens(),toks=[].concat.apply([],grupos),total=0;
  menu.classList.toggle('buscando',!!toks.length);
  CATS.forEach(function(o){
    var vis=0;
    o.items.forEach(function(it){
      var ok=grupos.every(function(g){return g.some(function(tk){return tem(it.f,tk)})});
      it.li.hidden=!ok;
      if(!ok)return;
      vis++;
      /* na busca, quem tem a palavra no próprio nome ou descrição vem primeiro; o resto da categoria vem depois */
      it.li.style.order=toks.length&&!toks.some(function(tk){return tem(it.p,tk)})?1:'';
      it.eN.innerHTML=hl(it.n,toks);poe(it.eO,it.o,toks);poe(it.eD,it.d,toks);poe(it.eOD,it.od,toks);
    });
    total+=vis;
    o.h2.innerHTML=palavras(o.nome,toks);
    o.sec.hidden=!vis;o.chip.hidden=!vis;
    o.n.textContent=vis===1?t('n1'):fmt(t('nN'),{n:vis});
    o.list.style.setProperty('--rows',Math.ceil(vis/2));
  });
  $$('.trio',menu).forEach(function(tr){tr.hidden=!$('.sec:not([hidden])',tr)});
  if(sep)sep.hidden=!!toks.length;
  if(brinde)brinde.hidden=!!toks.length;
  res.hidden=!toks.length||!total;
  if(toks.length&&total)resT.textContent=fmt(t(total===1?'achou1':'achouN'),{n:total,q:query.trim()});
  vazio.hidden=!toks.length||!!total;
  if(toks.length&&!total)$('p',vazio).textContent=fmt(t('nada'),{q:query.trim()});
  find.classList.toggle('tem',!!q.value);
  ajusta();
}
var tmQ=0;
function setQuery(v,semPulo){
  var antes=tokens().join(' ');
  query=v;apply();
  if(!semPulo&&tokens().join(' ')!==antes)pula(menu);
}
function limpa(foco){
  q.value='';setQuery('');
  if(foco&&mq('(min-width:62rem)'))q.focus({preventScroll:true});else{cats.classList.remove('searching');q.blur()}
}
function abreBusca(){
  if(!mq('(min-width:62rem)'))cats.classList.add('searching');
  q.focus({preventScroll:true});
}

/* ---------- rolagem ---------- */
function topoDe(e){
  var m=parseFloat(getComputedStyle(e).scrollMarginTop)||0;
  return Math.max(0,e.getBoundingClientRect().top+(W.scrollY||W.pageYOffset)-m);
}
function pula(e){ /* sem animação: usado quando o conteúdo muda (busca) */
  R.style.scrollBehavior='auto';W.scrollTo(0,topoDe(e));S.y=-1;subiu=false;
  requestAnimationFrame(function(){R.style.scrollBehavior=''});
}
function vai(e){
  if(calm)pula(e);else W.scrollTo({top:e===capa?0:topoDe(e),behavior:'smooth'});
}
/* mantém o item que a pessoa estava lendo no mesmo lugar quando o texto muda de tamanho */
function noLugar(fn){
  var lim=bar.offsetHeight+cats.offsetHeight+4,a=null,t0=0,i,r;
  if((W.scrollY||0)>capa.offsetHeight*.6){
    for(i=0;i<ITEMS.length;i++){
      if(ITEMS[i].li.hidden||ITEMS[i].cat.sec.hidden)continue;
      r=ITEMS[i].li.getBoundingClientRect();
      if(r.bottom>lim){a=ITEMS[i].li;t0=r.top;break}
    }
  }
  fn();
  if(a){r=a.getBoundingClientRect();if(Math.abs(r.top-t0)>1){R.style.scrollBehavior='auto';W.scrollBy(0,r.top-t0);requestAnimationFrame(function(){R.style.scrollBehavior=''})}}
}

/* categoria atual + pílula que desliza */
function marca(o){
  if(o===atual&&(!o||o.chip.classList.contains('on')))return poeInd(o,true);
  atual=o;
  CATS.forEach(function(x){
    x.chip.classList.toggle('on',x===o);
    if(x===o)x.chip.setAttribute('aria-current','true');else x.chip.removeAttribute('aria-current');
  });
  poeInd(o,false);
}
function poeInd(o,quieto){
  if(!o||o.chip.hidden||!o.chip.offsetWidth){ind.style.opacity=0;return}
  ind.style.opacity=1;ind.style.width=o.chip.offsetWidth+'px';ind.style.transform='translateX('+o.chip.offsetLeft+'px)';
  if(quieto)return;
  var l=o.chip.offsetLeft-(sc.clientWidth-o.chip.offsetWidth)/2;
  try{sc.scrollTo({left:Math.max(0,l),behavior:calm?'auto':'smooth'})}catch(e){sc.scrollLeft=Math.max(0,l)}
}
function espia(){
  var linha=bar.offsetHeight+cats.offsetHeight+Math.min(W.innerHeight*.28,200),cur=null,topC=0,i,r,o;
  if(rolando&&forcado&&!forcado.sec.hidden){marca(forcado);return}
  for(i=0;i<CATS.length;i++){
    o=CATS[i];if(o.sec.hidden)continue;
    r=o.sec.getBoundingClientRect();
    if(r.top<=linha&&(!cur||r.top>topC+4)){cur=o;topC=r.top}
  }
  if(forcado&&cur&&!forcado.sec.hidden&&Math.abs(forcado.sec.getBoundingClientRect().top-topC)<=4)cur=forcado;else if(cur)forcado=null;
  marca(cur);
}
function fimRola(){rolando=false;espia()}
function pontas(){
  sc.classList.toggle('mais-e',sc.scrollLeft>6);
  sc.classList.toggle('mais-d',sc.scrollLeft+sc.clientWidth<sc.scrollWidth-6);
}
/* a coluna do título só fica presa quando cabe inteira na tela */
function ajusta(){
  var livre=W.innerHeight-(bar.offsetHeight+cats.offsetHeight+26)-14;
  CATS.forEach(function(o){
    if(o.sec.hidden)return;
    o.side.classList.remove('solto');
    if(o.side.offsetHeight>livre)o.side.classList.add('solto');
  });
  faixaW=0;espia();pontas();
}

/* ---------- revelar ao rolar ---------- */
var io=null;
function observa(){
  var alvo=$$('.it,.sec__h,.pics,.rv,.selo');
  if(calm||!('IntersectionObserver' in W)){alvo.forEach(function(e){e.classList.add('in')});return}
  io=new IntersectionObserver(function(es){
    var n=0;
    es.forEach(function(e){
      if(!e.isIntersecting)return;
      var el=e.target;io.unobserve(el);
      if(el.classList.contains('it')){
        var d=Math.min(n++,7)*45;
        el.style.transitionDelay=d+'ms';
        setTimeout(function(){el.style.transitionDelay=''},d+900);
      }
      el.classList.add('in');
    });
  },{rootMargin:'0px 0px -7% 0px',threshold:0.01});
  alvo.forEach(function(e){io.observe(e)});
}

/* ---------- mar: ondas desenhadas ---------- */
function onda(L,A,b,ph){
  var k=Math.round(2160/L),L2=2160/Math.max(2,Math.round(k*.62));
  return function(x){return b-A*Math.sin(x/L*6.28319+ph)-A*.34*Math.sin(x/L2*6.28319+1.3+ph*2)};
}
function traco(f,x0,x1,st){
  var d='',x;
  for(x=x0;x<=x1+.01;x+=st)d+=(d?'L':'M')+(+x.toFixed(1))+' '+(+f(x).toFixed(1));
  return d;
}
function ondas(){
  $$('svg[data-onda]').forEach(function(s,i){
    var p=s.getAttribute('data-onda').split(',').map(Number),L=p[0],A=p[1],b=p[2],ph=i*1.7,f=onda(L,A,b,ph),k=Math.round(2160/L),n,x,d='',e;
    e=D.createElementNS(SVGNS,'path');e.setAttribute('d',traco(f,0,4320,15)+'V100H0Z');s.appendChild(e);
    for(n=0;n<2*k;n++){
      if(n%k%3===1)continue;
      x=(n+.25-ph/6.28319)*L;
      if(x-.22*L<0||x+.14*L>4320)continue;
      d+=traco(function(v){return f(v)+4.5+(n%k%2)*2},x-.22*L,x+.14*L,12);
    }
    e=D.createElementNS(SVGNS,'path');e.setAttribute('class','crista');e.setAttribute('d',d);s.appendChild(e);
  });
  $$('svg.borda').forEach(function(s,i){
    var f=onda(540,9,20,i*2.1),e=D.createElementNS(SVGNS,'path');
    e.setAttribute('d','M0 0'+traco(f,0,4320,18).replace(/^M/,'L')+'V0Z');s.appendChild(e);
  });
}

/* ---------- aviso rápido ---------- */
var tmT=0;
function toast(msg){
  toastEl.textContent=msg;toastEl.classList.add('on');
  clearTimeout(tmT);tmT=setTimeout(function(){toastEl.classList.remove('on')},2600);
}

/* ---------- aberto ou fechado (hora de Fortaleza) ---------- */
function agora(){
  try{
    var h=0,m=0;
    new Intl.DateTimeFormat('en-GB',{timeZone:CFG.fuso,hour:'2-digit',minute:'2-digit',hour12:false}).formatToParts(new Date()).forEach(function(x){
      if(x.type==='hour')h=+x.value%24;if(x.type==='minute')m=+x.value});
    return h*60+m;
  }catch(e){var d=new Date();return ((d.getUTCHours()+21)%24)*60+d.getUTCMinutes()}
}
function status(){
  var n=agora(),ab=n>=CFG.abre*60&&n<CFG.fecha*60,longo=ab?t('aberto'):(n<CFG.abre*60?t('abre_hoje'):t('abre_amanha'));
  [['#status',ab?t('aberto_c'):t('fechado_c')],['#status2',longo]].forEach(function(a){
    var e=$(a[0]);if(!e)return;
    e.classList.toggle('open',ab);$('span',e).textContent=a[1];
  });
}

/* ---------- endereço para compartilhar e QR ---------- */
function endereco(){
  if(CFG.url)return CFG.url;
  return location.origin&&location.origin!=='null'?location.origin+location.pathname:location.href.split('#')[0];
}
function compartilha(){
  var u=endereco(),d={title:t('share_txt'),text:t('share_txt'),url:u};
  function ok(){toast(t('copiado'))}
  function velho(){
    var i=D.createElement('input');i.value=u;i.setAttribute('readonly','');i.style.cssText='position:fixed;opacity:0;top:0;left:0';
    D.body.appendChild(i);i.select();
    try{if(D.execCommand('copy'))ok();else toast(u)}catch(e){toast(u)}
    D.body.removeChild(i);
  }
  function copia(){
    try{if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(u).then(ok,velho);return}}catch(e){}
    velho();
  }
  /* celular: abre o compartilhar do aparelho; se o navegador recusar, copia o link */
  if(navigator.share){
    try{navigator.share(d).catch(function(e){if(!e||e.name!=='AbortError')copia()})}catch(e){copia()}
    return;
  }
  copia();
}
var qrFila=null;
function comQR(fn){
  if(W.qrcode)return fn();
  if(qrFila){qrFila.push(fn);return}
  qrFila=[fn];
  var s=D.createElement('script');s.src='js/qr.js';
  s.onload=function(){qrFila.forEach(function(f){f()});qrFila=[]};
  s.onerror=function(){qrFila=null};
  D.head.appendChild(s);
}
function fazQR(e,margem){
  try{var c=W.qrcode(0,'M');c.addData(endereco());c.make();e.innerHTML=c.createSvgTag({cellSize:4,margin:margem,scalable:true});return true}catch(x){return false}
}
function abre(dlg){if(dlg.showModal){if(!dlg.open)dlg.showModal()}else dlg.setAttribute('open','')}
function fecha(dlg){if(dlg.close)dlg.close();else dlg.removeAttribute('open')}
function abreQR(){
  $('#qr-url').textContent=endereco().replace(/^https?:\/\//,'');
  comQR(function(){fazQR($('#qr-big'),0)});
  abre(dlgQr);
}

/* ---------- fotos ampliadas ---------- */
var fotoI=0;
function mostraFoto(i){
  var n=FOTOS.length,f;
  fotoI=(i%n+n)%n;f=FOTOS[fotoI];
  lbImg.src='img/fotos/'+f.id+'.jpg';lbImg.alt=alt(f.id);
  lbCap.innerHTML=esc(alt(f.id))+'<small>'+esc(t('ilus1'))+'</small>';
}

/* ---------- baixar ----------
   No site publicado o próprio link baixa o PDF. Dentro da prévia do Claude o link comum não
   baixa, então ali o arquivo é entregue pelo recurso de download da própria prévia. */
function baixa(ev){
  var c=W.claude;
  if(!c||typeof c.use!=='function')return;
  ev.preventDefault();
  function normal(){var x=D.createElement('a');x.href=CFG.pdf;x.download=CFG.pdfNome;D.body.appendChild(x);x.click();D.body.removeChild(x)}
  toast(t('baixando'));
  c.use('downloads').then(function(d){
    if(!d){normal();return}
    return fetch(CFG.pdf).then(function(r){if(!r.ok)throw 0;return r.blob()}).then(function(b){
      return d.save({filename:CFG.pdfNome,data:b});
    }).then(function(){toast(t('baixado'))},function(e){if(!e||e.code!=='declined')toast(t('baixa_erro'))});
  },normal);
}

/* ---------- efeitos que acompanham a rolagem e o ponteiro ---------- */
var S={mx:0,my:0,tx:0,ty:0,pv:0,vento:0,swell:0,toque:0,vel:0,y:-1,gs:0,fx:0,px:0,py:0,pt:0},
    V={capa:true,brinde:false,por:false,selo:false},faixaW=0,ult=0,tmE=0,subiu=false,yRef=0;
function poeVar(e,k,v,casas){
  var s=v.toFixed(casas==null?3:casas);
  if(e['_'+k]!==s){e['_'+k]=s;e.style.setProperty(k,s)}
}
function quadro(agoraT){
  var dt=Math.min(64,agoraT-ult)||16,y=W.scrollY||W.pageYOffset||0,dy=S.y<0?0:y-S.y,alt_=D.documentElement.scrollHeight-W.innerHeight,r,p;
  ult=agoraT;
  S.vel+=(dy/dt-S.vel)*.18;if(Math.abs(S.vel)<.0005)S.vel=0;
  /* coisas que só mudam quando a página rola */
  if(y!==S.y){
    S.y=y;
    bar.classList.toggle('solid',y>24);
    p=alt_>0?Math.min(1,y/alt_):0;
    prog.style.transform='scaleX('+p.toFixed(4)+')';psun.style.left=(p*100).toFixed(2)+'%';
    if(dy<-2&&y>W.innerHeight){subiu=true;yRef=y}
    if(subiu&&(y-yRef>70||y<W.innerHeight*.6))subiu=false;
    topo.classList.toggle('on',subiu);
    if(V.capa)poeVar(capa,'--sy',Math.min(y,capa.offsetHeight),0);
    if(V.por){
      r=por.getBoundingClientRect();p=W.innerHeight-r.top;
      poeVar(por,'--por',p<=0?0:Math.min(1,Math.max(p/(W.innerHeight*.45+r.height),p/(p+Math.max(0,alt_-y)))),3);
    }
    if(rolando){clearTimeout(tmFim);tmFim=setTimeout(fimRola,170)}
    if(!tmE)tmE=setTimeout(function(){tmE=0;espia()},90);
  }
  if(!calm){
    var av=Math.abs(S.vel);
    S.pv*=.92;S.toque*=.95;
    S.vento+=(Math.min(3,S.pv*.9+av*1.3+S.toque*2.2)-S.vento)*.07;
    S.swell+=(Math.min(1.2,av*.45+S.toque)-S.swell)*.1;
    S.mx+=(S.tx-S.mx)*.07;S.my+=(S.ty-S.my)*.07;
    if(V.capa){poeVar(capa,'--mx',S.mx);poeVar(capa,'--my',S.my);poeVar(capa,'--vento',S.vento,2);poeVar(capa,'--swell',S.swell,3)}
    if(V.por)poeVar(por,'--swell',S.swell,3);
    if(V.selo){S.gs+=(Math.max(-7,Math.min(7,S.vel*5))-S.gs)*.1;poeVar(selo,'--gs',S.gs,2)}
    if(V.brinde&&brinde&&!brinde.hidden){
      poeVar(brinde,'--vento',S.vento,2);
      if(!faixaW)faixaW=$('ul',faixaT).offsetWidth;
      if(faixaW){
        S.fx-=(.05+S.vel*.55)*dt;
        S.fx=((S.fx%faixaW)-faixaW)%faixaW;
        faixaT.style.transform='translate3d('+S.fx.toFixed(1)+'px,0,0)';
      }
    }
  }
  requestAnimationFrame(quadro);
}
function gota(alvo,ev){
  if(calm)return;
  var r=alvo.getBoundingClientRect(),i,g;
  for(i=0;i<2;i++){
    g=D.createElement('span');g.className='gota';
    g.style.left=(ev.clientX-r.left)+'px';g.style.top=(ev.clientY-r.top)+'px';g.style.animationDelay=(i*170)+'ms';
    alvo.appendChild(g);
    g.addEventListener('animationend',function(){this.remove()});
  }
  S.toque=1;
}
function umaVez(e,cls){
  if(calm)return;
  e.classList.remove(cls);void e.offsetWidth;e.classList.add(cls);
  clearTimeout(e._tm);e._tm=setTimeout(function(){e.classList.remove(cls)},1200);
}

/* ---------- eventos ---------- */
function liga(){
  /* idioma */
  $('#lang').addEventListener('click',function(e){
    var b=e.target.closest('button[data-l]'),l=b&&b.getAttribute('data-l');
    if(!l||l===lang)return;
    lang=l;guarda('cb_lang',l);
    if(calm){noLugar(paint);return}
    menu.classList.add('swap');
    setTimeout(function(){noLugar(paint);menu.classList.remove('swap')},190);
  });
  /* tamanho da letra */
  $('#fs').addEventListener('click',function(){
    var n=R.classList.contains('fs-1')?2:R.classList.contains('fs-2')?0:1;
    noLugar(function(){R.classList.remove('fs-1','fs-2');if(n)R.classList.add('fs-'+n);ajusta()});
    guarda('cb_fs',String(n));toast(t('letras')[n]);
  });
  /* busca */
  q.addEventListener('input',function(){clearTimeout(tmQ);find.classList.toggle('tem',!!q.value);tmQ=setTimeout(function(){setQuery(q.value)},140)});
  q.addEventListener('keydown',function(e){if(e.key==='Escape'){e.preventDefault();clearTimeout(tmQ);limpa(false)}});
  q.addEventListener('blur',function(){setTimeout(function(){if(!q.value&&D.activeElement!==q)cats.classList.remove('searching')},180)});
  find.addEventListener('submit',function(e){e.preventDefault();clearTimeout(tmQ);setQuery(q.value);if(!mq('(hover:hover) and (pointer:fine)'))q.blur()});
  findB.addEventListener('click',function(){
    if(cats.classList.contains('searching')||q.value){clearTimeout(tmQ);limpa(true)}else abreBusca();
  });
  $('#busca-btn').addEventListener('click',function(){abreBusca();vai(menu)});
  $('#res-x').addEventListener('click',function(){limpa(true)});
  $('#vazio-x').addEventListener('click',function(){limpa(true)});
  D.addEventListener('keydown',function(e){
    var a=D.activeElement,emCampo=a&&/^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName);
    if(e.key==='/'&&!emCampo&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&!lb.open&&!dlgQr.open){e.preventDefault();abreBusca();if((W.scrollY||0)<topoDe(menu)-4)vai(menu)}
    if(lb.open){if(e.key==='ArrowLeft')mostraFoto(fotoI-1);if(e.key==='ArrowRight')mostraFoto(fotoI+1)}
  });
  /* links internos: rolagem suave e endereço que dá para copiar */
  D.addEventListener('click',function(e){
    var a=e.target.closest('a[href^="#"]'),id,alvo,o;
    if(!a)return;
    id=a.getAttribute('href').slice(1);alvo=id&&D.getElementById(id);
    if(!alvo)return;
    e.preventDefault();
    o=CATS.filter(function(x){return x.id===id})[0];
    if(o){forcado=o;marca(o);rolando=true;clearTimeout(tmFim);tmFim=setTimeout(fimRola,1600)}
    vai(alvo);
    try{history.replaceState(null,'',alvo===capa?location.pathname+location.search:'#'+id)}catch(x){}
  });
  topo.addEventListener('click',function(){vai(capa)});
  /* compartilhar, QR, baixar */
  $$('[data-share]').forEach(function(b){b.addEventListener('click',compartilha)});
  $$('[data-qr]').forEach(function(b){b.addEventListener('click',abreQR)});
  $$('a[download]').forEach(function(a){a.addEventListener('click',baixa)});
  $$('dialog').forEach(function(d){
    d.addEventListener('click',function(e){
      if(e.target===d||e.target.classList.contains('lb__in')||e.target.closest('[data-fechar],.x'))fecha(d);
    });
  });
  /* fotos */
  FOTOS.forEach(function(f,i){f.btn.addEventListener('click',function(){mostraFoto(i);abre(lb)})});
  $('.p',lb).addEventListener('click',function(){mostraFoto(fotoI-1)});
  $('.n',lb).addEventListener('click',function(){mostraFoto(fotoI+1)});
  var x0=null;
  lb.addEventListener('pointerdown',function(e){x0=e.clientX});
  lb.addEventListener('pointerup',function(e){
    if(x0!==null&&Math.abs(e.clientX-x0)>48)mostraFoto(fotoI+(e.clientX<x0?1:-1));
    x0=null;
  });
  /* brincadeiras: logo, placa, mar e selo */
  $('#logo').addEventListener('click',function(){umaVez(this,'burst');S.toque=1;S.pv=3});
  $$('.sol').forEach(function(x){x.addEventListener('click',function(){umaVez(x,'brilha');S.toque=.6})});
  $$('.kite').forEach(function(k){k.addEventListener('pointerdown',function(e){e.stopPropagation();umaVez($('.kite__c',k),'salta')})});
  var placa=$('#placa');
  placa.addEventListener('click',function(){umaVez(placa,'wob')});
  placa.addEventListener('pointerenter',function(e){if(e.pointerType==='mouse')umaVez(placa,'wob')});
  $$('[data-mar]').forEach(function(m){m.addEventListener('pointerdown',function(e){gota(m,e)})});
  if(brinde)brinde.addEventListener('pointerdown',function(e){gota(brinde,e)});
  selo.addEventListener('click',function(){umaVez(selo,'bate')});
  if(!calm&&mq('(hover:hover) and (pointer:fine)')){
    W.addEventListener('pointermove',function(e){
      var agoraT=e.timeStamp||0,dt=agoraT-S.pt;
      S.tx=e.clientX/W.innerWidth*2-1;S.ty=e.clientY/W.innerHeight*2-1;
      if(dt>0&&dt<120)S.pv=Math.min(3,Math.max(S.pv,Math.sqrt(Math.pow(e.clientX-S.px,2)+Math.pow(e.clientY-S.py,2))/dt*.9));
      S.px=e.clientX;S.py=e.clientY;S.pt=agoraT;
    },{passive:true});
  }
  sc.addEventListener('scroll',pontas,{passive:true});
  var ax=null,al=0,arr=false;
  sc.addEventListener('pointerdown',function(e){if(e.pointerType==='mouse'&&e.button===0){ax=e.clientX;al=sc.scrollLeft;arr=false}});
  W.addEventListener('pointermove',function(e){
    if(ax===null)return;
    if(!arr&&Math.abs(e.clientX-ax)>6){arr=true;sc.classList.add('arrasta')}
    if(arr)sc.scrollLeft=al-(e.clientX-ax);
  });
  W.addEventListener('pointerup',function(){
    if(ax===null)return;ax=null;
    if(arr)setTimeout(function(){sc.classList.remove('arrasta')},0);
  });
  /* o que está na tela (para não animar o que ninguém vê) */
  if('IntersectionObserver' in W){
    var vo=new IntersectionObserver(function(es){es.forEach(function(e){V[e.target._v]=e.isIntersecting});S.y=-1},{rootMargin:'10% 0px'});
    [[capa,'capa'],[brinde,'brinde'],[por,'por'],[selo,'selo']].forEach(function(a){if(a[0]){a[0]._v=a[1];vo.observe(a[0])}});
  }else{V.brinde=V.por=V.selo=true}
  var tmR=0;
  W.addEventListener('resize',function(){
    clearTimeout(tmR);
    tmR=setTimeout(function(){if(mq('(min-width:62rem)'))cats.classList.remove('searching');S.y=-1;ajusta()},120);
  });
  W.addEventListener('load',function(){S.y=-1;ajusta()});
  if(D.fonts&&D.fonts.ready)D.fonts.ready.then(function(){S.y=-1;ajusta()});
}

/* ---------- abertura ---------- */
function pronto(){
  if(D.body.classList.contains('ready')&&!$('#ld'))return;
  var ld=$('#ld');
  if(ld)ld.classList.add('done');
  D.body.classList.add('ready');
  try{sessionStorage.setItem('cb_ld','1')}catch(e){}
  setTimeout(function(){if(ld&&ld.parentNode)ld.parentNode.removeChild(ld)},1200);
}
function abertura(){
  if(calm||R.classList.contains('ld-off')){pronto();return}
  var ini=Date.now(),foi=false;
  function vaiJa(){if(foi)return;foi=true;setTimeout(pronto,Math.max(0,1150-(Date.now()-ini)))}
  if(D.readyState==='complete')vaiJa();else W.addEventListener('load',vaiJa);
  setTimeout(vaiJa,2400);
}

/* ---------- começa ---------- */
build();
ondas();
paint();
liga();
observa();
abertura();
setInterval(status,60000);
requestAnimationFrame(function(n){ult=n;requestAnimationFrame(quadro)});
/* QR pequeno na capa (só em telas grandes, onde faz sentido apontar o celular) */
if(mq('(min-width:62rem)')){
  var espera=W.requestIdleCallback||function(f){return setTimeout(f,1500)};
  espera(function(){comQR(function(){var e=$('#qr-mini');if(fazQR(e,0))e.classList.add('ok')})});
}
/* link direto para uma categoria: .../#peixes */
function doHash(){
  var id='';
  try{id=decodeURIComponent(location.hash.slice(1))}catch(e){}
  var e=id&&D.getElementById(id);
  return e&&(e.classList.contains('sec')||e===menu)?e:null;
}
W.addEventListener('hashchange',function(){var e=doHash();if(e)vai(e)});
var alvo0=doHash();
if(alvo0)setTimeout(function(){pula(alvo0);espia()},60);
})();
