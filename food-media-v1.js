(function(){
'use strict';
var replacements={
  'Курица в медово-чесночной глазури':'images/c01.jpg',
  'Креветки в чесночно-лимонном масле':'images/f05.jpg',
  'Томатно-сырная паста':'images/v09.jpg'
};
function applyFoodMedia(root){
  var scope=root&&root.querySelectorAll?root:document;
  var imgs=scope.querySelectorAll('img[alt]');
  for(var i=0;i<imgs.length;i++){
    var img=imgs[i];
    var local=replacements[img.getAttribute('alt')];
    if(local && img.getAttribute('src')!==local){
      img.src=local;
      img.removeAttribute('srcset');
    }
  }
}
var app=document.getElementById('app');
if(app && window.MutationObserver){
  new MutationObserver(function(){applyFoodMedia(app);}).observe(app,{childList:true,subtree:true});
}
if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',function(){applyFoodMedia(document);});
}else{
  applyFoodMedia(document);
}
setTimeout(function(){applyFoodMedia(document);},0);
})();
