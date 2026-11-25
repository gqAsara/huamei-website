'use strict';
const industries = {
  beauty:{name:'Beauty & fragrance', hero:'Beauty &|fragrance', intro:'Start with the bottle, jar or bar. Compare cartons and gift sets, then specify the clearance your product needs.', prompt:'Container dimensions, cap height and filled weight', options:['Single product','Discovery set','Gift assortment']},
  drinks:{name:'Wine & spirits', hero:'Wine &|spirits', intro:'Compare how bottles travel, stand on a shelf and arrive as gifts. Start your brief with the filled bottle and its destination.',prompt:'Bottle dimensions, neck clearance and filled weight',options:['Single bottle','Two-bottle set','Bottle & glassware']},
  food:{name:'Confectionery', hero:'Confectionery|packaging',intro:'Plan a gift box around the number of pieces, their wrappers and the spacing between them.',prompt:'Piece count, wrapped dimensions and tray layout', options:['Single layer','Two layers','Assorted pieces']},
  jewellery:{name:'Jewellery & watches',hero:'Jewellery|packaging',intro:'From a single ring to a matching set, start with how the piece sits, how the box opens and how a customer lifts it out.',prompt:'Item dimensions, fastening and presentation position',options:['Ring roll','Earring card','Pendant tabs']},
  fashion:{name:'Fashion & retail',hero:'Fashion &|retail',intro:'Plan the boutique handover or the first opening at home. Compare carriers and mailers against the folded garment or accessory.',prompt:'Folded product dimensions, loaded weight and sales channel',options:['Retail handover','Online order','Seasonal gifting']},
  lifestyle:{name:'Lifestyle & gifting',hero:'Lifestyle &|gifting',intro:'Choose a structure for the items in your set, the way they are arranged and the journey from packing table to recipient.',prompt:'Item list, packed dimensions and shipping method', options:['Single gift','Gift assortment','Subscription set']}
};
const formats = {
  rigid:{name:'Rigid boxes',short:'Rigid box',intro:'A board-built presentation box for retail handover and gifting.',prompt:'Specify the lid fit, board build and wrapped finish.'},
  carton:{name:'Folding cartons',short:'Folding carton',intro:'A flat-delivered carton for individual products or grouped units.',prompt:'Specify the packed size, closure and artwork for each panel.'},
  drawer:{name:'Drawer boxes',short:'Drawer box',intro:'A sliding tray and sleeve that reveal the product as the customer opens the pack.',prompt:'Specify the tray depth, pull and clearance around the item.'},
  bag:{name:'Paper bags',short:'Paper bag',intro:'A paper carrier sized for the purchase and the weight at handover.',prompt:'Specify the finished width, gusset, handle and loaded weight.'},
  mailer:{name:'Corrugated mailers',short:'Corrugated mailer',intro:'A shipping pack designed around the filled product and the delivery route.',prompt:'Specify the load, internal protection and delivery method.'},
  inserts:{name:'Custom inserts',short:'Custom insert',intro:'A fitted support that holds, separates or presents the contents of a box.',prompt:'Share a product drawing, the number of cavities and how the item lifts out.'}
};
const ownPhotos = [
 ['factory-exterior','The Huamei factory','Factory exterior'],['showroom','Sample room','Packaging samples and structures'],['print-inspection','Prototype cutting','Structural sampling'],['press-room','Offset printing','Print production'],['quality-lab','Inspection equipment','Quality control'],['warehouse','Warehouse storage','Packed goods'],['dispatch','Dispatch','Preparation for loading'],['factory-visit','Client visit','Huamei reception'],['sample-review','Sample review','Project discussion'],['design-team','Project office','Design and coordination']
];
const kindNames={brief:'Custom packaging brief',pack:'Packaging reference',process:'Packing in practice',scene:'Industry photograph',archive:'Design archive'};
const records=(window.LICENSED_CATALOG || []).filter(r=>r.kind!=='sample');
const byId=new Map(records.map(r=>[r.id,r]));
const drawerBriefId='jewellery-drawer';
const $=s=>document.querySelector(s);
const h=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const encode=(route,values={})=>{const q=new URLSearchParams(Object.entries(values).filter(([,v])=>v!==''&&v!=null));return '#'+route+(q.size?'?'+q:'')};
const imageUrl=file=>'/catalogue/'+file;
const img=(file,alt,lazy=true)=>'<img '+(lazy?'loading="lazy"':'fetchpriority="high"')+' decoding="async" src="'+h(imageUrl(file))+'" alt="'+h(alt)+'">';
const link=(label,href,cls='under')=>'<a class="'+cls+'" href="'+h(href)+'">'+h(label)+'</a>';
const refUrl=(r,params={})=>encode(r.kind==='brief'?'product/'+r.id:'case/'+r.id,params);
const titleCase=s=>s.charAt(0).toUpperCase()+s.slice(1);
const count=n=>n.toLocaleString('en-US');
const viewName=r=>kindNames[r.kind]||'Packaging reference';
const industryOf=(r,chosen)=>r?.sectors?.includes(chosen)?chosen:r?.sectors?.[0]||'';
const formatOf=(r,chosen)=>r?.formats?.includes(chosen)?chosen:r?.formats?.[0]||'';
const findRows=(s='',f='')=>records.filter(r=>(!s||r.sectors.includes(s))&&(!f||r.formats.includes(f)));
const boxRows=rows=>rows.filter(r=>['pack','archive'].includes(r.kind));
const pick=(id,rows=[])=>byId.get(id)||rows[0]||records[0];
function bread(items){return '<nav class="path" aria-label="Breadcrumb">'+items.map((item,i)=>(i?'<span aria-hidden="true">/</span>':'')+(item[1]?link(item[0],item[1],''):h(item[0]))).join('')+'</nav>'}
function headline(k,t,extra=''){return '<div class="heading-line"><div><span class="suptitle">'+h(k)+'</span><h2>'+h(t)+'</h2></div>'+extra+'</div>'}
function card(r,context={}){return '<a class="pic-card" href="'+h(refUrl(r,context))+'"><div class="pic">'+img(r.photo,r.title)+'</div><span class="card-note">'+h(viewName(r))+'</span><h3>'+h(r.title)+'</h3></a>'}
function tile(name,copy,r,url,c=''){return '<a class="pic-card '+c+'" href="'+h(url)+'"><div class="pic">'+img(r.photo,r.title)+'</div><h3>'+h(name)+'</h3><p>'+h(copy)+'</p></a>'}
function grid(cards){return '<div class="picture-grid">'+cards.join('')+'</div>'}
function frame(body){return '<div class="wrap studio">'+body+'</div>'}
function quoteStrip(title,copy,href='#quote'){return '<section class="quote-strip section-space"><div><h2>'+h(title)+'</h2><p>'+h(copy)+'</p></div>'+link('Request a quote',href,'btn')+'</section>'}
function hero({label,heading,copy,cta,url,image,caption,source,home=false,featureUrl=url}){const [line,em]=heading.split('|');return '<section class="hero-sheet '+(home?'hero-home':'')+'"><div class="hero-type"><span class="suptitle">'+h(label)+'</span><h1>'+h(line)+(em?'<br><em>'+h(em)+'</em>':'')+'</h1><p>'+h(copy)+'</p><div class="actions">'+link(cta,url,'btn primary')+(home?link('Explore packaging','#packaging','under'):'')+'</div></div><figure>'+(home?'<a href="'+h(featureUrl)+'" aria-label="View '+h(caption)+'">':'<div class="hero-art">')+img(image.photo,image.title,false)+(home?'</a>':'</div>')+'<figcaption><span>'+h(caption)+'</span><small>'+h(source)+'</small></figcaption></figure></section>'}
const photoEdit = window.PHOTO_SELECTION || {home:['un-zPYro5uenhs','px-9159719'],industry:{},features:{},formats:{}};
const featuredPhotos = () => photoEdit.home.map(id=>byId.get(id)).filter(Boolean);
function drawerBrief(){
 const opening=byId.get(photoEdit.drawer), jewellery=byId.get(photoEdit.jewel);
 if(!opening || !jewellery)return null;
 const views=[
   {ref:opening, short:'Sliding structure', label:'Sleeve and sliding tray · '+opening.title},
   {ref:jewellery, short:'Jewellery presentation', label:'Jewellery presentation reference · '+jewellery.title}
 ];
 return {...opening,id:drawerBriefId,title:'Plan a jewellery drawer box',kind:'brief',sectors:['jewellery'],formats:['drawer'],
  summary:'Specify a sliding paper box for your jewellery. The first photograph shows the sleeve and tray construction. The second shows how a piece of jewellery sits on an insert in a separate presentation box.',
  specs:[['Opening','Paper sleeve and sliding tray'],['For a quote','Share the size and weight of your piece and the insert you prefer.']],
  gallery:views.map(v=>({photo:v.ref.photo,alt:v.ref.title,label:v.label,short:v.short,record:v.ref}))};
}
const brief=drawerBrief();
if(brief)byId.set(drawerBriefId,brief);
const legacyProducts={'huamei-rigid':'rigid','huamei-carton':'carton','huamei-bag':'bag','huamei-mailer':'mailer','huamei-food':'rigid','huamei-bottle':'carton'};
const own=(id)=>'assets/'+id+'.webp';
let slideIndex=0;
function industryTiles(){return grid(Object.entries(industries).map(([id,s])=>tile(s.name,boxRows(findRows(id)).length+' packaging references',pick(photoEdit.industry[id],findRows(id)),encode('industry/'+id),'industry-tile')))}
function formatCover(f){return pick(photoEdit.formats[f],boxRows(findRows('',f)))}
function formatTiles(){return grid(Object.entries(formats).map(([id,f])=>tile(f.name,f.intro,formatCover(id),encode('packaging/'+id),'format-tile')))}
const archivalSlides=['un-zPYro5uenhs','f52176619571','px-5477577','burst-gift-wrapped-with-bow'];
const ar='<span aria-hidden="true">↗</span>';
const head=(label,heading,tail='')=>'<div class="section-head"><div><span class="kicker tint">'+label+'</span><h2>'+heading+'</h2></div>'+tail+'</div>';
const photograph=(file,alt,extra='')=>'<img src="'+imageUrl(own(file))+'" alt="'+h(alt)+'" decoding="async" '+extra+'>';
const invitation=(title,body)=>'<div class="invitation"><div><h2>'+title+'</h2><p>'+body+'</p></div><a class="btn primary" href="#quote">Request a quote '+ar+'</a></div>';
function heroFigure(){
 const r=byId.get(archivalSlides[slideIndex]), href=refUrl(r);
 return `<div class="feature-photo"><a href="${href}" aria-label="Explore ${h(r.title)}">${img(r.photo,r.title,false)}</a></div>
  <div class="feature-bar"><a href="${href}"><small>Design reference · ${h(r.author)}</small><strong>${h(r.title)}</strong></a><div class="arrows"><button data-step="-1" aria-label="Previous featured reference">←</button><span class="mono">${slideIndex+1} / ${archivalSlides.length}</span><button data-step="1" aria-label="Next featured reference">→</button></div></div>`;
}
function fitHomePhotos(container){
 for(const photo of container.querySelectorAll('img')){
  photo.style.objectFit='contain';
  photo.style.transform='none';
 }
}
function homeGallery(){
 const featured=document.querySelector('#feature');if(!featured)return;
 fitHomePhotos(main);
 featured.onclick=e=>{const b=e.target.closest('button[data-step]');if(!b)return;slideIndex=(slideIndex+Number(b.dataset.step)+archivalSlides.length)%archivalSlides.length;featured.innerHTML=heroFigure();fitHomePhotos(featured);featured.querySelector('[data-step="'+b.dataset.step+'"]').focus({preventScroll:true})};
}
function formatCards(){
 const hints=['For bottles, gift sets and keepsakes','For shelf-ready retail products','For gift collections and advent sets','For retail carryout and gifting','For courier delivery and returns','For shaped bottles and delicate items'];
 const ids=['px-4397912','px-14977429','drawer-18693815','f52177106830','px-9594426','px-13278153'];
 return ['rigid','carton','drawer','bag','mailer','inserts'].map((id,i)=>{const r=byId.get(ids[i]);return `<a class="pack-tile" href="#packaging/${id}"><div>${img(r.photo,r.title)}</div><h3>${formats[id].name}<span>↗</span></h3><p>${hints[i]} · ${boxRows(findRows('',id)).length} references</p></a>`}).join('');
}
function marketCards(){
 const ids=['burst-packaged-soap','f23247639595','px-7318915','px-29844836','burst-gift-bag-with-bow','px-9159719'];
 return ['beauty','drinks','fashion','jewellery','lifestyle','food'].map((id,i)=>{const r=byId.get(ids[i]);return `<a class="market-tile" href="#industry/${id}">${img(r.photo,r.title)}<span>${h(industries[id].name)}<small>${boxRows(findRows(id)).length} references</small></span><b aria-hidden="true">↗</b></a>`}).join('');
}
const referenceCaptions={
 'si-172':['Whitman chocolate box','An illustrated sleeve and sliding tray.','Cooper Hewitt, Smithsonian Design Museum'],
 'f52175590407':['Wine carrier','A divided carton for two bottles.'],
 'w3584033':['Footwear box','Embossed board and dark tissue.'],
 'px-10825661':['Skincare cartons','Printed cartons for dropper bottles.'],
 'px-11444898':['Pendant box','A pink box with a dark insert.'],
 'w13676860':['Chocolate assortment','A hinged lid over a divided tray.']
};
function archivalReference(id){
 const [title,caption,credit]=referenceCaptions[id];
 const r=byId.get(id), meta=industries[r.sectors[0]].name+(r.formats[0]?' · '+formats[r.formats[0]].name:'');
 return `<a class="project-card" href="${h(refUrl(r))}"><div class="card-img">${img(r.photo,r.title)}</div><div class="card-body"><span class="card-meta">${h(meta)}</span><h3>${h(title)}<span aria-hidden="true">↗</span></h3><p>${h(caption)}</p><small>Photo · ${h(credit||r.author)}</small></div></a>`;
}
function useLinks(){return '<div class="use-links"><b>Shop by use</b>'+[['Retail display',{format:'carton'}],['Gifting',{q:'gift'}],['E-commerce delivery',{format:'mailer'}],['Product launches',{q:'sample'}]].map(([name,filters])=>`<a href="${h(encode('cases',{type:'boxes',...filters}))}">${name} <span>→</span></a>`).join('')+'</div>'}
function fieldStrip(){
 const scene=(id,title)=>{const r=byId.get(id);return `<a href="${h(refUrl(r))}"><figure>${img(r.photo,r.title)}<figcaption><b>${title}</b><span>Photography · ${h(r.author)}</span></figcaption></figure></a>`};
 return `<section class="field-strip"><div class="wrap block">${head('Packaging in use','Beyond the sample room.','<a class="under" href="#field-notes">Read the field notes →</a>')}<div class="field-diptych">${scene('px-7233944','Packing candles by hand')}${scene('px-7289727','Ready for dispatch')}</div></div></section>`;
}
function home(){
 return `<div class="wrap"><section class="hero"><div class="hero-copy"><div class="kicker"><i></i> Paper packaging manufacturer <span>/</span> Est. 1992</div><h1>Custom paper<br><em>packaging.</em></h1><p>Custom boxes, paper bags and inserts for retail shelves, gift sets and online orders. Start with your product or a reference you like.</p><div class="actions"><a class="btn primary" href="#quote">Request a quote ${ar}</a><a class="under" href="#packaging">Explore packaging →</a></div></div><figure class="hero-feature" id="feature">${heroFigure()}</figure></section></div>
 <section class="wrap block">${head("Packaging formats","Choose your packaging.",'<a class="under" href="#packaging">Compare structures →</a>')}<div class="pack-tiles">${formatCards()}</div></section>
 <section class="wrap block"><div class="visit-feature">${photograph("factory-visit","Visitors and Huamei staff at the company reception","loading=lazy")}<div><span class="kicker tint">At Huamei</span><h2>Meet the people behind your pack.</h2><p>From the sample room to the press floor, see where Huamei develops and produces paper packaging.</p><a class="under" href="#factory">Visit the factory →</a></div></div></section>
 <section class="ref-section"><div class="wrap block">${head("International reference projects","Inside the box.",'<p>See how a structure opens, what holds the product in place and which details to specify for your own version.</p>')}<div class="projects">${['si-172','f52175590407','w3584033','px-10825661','px-11444898','w13676860'].map(archivalReference).join("")}</div><div class="section-end"><a class="under" href="#cases">Browse all ${boxRows(records).length} references →</a></div></div></section>
 <section class="wrap block">${head("Industries","Start with your market.")}<div class="market-tiles">${marketCards()}</div>${useLinks()}</section>
 ${fieldStrip()}
 <section class="wrap final-rfq">${invitation("What are you packing?","An approximate quantity and your product dimensions are enough to start a discussion.")}</section>`;}
