const PEOPLE=[["Hayley","👩"],["Caleb","👨"],["Suttonn","👧"],["Nox","🌸"]];
const CATS=[
{key:"must",label:"MUST DO",icon:"💚",color:"#42a36b",tint:"#e4f4e8"},
{key:"want",label:"WANT TO DO",icon:"★",color:"#e58b2a",tint:"#fff3df"},
{key:"no",label:"DON'T CARE",icon:"✕",color:"#cf4747",tint:"#f9ebe7"},
{key:"unknown",label:"DON'T KNOW WHAT THIS IS",icon:"?",color:"#6d4ba8",tint:"#f0ecfa"},
{key:"unsorted",label:"UNSORTED",icon:"📥",color:"#83a99b",tint:"#ecf4ef"}
];
const KEY="gatlinburg2026-v1";
const seed=window.GATLINBURG_ACTIVITIES||[];
const ACTIVITY_CATEGORIES=window.GATLINBURG_CATEGORIES||[];
const categoryEmoji=name=>ACTIVITY_CATEGORIES.find(c=>c.name===name)?.emoji||"🎢";
let state={profile:"Hayley",active:"unsorted",view:"board",activities:seed.map(a=>({...a})),votes:{},filter:"",search:"",matchFilter:"all"};
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const safe=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function textStatus(t,error=false){$("#syncStatus").textContent=t;$("#statusDot").className="status-dot"+(error?" error":"");}
function load(){try{let saved=JSON.parse(localStorage.getItem(KEY)||"null");if(saved&&typeof saved==="object"){state.profile=PEOPLE.some(p=>p[0]===saved.profile)?saved.profile:"Hayley";state.active=CATS.some(c=>c.key===saved.active)?saved.active:"unsorted";state.activities=[...seed.map(a=>({...a}))];if(Array.isArray(saved.activities)){const ids=new Set(state.activities.map(a=>a.id));for(const a of saved.activities){if(typeof a.id!=="string")continue;const existing=state.activities.find(x=>x.id===a.id);if(existing){if(typeof a.photo==="string"&&a.photo.trim())existing.photo=a.photo;}else if(typeof a.name==="string"&&!ids.has(a.id)){state.activities.push({...a,category:window.gatlinburgCategoryName(a.category,a.name)});ids.add(a.id);}}}state.votes=saved.votes&&typeof saved.votes==="object"?saved.votes:{};}}catch(e){textStatus("Could not read saved data",true);console.error(e);}}
function persist(){try{localStorage.setItem(KEY,JSON.stringify({profile:state.profile,active:state.active,activities:state.activities,votes:state.votes,updatedAt:new Date().toISOString()}));textStatus("Saved on this device");return true;}catch(e){textStatus("Save failed — storage full?",true);showToast("Could not save! Please free up browser storage.");console.error(e);return false;}}
function voteFor(person,id){return CATS.some(c=>c.key===state.votes?.[person]?.[id])?state.votes[person][id]:"unsorted";}
function setVote(id,key){if(!CATS.some(c=>c.key===key))return;if(!state.votes[state.profile])state.votes[state.profile]={};if(key==="unsorted")delete state.votes[state.profile][id];else state.votes[state.profile][id]=key;persist();render();}
function totalFor(key){return state.activities.filter(a=>voteFor(state.profile,a.id)===key).length;}
function photoMarkup(a){const valid=/^https:\/\//i.test(a.photo||"");return valid?`<img loading="lazy" referrerpolicy="no-referrer" src="${safe(a.photo)}" alt="${safe(a.name)}" onerror="this.remove();this.parentElement.querySelector('.card-emoji').hidden=false">`:"";}
const palette=["#d5e7e4","#eedec7","#e2e2ee","#d4e6d2","#f6decf","#d9e8ee","#ece5d5"];
function renderProfiles(){const target=$("#profiles");target.innerHTML=PEOPLE.map(([name,emoji])=>`<button type="button" class="profile ${state.profile===name?"selected":""}" data-person="${name}" aria-pressed="${state.profile===name}"><span class="profile-face">${emoji}</span><span>${name}<small class="profile-sub">${name===state.profile?"Currently choosing":"Tap to choose"}</small></span></button>`).join("");}
function renderTabs(){$$(".tab").forEach(b=>{b.classList.toggle("active",b.dataset.view===state.view)});$("#boardView").classList.toggle("hidden",state.view!=="board");$("#matchesView").classList.toggle("hidden",state.view!=="matches");$("#compareView").classList.toggle("hidden",state.view!=="compare");}
function renderBuckets(){$("#buckets").innerHTML=CATS.map(c=>`<button type="button" class="bucket ${state.active===c.key?"selected":""}" data-bucket="${c.key}" style="--tint:${c.tint};--accent:${c.color}" aria-pressed="${state.active===c.key}"><span class="bucket-emoji">${c.icon}</span><span><span class="bucket-title">${c.label}</span><span class="bucket-count">${totalFor(c.key)} activities</span></span></button>`).join("");}
function renderCards(){const term=state.search.trim().toLowerCase();const arr=state.activities.filter(a=>voteFor(state.profile,a.id)===state.active&&(!state.filter||a.category===state.filter)&&(!term||(a.name+" "+a.area+" "+a.category).toLowerCase().includes(term)));$("#cards").innerHTML=arr.map((a,i)=>{const valid=/^https:\/\//i.test(a.photo||"");const color=palette[(state.activities.indexOf(a))%palette.length];const q="https://www.google.com/search?tbm=isch&q="+encodeURIComponent(a.name+" "+a.area+" attraction");return `<article class="card" data-id="${safe(a.id)}"><div class="card-image" style="--shade:${color}">${photoMarkup(a)}<span class="card-emoji" ${valid?"hidden":""}>${safe(a.emoji||"📍")}</span><span class="card-area">${safe(a.area)}</span></div><div class="card-content"><div class="card-type"><span class="type-emoji">${safe(categoryEmoji(a.category))}</span><span>${safe(a.category)}</span></div><h3>${safe(a.name)}</h3><div class="card-bottom"><select aria-label="Rank ${safe(a.name)}" data-vote="${safe(a.id)}">${CATS.map(c=>`<option value="${c.key}" ${voteFor(state.profile,a.id)===c.key?"selected":""}>${c.icon} ${c.label}</option>`).join("")}</select><a class="photo-search" href="${q}" target="_blank" rel="noopener noreferrer" title="Find photos">↗</a></div></div></article>`;}).join("");$("#emptyState").classList.toggle("hidden",arr.length>0);$("#boardTitle").textContent=state.profile+"'s adventure board";}
function compareInfo(a){const votes=PEOPLE.map(p=>voteFor(p[0],a.id));const ranked=votes.filter(v=>v!=="unsorted");const positive=ranked.filter(v=>v==="must"||v==="want").length;const negative=ranked.filter(v=>v==="no").length;let type="pending";if(positive>=2&&negative===0)type="match";if(positive>0&&negative>0)type="conflict";return {votes,type,positive,ranked:ranked.length,score:votes.reduce((n,v)=>n+({must:3,want:1,unknown:0,no:-2,unsorted:0}[v]||0),0)};}
function statusLabel(k){return CATS.find(c=>c.key===k)?.label||"UNSORTED";}
function renderMatch(){const items=state.activities.map(a=>({...a,info:compareInfo(a)})).sort((a,b)=>b.info.score-a.info.score||b.info.ranked-a.info.ranked||a.name.localeCompare(b.name));const matches=items.filter(a=>a.info.type==="match").length;const conflicts=items.filter(a=>a.info.type==="conflict").length;$("#summaryStats").innerHTML=`<div class="stat"><strong>${matches}</strong><span>Shared favorites</span></div><div class="stat"><strong>${conflicts}</strong><span>Disagreements</span></div><div class="stat"><strong>${items.filter(a=>a.info.ranked).length}</strong><span>Activities voted on</span></div>`;$("#matchFilters").innerHTML=[["all","All"],["match","Shared favorites"],["conflict","Disagreements"],["pending","Still deciding"]].map(([k,v])=>`<button type="button" class="chip ${state.matchFilter===k?"active":""}" data-match="${k}">${v}</button>`).join("");const displayed=items.filter(a=>state.matchFilter==="all"?a.info.ranked>0:a.info.type===state.matchFilter);$("#matchCards").innerHTML=displayed.map(a=>`<div class="match"><span class="match-tag ${a.info.type}">${a.info.type==="match"?"♥ Shared favorite":a.info.type==="conflict"?"↔ Different opinions":"◷ Still deciding"}</span><h3>${safe(categoryEmoji(a.category))} ${safe(a.name)}</h3><small>${safe(a.area)}</small><div class="votes">${PEOPLE.map((p,i)=>`<div class="vote"><b>${p[0]}</b><span>${statusLabel(a.info.votes[i])}</span></div>`).join("")}</div></div>`).join("")||'<div class="empty-state">No matching activities yet. Start sorting!</div>';}
function renderCompare(){const search=$("#compareSearch").value.trim().toLowerCase();const arr=state.activities.filter(a=>a.name.toLowerCase().includes(search)).sort((a,b)=>a.name.localeCompare(b.name));$("#comparisonRows").innerHTML=arr.map(a=>`<tr><td>${safe(categoryEmoji(a.category))} ${safe(a.name)}</td>${PEOPLE.map(p=>{const v=voteFor(p[0],a.id);return `<td><span class="pill ${v}">${statusLabel(v)}</span></td>`}).join("")}</tr>`).join("");}
function render(){renderProfiles();renderTabs();renderBuckets();if(state.view==="board")renderCards();if(state.view==="matches")renderMatch();if(state.view==="compare")renderCompare();}
function showToast(t){const el=$("#toast");el.textContent=t;el.classList.remove("hidden");clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>el.classList.add("hidden"),2500);}
function closeDialog(id){$("#"+id).classList.add("hidden");}
function openAdd(){$("#activityForm").reset();$("#activityCategory").innerHTML=ACTIVITY_CATEGORIES.map(c=>`<option value="${safe(c.name)}">${safe(c.emoji)} ${safe(c.name)}</option>`).join("");$("#modalShade").classList.remove("hidden");$("#activityName").focus();}
function addActivity(e){e.preventDefault();const name=$("#activityName").value.trim();if(!name)return;const match=state.activities.find(a=>a.name.toLowerCase()===name.toLowerCase());if(match){showToast("That activity is already on the list");return;}const photo=$("#activityPhoto").value.trim();if(photo&&!/^https:\/\//i.test(photo)){showToast("Photo needs an https:// link");return;}const id="custom-"+(globalThis.crypto?.randomUUID?.()||Date.now()+"-"+Math.random().toString(36).slice(2));state.activities.push({id,name,area:$("#activityArea").value,category:$("#activityCategory").value,photo,emoji:categoryEmoji($("#activityCategory").value)});state.active="unsorted";state.filter="";$("#activityFilter").value="";state.search="";$("#search").value="";persist();closeDialog("modalShade");state.view="board";render();showToast("Added to everyone's Unsorted list");}
function initFilter(){$("#activityFilter").innerHTML='<option value="">All activity types</option>'+ACTIVITY_CATEGORIES.map(c=>`<option value="${safe(c.name)}">${safe(c.emoji)} ${safe(c.name)}</option>`).join("");}
function downloadBackup(){const blob=new Blob([JSON.stringify({savedAt:new Date().toISOString(),...state},null,2)],{type:"application/json"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="gatlinburg2026-backup.json";a.click();setTimeout(()=>URL.revokeObjectURL(url),500);}
let drag=null;
function dragStart(x,y,card){
  const id=card.dataset.id;
  if(!id)return;
  drag={id,x,y,moved:false,card};
}
function dragMove(x,y){
  if(!drag)return;
  if(!drag.moved&&Math.hypot(x-drag.x,y-drag.y)<7)return;
  if(!drag.moved){
    drag.moved=true;
    // Use a full visual copy of the card, including the photo and the details.
    drag.ghost=drag.card.cloneNode(true);
    drag.ghost.removeAttribute("data-id");
    drag.ghost.setAttribute("aria-hidden","true");
    drag.ghost.classList.add("drag-preview");
    drag.ghost.querySelectorAll("select").forEach(el=>{el.disabled=true;el.tabIndex=-1;});
    drag.ghost.querySelectorAll("a").forEach(el=>{el.removeAttribute("href");el.tabIndex=-1;});
    drag.ghost.style.width=Math.min(drag.card.getBoundingClientRect().width,245)+"px";
    document.body.append(drag.ghost);
    drag.card.style.opacity=".5";
  }
  drag.ghost.style.left=(x+12)+"px";
  drag.ghost.style.top=(y+10)+"px";
  document.querySelectorAll(".bucket").forEach(el=>el.classList.remove("drag-over"));
  document.elementFromPoint(x,y)?.closest("[data-bucket]")?.classList.add("drag-over");
}
function dragEnd(x,y){
  if(!drag)return;
  const id=drag.id;
  const to=drag.moved?document.elementFromPoint(x,y)?.closest("[data-bucket]")?.dataset.bucket:null;
  drag.ghost?.remove();
  if(drag.card)drag.card.style.opacity="";
  document.querySelectorAll(".bucket").forEach(el=>el.classList.remove("drag-over"));
  drag=null;
  if(to){setVote(id,to);showToast("Moved to "+statusLabel(to));}
}
function cancelDrag(){
  drag?.ghost?.remove();if(drag?.card)drag.card.style.opacity="";
  drag=null;
  document.querySelectorAll(".bucket").forEach(el=>el.classList.remove("drag-over"));
}
function cardFromEvent(e){if(e.target.closest("select,a,button,input"))return null;return e.target.closest(".card");}
// Mouse and Apple Pencil: drag immediately from anywhere on the card.
document.addEventListener("pointerdown",e=>{
  if(e.pointerType==="touch"||e.button!==0)return;
  const card=cardFromEvent(e);
  if(!card)return;
  card.setPointerCapture(e.pointerId);
  dragStart(e.clientX,e.clientY,card);
});
document.addEventListener("pointermove",e=>{if(drag&&e.pointerType!=="touch")dragMove(e.clientX,e.clientY);});
document.addEventListener("pointerup",e=>{if(drag&&e.pointerType!=="touch")dragEnd(e.clientX,e.clientY);});
document.addEventListener("pointercancel",e=>{if(e.pointerType!=="touch")cancelDrag();});
// On iPad/iPhone, hold briefly to pick up a card. Ordinary swipes still scroll.
let touchPending=null;
document.addEventListener("touchstart",e=>{
  if(e.touches.length!==1)return;
  const card=cardFromEvent(e);
  if(!card)return;
  const t=e.touches[0];
  const pending={x:t.clientX,y:t.clientY,card,activated:false,timer:null};
  pending.timer=setTimeout(()=>{
    if(touchPending!==pending)return;
    pending.activated=true;
    dragStart(pending.x,pending.y,pending.card);
    if(navigator.vibrate)navigator.vibrate(12);
  },50);
  touchPending=pending;
},{passive:true});
document.addEventListener("touchmove",e=>{
  if(!touchPending||e.touches.length!==1)return;
  const t=e.touches[0];
  if(!touchPending.activated){
    const dx=t.clientX-touchPending.x;
    const dy=t.clientY-touchPending.y;
    // Horizontal movement starts dragging immediately, without waiting.
    // A quick vertical swipe still scrolls the list normally.
    if(Math.abs(dx)>5 && Math.abs(dx)>Math.abs(dy)*1.1){
      clearTimeout(touchPending.timer);
      touchPending.activated=true;
      dragStart(touchPending.x,touchPending.y,touchPending.card);
    } else if(Math.abs(dy)>10){
      clearTimeout(touchPending.timer);
      touchPending=null;
      return;
    } else {
      return;
    }
  }
  e.preventDefault();
  dragMove(t.clientX,t.clientY);
},{passive:false});
document.addEventListener("touchend",e=>{
  if(!touchPending)return;
  clearTimeout(touchPending.timer);
  if(touchPending.activated){
    e.preventDefault();
    const t=e.changedTouches[0];
    if(t)dragEnd(t.clientX,t.clientY);
    else cancelDrag();
  }
  touchPending=null;
},{passive:false});
document.addEventListener("touchcancel",()=>{
  clearTimeout(touchPending?.timer);
  touchPending=null;cancelDrag();
});
document.addEventListener("click",e=>{const p=e.target.closest("[data-person]");if(p){state.profile=p.dataset.person;persist();render();return;}const b=e.target.closest("[data-bucket]");if(b){state.active=b.dataset.bucket;persist();render();return;}const tab=e.target.closest("[data-view]");if(tab){state.view=tab.dataset.view;render();return;}const chip=e.target.closest("[data-match]");if(chip){state.matchFilter=chip.dataset.match;renderMatch();}});
document.addEventListener("change",e=>{if(e.target.matches("[data-vote]"))setVote(e.target.dataset.vote,e.target.value);});
$("#search").addEventListener("input",e=>{state.search=e.target.value;renderCards();});
$("#activityFilter").addEventListener("change",e=>{state.filter=e.target.value;renderCards();});
$("#compareSearch").addEventListener("input",renderCompare);
$("#addActivityBtn").addEventListener("click",openAdd);
$("#activityForm").addEventListener("submit",addActivity);
$("#cancelModal").addEventListener("click",()=>closeDialog("modalShade"));
$("#closeModal").addEventListener("click",()=>closeDialog("modalShade"));
$("#modalShade").addEventListener("click",e=>{if(e.target.id==="modalShade")closeDialog("modalShade");});
$("#syncSettingsBtn").addEventListener("click",()=>{$("#syncShade").classList.remove("hidden");$("#syncMessage").textContent="Shared syncing has not been connected yet. Your current rankings are saved locally on this device. We'll connect a separate Gatlinburg Supabase project before enabling this.";$("#syncConnectForm").classList.add("hidden");$("#syncConnected").classList.add("hidden");});
$("#closeSync").addEventListener("click",()=>closeDialog("syncShade"));
$("#syncShade").addEventListener("click",e=>{if(e.target.id==="syncShade")closeDialog("syncShade");});
$("#connectBtn").addEventListener("click",()=>showToast("Supabase connection is not configured yet"));
$("#disconnectBtn").addEventListener("click",()=>closeDialog("syncShade"));
$("#leaveTripBtn").addEventListener("click",()=>closeDialog("syncShade"));
$("#copyLinkBtn").addEventListener("click",()=>showToast("Connect Supabase first"));
document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeDialog("modalShade");closeDialog("syncShade");}});
load();initFilter();render();