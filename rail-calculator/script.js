'use strict';
// All application data lives under one versioned key; no external requests.
const KEY = 'rails-seller-v1';
const DEFAULT_PRICES = {price:1290, install:8000, light:0, rotation:0};
const LEGACY_STANDARD = [
 {id:'standard',name:'Обычный расчёт',text:'Добрый день!\n\nПо вашим размерам ориентировочно потребуется {TOTAL_RAILS} элементов с учётом верхней и нижней направляющих.\n\nСтоимость изготовления — примерно {PRODUCTION_PRICE} ₽.\n\nМонтаж — {INSTALLATION_PRICE} ₽.\n\nИтого ориентировочно — {TOTAL_PRICE} ₽.\n\nТочную стоимость сможем подтвердить после уточнения размеров и места установки.'},
 {id:'short',name:'Короткий расчёт',text:'Добрый день!\n\nПо вашим размерам изготовление перегородки ориентировочно составит {PRODUCTION_PRICE} ₽.\n\nС монтажом — около {TOTAL_PRICE} ₽.\n\nЕсли пришлёте фото места установки, сможем точнее всё проверить.'},
 {id:'dimensions',name:'Нужны размеры',text:'Добрый день!\n\nДля расчёта пришлите, пожалуйста, ширину и высоту места установки.\n\nЕсли есть возможность, также отправьте фото помещения — так будет проще сразу подобрать подходящий вариант.'}
];
const LEGACY_WITHOUT_INSTALLATION = [
 {id:'standard-no-install',name:'Обычный расчёт · без монтажа',text:'Добрый день!\n\nПо вашим размерам ориентировочно потребуется {TOTAL_RAILS} элементов с учётом верхней и нижней направляющих.\n\nСтоимость изготовления — примерно {PRODUCTION_PRICE} ₽.\n\nИтого без монтажа — {TOTAL_PRICE} ₽. Монтаж в стоимость не включён.\n\nТочную стоимость сможем подтвердить после уточнения размеров и места установки.'},
 {id:'short-no-install',name:'Короткий расчёт · без монтажа',text:'Добрый день!\n\nИзготовление перегородки по вашим размерам — ориентировочно {TOTAL_PRICE} ₽, без монтажа.\n\nЕсли пришлёте фото места установки, сможем точнее всё проверить.'}
];
const LEGACY_QUICK = [
 ['Нужны размеры',LEGACY_STANDARD[2].text],
 ['Срок изготовления','Добрый день! Срок изготовления уточним после согласования размеров, исполнения и текущей загрузки производства. Подскажите, к какой дате вам нужна перегородка?'],
 ['Монтаж','Монтаж можно включить в расчёт. Пришлите, пожалуйста, фото места установки и адрес или район — уточним условия и стоимость.'],
 ['Клиент думает','Конечно, подумайте! Если появятся вопросы по размерам, исполнению или монтажу — напишите, с удовольствием помогу.'],
 ['Попросить фото помещения','Пришлите, пожалуйста, фото места установки, чтобы были видны пол и потолок. Так сможем проверить, какой вариант перегородки подойдёт.']
];
const STANDARD = [
 {
  "id": "dimensions",
  "name": "Первый ответ — цена",
  "text": "Добрый день! Можем рассчитать. Пришлите ширину и высоту места установки — подготовлю расчёт.\n\nПришлите фото места установки или уточните, к чему будет крепиться перегородка — к какому полу и потолку. Если пока не знаете, так и напишите: подскажем, что проверить."
 },
 {
  "id": "standard",
  "name": "Готовый расчёт",
  "text": "Посчитал по вашим размерам.\n\nИзготовление — {PRODUCTION_PRICE} ₽.[IF_LIGHTING] Подсветка учтена в этой сумме.[/IF_LIGHTING][IF_INSTALLATION]\nМонтаж — {INSTALLATION_PRICE} ₽.[/IF_INSTALLATION]\nИтого — ориентировочно {TOTAL_PRICE} ₽.\n\nВ конструкции {TOTAL_RAILS} элементов с учётом направляющих.\n\nЕсли стоимость подходит, уточним размеры и крепление перед заказом."
 },
 {
  "id": "short",
  "name": "Короткий расчёт",
  "text": "По вашим размерам — ориентировочно {TOTAL_PRICE} ₽.[IF_INSTALLATION] Монтаж включён.[/IF_INSTALLATION][IF_LIGHTING] Подсветка включена.[/IF_LIGHTING]\n\nЕсли стоимость подходит, уточним крепление и согласуем детали."
 },
 {
  "id": "construction",
  "name": "Вариант перегородки",
  "text": "По вашим размерам {VERSION} перегородка — ориентировочно {TOTAL_PRICE} ₽.[IF_INSTALLATION] Монтаж включён.[/IF_INSTALLATION][IF_LIGHTING] Подсветка включена.[/IF_LIGHTING]\n\n[IF_ROTATING]Рейки можно поворачивать, меняя открытость перегородки.[/IF_ROTATING][IF_FIXED]Рейки помогут разделить пространство на зоны.[/IF_FIXED]\n\nПришлите фото места установки или уточните, к чему будет крепиться перегородка — к какому полу и потолку. Если пока не знаете, так и напишите: подскажем, что проверить."
 },
 {
  "id": "approximate",
  "name": "Нет точных размеров",
  "text": "Подойдут и примерные размеры. Напишите ширину и высоту — дам ориентир по стоимости. Точные размеры уточним перед изготовлением."
 },
 {
  "id": "mounting",
  "name": "Фото или крепление",
  "text": "Пришлите фото места установки или уточните, к чему будет крепиться перегородка — к какому полу и потолку. Если пока не знаете, так и напишите: подскажем, что проверить."
 },
 {
  "id": "timing",
  "name": "Срок изготовления",
  "text": "К какой дате нужна перегородка? Уточню срок под ваши размеры и исполнение с учётом загрузки производства."
 },
 {
  "id": "thinking",
  "name": "Клиент думает",
  "text": "Что пока останавливает: стоимость или выбор конструкции? Подскажу, какие варианты можно рассмотреть под вашу задачу."
 },
 {
  "id": "budget",
  "name": "Дорого",
  "text": "На какой бюджет ориентируетесь? Посмотрим, что можно изменить в конструкции.[IF_LIGHTING] Отдельно проверим стоимость выбранной подсветки.[/IF_LIGHTING]"
 },
 {
  "id": "order",
  "name": "Следующий шаг",
  "text": "Если расчёт подходит, согласуем точные размеры, цвет и крепление.[IF_LIGHTING] Уточним расположение подсветки.[/IF_LIGHTING][IF_INSTALLATION] Затем согласуем детали монтажа.[/IF_INSTALLATION]\n\nКакой цвет хотите?"
 }
];
const QUICK = [["Нужны размеры", "Добрый день! Можем рассчитать. Пришлите ширину и высоту места установки — подготовлю расчёт.\n\nПришлите фото места установки или уточните, к чему будет крепиться перегородка — к какому полу и потолку. Если пока не знаете, так и напишите: подскажем, что проверить."], ["Срок изготовления", "К какой дате нужна перегородка? Уточню срок под ваши размеры и исполнение с учётом загрузки производства."], ["Крепление и установка", "Уточним крепление перегородки.[IF_INSTALLATION] Для согласования монтажа напишите адрес или район.[/IF_INSTALLATION]\n\nПришлите фото места установки или уточните, к чему будет крепиться перегородка — к какому полу и потолку. Если пока не знаете, так и напишите: подскажем, что проверить."], ["Клиент думает", "Что пока останавливает: стоимость или выбор конструкции? Подскажу, какие варианты можно рассмотреть под вашу задачу."], ["Фото или крепление", "Пришлите фото места установки или уточните, к чему будет крепиться перегородка — к какому полу и потолку. Если пока не знаете, так и напишите: подскажем, что проверить."]];
const VARIABLES = {WIDTH:'Ширина',HEIGHT:'Высота',TYPE:'Тип',VERSION:'Исполнение',GAPS:'Промежутки',VERTICAL_RAILS:'Вертикальные рейки',GUIDES:'Направляющие',TOTAL_RAILS:'Все элементы',PRICE_PER_RAIL:'Цена элемента',PRODUCTION_PRICE:'Изготовление с опциями',INSTALLATION_PRICE:'Выбранный монтаж',OPTIONS_PRICE:'Дополнительные опции',TOTAL_PRICE:'Итого'};
const $ = id => document.getElementById(id);
const clone = value => JSON.parse(JSON.stringify(value));
const numberFormat = new Intl.NumberFormat('ru-RU',{maximumFractionDigits:2});
const num = value => numberFormat.format(value).replace(/\u00a0/g,' ');
const money = value => num(value)+' ₽';
const uid = () => Date.now().toString(36)+'-'+Math.random().toString(36).slice(2);
let state = {prices:clone(DEFAULT_PRICES),templates:clone(STANDARD),defaultId:'standard',quick:QUICK.map(x=>x[1]),history:[],draft:null,reply:''};
let result = null, editingId = null, historicalPrices = null, toastTimer;
function storageWarning(text){$('storage-warning').textContent=text;$('storage-warning').hidden=false;}
// Validate persisted values before using them. Broken storage never prevents opening the app.
function validPrices(p){return p && Object.keys(DEFAULT_PRICES).every(k=>typeof p[k]==='number' && Number.isFinite(p[k]) && p[k]>=0 && p[k]<=1e9);}
function validInput(i){return i && Number.isFinite(i.width)&&i.width>0&&i.width<=1e7&&Number.isFinite(i.height)&&i.height>0&&i.height<=1e7&&['opaque','open'].includes(i.type)&&['fixed','rotating'].includes(i.version)&&typeof i.installation==='boolean'&&typeof i.lighting==='boolean';}
try{
 const raw=localStorage.getItem(KEY);
 if(raw){const saved=JSON.parse(raw);if(!saved || !validPrices(saved.prices)||!Array.isArray(saved.templates)||!saved.templates.every(t=>t&&typeof t.id==='string'&&typeof t.name==='string'&&typeof t.text==='string'))throw Error('invalid');
 state.prices=saved.prices;state.templates=saved.templates;state.defaultId=saved.defaultId;
 if(Array.isArray(saved.quick)&&saved.quick.length===5&&saved.quick.every(t=>typeof t==='string'))state.quick=saved.quick;
 if(Array.isArray(saved.history))state.history=saved.history.filter(h=>h&&validInput(h.input)&&validPrices(h.prices)&&Number.isFinite(h.time)).slice(0,20);
 if(saved.draft&&typeof saved.draft==='object')state.draft=saved.draft;
 if(typeof saved.reply==='string')state.reply=saved.reply;state.replyContext=saved.replyContext;state.libraryVersion=saved.libraryVersion;
 }
}catch(e){storageWarning('Не удалось прочитать сохранённые данные. Работа продолжается с начальными значениями.');}
function save(){try{localStorage.setItem(KEY,JSON.stringify(state));return true;}catch(e){storageWarning('Браузер не смог сохранить данные. Они доступны в этой вкладке, но могут исчезнуть после закрытия. Освободите место или разрешите локальное хранение.');return false;}}
function toast(text){clearTimeout(toastTimer);$('toast').textContent=text;$('toast').hidden=false;toastTimer=setTimeout(()=>$('toast').hidden=true,3500);}
function error(id,text){$(id).textContent=text;$(id).hidden=!text;}
function parseNumber(value){const raw=String(value).trim();if(!/^\d+(?:[.,]\d+)?$/.test(raw)&&!/^\d{1,3}(?:[ \u00a0\u202f]\d{3})+(?:[.,]\d+)?$/.test(raw))return NaN;const s=raw.replace(/[ \u00a0\u202f]/g,'').replace(',','.');return /^\d+(\.\d+)?$/.test(s)?Number(s):NaN;}
function readInput(){return {width:parseNumber($('width').value),height:parseNumber($('height').value),type:document.querySelector('[name=type]:checked').value,version:document.querySelector('[name=version]:checked').value,installation:$('installation').checked,lighting:$('lighting').checked};}
function writeInput(i){$('width').value=i.width??'';$('height').value=i.height??'';document.querySelector('[name=type][value="'+(i.type==='open'?'open':'opaque')+'"]').checked=true;document.querySelector('[name=version][value="'+(i.version==='rotating'?'rotating':'fixed')+'"]').checked=true;$('installation').checked=i.installation===true;$('lighting').checked=i.lighting===true;}
// Money is calculated in kopecks, avoiding floating-point rounding in totals.
function calculate(input, prices){const gaps=Math.round(input.width/(input.type==='opaque'?75:110));const vertical=gaps+1,totalRails=vertical+2;const options=(input.lighting?Math.round(prices.light*100):0)+(input.version==='rotating'?Math.round(prices.rotation*100):0);const production=totalRails*Math.round(prices.price*100)+options;const installation=input.installation?Math.round(prices.install*100):0;return {gaps,vertical,guides:2,totalRails,options:options/100,production:production/100,installation:installation/100,total:(production+installation)/100};}
function typeName(i){return i.type==='opaque'?'Непроглядная':'Проглядная';}
function versionName(i){return i.version==='fixed'?'Неподвижная':'Поворотная';}
function renderResult(){if(!result)return;const {input:i,values:r}=result;$('empty-result').hidden=true;$('result').hidden=false;$('result-status').textContent=historicalPrices?'Цены из истории':'Предварительный';$('result-size').textContent=`${num(i.width)} × ${num(i.height)} мм · ${typeName(i)} · ${versionName(i)}`;$('total').textContent=money(r.total);$('height-warning').hidden=i.height<=2850;
 $('price-lines').replaceChildren();[['Изготовление',r.production],['В том числе опции',r.options],['Монтаж'+(i.installation?'':' · не включён'),r.installation]].forEach(([label,value])=>{const row=document.createElement('div'),dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=label;dd.textContent=money(value);row.append(dt,dd);$('price-lines').append(row);});
 $('counts').replaceChildren();[[r.gaps,'Промежутков'],[r.vertical,'Реек'],[2,'Направляющих'],[r.totalRails,'Всего']].forEach(([value,label])=>{const d=document.createElement('div'),strong=document.createElement('strong'),s=document.createElement('span');strong.textContent=num(value);s.textContent=label;d.append(strong,s);$('counts').append(d);});
}
function runCalculation(record=true){const input=readInput();
 for(const key of ['width','height']){const label=key==='width'?'Ширина':'Высота';const value=input[key];
 if(!Number.isFinite(value)||value<=0||value>1e7){error('calc-error',label+': введите положительное число в миллиметрах. Например, 1 600 или 2700.');$(key).focus();return false;}
 if(value<100){error('calc-error',label+': размер меньше 100 мм. Проверьте единицы: 1,6 м нужно вводить как 1600 мм.');$(key).focus();return false;}}
 error('calc-error','');$('dimension-warning').hidden=input.width<=10000&&input.height<=10000;
 const prices=clone(historicalPrices||state.prices);result={input,prices,values:calculate(input,prices)};renderResult();updateReplyStatus();if(record){state.history.unshift({id:uid(),time:Date.now(),input,prices});state.history=state.history.slice(0,20);save();renderHistory();}return true;}
