
const FFF_PIN=`<svg class="share-glyph" viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6l-1 6 3 3v2H7v-2l3-3-1-6Z" fill="currentColor" stroke="currentColor"/><path d="M12 14v8"/></svg>`,FFF_FB=`<span class="share-f" aria-hidden="true">f</span>`,FFF_LINK=`<svg class="share-glyph" viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round"><path d="M10 13a5 5 0 0 0 7.1 0l3-3a5 5 0 0 0-7.1-7.1l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.1 0l-3 3a5 5 0 0 0 7.1 7.1l1.7-1.7"/></svg>`;
function eventKey(e){return [e.name||'',e.startDate||'',e.venue||''].join('|')}
function eventShareUrl(e){const u=new URL('https://unique-dolphin-ce704c.netlify.app/');u.searchParams.set('event',eventKey(e));return u.href}

function fffShowCopyFallback(url){
  let overlay=document.getElementById('fff-copy-fallback');
  if(!overlay){
    overlay=document.createElement('div');overlay.id='fff-copy-fallback';
    overlay.setAttribute('role','dialog');overlay.setAttribute('aria-label','Copy link');
    overlay.style.cssText='position:fixed;inset:0;z-index:2147483647;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;padding:20px';
    overlay.innerHTML='<div style="background:white;color:#222;border-radius:12px;padding:20px;max-width:520px;width:100%;box-shadow:0 8px 35px #0003"><strong>Copy this link</strong><p style="margin:10px 0">Select the link below and copy it to share.</p><input aria-label="Link to copy" readonly style="width:100%;box-sizing:border-box;padding:10px;border:1px solid #aaa;border-radius:6px"><button type="button" style="margin-top:12px;padding:9px 18px;border:1px solid #999;border-radius:7px;background:#fff;color:#222;cursor:pointer">Close</button></div>';
    overlay.querySelector('button').addEventListener('click',()=>overlay.remove());
    overlay.addEventListener('click',e=>{if(e.target===overlay)overlay.remove()});
    document.body.appendChild(overlay);
  }
  const input=overlay.querySelector('input');input.value=url;input.focus();input.select();
}
function fffCopy(url,button){
  // Use the same visible, selectable input approach that worked in the Squarespace embed.
  const card=button.closest('article')||button.closest('.event-card')||button.parentElement;
  let panel=card.querySelector('.fff-copy-link-panel');
  if(!panel){
    panel=document.createElement('div');
    panel.className='fff-copy-link-panel';
    panel.setAttribute('role','status');
    panel.style.cssText='margin:8px 0 0;padding:0;color:#246b42;font-size:13px;font-weight:600';
    const label=document.createElement('div');
    label.className='fff-copy-label';
    const input=document.createElement('input');
    input.type='text';input.readOnly=true;
    input.setAttribute('aria-label','Event link to copy');
    input.style.cssText='display:block;width:100%;box-sizing:border-box;padding:8px;margin-top:6px;border:1px solid #bbb;border-radius:6px;color:#222;background:#fff;font-size:13px';
    panel.append(label,input);
    const share=button.closest('.fff-share')||button.closest('details')||button;
    share.insertAdjacentElement('afterend',panel);
  }
  const label=panel.querySelector('.fff-copy-label');
  const input=panel.querySelector('input');
  input.value=url;
  panel.hidden=false;
  input.style.display='block';
  input.focus();input.select();
  try{input.setSelectionRange(0,input.value.length)}catch(_){}
  let copied=false;
  try{copied=document.execCommand('copy')}catch(_){}
  clearTimeout(panel._fffTimer);
  if(copied){
    label.textContent='✓ Link Copied';
    input.style.display='none';
    panel._fffTimer=setTimeout(()=>{if(panel.isConnected)panel.remove()},2200);
  }else{
    label.textContent='Select the link below and press Ctrl+C to copy';
    input.focus();input.select();
  }
}
function shareEvent(action,key,button){
  const e=state.events.find(x=>eventKey(x)===key);
  if(!e)return;
  const url=eventShareUrl(e);
  if(action==='pin'){
    const media=safeUrl(e.image)||safeUrl(CATEGORY_IMAGES[e.category]);
    window.open('https://www.pinterest.com/pin/create/button/?url='+encodeURIComponent(url)+'&description='+encodeURIComponent(e.name||'')+(media?'&media='+encodeURIComponent(media):''),'_blank','noopener,noreferrer');
  }else if(action==='fb'){
    window.open('https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(url),'_blank','noopener,noreferrer');
  }else if(action==='copy'){
    // Copy the individual event listing, matching the card's Explore this event link.
    const individualEventUrl=safeUrl(e.url);
    if(individualEventUrl){
      fffCopy(individualEventUrl,button);
    }else{
      const old=button.textContent;
      button.textContent='Event link unavailable';
      setTimeout(()=>{if(button.isConnected)button.textContent=old},2400);
      return;
    }
  }
  const disclosure=button.closest('details');
  if(disclosure)disclosure.open=false;
}
const CATEGORY_IMAGES={"Arts & Culture": "https://raw.githubusercontent.com/fortyfeistyfrugalish/a-little-local-adventure/main/images/arts-culture.png", "Community": "https://raw.githubusercontent.com/fortyfeistyfrugalish/a-little-local-adventure/main/images/community.png", "Family & Kids": "https://raw.githubusercontent.com/fortyfeistyfrugalish/a-little-local-adventure/main/images/family-kids.png", "Festivals & Seasonal Events": "https://raw.githubusercontent.com/fortyfeistyfrugalish/a-little-local-adventure/main/images/festivals-seasonal-events.png", "Food & Drink": "https://raw.githubusercontent.com/fortyfeistyfrugalish/a-little-local-adventure/main/images/food-drink.png", "Free & Frugal-ish Fun": "https://raw.githubusercontent.com/fortyfeistyfrugalish/a-little-local-adventure/main/images/free-frugalish.png", "Markets & Shopping": "https://raw.githubusercontent.com/fortyfeistyfrugalish/a-little-local-adventure/main/images/markets-shopping.png", "Music & Entertainment": "https://raw.githubusercontent.com/fortyfeistyfrugalish/a-little-local-adventure/main/images/music-entertainment.png", "Outdoors & Recreation": "https://raw.githubusercontent.com/fortyfeistyfrugalish/a-little-local-adventure/main/images/outdoors-recreation.png"};const state={events:[],region:"Lancaster County"};const $=id=>document.getElementById(id);const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));function safeUrl(u){try{const v=new URL(u);return ["http:","https:"].includes(v.protocol)?v.href:null}catch{return null}}function dateParts(s){const m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(s||"");return m?{year:+m[1],month:+m[2],day:+m[3]}:null}function localToday(){const p=new Intl.DateTimeFormat("en-CA",{timeZone:"America/New_York",year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(new Date());const o=Object.fromEntries(p.map(x=>[x.type,x.value]));return `${o.year}-${o.month}-${o.day}`}function plusDays(s,n){const d=new Date(s+"T12:00:00Z");d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10)}function thisWeekendRange(){const t=localToday(),d=new Date(t+"T12:00:00Z"),dow=d.getUTCDay();return [plusDays(t,(6-dow+7)%7),plusDays(t,(7-dow)%7||7)]}function prettyTime(s){if(!s)return"";const m=/^(\d{1,2}):(\d{2})/.exec(s);if(!m)return s;let h=+m[1];return `${h%12||12}:${m[2]} ${h>=12?"PM":"AM"}`}function render(){const term=$("search").value.trim().toLowerCase(),cat=$("category").value,adm=$("admission").value,date=$("date-filter").value,today=localToday(),weekend=thisWeekendRange();const items=state.events.filter(e=>e.region===state.region&&(!cat||e.category===cat)&&(!adm||e.admission===adm)&&(!date||(date==="week"?(e.startDate<=plusDays(today,7)):e.startDate<=weekend[1]&&(e.endDate||e.startDate)>=weekend[0]))&&[e.name,e.venue,e.city,e.description].join(" ").toLowerCase().includes(term)).sort((a,b)=>(a.startDate||"").localeCompare(b.startDate||""));$("status").textContent=`${items.length} upcoming event${items.length===1?"":"s"} in ${state.region}`;$("events").innerHTML=items.map(e=>{const url=safeUrl(e.url),img=safeUrl(e.image)||safeUrl(CATEGORY_IMAGES[e.category]),d=dateParts(e.startDate),month=d?new Date(Date.UTC(d.year,d.month-1,d.day)).toLocaleString("en-US",{month:"short",timeZone:"UTC"}).toUpperCase():"TBA";return `<article class="card"><div class="visual ${img?"":"no-image"}">${img?`<img src="${esc(img)}" alt="" loading="lazy">`:`<span class="fallback">Around<br>Town ✿</span>`}<div class="date-stamp"><b>${month}</b><strong>${d?d.day:"—"}</strong></div></div><div class="content"><div class="meta">${esc(e.category||"Local happening")} · ${esc(e.admission||"Admission varies")}</div><h3>${esc(e.name)}</h3><p>${esc(e.description||"A little local adventure awaits.")}</p><div class="details"><p>⌁ ${esc(e.venue||"Venue to be confirmed")}${e.city?", "+esc(e.city):""}</p>${e.startTime?`<p>◷ ${esc(prettyTime(e.startTime))}</p>`:""}${e.cost?`<p>✦ ${esc(e.cost)}</p>`:""}</div>${url?`<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">Explore this event ↗</a>`:""}<div class="fff-share"><details><summary><svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="2"/><circle cx="6" cy="12" r="2"/><circle cx="18" cy="19" r="2"/><path d="m8 11 8-5M8 13l8 5"/></svg> Share This Event</summary><div class="fff-menu"><button type="button" class="fff-pin" data-share="pin" data-key="${esc(eventKey(e))}">Pinterest</button><button type="button" class="fff-fb" data-share="fb" data-key="${esc(eventKey(e))}">Facebook</button><button type="button" class="fff-copy" data-share="copy" data-key="${esc(eventKey(e))}">Copy Link</button></div></details></div></div></article>`}).join("")||`<div class="empty"><h3>More hometown fun is on its way ✿</h3><p>No matching events right now. Try another filter or check back soon!</p></div>`;/* Featured event enhancement: runs after the existing gallery renders. */
const featuredKey='FFF-EVT-20261128-010';
const featuredIndex=items.findIndex(item=>item.id===featuredKey);
if(featuredIndex!==-1){
 const container=$("events");
 const featuredCard=container.querySelectorAll(".card")[featuredIndex];
 if(featuredCard){
  featuredCard.classList.add("fff-featured-card");
  const badge=document.createElement("span");
  badge.className="fff-featured-label";
  badge.textContent="✦ Featured Local Find";
  featuredCard.appendChild(badge);
  container.prepend(featuredCard);
 }
};const selectedEvent=new URLSearchParams(location.search).get('event');if(selectedEvent){const match=items.find(e=>eventKey(e)===selectedEvent);if(match){const btn=Array.from(document.querySelectorAll('#events button[data-key]')).find(b=>b.dataset.key===selectedEvent);if(btn){const card=btn.closest('.card');card.classList.add('fff-target');if(!window.__fffScrolled){window.__fffScrolled=true;requestAnimationFrame(()=>card.scrollIntoView({block:'center',behavior:'smooth'}))}}}}document.querySelectorAll(".visual img").forEach(image=>image.addEventListener("error",()=>{const visual=image.parentElement;visual.classList.add("no-image");image.remove();const fallback=document.createElement("span");fallback.className="fallback";fallback.innerHTML="Around<br>Town ✿";visual.insertBefore(fallback,visual.querySelector(".date-stamp"));},{once:true}));}async function init(){try{const res=await fetch("/.netlify/functions/events",{cache:"no-store"});if(!res.ok)throw Error("Feed unavailable");const data=await res.json();state.events=Array.isArray(data.events)?data.events:[];const selectedKey=new URLSearchParams(location.search).get('event');if(selectedKey){const match=state.events.find(e=>eventKey(e)===selectedKey);if(match){state.region=match.region;document.querySelectorAll('[data-region]').forEach(b=>b.classList.toggle('active',b.dataset.region===state.region))}}const cats=[...new Set(state.events.map(e=>e.category).filter(Boolean))].sort();$("category").innerHTML='<option value="">All categories</option>'+cats.map(c=>`<option value="${esc(c)}">${esc(c)}</option>`).join("");render()}catch(e){$("status").textContent="";$("events").innerHTML='<div class="empty"><h3>Good things are coming!</h3><p>The events feed isn’t connected yet. Check back soon for local happenings.</p></div>'}}document.querySelectorAll("[data-region]").forEach(b=>b.addEventListener("click",()=>{state.region=b.dataset.region;document.querySelectorAll("[data-region]").forEach(x=>x.classList.toggle("active",x===b));render()}));["search","category","admission","date-filter"].forEach(id=>$(id).addEventListener("input",render));init();
$("events").addEventListener('click',event=>{const button=event.target.closest('button[data-share]');if(button)shareEvent(button.dataset.share,button.dataset.key,button)});

document.addEventListener('toggle',e=>{if(e.target.matches?.('.fff-share details')&&e.target.open){document.querySelectorAll('.fff-share details[open]').forEach(d=>{if(d!==e.target)d.open=false})}},true);
