'use strict';
/* ORZEN Energy – herramienta local sin conexión a servidor. */
const form = document.getElementById('quoteForm');
const STORAGE_KEY = 'orzen_energy_fichas_v1'; // Conservar las fichas creadas en V1 al actualizar.
const formFields = () => Object.fromEntries(new FormData(form).entries());
let currentId = null;
let planUrl = null;
let planName = '';
let toastHandle;
const byId = (id) => document.getElementById(id);
const money = n => new Intl.NumberFormat('es-AR',{style:'currency',currency:'ARS',maximumFractionDigits:2}).format(n);
const safe = s => String(s ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
const nice = s => String(s ?? '').trim() || 'No informado';
const compactNumber = n => String(n).replaceAll('.','').replace(',','.');
const toast = message => {const el=byId('toast');el.textContent=message;el.classList.add('show');clearTimeout(toastHandle);toastHandle=setTimeout(()=>el.classList.remove('show'),4400)};
const today = () => new Date().toLocaleDateString('es-AR');
const todayISO = () => new Date().toLocaleDateString('en-CA');
const opportunityRef = () => {if(!currentId)currentId=uid();return 'ORZ-'+currentId.replace(/[^A-Za-z0-9]/g,'').slice(-8).toUpperCase()};
const uid = () => (typeof crypto!=='undefined' && crypto.randomUUID)?crypto.randomUUID():`${Date.now()}-${Math.random().toString(16).slice(2)}`;
function getRecords(){try{const x=JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]');return Array.isArray(x)?x:[]}catch{return []}}
function setRecords(rows){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(rows));return true}catch{toast('No se pudo guardar. Revisá el espacio del navegador.');return false}}
function getItems(){return [...byId('itemRows').querySelectorAll('tr')].map(tr=>{const value=s=>tr.querySelector(`[data-item="${s}"]`)?.value??'';return {description:value('description'),quantity:value('quantity'),unit:value('unit'),price:value('price')}})}
function addItem(item={}){
 const tr=document.createElement('tr');
 const fields=[['description','text','Ej.: instalación'],['quantity','number','1'],['unit','text','u'],['price','number','Sin informar']];
 for(const [name,type,placeholder] of fields){const td=document.createElement('td');const input=document.createElement('input');input.type=type;input.dataset.item=name;input.placeholder=placeholder;input.setAttribute('aria-label',name);if(name==='quantity') {input.min='0';input.step='any';input.value=item[name]??1;}else if(name==='price'){input.min='0';input.step='any';input.value=item[name]??'';}else input.value=item[name]??(name==='unit'?'u':'');input.addEventListener('input',updateTotals);td.append(input);tr.append(td)}
 const total=document.createElement('td');total.innerHTML='<span class="item-total">—</span>';tr.append(total);
 const removeCell=document.createElement('td');const rm=document.createElement('button');rm.type='button';rm.className='item-remove';rm.textContent='×';rm.title='Eliminar concepto';rm.setAttribute('aria-label','Eliminar concepto');rm.addEventListener('click',()=>{tr.remove();updateTotals()});removeCell.append(rm);tr.append(removeCell);
 byId('itemRows').append(tr);updateTotals();
}
function totals(){const items=getItems().filter(i=>i.description.trim());const allPriced=items.length>0&&items.every(i=>i.price!==''&&Number.isFinite(Number(i.price))&&Number(i.price)>=0);const sub=items.reduce((sum,i)=>sum+(Math.max(0,Number(i.quantity)||0)*Math.max(0,Number(i.price)||0)),0);const vat=form.elements.includeVat.checked?sub*.21:0;return {items,allPriced,sub,vat,total:sub+vat,authorized:form.elements.priceStatus.value==='authorized'} }
function updateTotals(){for(const row of byId('itemRows').querySelectorAll('tr')){const quantity=Number(row.querySelector('[data-item="quantity"]').value)||0;const price=row.querySelector('[data-item="price"]').value;row.querySelector('.item-total').textContent=price!==''?money(Math.max(0,quantity)*Math.max(0,Number(price))):'—'}const t=totals(),ready=t.allPriced&&t.authorized;byId('subTotal').textContent=ready?money(t.sub):'A confirmar';byId('taxTotal').textContent=ready?(form.elements.includeVat.checked?money(t.vat):'No calculado'):'A confirmar';byId('grandTotal').textContent=ready?money(t.total):'A confirmar';}
function selectedFuel(){return form.querySelector('[name="fuel"]:checked')?.value||'GLP a granel'}
function selectedTank(){return form.querySelector('[name="tank"]:checked')?.value||''}
function renderTank(){const capacity=selectedTank();const valid=Number(capacity);byId('schemeTitle').textContent=valid?`${Number(valid).toLocaleString('es-AR')} L · seleccionada para evaluación`:'Equipo pendiente de definir';const tank=valid>0;
 byId('schemeVisual').innerHTML=`<svg viewBox="0 0 720 210" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Representación conceptual sin escala de un tanque de gas a granel"><defs><linearGradient id="tGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e6f3fc"/><stop offset="1" stop-color="#96b9d2"/></linearGradient></defs><path d="M100 170H615" stroke="#c0d2df" stroke-width="2"/><path d="M140 155H580" stroke="#d9e6f0" stroke-width="3" stroke-dasharray="7 5"/><g opacity="${tank?'1':'.6'}"><rect x="182" y="53" width="350" height="112" rx="56" fill="url(#tGrad)" stroke="#4c7b9f" stroke-width="2"/><path d="M222 66C240 96 240 121 222 151M492 66C474 96 474 121 492 151" stroke="#5b89ab" stroke-width="1.2" fill="none"/><rect x="240" y="161" width="36" height="10" rx="2" fill="#668eae"/><rect x="439" y="161" width="36" height="10" rx="2" fill="#668eae"/><path d="M355 53V28H402" fill="none" stroke="#416a8e" stroke-width="4" stroke-linejoin="round"/><circle cx="403" cy="28" r="5" fill="#2d5376"/><path d="M530 110H575V145" fill="none" stroke="#4b789c" stroke-width="4" stroke-linejoin="round"/><path d="M575 145H610" stroke="#4b789c" stroke-width="4"/></g><text x="358" y="118" fill="#0a3556" font-size="18" text-anchor="middle" font-family="Arial" font-weight="bold">${tank?Number(valid).toLocaleString('es-AR')+' L':'GLP'}</text><text x="360" y="198" text-anchor="middle" fill="#8098aa" font-size="12" font-family="Arial" letter-spacing="3">ESQUEMA ILUSTRATIVO · NO ES UN PLANO</text></svg>`;
}
function updateIndustry(){
 const fuel=selectedFuel();const industry=form.elements.industry.value;
 const isGlp=fuel==='GLP a granel';
 byId('poultryQuestions').classList.toggle('hidden',!isGlp||!industry.includes('Avicultura'));
 byId('grainQuestions').classList.toggle('hidden',!isGlp||!industry.includes('Acopio'));
 byId('industrialQuestions').classList.toggle('hidden',!isGlp||!industry||(industry.includes('Avicultura')||industry.includes('Acopio')));
}
function updateFuel(){const isGlp=selectedFuel()==='GLP a granel';byId('glpPanel').classList.toggle('hidden',!isGlp);byId('dieselPanel').classList.toggle('hidden',isGlp);form.elements.consumptionUnit.value=isGlp?'kg/mes':'L/mes';updateIndustry();updateTotals()}
function record(){const data=formFields();return {id:currentId||uid(),updatedAt:new Date().toISOString(),...data,tank:selectedTank(),fuel:selectedFuel(),items:getItems()}}
function populate(data){form.reset();for(const el of [...form.elements]){if(!el.name||el.name==='fuel'||el.name==='tank'||el.type==='file')continue;if(Object.hasOwn(data,el.name)){if(el.type==='checkbox')el.checked=!!data[el.name];else el.value=String(data[el.name])}}
 form.querySelector(`[name="fuel"][value="${data.fuel==='Diésel'?'Diésel':'GLP a granel'}"]`).checked=true;
 const tank=form.querySelector(`[name="tank"][value="${['500','1000','2000','4000','7300'].includes(String(data.tank))?data.tank:''}"]`);if(tank)tank.checked=true;
 byId('itemRows').innerHTML='';for(const it of data.items||[])addItem(it);currentId=data.id||null;
 clearPlan();const isGlp=selectedFuel()==='GLP a granel';byId('glpPanel').classList.toggle('hidden',!isGlp);byId('dieselPanel').classList.toggle('hidden',isGlp);renderTank();updateIndustry();updateTotals();}