function directory(isMarket){return frame(bread([['Home','#home'],[isMarket?'Industries':'Packaging']])+'<div class="pagelead"><span class="suptitle">'+(isMarket?'Market applications':'Product library')+'</span><h1>'+(isMarket?'Industries':'Packaging formats')+'</h1><p>'+(isMarket?'Choose your market to explore product fit, opening styles and relevant packaging references.':'Compare six paper packaging structures. Choose one to explore examples and specify your own version.')+'</p></div>'+(isMarket?industryTiles():formatTiles()+'<section class="section-space">'+headline('Packaging photographs','Explore the details')+grid(featuredPhotos().map(r=>card(r)))+'</section>')+quoteStrip('Need help choosing?','Share what you are packing and how it will reach your customer.'))}
function feature(r,context){return '<section class="lead-feature section-space"><a href="'+h(refUrl(r,context))+'">'+img(r.photo,r.title)+'</a><div><span class="suptitle">'+h(viewName(r))+'</span><h2>'+h(r.title)+'</h2><p>'+h(r.summary||'Explore this packaging reference. Choose the details that matter for your product and include them in your inquiry.')+'</p>'+link(r.kind==='brief'?'Specify a drawer box':'Explore this reference',refUrl(r,context),'btn primary')+'</div></section>'}
function industryPage(s){const market=industries[s],rows=findRows(s),packs=boxRows(rows);const primary=byId.get(photoEdit.features[s]);const r=primary||packs[0];const photo=pick(photoEdit.industry[s],rows);return frame(bread([['Home','#home'],['Industries','#industries'],[market.name]])+hero({label:market.name+' · Industry guide',heading:market.hero,copy:market.intro,cta:s==='jewellery'&&brief?'Specify a drawer box':'Explore the featured packaging',url:refUrl(s==='jewellery'&&brief?brief:r,{industry:s}),image:photo,caption:photo.title,source:photo.author})+feature(r,{industry:s})+'<section class="section-space">'+headline('Packaging references','Boxes for this market',link('View all '+packs.length,encode('cases',{industry:s,type:'boxes'})))+grid(packs.filter(x=>x!==r).slice(0,6).map(x=>card(x,{industry:s})))+'</section>'+((rows.some(x=>x.kind==='scene'||x.kind==='process'))?'<section class="section-space">'+headline('In use','At the counter & packing table',link('View industry photographs',encode('cases',{industry:s,type:'context'})))+grid(rows.filter(x=>['scene','process'].includes(x.kind)).slice(0,3).map(x=>card(x,{industry:s})))+'</section>':'')+quoteStrip('Start your '+market.name.toLowerCase()+' brief',market.prompt+'.',encode('quote',{industry:s})))}
function formatPage(f){const fmt=formats[f],rows=findRows('',f),r=formatCover(f);return frame(bread([['Home','#home'],['Packaging','#packaging'],[fmt.name]])+hero({label:'Packaging format',heading:fmt.name,copy:fmt.intro+' '+fmt.prompt,cta:'Quote this format',url:encode('quote',{format:f}),image:r,caption:r.title,source:r.author})+(f==='drawer'&&brief?feature(brief,{format:f}):'')+'<section class="section-space">'+headline('Product library','See the structure',link('View all references',encode('cases',{format:f})))+grid(rows.slice(0,9).map(x=>card(x,{format:f})))+'</section>')}