function invalidate(){historicalPrices=null;renderSettings();result=null;$('result').hidden=true;$('empty-result').hidden=false;$('empty-result').firstChild.textContent='Параметры изменены. Нажмите «Рассчитать».';updateReplyStatus();$('dimension-warning').hidden=true;state.draft={...readInput(),width:$('width').value,height:$('height').value};save();}
function showPage(id){document.querySelectorAll('.page').forEach(p=>p.hidden=p.id!==id);document.querySelectorAll('nav button').forEach(b=>{b.classList.toggle('active',b.dataset.page===id);if(b.dataset.page===id)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});window.scrollTo(0,0);}
function confirmAction(text,action){$('confirm-text').textContent=text;$('confirm-dialog').showModal();$('confirm-cancel').focus();$('confirm-ok').onclick=()=>{$('confirm-dialog').close();action();};}
$('confirm-cancel').onclick=()=>$('confirm-dialog').close();
async function copyText(text){if(!text.trim()){toast('Сначала подготовьте текст ответа');return;}try{if(!navigator.clipboard?.writeText)throw Error('fallback');await navigator.clipboard.writeText(text);toast('Скопировано');}catch(e){const t=document.createElement('textarea');t.value=text;t.style.cssText='position:fixed;top:0;left:0;opacity:0';document.body.append(t);t.focus();t.select();t.setSelectionRange(0,t.value.length);let copied=false;try{copied=document.execCommand('copy');}catch(e){}t.remove();if(copied)toast('Скопировано');else{showPage('calculator');$('reply').value=text;state.reply=text;save();$('reply').focus();$('reply').select();toast('Текст выделен. Выберите «Копировать» в меню устройства.');}}}
function substitutions(){const {input:i,prices:p,values:r}=result;return {WIDTH:num(i.width),HEIGHT:num(i.height),TYPE:typeName(i).toLowerCase(),VERSION:versionName(i).toLowerCase(),GAPS:num(r.gaps),VERTICAL_RAILS:num(r.vertical),GUIDES:'2',TOTAL_RAILS:num(r.totalRails),PRICE_PER_RAIL:num(p.price),PRODUCTION_PRICE:num(r.production),INSTALLATION_PRICE:num(r.installation),OPTIONS_PRICE:num(r.options),TOTAL_PRICE:num(r.total)};}
function optionText(text,input=readInput()){
 const flags={INSTALLATION:input.installation,LIGHTING:input.lighting,ROTATING:input.version==='rotating',FIXED:input.version==='fixed'};
 return text.replace(/\[IF_(INSTALLATION|LIGHTING|ROTATING|FIXED)\]([\s\S]*?)\[\/IF_\1\]/g,(_,key,body)=>flags[key]?body:'').replace(/\n{3,}/g,'\n\n').trim();
}
function optionContext(){const i=readInput();return 'options:'+JSON.stringify([i.installation,i.lighting,i.version]);}
function generate(){
 const t=state.templates.find(t=>t.id===$('reply-template').value);
 if(!t){toast('Создайте шаблон в разделе «Шаблоны»');return;}
 let text=optionText(t.text);
 const needsCalculation=Object.keys(VARIABLES).some(k=>text.includes('{'+k+'}'));
 if(needsCalculation){
  if(!result&&!runCalculation())return;
  const values=substitutions();text=text.replace(/\{([A-Z_]+)\}/g,(match,key)=>values[key]??match);
  if(result.input.height>2850)text+='\n\nВысота превышает стандартную максимальную высоту конструкции 2850 мм. Требуется индивидуальный расчёт.';
 }
 $('reply').value=text;state.reply=text;
 state.replyContext=needsCalculation?JSON.stringify(result):(t.text.includes('[IF_')?optionContext():'independent');
 updateReplyStatus();save();toast('Ответ готов — можно отредактировать');
}
function renderTemplates(){const previous=$('reply-template').value;$('reply-template').replaceChildren();$('template-list').replaceChildren();state.templates.forEach(t=>{const o=document.createElement('option');o.value=t.id;o.textContent=t.name+(t.id===state.defaultId?' · по умолчанию':'');$('reply-template').append(o);const b=document.createElement('button');b.className='template-item'+(t.id===editingId?' selected':'');b.textContent=o.textContent;b.onclick=()=>editTemplate(t.id);$('template-list').append(b);});$('reply-template').value=state.templates.some(t=>t.id===previous)?previous:(state.defaultId||state.templates[0]?.id||'');if(!state.templates.length)$('template-list').textContent='Пока нет шаблонов. Создайте первый.';}
function editTemplate(id){editingId=id;const t=state.templates.find(t=>t.id===id);$('template-name').value=t?.name||'';$('template-text').value=t?.text||'';$('template-default').checked=t?t.id===state.defaultId:!state.templates.length;$('delete-template').disabled=!t;$('duplicate-template').disabled=!t;error('template-error','');renderTemplates();}
function renderQuick(){$('quick-buttons').replaceChildren();$('quick-form').replaceChildren();QUICK.forEach(([name],index)=>{const b=document.createElement('button');b.textContent=name;b.onclick=()=>copyText(optionText(state.quick[index]));$('quick-buttons').append(b);const label=document.createElement('label');label.textContent=name;const text=document.createElement('textarea');text.rows=3;text.value=state.quick[index];text.dataset.quick=index;label.append(text);$('quick-form').append(label);});const saveButton=document.createElement('button');saveButton.className='secondary';saveButton.textContent='Сохранить быстрые ответы';$('quick-form').append(saveButton);}
function renderHistory(){$('export-history').disabled=!state.history.length;$('history-list').replaceChildren();$('clear-history').disabled=!state.history.length;if(!state.history.length){$('history-list').textContent='Здесь появятся ваши расчёты.';return;}state.history.forEach(h=>{const r=calculate(h.input,h.prices),b=document.createElement('button');b.className='history-item';const date=document.createElement('span'),title=document.createElement('strong'),info=document.createElement('span');date.textContent=new Date(h.time).toLocaleString('ru-RU');title.textContent=`${num(h.input.width)} × ${num(h.input.height)} мм · ${money(r.total)}`;info.textContent=`${typeName(h.input)} · ${versionName(h.input)} · ${r.totalRails} элементов`;b.append(date,title,info);b.onclick=()=>{historicalPrices=clone(h.prices);writeInput(h.input);$('install-hint').textContent=money(h.prices.install);$('light-hint').textContent=money(h.prices.light);state.draft=clone(h.input);save();runCalculation(false);showPage('calculator');toast('Восстановлен расчёт с прежними ценами. При изменении параметров применятся текущие цены.');};$('history-list').append(b);});}
function renderSettings(){Object.keys(DEFAULT_PRICES).forEach(k=>$(k).value=state.prices[k]);$('install-hint').textContent=money(state.prices.install);$('light-hint').textContent=money(state.prices.light);}
// Bind events once; user-supplied text is always rendered as text, never HTML.
document.querySelectorAll('nav button').forEach(b=>b.onclick=()=>showPage(b.dataset.page));
document.querySelector('.brand').onclick=e=>{e.preventDefault();showPage('calculator');};
$('calc-form').onsubmit=e=>{e.preventDefault();if(runCalculation()&&window.matchMedia('(max-width:760px)').matches)$('result').scrollIntoView({block:'start',behavior:'auto'});};$('calc-form').addEventListener('input',invalidate);
$('generate').onclick=generate;$('copy').onclick=()=>{if(replyIsStale()){toast('Обновите ответ: параметры или цены изменились');return;}copyText($('reply').value);};$('reply').oninput=()=>{state.reply=$('reply').value;updateReplyStatus();save();};
$('new-template').onclick=()=>{editTemplate(null);$('template-name').focus();};
$('template-form').onsubmit=e=>{e.preventDefault();const name=$('template-name').value.trim(),text=$('template-text').value;if(!name||!text.trim()){error('template-error','Введите название и текст шаблона.');return;}const id=editingId||uid(),t={id,name,text},index=state.templates.findIndex(t=>t.id===id);if(index<0)state.templates.push(t);else state.templates[index]=t;if($('template-default').checked||!state.defaultId)state.defaultId=id;else if(state.defaultId===id)state.defaultId=state.templates.find(t=>t.id!==id)?.id||id;editingId=id;if(save())toast('Шаблон сохранён');editTemplate(id);};
$('duplicate-template').onclick=()=>{const t=state.templates.find(t=>t.id===editingId);if(!t)return;const copy={id:uid(),name:t.name+' — копия',text:t.text};state.templates.push(copy);save();editTemplate(copy.id);toast('Копия создана');};
$('delete-template').onclick=()=>{const id=editingId;if(!id)return;confirmAction('Удалить этот шаблон? Это действие нельзя отменить.',()=>{state.templates=state.templates.filter(t=>t.id!==id);if(state.defaultId===id)state.defaultId=state.templates[0]?.id||null;save();editTemplate(state.templates[0]?.id||null);toast('Шаблон удалён');});};
Object.entries(VARIABLES).forEach(([key,label])=>{const b=document.createElement('button');b.type='button';b.textContent='{'+key+'}';b.title=label;b.setAttribute('aria-label',label+' — вставить '+b.textContent);b.onclick=()=>{const t=$('template-text');t.setRangeText(b.textContent,t.selectionStart,t.selectionEnd,'end');t.focus();};$('variables').append(b);});
$('quick-form').onsubmit=e=>{e.preventDefault();const values=Array.from(document.querySelectorAll('[data-quick]'),t=>t.value);if(values.some(v=>!v.trim())){toast('Заполните все быстрые ответы');return;}state.quick=values;if(save())toast('Быстрые ответы сохранены');};
$('settings-form').onsubmit=e=>{e.preventDefault();const prices={};for(const k of Object.keys(DEFAULT_PRICES)){prices[k]=parseNumber($(k).value);if(!Number.isFinite(prices[k])||prices[k]<0||prices[k]>1e9||Math.abs(prices[k]*100-Math.round(prices[k]*100))>0.0001){error('settings-error','Введите цены от 0 до 1 000 000 000 ₽, не более двух знаков после запятой.');$(k).focus();return;}}state.prices=prices;historicalPrices=null;error('settings-error','');invalidate();renderSettings();if(save())toast('Цены сохранены');};
$('reset-settings').onclick=()=>confirmAction('Вернуть начальные цены: элемент 1 290 ₽, монтаж 8 000 ₽, подсветка и поворотное исполнение 0 ₽?',()=>{state.prices=clone(DEFAULT_PRICES);historicalPrices=null;renderSettings();invalidate();error('settings-error','');if(save())toast('Начальные цены восстановлены');});
$('clear-history').onclick=()=>confirmAction('Удалить все сохранённые расчёты?',()=>{state.history=[];save();renderHistory();toast('История очищена');});
// Replace only untouched factory text; keep edited and custom templates.
if(state.libraryVersion!==3){
 const legacy=[...LEGACY_STANDARD,...LEGACY_WITHOUT_INSTALLATION];
 state.templates=state.templates.filter(t=>!legacy.some(old=>old.id===t.id&&old.text===t.text));
 for(const template of STANDARD){
  if(state.templates.some(t=>t.id===template.id)){
   const existing=state.templates.find(t=>t.id===template.id);
   if(existing.text!==template.text){const oldId=existing.id;existing.id=uid();if(state.defaultId===oldId)state.defaultId=existing.id;}
  }
  if(!state.templates.some(t=>t.id===template.id))state.templates.push(clone(template));
 }
 state.quick=state.quick.map((text,i)=>text===LEGACY_QUICK[i][1]?QUICK[i][1]:text);
 if(['standard-no-install','short-no-install'].includes(state.defaultId))state.defaultId=state.defaultId.replace('-no-install','');
 state.libraryVersion=3;
 state.replyContext=null;
}
if(state.draft)writeInput({...state.draft,installation:false});
$('reply').value=state.reply;renderSettings();editTemplate(state.defaultId||state.templates[0]?.id||null);renderQuick();renderHistory();
if(!state.templates.some(t=>t.id===state.defaultId)){state.defaultId=state.templates[0]?.id||null;renderTemplates();}
updateReplyStatus();save();