function save(){const data=record();if(!data.company.trim()||!data.city.trim()){toast('Para guardar, completá empresa y localidad.');return}let rows=getRecords();const i=rows.findIndex(r=>r.id===data.id);if(i===-1)rows.unshift(data);else rows[i]=data;if(setRecords(rows)){currentId=data.id;renderSaved();toast('Ficha guardada en este navegador.')}}
function renderSaved(){const wrap=byId('savedList');wrap.replaceChildren();const rows=getRecords();if(!rows.length){wrap.innerHTML='<p class="saved-empty">Todavía no hay fichas guardadas en este navegador.</p>';return}for(const row of rows.sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt))){const entry=document.createElement('div');entry.className='saved-item';const caption=document.createElement('div');const heading=document.createElement('strong');heading.textContent=row.company||'Sin nombre';const sub=document.createElement('small');const d=new Date(row.updatedAt);sub.textContent=`${row.fuel||'GLP'} · ${row.city||'—'} · ${Number.isNaN(d.getTime())?'Fecha desconocida':d.toLocaleDateString('es-AR')}`;caption.append(heading,sub);const buttons=document.createElement('div');buttons.style.cssText='display:flex;gap:7px;flex-direction:row';const open=document.createElement('button');open.textContent='Abrir';open.addEventListener('click',()=>{populate(row);window.scrollTo({top:0,behavior:'smooth'});toast('Ficha recuperada.')});const del=document.createElement('button');del.textContent='Eliminar';del.addEventListener('click',()=>{if(!confirm(`¿Eliminar la ficha de ${row.company}?`))return;setRecords(getRecords().filter(x=>x.id!==row.id));if(currentId===row.id)currentId=null;renderSaved();toast('Ficha eliminada.')});buttons.append(open,del);entry.append(caption,buttons);wrap.append(entry)}}
function startFresh(){if(!confirm('¿Crear una ficha nueva? Guardá primero los cambios que quieras conservar.'))return;populate({items:[]});addItem();toast('Nueva ficha lista.');window.scrollTo({top:0,behavior:'smooth'})}
function exportBackup(){const rows=getRecords();const data={type:'ORZEN_OFFLINE_BACKUP',version:1,createdAt:new Date().toISOString(),records:rows};download(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),`orzen-respaldo-${new Date().toISOString().slice(0,10)}.json`);toast('Respaldo JSON descargado.');}
function download(blob,name){const a=document.createElement('a');const url=URL.createObjectURL(blob);a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000)}
async function importBackup(file){if(!file)return;try{if(file.size>6_000_000)throw Error('El archivo es demasiado grande.');const x=JSON.parse(await file.text());if(x.type!=='ORZEN_OFFLINE_BACKUP'||!Array.isArray(x.records))throw Error('No es un respaldo ORZEN válido.');const merged=new Map(getRecords().map(r=>[r.id,r]));for(const rec of x.records){if(!rec||typeof rec!=='object'||typeof rec.id!=='string'||typeof rec.company!=='string')continue;merged.set(rec.id,rec)}if(!confirm(`Se importarán hasta ${x.records.length} fichas. Las fichas con el mismo identificador se actualizarán. ¿Continuar?`))return;if(setRecords([...merged.values()])){renderSaved();toast('Respaldo importado correctamente.')}}catch(e){toast(`Error al importar: ${e.message}`)}finally{byId('importJson').value=''}}
function clearPlan(){if(planUrl){URL.revokeObjectURL(planUrl);planUrl=null}planName='';byId('planUpload').value='';byId('planPreview').classList.add('hidden');byId('planPreview').replaceChildren()}
function attachPlan(file){clearPlan();if(!file)return;const allowed=['image/png','image/jpeg','image/webp'];if(!allowed.includes(file.type)||file.size>4_000_000){toast('Adjuntá una imagen PNG, JPG o WebP de hasta 4 MB.');return}planUrl=URL.createObjectURL(file);planName=file.name;const img=document.createElement('img');img.src=planUrl;img.alt='Vista previa del plano técnico adjuntado';const label=document.createElement('small');label.textContent=`Plano adjunto: ${file.name}. Debe ser un documento autorizado por el proveedor.`;byId('planPreview').append(img,label);byId('planPreview').classList.remove('hidden')}
function printField(label,value){return `<div class="doc-field"><div class="doc-label">${safe(label)}</div><div class="doc-value">${safe(nice(value))}</div></div>`}
const section=(title,inner)=>`<section class="doc-section"><h2>${safe(title)}</h2>${inner}</section>`;
function sourceLabel(source){return ({invoice:'Factura o registro de consumo',client:'Estimación declarada por el cliente',supplier:'Dato facilitado por proveedor/técnico',unknown:'Sin dato verificado'})[source]||'Por confirmar'}
function operationalDetails(d,fuel){
 const parts=[];
 if(fuel==='Diésel'){
  parts.push(printField('Equipos / vehículos',d.dieselEquipment));
  parts.push(printField('Frecuencia de reposición',d.dieselFrequency));
  parts.push(printField('Almacenamiento / entrega',d.dieselStorage));
  parts.push(printField('Información sobre registros',d.dieselProof));
 }else if((d.industry||'').includes('Avicultura')){
  parts.push(printField('Galpones',d.poultryHouses));
  parts.push(printField('Aves por galpón (declarado)',d.birdsPerHouse));
  parts.push(printField('Ciclos anuales',d.poultryCycles));
  parts.push(printField('Sistema de calefacción',d.heatingSystem));
  parts.push(printField('Temporada de calefacción',d.heatingPeak));
 }else if((d.industry||'').includes('Acopio')){
  parts.push(printField('Secadoras',d.dryers));
  parts.push(printField('Toneladas por hora (declarado)',d.dryerCapacity));
  parts.push(printField('Horas operativas por día',d.dryerHours));
  parts.push(printField('Duración de la campaña',d.dryerSeason));
  parts.push(printField('Historial declarado',d.dryerPreviousFuel));
 }else{
  parts.push(printField('Cantidad de equipos',d.industrialEquipmentCount));
  parts.push(printField('Horas operativas por día',d.industrialHours));
  parts.push(printField('Potencia / modelo / referencia',d.industrialPower));
 }
 return parts.join('');
}
function supplierText(){const d=formFields();const fuel=selectedFuel();const glp=fuel==='GLP a granel';return [
 `ORZEN ENERGY | Oportunidad ${opportunityRef()}`,
 `Empresa: ${nice(d.company)} | ${nice(d.city)}, ${nice(d.province)}`,
 `Contacto: ${nice(d.contact)} (${nice(d.role)})`,
 `Teléfono: ${nice(d.phone)} | Email: ${nice(d.email)}`,
 `Actividad: ${nice(d.industry)} | Uso: ${nice(d.application)}`,
 `Combustible: ${fuel} | Actual: ${nice(d.currentFuel)}`,
 `Consumo declarado: ${d.consumption?d.consumption+' '+nice(d.consumptionUnit):'Sin dato aún'} | Fuente: ${sourceLabel(d.consumptionSource)}`,
 `Equipos y operación: ${nice(d.equipment)}`,
 glp?`Tanque indicado por cliente: ${selectedTank()?Number(selectedTank()).toLocaleString('es-AR')+' L (a validar)':'Sin definir'} | Cantidad mencionada: ${nice(d.tankCount)}`:`Equipos: ${nice(d.dieselEquipment)} | Reposición: ${nice(d.dieselFrequency)}`,
 `Necesidad: ${nice(d.pain)}`,
 `Plazo: ${nice(d.timeline)} | Próximo paso: ${nice(d.nextStep)}`,
 `Consentimiento para compartir contacto: ${d.shareConsent==='on'?'Confirmado':'NO registrado'}`,
 'Se requiere visita y evaluación técnica/comercial del proveedor.'
 ].join('\n')}
