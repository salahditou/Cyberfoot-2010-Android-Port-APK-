(function(){'use strict';
var D=window.__DATA__,IM=window.__IMGS__||{},A=document.getElementById('app'),L='65',O=false;
var ORD=['57','31','3','97','65','11','72','104','152','154','160','192'];
try{L=localStorage.getItem('cf_lang')||L}catch(e){}
if(ORD.indexOf(L)<0)L='65';
function U(p){return IM[p]||p}
function T(k){return(D.i18n[L]&&D.i18n[L][k])||D.i18n['65'][k]||k}
function E(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function N(id){for(var i=0;i<D.idiomas.length;i++)if(D.idiomas[i][0]===id)return D.idiomas[i][1];return id}
function F(id){return'<img class="fl" alt="" src="'+U('assets/flags/'+id+'.png')+'">'}
function draw(){
 var it=ORD.map(function(i){return'<div class="it'+(i===L?' on':'')+'" data-l="'+i+'">'+F(i)+'<span>'+E(N(i))+'</span></div>'}).join('');
 A.innerHTML='<div class="stage" style="background-image:url('+U('assets/inicio.jpg')+')"><span class="lb">'+E(T('lang'))+'</span><div class="cbx"><button class="cb" id="cb" type="button">'+F(L)+'<span>'+E(N(L))+'</span><i></i></button><div class="dd" id="dd"'+(O?'':' hidden')+'>'+it+'</div></div><button class="gb" style="top:78.08cqw" data-a="n">'+E(T('new'))+'</button><button class="gb" style="top:88.28cqw" data-a="c">'+E(T('cont'))+'</button></div>';
 document.getElementById('cb').onclick=function(e){e.stopPropagation();O=!O;document.getElementById('dd').hidden=!O};
 var l=A.querySelectorAll('[data-l]');for(var i=0;i<l.length;i++)l[i].onclick=function(e){e.stopPropagation();L=this.getAttribute('data-l');try{localStorage.setItem('cf_lang',L)}catch(x){}O=false;draw()};
}
document.addEventListener('click',function(){var d=document.getElementById('dd');if(O&&d){O=false;d.hidden=true}});
draw();
if('serviceWorker' in navigator){if(/^(localhost|127\.0\.0\.1)$/.test(location.hostname)){navigator.serviceWorker.getRegistrations().then(function(r){r.forEach(function(x){x.unregister()})});if(window.caches)caches.keys().then(function(k){k.forEach(function(x){caches.delete(x)})})}else if(/^https?:/.test(location.protocol))navigator.serviceWorker.register('sw.js').catch(function(){})}
})();