const filters={all:'All images',boxes:'Packaging references',context:'Scenes & packing',archive:'Design archive'};
function library(params){const s=Object.hasOwn(industries,params.get('industry'))?params.get('industry'):'',f=Object.hasOwn(formats,params.get('format'))?params.get('format'):'';
 const type=Object.hasOwn(filters,params.get('type'))?params.get('type'):'all',term=(params.get('q')||'').trim().slice(0,120);
 const all=findRows(s,f).filter(r=>(type==='all'||(type==='boxes'?['pack','archive'].includes(r.kind):type==='context'?['scene','process'].includes(r.kind):r.kind===type))&&(!term||[r.title,r.caption,r.author,r.summary,...r.sectors,...r.formats].join(' ').toLowerCase().includes(term.toLowerCase())));
 const pp=18,pages=Math.max(1,Math.ceil(all.length/pp)),n=Math.max(1,Math.min(pages,parseInt(params.get('page'),10)||1));
 const opts=(obj,value,any)=>'<option value="">'+any+'</option>'+Object.entries(obj).map(([k,v])=>'<option value="'+k+'" '+(k===value?'selected':'')+'>'+h(v.name)+'</option>').join('');
 const config={industry:s,format:f,type:type==='all'?'':type,q:term};
 const controls='<form id="catalog-filter" class="controlbar"><label>Industry<select name="industry" aria-label="Industry">'+opts(industries,s,'All industries')+'</select></label><label>Structure<select name="format" aria-label="Structure">'+opts(formats,f,'All structures')+'</select></label><label>Showing<select name="type" aria-label="Showing">'+Object.entries(filters).map(([k,v])=>'<option value="'+k+'" '+(k===type?'selected':'')+'>'+v+'</option>').join('')+'</select></label><label>Search<input name="q" type="search" value="'+h(term)+'" placeholder="Box, detail or photographer"></label><button class="btn primary" type="submit">Apply</button></form>';
 return frame(bread([['Home','#home'],['Design library']])+'<div class="pagelead"><span class="suptitle">Packaging research</span><h1>Design library</h1><p>Browse packaging photographs from makers, photographers and public collections. Each reference credits its source. Choose the structure or detail you want to include in your own brief.</p></div>'+controls+'<p class="result-count" role="status">'+(all.length?'Showing '+((n-1)*pp+1)+'–'+Math.min(n*pp,all.length)+' of '+count(all.length):'No matches. Try a different search or clear the filters.')+'</p>'+grid(all.slice((n-1)*pp,n*pp).map(r=>card(r,{industry:s,format:f})))+'<div class="pager">'+(n>1?link('Previous',encode('cases',{...config,page:n-1}), ''):'<span></span>')+'<span>Page '+n+' of '+pages+'</span>'+(n<pages?link('Next page',encode('cases',{...config,page:n+1}), ''):'<span></span>')+'</div>')}
