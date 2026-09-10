(function(){
'use strict';

function setText(el,text){if(el&&el.textContent!==text)el.textContent=text;}
function setHTML(el,html){if(el&&el.innerHTML!==html)el.innerHTML=html;}
function plural(n,one,few,many){var m10=n%10,m100=n%100;if(m10===1&&m100!==11)return one;if(m10>=2&&m10<=4&&(m100<12||m100>14))return few;return many;}

function patchSheet(){
  var backdrop=document.querySelector('.sheet-backdrop');
  if(!backdrop)return;
  var sheet=backdrop.querySelector('.sheet');
  if(!sheet)return;
  document.body.classList.add('sheet-open');
  sheet.setAttribute('role','dialog');
  sheet.setAttribute('aria-modal','true');

  var title=sheet.querySelector('h3');
  if(title&&!sheet.querySelector('.sheet-titlebar')){
    title.id='sheetTitle';
    sheet.setAttribute('aria-labelledby','sheetTitle');
    var bar=document.createElement('div');
    bar.className='sheet-titlebar';
    title.parentNode.insertBefore(bar,title);
    bar.appendChild(title);
    var close=document.createElement('button');
    close.type='button';
    close.className='sheet-close';
    close.setAttribute('aria-label','Закрыть');
    close.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="m7 7 10 10M17 7 7 17"></path></svg>';
    bar.appendChild(close);
    close.addEventListener('click',function(){
      document.body.classList.remove('sheet-open');
      if(backdrop.parentNode)backdrop.parentNode.removeChild(backdrop);
    });
  }

  var options=sheet.querySelectorAll('.sheet-option');
  Array.prototype.forEach.call(options,function(option){
    option.setAttribute('aria-pressed',option.classList.contains('selected')?'true':'false');
    if(option.textContent.trim()==='Любой'){
      var span=option.querySelector('span');
      if(span)setText(span,'Любой продукт');
    }
  });
}

function patchMicrocopy(){
  var brandSmall=document.querySelector('.brand small');
  setText(brandSmall,'рецепты на каждый день');

  var intro=document.querySelector('.intro');
  if(intro){
    setText(intro.querySelector('.eyebrow'),'Подбор ужина');
    setText(intro.querySelector('p'),'Ответьте на 3 вопроса — подберём 3 рецепта под ваше время и настроение.');
  }

  var show=document.getElementById('showBtn');
  if(show){
    setHTML(show,'Подобрать 3 рецепта <span aria-hidden="true">→</span>');
    show.setAttribute('aria-label','Подобрать три рецепта');
  }

  var trust=document.querySelectorAll('.trust-line span');
  if(trust.length>=3)setText(trust[2],'рецепт целиком');

  var results=document.querySelector('.results-head');
  if(results){
    setText(results.querySelector('.eyebrow'),'Под ваши ответы');
    setText(results.querySelector('h2'),'Вот что можно приготовить');
    var desc=results.querySelector('.results-description');
    if(!desc){
      desc=document.createElement('p');
      desc.className='results-description';
      desc.textContent='3 рецепта, которые подходят под выбранные параметры.';
      var heading=results.querySelector('h2');
      if(heading&&heading.parentNode)heading.parentNode.appendChild(desc);
    }
  }

  var edit=document.getElementById('editBtn');
  setText(edit,'Изменить выбор');

  Array.prototype.forEach.call(document.querySelectorAll('.card-cta'),function(button){
    setHTML(button,'Открыть рецепт <span aria-hidden="true">→</span>');
  });

  var reroll=document.getElementById('rerollBtn');
  if(reroll)setText(reroll,'↻  Показать ещё 3');

  Array.prototype.forEach.call(document.querySelectorAll('.card-meta span'),function(item){
    var match=item.textContent.trim().match(/^(\d+)\s+порц\.$/);
    if(match){
      var n=Number(match[1]);
      setText(item,n+' '+plural(n,'порция','порции','порций'));
    }
  });

  Array.prototype.forEach.call(document.querySelectorAll('.step > span'),function(num){
    var n=Number(num.textContent.trim());
    if(n&&n<10)setText(num,'0'+n);
  });

  var offer=document.querySelector('.offer');
  if(offer){
    setText(offer.querySelector('.offer-label'),'Больше готовых решений');
    var offerP=offer.querySelector('p');
    setText(offerP,'Не хочется каждый вечер выбирать с нуля? В подборке — 50 идей для обычных будней.');
    var offerButton=offer.querySelector('button');
    setText(offerButton,'Посмотреть подборку →');
  }

  Array.prototype.forEach.call(document.querySelectorAll('.toast'),function(toast){
    if(toast.textContent.indexOf('Платный продукт подключим')!==-1)setText(toast,'Подборка готовится — скоро откроем доступ.');
  });

  Array.prototype.forEach.call(document.querySelectorAll('.notice'),function(notice){
    if(notice.textContent.indexOf('Не получилось собрать три варианта')!==-1){
      setText(notice,'Не нашли 3 рецепта по этим параметрам. Увеличьте время или выберите «Любой продукт».');
    }
  });

  patchSheet();
}

patchMicrocopy();
var observer=new MutationObserver(function(){
  patchMicrocopy();
  if(!document.querySelector('.sheet-backdrop'))document.body.classList.remove('sheet-open');
});
observer.observe(document.documentElement,{childList:true,subtree:true});
})();