// A saved reply cannot silently become a quote for different dimensions/prices.
function replyIsStale(){return !!$('reply').value.trim()&&state.replyContext!=='independent'&&(state.replyContext?.startsWith('options:')?state.replyContext!==optionContext():(!result||state.replyContext!==JSON.stringify(result)));}
function updateReplyStatus(){const stale=replyIsStale();$('reply-warning').hidden=!stale;$('copy').disabled=stale||!$('reply').value.trim();}
$('export-history').onclick=()=>{
 const headers=['Дата','Ширина, мм','Высота, мм','Тип','Исполнение','Монтаж включён','Подсветка включена','Элементов','Цена элемента, ₽','Доплата подсветка, ₽','Доплата поворот, ₽','Изготовление, ₽','Монтаж, ₽','Итого, ₽'];
 const rows=state.history.map(h=>{const r=calculate(h.input,h.prices);return [new Date(h.time).toLocaleString('ru-RU'),h.input.width,h.input.height,typeName(h.input),versionName(h.input),h.input.installation?'Да':'Нет',h.input.lighting?'Да':'Нет',r.totalRails,h.prices.price,h.prices.light,h.prices.rotation,r.production,r.installation,r.total];});
 const csv='\uFEFF'+[headers,...rows].map(row=>row.map(v=>'"'+(typeof v==='number'?String(v).replace('.',','):String(v)).replace(/"/g,'""')+'"').join(';')).join('\r\n');
 const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='raschety-'+new Date().toISOString().slice(0,10)+'.csv';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);toast('История выгружена в CSV');
};