function credits(r,includeExtra=true){const external=(text,url)=>url?'<a href="'+h(url)+'" target="_blank" rel="noopener noreferrer">'+h(text)+'</a>':h(text);return '<div class="photo-credit">'+h(r.author)+' · '+external('Original on '+r.source,r.url)+(r.original?' · '+h(r.original):'')+' · '+external(r.license,r.terms)+(r.edit?' · '+h(r.edit):'')+'</div>'+(includeExtra&&r.additional?credits(r.additional,false):'')}
function safeQty(s){return /^[1-9]\d{0,8}$/.test(s||'')?s:''}
function selection(r,p){
 const industry=industryOf(r,p.get('industry')), format=formatOf(r,p.get('format'));
 const options=r.id===drawerBriefId?industries.jewellery.options:industries[industry]?.options||['Single product','Assorted set','Help me choose'];
 const option=options.includes(p.get('option'))?p.get('option'):options[0];
 return {industry,format,options,option,quantity:safeQty(p.get('quantity'))};
}
function specTable(rows){return '<dl class="specset">'+rows.filter(([,v])=>v).map(([k,v])=>'<div><dt>'+h(k)+'</dt><dd>'+h(v)+'</dd></div>').join('')+'</dl>'}
function referencePage(r,p){
 const sel=selection(r,p),market=industries[sel.industry],fmt=formats[sel.format];
 const context=sel.industry?{industry:sel.industry}:{};
 const pictures=r.gallery||[{photo:r.photo,label:r.kind==='scene'?'Industry scene':'Reference view',alt:r.title}];

 const intro=r.summary||({scene:'Use this setting to describe how your customer will encounter the product. Include the size and structure you want in your brief.',process:'Use this packing detail to describe your own workflow. Add the product and packaging requirements when you request a quote.',archive:'A paper packaging object from a public collection. Its original design and construction are presented here as a reference.'}[r.kind] || (market?.intro||'Use this photograph as a starting point for your own packaging specification.'));

 const specs=r.specs||[['Application',market?.name],['Format',fmt?.name],['Briefing detail',market?.prompt||fmt?.prompt]];
 const fields='<form class="purchase" id="configure"><fieldset><legend>'+(r.id===drawerBriefId?'Requested insert':'Your application')+'</legend><div class="option-row">'+sel.options.map(o=>'<label><input type="radio" name="option" value="'+h(o)+'" '+(o===sel.option?'checked':'')+'><span>'+h(o)+'</span></label>').join('')+'</div></fieldset><label class="ctrl">Estimated quantity<input type="number" name="quantity" min="1" max="999999999" step="1" inputmode="numeric" placeholder="e.g. 1,000" value="'+h(sel.quantity)+'"></label><button class="btn primary" type="submit">'+(r.kind==='brief'?'Request a quote for this box':r.kind==='scene'?'Discuss this application':'Quote a similar structure')+'</button></form>';
 return frame(bread([['Home','#home'],[market?.name||'Design library',market?encode('industry/'+sel.industry):'#cases'],[r.title]])+'<section class="product-split"><div class="product-media"><figure><img id="large-image" src="'+h(imageUrl(pictures[0].photo))+'" alt="'+h(pictures[0].alt||r.title)+'" fetchpriority="high"><figcaption><span id="view-description">'+h(pictures[0].label)+'</span><button id="enlarge" type="button">Enlarge image</button></figcaption></figure>'+(pictures.length>1?'<div class="view-choices" aria-label="Product views">'+pictures.map((v,i)=>'<button type="button" data-view="'+i+'" aria-pressed="'+(i===0)+'">'+img(v.photo,'')+h(v.short||v.label)+'</button>').join('')+'</div>':'')+'<div id="media-credit">'+credits(pictures[0].record||r)+'</div></div><div class="product-copy"><span class="suptitle">'+h(viewName(r))+(r.sku?' · '+h(r.sku):'')+'</span><h1>'+h(r.title)+'</h1><p>'+h(intro)+'</p>'+specTable(specs)+fields+'</div></section><section class="section-space">'+headline('Design library','Related packaging',link('Browse the library',encode('cases',{...context,type:'boxes'})))+grid(boxRows(findRows(sel.industry)).filter(o=>o!==r).slice(0,3).map(o=>card(o,context)))+'</section>');
}
const inquiryEmail='jackychan@huamei.io';
const offline=location.protocol==='file:';
const localServer=location.protocol==='http:'&&['127.0.0.1','localhost'].includes(location.hostname)&&['43205','43206'].includes(location.port);
const online=!offline&&!localServer;
const inquiryPrivacy=online
 ? 'When you submit an inquiry, Huamei receives your contact details and packaging brief by email through Resend. We use them to respond to your project. Contact '+inquiryEmail+' about your information.'
 : localServer?'Submissions to this local preview are saved on this computer.':'The offline edition keeps the brief in this browser session.';
