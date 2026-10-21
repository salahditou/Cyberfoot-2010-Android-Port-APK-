(function(){'use strict';
var D=window.__DATA__,IM=window.__IMGS__||{},A=document.getElementById('app'),L='65',S={v:'t',a:null,q:''};
try{L=localStorage.getItem('cf_lang')||L}catch(e){}
if(!D.i18n[L])L='65';
function U(p){return IM[p]||p}
function T(k){return(D.i18n[L]&&D.i18n[L][k])||D.i18n['65'][k]||k}
function E(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function P(id){return((D.paises[L]||D.paises['65'])[id])||''}
function F(id){return'<img class="fl" alt="" src="'+U('assets/flags/'+id+'.png')+'" onerror="this.style.visibility=\'hidden\'">'}
function SH(on){return'<svg class="sh" viewBox="0 0 16 16"><path d="M4.5 1L1 3 0 6.5 3 8l.5-1V15h9V7l.5 1 3-1.5L15 3 11.5 1C10.5 2.5 5.5 2.5 4.5 1z" fill="'+(on?'#2ed32e':'#fff')+'" stroke="#444" stroke-width=".8"/></svg>'}
function FG(c){var m=/^#(..)(..)(..)$/.exec(c);if(!m)return'#fff';return(.299*parseInt(m[1],16)+.587*parseInt(m[2],16)+.114*parseInt(m[3],16))/255>.62?'#000':'#fff'}
function title(){var o=D.idiomas.map(function(i){return'<option value="'+i[0]+'"'+(i[0]===L?' selected':'')+'>'+E(i[1])+'</option>'}).join('');
 function b(k,t,a){return'<button class="gb" style="top:'+t+'%" data-a="'+a+'">'+E(T(k))+'</button>'}
 return'<div class="stage" style="background-image:url('+U('assets/inicio.jpg')+')"><span class="lb">'+E(T('lang'))+'</span><select id="lg">'+o+'</select>'+b('new',40.3,'n')+b('cont',50,'c')+b('edit',59.7,'e')+'</div><p class="nt" id="nt">&nbsp;</p>'}
function rows(){var s=S.a==='s',R=s?D.sel:D.clubes,q=S.q.toLowerCase(),h='';
 R.forEach(function(r,i){var n=s?P(r.p):r.n,c=s?'':P(r.p);if(q&&(n+' '+c).toLowerCase().indexOf(q)<0)return;
  h+='<div class="gr rw '+(s?'g3':'g4')+'" data-i="'+i+'">'+(s?F(r.p)+'<span class="el">'+E(n)+'</span>':'<span class="el">'+E(n)+'</span>'+F(r.p)+'<span class="el">'+E(c)+'</span>')+'<span class="r">'+r.f+'</span></div>'});
 return h}
function list(){var s=S.a==='s';
 return'<div class="scr"><div class="bar"><button class="wb'+(s?'':' on')+'" data-a="le">'+E(T('teams'))+'</button><button class="wb'+(s?' on':'')+'" data-a="ls">'+E(T('nats'))+'</button><button class="wb" data-a="t">'+E(T('home'))+'</button></div><input id="q" class="q" type="search" placeholder="..." value="'+E(S.q)+'"><div class="tb"><div class="gr hd '+(s?'g3':'g4')+'">'+(s?'<span></span><span>'+E(T('country'))+'</span>':'<span>'+E(T('club'))+'</span><span></span><span>'+E(T('country'))+'</span>')+'<span class="r">'+E(T('strength'))+'</span></div><div id="rows">'+rows()+'</div></div></div>'}
function detail(){var s=S.a.s,t=(s?D.sel:D.clubes)[S.a.i],c=s?'#cc0000':t.k[0],nm=s?P(t.p):t.n;
 var pn='<div class="pn" style="background:'+c+';color:'+FG(c)+'"><div class="pr"><div><div class="tn">'+E(nm)+'</div><div class="fn">'+E(s?'':t.c)+'</div></div>'+(t.s?'<img class="cr" alt="" src="'+U('assets/escudos/'+t.s)+'">':'')+'</div><div class="pr"><div><small>'+E(T('stadium'))+'</small><div>'+E(s?'':t.e)+'</div></div><div class="fz"><small>'+E(T('strength'))+'</small><b>'+t.f+'</b></div></div><div class="pr"><div><small>'+E(T('coach'))+'</small><div>'+E(t.t)+'</div></div><div class="ct">'+F(t.p)+'<div>'+E(P(t.p))+'</div></div></div></div>';
 var R=D.rasgos[L]||D.rasgos['65'],N=D.pos[L]||D.pos['65'],g=s?'p5':'p7',n=0,h='<div class="gr hd mh '+g+'">'+(s?'':'<span></span>')+'<span>'+E(T('name'))+'</span><span>'+E(T('position'))+'</span>'+(s?'':'<span></span>')+'<span class="c">'+E(T('age'))+'</span><span>'+E(T('traits'))+'</span>'+(s?'':'<span class="c">'+E(T('side'))+'</span>')+'</div>';
 t.j.forEach(function(j){if(j[4])n++;
  h+='<div class="gr rw '+g+'">'+(s?'':SH(j[4]))+'<span class="el">'+E(j[0])+'</span><span class="el">'+E(N[j[3]])+'</span>'+(s?'':F(j[1]))+'<span class="c">'+j[2]+'</span><span class="el">'+E(R[j[5]]+'/'+R[j[6]])+'</span>'+(s?'':'<span class="c">'+(j[7]?'I':'D')+'</span>')+'</div>'});
 return'<div class="scr"><div class="bar"><button class="wb" data-a="bk">&larr; '+E(T(s?'nats':'teams'))+'</button></div>'+pn+'<div class="tb">'+h+'</div><div class="ft"><span>'+t.j.length+' '+E(T('players'))+'</span>'+(s?'':SH(1)+'<span>'+n+'</span>')+'</div></div>'}
function draw(){A.innerHTML=S.v==='t'?title():S.v==='l'?list():detail();bind()}
function go(v,a){S.v=v;S.a=a;S.q='';try{history.pushState({v:v,a:a},'')}catch(e){}draw();window.scrollTo(0,0)}
function act(){var a=this.getAttribute('data-a');
 if(a==='n'||a==='c')document.getElementById('nt').textContent='Disponible en la próxima etapa';
 else if(a==='e'||a==='le')go('l','e');else if(a==='ls')go('l','s');else if(a==='t')go('t');else if(a==='bk')go('l',S.a.s?'s':'e')}
function bind(){var b=A.querySelectorAll('[data-a]');for(var i=0;i<b.length;i++)b[i].onclick=act;
 var lg=document.getElementById('lg');if(lg)lg.onchange=function(){L=lg.value;try{localStorage.setItem('cf_lang',L)}catch(e){}draw()};
 var q=document.getElementById('q');if(q)q.oninput=function(){S.q=q.value;document.getElementById('rows').innerHTML=rows()};
 var r=document.getElementById('rows');if(r)r.onclick=function(e){var x=e.target.closest('[data-i]');if(x)go('d',{s:S.a==='s',i:+x.getAttribute('data-i')})}}
try{history.replaceState({v:'t',a:null},'')}catch(e){}
window.onpopstate=function(e){var s=e.state||{v:'t',a:null};S.v=s.v;S.a=s.a;S.q='';draw()};
draw();
if('serviceWorker' in navigator&&/^https?:/.test(location.protocol))navigator.serviceWorker.register('sw.js').catch(function(){});
})();
