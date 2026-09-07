(function(){
'use strict';
function optionFrom(target){
  if(!target) return null;
  if(target.closest) return target.closest('.sheet-option');
  while(target && target!==document){
    if(target.classList && target.classList.contains('sheet-option')) return target;
    target=target.parentNode;
  }
  return null;
}

// iOS Safari can occasionally fail to deliver the synthetic click after a tap
// inside a fixed bottom sheet. Force the existing button click handler on touchend.
document.addEventListener('touchend', function(e){
  var btn=optionFrom(e.target);
  if(!btn) return;
  e.preventDefault();
  e.stopPropagation();
  btn.click();
}, {capture:true, passive:false});

// Safety net: after a normal click on an option, never leave a stale backdrop.
document.addEventListener('click', function(e){
  var btn=optionFrom(e.target);
  if(!btn) return;
  setTimeout(function(){
    var sheet=document.querySelector('.sheet-backdrop');
    if(sheet && sheet.parentNode) sheet.parentNode.removeChild(sheet);
  }, 30);
}, true);
})();