const sessionKey='huamei-commercial-inquiry-v1';
let saved=null,drafts=new Map(),lastRoute='';
try{saved=JSON.parse(sessionStorage.getItem(sessionKey)||'null')}catch{}
function quotePage(p){
 const r=byId.get(p.get('ref')),sel=r?selection(r,p):null,s=sel?.industry||(Object.hasOwn(industries,p.get('industry'))?p.get('industry'):''),f=sel?.format||(Object.hasOwn(formats,p.get('format'))?p.get('format'):'');
 const key=r?.id||[s,f].join('-'),d=drafts.get(key)||{},option=sel?.option||'',quantity=p.has('quantity')?safeQty(p.get('quantity')):(d.quantity||''),back=r?refUrl(r,{industry:s,format:f,option,quantity}):s?encode('industry/'+s):f?encode('packaging/'+f):'#home';
 const optionField=sel?'<label>'+(r.id===drawerBriefId?'Requested insert':'Application')+'<select name="option">'+sel.options.map(x=>'<option '+(x===option?'selected':'')+'>'+h(x)+'</option>').join('')+'</select></label>':'';
 const choose=(name,choices,selected,any)=>'<select name="'+name+'"><option value="">'+any+'</option>'+Object.entries(choices).map(([id,v])=>'<option value="'+id+'" '+(id===selected?'selected':'')+'>'+h(v.name)+'</option>').join('')+'</select>';
 const selectionPanel=r?'<div class="selection">'+img(r.photo,r.title)+'<div><p>'+h(viewName(r))+'</p><b>'+h(r.title)+'</b>'+link('Return to details',back,'tab-link')+'</div></div>':'';
 const contactName=online?'<label>Your name *<input name="name" required maxlength="180" autocomplete="name" value="'+h(d.name)+'"></label><label hidden aria-hidden="true">Company website<input name="company_website" type="hidden" value="" tabindex="-1" autocomplete="off"></label>':'';
 const submitLabel=online?'Send inquiry':localServer?'Submit local inquiry':'Save inquiry brief';
 const deliveryNote=online?'Your brief goes to '+link(inquiryEmail,'mailto:'+inquiryEmail,'under')+'.':localServer?'Local preview. Submissions are saved on this computer.':'Offline preview. Your brief stays in this browser session.';
 const briefFields=' <div class="field-pair"><label>Industry'+choose('industry',industries,s||d.industry,'Help me choose')+'</label><label>Packaging format'+choose('format',formats,f||d.format,'Help me choose')+'</label></div><div class="field-pair">'+optionField+'<label>Estimated quantity<input name="quantity" type="number" min="1" max="999999999" step="1" inputmode="numeric" value="'+h(quantity)+'" placeholder="Number of packs"></label></div>';
 return frame(bread([['Home','#home'],[r?r.title:'Packaging brief',back],['Inquiry']])+'<section class="brief-split"><div class="side-brief"><span class="suptitle">Project inquiry</span><h1>Request a <em>quote</em></h1><p>Tell us what goes inside, where the pack will travel and which details you want to sample.</p>'+selectionPanel+'</div><form id="inquiry" data-key="'+h(key)+'"><h2>Your packaging brief</h2><p class="form-note">Fields marked * are required.</p>'+briefFields+'<label>What are you packing? *<textarea name="product" required maxlength="2500" placeholder="'+h(industries[s]?.prompt||'Product, dimensions and any special requirements')+'">'+h(d.product??(r?.id===drawerBriefId?'Jewellery in a custom drawer box':'') )+'</textarea></label>'+contactName+'<div class="field-pair"><label>Work email *<input name="email" type="email" required maxlength="180" autocomplete="email" placeholder="you@company.com" value="'+h(d.email)+'"></label><label>Company<input name="company" maxlength="180" autocomplete="organization" value="'+h(d.company)+'"></label></div><label>Delivery destination & timing<input name="delivery" maxlength="280" placeholder="e.g. London, by September" value="'+h(d.delivery)+'"></label><div class="form-end"><button class="btn primary" type="submit">'+submitLabel+'</button><small>'+deliveryNote+'</small></div><p id="form-error" role="alert"></p></form></section>');
}
function briefText(brief){return Object.entries(brief).filter(([,value])=>value).map(([key,value])=>key+' — '+value).join('\n')}
function emailDraft(brief){return 'mailto:'+inquiryEmail+'?subject='+encodeURIComponent('Custom packaging inquiry')+'&body='+encodeURIComponent(briefText(brief))}
function receipt(){
 if(!saved)return quotePage(new URLSearchParams());
 const sent=saved['Sent to']===inquiryEmail;
 const heading=sent?'Inquiry sent':saved['Local inquiry ID']?'Inquiry saved locally':'Your brief is ready';
 const actions='<button class="btn primary" type="button" id="download-brief">Download brief</button>'+(sent?'':link('Open email draft',emailDraft(saved),'under'))+link('Back to design library','#cases');
 return frame('<div class="credit-page"><span class="suptitle">'+(online?'Project inquiry':'Local preview')+'</span><h1>'+heading+'</h1><p class="studio-note">'+(sent?'Thank you. Our packaging team will reply to '+h(saved.Email)+'.':'You can download this brief for your records.')+'</p>'+specTable(Object.entries(saved))+'<div class="actions">'+actions+'</div></div>');
}
function footer(){return '<div class="wrap footer-grid"><div><a href="#home" class="foot-logo"><img src="'+h(imageUrl('assets/huamei-logo-dark.png'))+'" alt="Huamei Product Packaging"></a><p>Paper packaging manufacturer<br>Est. 1992</p>'+link(inquiryEmail,'mailto:'+inquiryEmail,'')+'</div><div><h2>Packaging</h2>'+Object.entries(formats).map(([id,o])=>link(o.name,encode('packaging/'+id),'')).join('')+'</div><div><h2>Explore</h2>'+[['Industries','#industries'],['Design library','#cases'],['Materials & finishes','#finishes'],['Packaging in use','#field-notes'],['Packaging news','/news']].map(x=>link(...x,'')).join('')+'</div><div><h2>Work with us</h2>'+[['Our factory','#factory'],['How to order','#ordering'],['Contact','#contact'],['Request a quote','#quote']].map(x=>link(...x,'')).join('')+'</div></div><div class="wrap footer-end"><span>Huamei Packaging</span>'+link('Image credits','#credits','')+link('Inquiry privacy','#privacy','')+'</div>'}
function navigation(){const group=(title,links)=>'<details class="nav-group"><summary>'+title+'</summary><div class="sub-links">'+links.map(([l,u])=>link(l,u,'')).join('')+'</div></details>';return group('Packaging',[['All packaging','#packaging'],...Object.entries(formats).map(([id,v])=>[v.name,'#packaging/'+id]),['Materials & finishes','#finishes']])+group('Industries',[['All industries','#industries'],...Object.entries(industries).map(([id,v])=>[v.name,'#industry/'+id])])+link('Design library','#cases','')+group('Inside Huamei',[['Our factory & team','#factory'],['Packaging in use','#field-notes'],['Packaging news','/news'],['Contact','#contact']])+group('How to order',[['Ordering & sampling','#ordering'],['Buyer questions','#ordering?view=faq'],['Request a quote','#quote']])}
function staticPage(route,p){
 const info={factory:['Our factory','Visit the factory floor and the sample room through photographs from Huamei’s own archive.'],finishes:['Materials & finishes','Compare structural details and discuss which ones need a physical sample.'],ordering:['How to order','Start with the product. Agree on a structure and a sample before finalising artwork and production.'],'field-notes':['Packaging in use','See how products are packed, wrapped and presented in stores and at the packing table.'],contact:['Contact Huamei','Discuss structure, sampling, timing and delivery with the packaging team.'],privacy:['Inquiry privacy',inquiryPrivacy],credits:['Image credits','Source pages, creators and usage terms for the imagery in this catalogue. Individual reference pages also carry their own credits.']};
 const [title,lead]=info[route];let body='';
 if(route==='factory')body=grid(ownPhotos.map(([id,title,sub])=>'<figure class="pic-card"><div class="pic">'+img(own(id),title)+'</div><figcaption><span class="card-note">Huamei factory archive</span><h3>'+h(title)+'</h3><p>'+h(sub)+'</p></figcaption></figure>'));
 if(route==='finishes')body=grid(Object.keys(formats).map(f=>tile(formats[f].name,formats[f].prompt,formatCover(f),encode('packaging/'+f))));
 if(route==='field-notes')body=grid(records.filter(r=>r.kind==='process').slice(0,18).map(r=>card(r)))+link('Browse scenes and packing photographs',encode('cases',{type:'context'}));
 if(route==='ordering'){const steps=[['Brief','Send product dimensions, an estimated quantity, your destination and target date.'],['Sample','Use a physical sample to check the fit, opening and removal of each item.'],['Production & delivery','Confirm the approved artwork, material specification, packing method and shipping arrangements.']];const faqs=[['Can I start without final artwork?','Yes. A description of your product, its size and your estimated quantity are enough to discuss a first structure.'],['How is the price calculated?','The quote depends on dimensions, materials, print, inserts, finishes, quantity and destination.'],['What should I check on a sample?','Check the filled pack, fit and clearance, how it opens, and any print or foil details you want approved before production.']];body='<div class="line-list">'+steps.map(([x,y])=>'<div><h3>'+x+'</h3><p>'+y+'</p></div>').join('')+'</div><section id="faq" class="section-space">'+headline('Before you order','Buyer questions')+faqs.map(([x,y],i)=>'<details class="question" '+(!i&&p.get('view')==='faq'?'open':'')+'><summary>'+x+'</summary><p>'+y+'</p></details>').join('')+'</section>'}
 if(route==='contact')body='<section class="image-story">'+img(own('design-team'),'Huamei project office')+'<div><span class="suptitle">Project email</span><h2>Speak with our team</h2>'+link(inquiryEmail,'mailto:'+inquiryEmail,'under')+'</div></section>';
 if(route==='credits'){const idx=new Map();for(const r of records){const key=r.source+' '+r.license;if(!idx.has(key))idx.set(key,r)}body='<div class="credit-page">'+[...idx.values()].map(r=>'<div class="credits"><h3>'+h(r.source)+'</h3><p>'+h(r.license)+' · '+(r.terms?link('Usage terms',r.terms,''):'Huamei project assets')+'</p></div>').join('')+'<div class="credits"><h3>Huamei archive</h3><p>Factory photography and the company identity come from Huamei. The original manufacturer is named on public-collection records.</p></div><div class="credits"><h3>Individual photographs</h3>'+records.map(r=>'<p>'+link(r.title,refUrl(r),'')+' · '+h(r.author)+' · '+(r.url?link(r.source,r.url,''):h(r.source))+' · '+(r.terms?link(r.license,r.terms,''):h(r.license))+(r.edit?' · '+h(r.edit):'')+'</p>').join('')+'</div></div>'}
 return frame(bread([['Home','#home'],[title]])+'<div class="pagelead"><h1>'+h(title)+'</h1><p>'+h(lead)+'</p></div>'+body+(!['privacy','credits'].includes(route)?quoteStrip('Tell us about your pack','A product description and rough quantity are enough to begin.'):''));
}
const catalogueRoutes={'/industry':'industries','/craft':'packaging','/volumes':'cases'};
function getRoute(){const raw=location.hash.slice(1)||catalogueRoutes[location.pathname]||'',split=raw.indexOf('?');return [split<0?raw:raw.slice(0,split),new URLSearchParams(split<0?'':raw.slice(split+1))]}
const main=$('main'),menu=$('#menu'),mobile=$('#mobile-nav');
function closeMenu(){mobile.hidden=true;menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open navigation');document.querySelectorAll('.nav-group[open]').forEach(el=>el.open=false)}
function setQuoteLinks(url){for(const el of document.querySelectorAll('[data-rfq],footer a[data-foot-rfq],.sub-links a[data-nav-rfq]'))el.href=url}
function configureUrl(r,params,form){const c=selection(r,params);const data=new FormData(form);return encode('quote',{ref:r.id,industry:c.industry,format:c.format,option:data.get('option'),quantity:safeQty(data.get('quantity'))})}
let inquiryAttemptId;
async function sendInquiry(brief,website){
 const fields=new FormData();
 for(const [key,value] of Object.entries({name:brief.Name,email:brief.Email,brand:brief.Company,industry:brief.Industry,brief:brief.Product,qty:brief.Quantity,ship:brief.Delivery,structure:brief['Packaging format'],notes:briefText(Object.fromEntries(Object.entries(brief).filter(([key])=>['Reference','Reference type','Reference source','Application','Requested insert'].includes(key)))),company_website:website||''})){
  if(value)fields.set(key,value);
 }
 const headers={Accept:'application/json'};
 if(window.crypto?.subtle&&typeof crypto.randomUUID==='function'){
  inquiryAttemptId??=crypto.randomUUID();
  const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(JSON.stringify([...fields])));
  headers['X-Huamei-Order-Key']=inquiryAttemptId+':'+Array.from(new Uint8Array(digest),n=>n.toString(16).padStart(2,'0')).join('');
 }
 const response=await fetch('/api/commission',{method:'POST',headers,body:fields});
 if(!response.ok||(await response.json()).ok!==true)throw new Error('Delivery failed');
}
async function saveInquiry(event,p){
 event.preventDefault();const form=event.currentTarget;
 const data=Object.fromEntries(new FormData(form));
 if(!data.product.trim()){form.elements.product.setCustomValidity('Describe the product you are packing.');form.elements.product.reportValidity();return}
 const r=byId.get(p.get('ref')),button=form.querySelector('[type=submit]');if(button.disabled)return;
 const brief={...(data.name?{Name:data.name.trim()}:{}),'Product':data.product.trim(),'Reference':r?.title||'','Reference type':r?viewName(r):'','Reference source':r?.gallery?.filter(v=>v.record).map(v=>v.record.url).join(' | ')||r?.url||'','Industry':industries[data.industry]?.name||'', 'Packaging format':formats[data.format]?.name||'Help me choose',[r?.id===drawerBriefId?'Requested insert':'Application']:data.option||'', 'Quantity':data.quantity||'', 'Email':data.email.trim(),'Company':data.company.trim(),'Delivery':data.delivery.trim()};
 const originalLabel=button.textContent;
 button.disabled=true;
 if(online)button.textContent='Sending…';
 form.querySelector('#form-error').textContent='';
 try{if(localServer){const response=await fetch('/api/preview-inquiry',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(brief)});if(!response.ok)throw Error('Save failed');const receipt=await response.json();if(!receipt.id)throw Error('Missing receipt');brief['Local inquiry ID']=receipt.id}
  if(online){await sendInquiry(brief,data.company_website);brief['Sent to']=inquiryEmail;inquiryAttemptId=undefined}
  saved=brief;try{sessionStorage.setItem(sessionKey,JSON.stringify(saved))}catch{};drafts.delete(form.dataset.key);location.hash='#saved';
 }catch{
  const error=form.querySelector('#form-error');
  if(online)error.innerHTML='We could not confirm delivery. Try again or '+link('email this brief to '+inquiryEmail,emailDraft(brief),'under')+'.';
  else error.textContent='This inquiry could not be saved. Your entries are still here. Please try again.';
  button.disabled=false;button.textContent=originalLabel;
 }
}