async function copyLead(){const d=formFields();if(!d.company?.trim()||!d.city?.trim()){toast('Completá empresa y localidad.');return}if(d.shareConsent!=='on'){toast('Antes de derivar, registrá la autorización del cliente.');return}if(!(d.phone?.trim()||d.email?.trim())){toast('Ingresá un teléfono o correo para que Brian pueda contactar al cliente.');return}
 const txt=supplierText();try{if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(txt)}else{const t=document.createElement('textarea');t.value=txt;t.style.position='fixed';t.style.top='-1000px';document.body.append(t);t.select();if(!document.execCommand('copy'))throw Error('Copiado no disponible');t.remove()}toast('Resumen copiado. Pegalo en WhatsApp para Brian.')}catch{toast('No se pudo copiar. Generá la ficha PDF y compartila.')}}
function makeDoc(type){const d=formFields();const client=type==='client';const supplierReady=!!d.company.trim()&&!!d.city.trim();if(!supplierReady){toast('Completá la empresa y la localidad antes de generar un documento.');return}
 if(!client){if(d.shareConsent!=='on'){toast('Pedile permiso al cliente antes de enviar su contacto al proveedor.');return}if(!(d.phone?.trim()||d.email?.trim())){toast('Completá un teléfono o correo para coordinar la visita.');return}}
 const t=totals();const authorized=t.authorized&&t.allPriced;const fuel=selectedFuel();const glp=fuel==='GLP a granel';const content=[];
 content.push(section('Empresa y establecimiento',`<div class="doc-grid">${printField('Empresa',d.company)}${printField('Localidad y provincia',[d.city,d.province].filter(Boolean).join(', '))}${printField('Actividad',d.industry)}${client?'':printField('Dirección / referencia',d.address)+printField('Contacto',d.contact)+printField('Cargo / área',d.role)+printField('Teléfono',d.phone)+printField('Email',d.email)+printField('Estado comercial',d.status)+printField('Origen del lead',d.leadSource)+printField('Fecha del primer contacto',d.contactDate)}</div>`));
 content.push(section('Necesidad registrada',`<div class="doc-grid">${printField('Combustible de interés',fuel)}${printField('Uso principal',d.application)}${printField('Consumo informado',d.consumption?`${d.consumption} ${d.consumptionUnit}`:'A determinar por el proveedor')}${printField('Origen del dato',sourceLabel(d.consumptionSource))}${printField('Combustible que utiliza hoy',d.currentFuel)}${printField('Establecimientos',d.sites)}${printField('Variación del consumo',d.seasonality)}${printField('Plazo',d.timeline)}${glp?printField('Capacidad de tanque referida',selectedTank()?`${Number(selectedTank()).toLocaleString('es-AR')} L (solo dato orientativo; no validado)`:'No determinada')+printField('Número de tanques referido',d.tankCount):printField('Destino del diésel',d.dieselUse)}</div>`));
 if(!client){content.push(section('Información operativa para visita técnica',`<div class="doc-grid">${operationalDetails(d,fuel)}</div>`));if(d.equipment?.trim())content.push(section('Equipos y horarios declarados',`<div class="doc-kv">${safe(d.equipment)}</div>`));if(d.pain?.trim())content.push(section('Necesidad y motivo de consulta',`<div class="doc-kv">${safe(d.pain)}</div>`));if(d.notes?.trim())content.push(section('Observaciones internas ORZEN',`<div class="doc-kv">${safe(d.notes)}</div>`));content.push(section('Gestión y derivación',`<div class="doc-grid">${printField('Autorización de compartir datos',d.shareConsent==='on'?'Declarada por el cliente':'No registrada')}${printField('Próximo contacto previsto',d.followUpDate)}${printField('Responsable del seguimiento',d.nextOwner)}${printField('Próxima gestión',d.nextStep)}</div>`))}
 else{content.push(section('Estado de la solicitud',`<div class="doc-kv">ORZEN Energy ha registrado su consulta de ${safe(fuel)} para gestionar el contacto con especialistas en suministro energético. El equipo técnico/comercial del proveedor deberá confirmar la información y coordinar una evaluación si corresponde. Este documento acredita el relevamiento, no la aceptación de la operación ni la asignación de un tanque o una tarifa.</div>`));if(d.pain?.trim())content.push(section('Objetivo de la consulta',`<div class="doc-kv">${safe(d.pain)}</div>`));}
 if(client && d.includeClientPrices==='on' && authorized){const trs=t.items.map(i=>`<tr><td>${safe(i.description)}</td><td>${safe(i.quantity||'—')} ${safe(i.unit||'')}</td><td>${money(Number(i.price))}</td></tr>`).join('');content.push(section('Importes confirmados por el proveedor',`<table class="doc-table"><thead><tr><th>Concepto</th><th>Cantidad</th><th>Precio unitario</th></tr></thead><tbody>${trs}</tbody></table><div class="doc-total">Total informado: ${safe(money(t.total))}</div><div class="doc-muted">No constituye una oferta vinculante de ORZEN. Validez y alcance a definir por el proveedor.</div>`))}
 if(client && d.includeClientPlan==='on' && planUrl)content.push(section('Plano autorizado por proveedor',`<img class="doc-plan" src="${planUrl}" alt="Plano de referencia compartido por el proveedor"><div class="doc-muted">Ilustración aportada por el proveedor. La viabilidad de la instalación requiere validación.</div>`));
 if(!client){if(t.items.length){const trs=t.items.map(i=>`<tr><td>${safe(i.description)}</td><td>${safe(i.quantity||'—')} ${safe(i.unit||'')}</td><td>${i.price!==''?money(Number(i.price)):'A confirmar'}</td></tr>`).join('');content.push(section('Conceptos para validar con proveedor (si corresponde)',`<table class="doc-table"><thead><tr><th>Concepto</th><th>Cantidad</th><th>Valor unitario</th></tr></thead><tbody>${trs}</tbody></table>${authorized?`<div class="doc-total">Total informado: ${safe(money(t.total))}</div>`:'<p class="doc-warning">Sin validación completa de importes. No constituye presupuesto económico.</p>'}`))}if(d.tariffRef)content.push(section('Referencia interna',`<div class="doc-kv">${safe(d.tariffRef)}</div>`));if(d.commercialTerms)content.push(section('Condiciones informadas',`<div class="doc-kv">${safe(d.commercialTerms)}</div>`));if(planUrl)content.push(section('Plano aportado para revisión',`<div class="doc-muted">Adjunto: ${safe(planName)}. Deben confirmarse su origen, alcance y vigencia.</div><img class="doc-plan" src="${planUrl}" alt="Plano para revisión">`));}
 const headline=client?'Constancia de solicitud de evaluación energética':'Ficha de oportunidad para Brian';const sub=client?'ORZEN Energy registra su necesidad y facilita el contacto con proveedores especializados. Próxima instancia: validación técnica y comercial del proveedor.':'Uso comercial para analizar la necesidad y coordinar visita técnica. Información declarada por el prospecto, sin certificación técnica de ORZEN.';
 byId('printArea').innerHTML=`<article class="doc-page"><div class="doc-header"><img class="doc-logo" src="assets/logo-azul.svg" alt="ORZEN Energy"><div class="doc-header-meta"><div class="doc-type">${client?'CONSTANCIA PARA EL CLIENTE':'DERIVACIÓN COMERCIAL · PARA BRIAN'}</div><div>Referencia: ${safe(opportunityRef())}</div><div>${safe(today())}</div><div>ORZEN ENERGY</div></div></div><h1>${headline}</h1><p class="doc-lead">${sub}</p>${content.join('')}<div class="doc-notice"><strong>Información preliminar.</strong> El dimensionamiento, la seguridad, la visita, el suministro y las condiciones económicas dependen exclusivamente de la evaluación y confirmación del proveedor especializado. ORZEN no realiza instalaciones ni garantiza resultados.</div><div class="doc-footer"><span>ORZEN ENERGY · Nexo comercial independiente<br>www.orzenenergy.com · comercial@orzenenergy.com</span><span>${client?'Constancia de consulta.':'Ficha comercial para evaluación.'}<br>Fecha: ${safe(today())}</span></div></article>`;
 byId('printArea').setAttribute('aria-hidden','false');const prev=document.title;document.title=`ORZEN-${client?'Constancia':'Ficha-Brian'}-${(d.company||'empresa').replace(/[^\w-]+/g,'-')}`;
 const imgs=[...byId('printArea').querySelectorAll('img')];Promise.all(imgs.map(img=>img.complete?Promise.resolve():new Promise(resolve=>{img.onload=resolve;img.onerror=resolve;setTimeout(resolve,2000)}))).then(()=>{window.print();document.title=prev;byId('printArea').setAttribute('aria-hidden','true')});
}
form.addEventListener('submit',e=>e.preventDefault());
form.querySelectorAll('[name="fuel"]').forEach(el=>el.addEventListener('change',updateFuel));
form.elements.industry.addEventListener('change',updateIndustry);
form.querySelectorAll('[name="tank"]').forEach(el=>el.addEventListener('change',renderTank));
form.querySelectorAll('[name="priceStatus"],[name="includeVat"]').forEach(el=>el.addEventListener('change',updateTotals));
byId('addItem').addEventListener('click',()=>addItem());
byId('saveDraft').addEventListener('click',save);byId('newDraft').addEventListener('click',startFresh);
byId('supplierPrint').addEventListener('click',()=>makeDoc('supplier'));
byId('clientPrint').addEventListener('click',()=>makeDoc('client'));
byId('copyLead').addEventListener('click',copyLead);
byId('exportJson').addEventListener('click',exportBackup);
byId('importJson').addEventListener('change',e=>importBackup(e.target.files?.[0]));
byId('planUpload').addEventListener('change',e=>attachPlan(e.target.files?.[0]));
// One blank item, no amount and no vendor prices.
addItem();renderTank();renderSaved();updateIndustry();if(!form.elements.contactDate.value)form.elements.contactDate.value=todayISO();