function homeNavigation(){
 const group=(title,links)=>`<details class="nav-group"><summary>${title}</summary><div class="sub-links">${links.map(([l,t])=>`<a href="${l}">${t}</a>`).join("")}</div></details>`;
 return group("Packaging",[["#packaging","All packaging"],...Object.entries(formats).map(([id,f])=>[encode('packaging/'+id),f.name]),["#finishes","Materials & finishes"]])+group("Industries",[["#industries","All industries"],...['beauty','drinks','fashion','jewellery','lifestyle','food'].map(id=>[encode('industry/'+id),industries[id].name]),["#home?view=uses","Shop by use"]])+'<a href="#cases">Case library</a>'+group("Inside Huamei",[["#factory","Our factory & team"],["#field-notes","Packaging in use"],["/news","Packaging news"],["#contact","Contact Huamei"]])+group("How to order",[["#ordering","Sampling & production"],["#ordering?view=faq","Buyer questions"],["#quote","Start an inquiry"]]);
}
function homeFooter(){return `<div class="wrap footer-grid"><div><a href="#home" class="foot-logo"><img src="${h(imageUrl('assets/huamei-logo-dark.png'))}" width="1818" height="431" alt="Huamei Product Packaging"></a><p>Custom paper packaging<br>Manufacturer since 1992</p><a href="mailto:${h(inquiryEmail)}">${h(inquiryEmail)}</a></div><div><h2>Packaging</h2>${Object.entries(formats).map(([id,f])=>`<a href="#packaging/${id}">${f.name}</a>`).join("")}</div><div><h2>Explore</h2><a href="#industries">Industries</a><a href="#cases">Case library</a><a href="#finishes">Materials &amp; finishes</a><a href="#field-notes">Packaging in use</a><a href="/news">Packaging news</a></div><div><h2>Work with us</h2><a href="#factory">Our factory &amp; team</a><a href="#ordering">Sampling &amp; production</a><a href="#contact">Contact</a><a href="#quote" class="footer-quote">Request a quote ↗</a></div></div><div class="wrap footer-end"><span>Huamei Packaging</span><a href="#credits">Image credits</a><a href="#privacy">Inquiry privacy</a></div>`;}
let showingArchiveHeader;
function setCatalogueChrome(isHome){
 if(showingArchiveHeader===isHome)return;
 showingArchiveHeader=isHome;
 const nav=isHome?homeNavigation():navigation();
 $('.desktop-nav').innerHTML=nav;
 mobile.innerHTML=nav;
 $('footer').innerHTML=isHome?homeFooter():footer();
 document.querySelectorAll('.sub-links a[href="#quote"]').forEach(a=>a.dataset.navRfq='');
 $('footer a[href="#quote"]').dataset.footRfq='';
}
const detailStyles=document.querySelector('link[rel="stylesheet"][href$="studio.css"]')
 ||[...document.querySelectorAll('style')].find(style=>style.textContent.trimStart().startsWith(':root{--wine:'));

function render(){
 const [route,p]=getRoute();if(route==='content'){main.focus();return}closeMenu();
 const [base,id]=route.split('/');let output,rfq='#quote',r=null;
 if(base==='industry'&&Object.hasOwn(industries,id)){output=industryPage(id);rfq=encode('quote',{industry:id})}
 else if(base==='packaging'&&Object.hasOwn(formats,id)){output=formatPage(id);rfq=encode('quote',{format:id})}
 else if(base==='case'||base==='product'){
  const legacyFormat=base==='product'?legacyProducts[id]:null;
  r=byId.get(id);
  output=r?referencePage(r,p):legacyFormat?formatPage(legacyFormat):library(p);
  if(legacyFormat)rfq=encode('quote',{format:legacyFormat});
 }
 else if(base==='cases'){output=library(p);rfq=encode('quote',{industry:p.get('industry'),format:p.get('format')})}
 else if(base==='industries'||base==='packaging') output=directory(base==='industries');
 else if(base==='quote'){output=quotePage(p);rfq=location.hash}
 else if(base==='saved')output=receipt();
 else if(['privacy','factory','contact','credits','finishes','field-notes','ordering'].includes(base))output=staticPage(base,p);
 else output=home();
 main.innerHTML=output;
 const isHome=Boolean(main.querySelector('#feature'));
 if(detailStyles)detailStyles.media=isHome?'not all':'all';
 setCatalogueChrome(isHome);homeGallery();document.title=(main.querySelector('h1')?.innerText||'Custom paper packaging').replace(/\s+/g,' ').trim()+' — Huamei';
 const config=$('#configure');if(config&&r){rfq=configureUrl(r,p,config);config.oninput=()=>setQuoteLinks(configureUrl(r,p,config));config.onsubmit=e=>{e.preventDefault();location.hash=configureUrl(r,p,config)}}
 setQuoteLinks(rfq);
 const f=$('#catalog-filter');if(f){const apply=e=>{e.preventDefault();const v=Object.fromEntries(new FormData(f));location.hash=encode('cases',{...v,type:v.type==='all'?'':v.type})};f.onsubmit=apply;f.onchange=e=>{if(e.target.tagName==='SELECT')apply(e)}}
 const inquiry=$('#inquiry');if(inquiry){inquiry.oninput=()=>{inquiry.elements.product.setCustomValidity('');drafts.set(inquiry.dataset.key,Object.fromEntries(new FormData(inquiry)))};inquiry.onsubmit=e=>saveInquiry(e,p)}
 const gallery=r?.gallery||[];const setView=(i)=>{const v=gallery[i];if(!v)return;const photo=$('#large-image');photo.src=imageUrl(v.photo);photo.alt=v.alt||v.label;$('#view-description').textContent=v.label;$('#media-credit').innerHTML=credits(v.record||r);main.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',Number(b.dataset.view)===i))};
 main.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>setView(Number(b.dataset.view)));
 const zoom=$('#enlarge');if(zoom)zoom.onclick=()=>{const original=$('#large-image'),d=document.createElement('dialog');d.className='photo-view';d.setAttribute('aria-label',original.alt);d.innerHTML='<img src="'+h(original.src)+'" alt="'+h(original.alt)+'"><div class="viewer-bar"><p>'+h($('#view-description').textContent)+'</p><button autofocus type="button">Close</button></div>';document.body.append(d);d.showModal();d.querySelector('button').onclick=()=>d.close();d.addEventListener('close',()=>{d.remove();zoom.focus()},{once:true})};
 const download=$('#download-brief');if(download)download.onclick=()=>{const blob=new Blob([briefText(saved)],{type:'text/plain;charset=utf-8'});const u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download='Huamei-packaging-inquiry.txt';a.click();setTimeout(()=>URL.revokeObjectURL(u),1500)};
 window.scrollTo(0,0);if(lastRoute)main.focus({preventScroll:true});lastRoute=location.hash||'#home';
 if(isHome&&p.get('view')==='uses')main.querySelector('.use-links')?.scrollIntoView();
 if(base==='ordering'&&p.get('view')==='faq')$('#faq')?.scrollIntoView();
}
menu.onclick=()=>{if(!mobile.hidden){closeMenu();return}mobile.hidden=false;menu.setAttribute('aria-expanded','true');menu.setAttribute('aria-label','Close navigation')};
document.addEventListener('click',e=>{document.querySelectorAll('.nav-group[open]').forEach(g=>{if(!g.contains(e.target)||e.target.closest('a'))g.open=false});const a=e.target.closest('a[href^="#"]');if(a?.hash===location.hash){closeMenu();window.scrollTo(0,0)}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(!mobile.hidden){closeMenu();menu.focus()}else{const opened=document.querySelector('.nav-group[open]');if(opened){opened.open=false;opened.querySelector('summary').focus()}}}});
window.matchMedia('(min-width:761px)').addEventListener('change',e=>{if(e.matches)closeMenu()});
$('.skip').onclick=e=>{e.preventDefault();main.focus()};window.addEventListener('hashchange',render);render();
