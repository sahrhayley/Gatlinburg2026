const PEOPLE=[["Hayley","👩"],["Caleb","👨"],["Suttonn","👧"],["Nox","🌸"]];
const avatarFor = (name, emoji) => `<img class="family-avatar" src="./images/backgrounds/avatars/${name.toLowerCase()}.png" alt="" loading="lazy" onerror="this.replaceWith(document.createTextNode(${JSON.stringify("👤")}))">`;
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
let state={profile:"Hayley",active:"unsorted",view:"board",activities:seed.map(a=>({...a})),votes:{},deletedIds:[],filter:"",search:"",matchFilter:"all"};
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const safe=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function textStatus(t,error=false){$("#syncStatus").textContent=t;$("#statusDot").className="status-dot"+(error?" error":"");}
function load(){try{let saved=JSON.parse(localStorage.getItem(KEY)||"null");if(saved&&typeof saved==="object"){state.profile=PEOPLE.some(p=>p[0]===saved.profile)?saved.profile:"Hayley";state.active=CATS.some(c=>c.key===saved.active)?saved.active:"unsorted";state.deletedIds=Array.isArray(saved.deletedIds)?saved.deletedIds.filter(id=>typeof id==="string"):[];state.activities=seed.filter(a=>!state.deletedIds.includes(a.id)).map(a=>({...a}));if(Array.isArray(saved.activities)){const ids=new Set(state.activities.map(a=>a.id));for(const a of saved.activities){if(typeof a.id!=="string"||state.deletedIds.includes(a.id))continue;const existing=state.activities.find(x=>x.id===a.id);if(existing){if(!a.id.startsWith("default-")&&typeof a.photo==="string"&&a.photo.trim())existing.photo=a.photo;}else if(typeof a.name==="string"&&!ids.has(a.id)){state.activities.push({...a,category:window.gatlinburgCategoryName(a.category,a.name)});ids.add(a.id);}}}state.votes=saved.votes&&typeof saved.votes==="object"?saved.votes:{};}}catch(e){textStatus("Could not read saved data",true);console.error(e);}}
function persist(){try{localStorage.setItem(KEY,JSON.stringify({profile:state.profile,active:state.active,activities:state.activities,votes:state.votes,deletedIds:state.deletedIds,updatedAt:new Date().toISOString()}));textStatus("Saved on this device");return true;}catch(e){textStatus("Save failed — storage full?",true);showToast("Could not save! Please free up browser storage.");console.error(e);return false;}}

const SYNC_CODE_KEY="gatlinburg-family-code-v1";
const SYNC_QUEUE_KEY="gatlinburg-pending-v1";
const familyCode="gatlinburg2026-shared-family-8d2f74b0-1a5c-4d98-9e63-7b4c2f1a0d55";
const SHARED_MIGRATED_KEY="gatlinburg-shared-imported-v1";
let syncQueue=JSON.parse(localStorage.getItem(SYNC_QUEUE_KEY)||"[]");
let syncBusy=false, syncReady=false, syncPoll=null;
const apiConfig=window.GATLINBURG_CONFIG||{};
async function rpc(name,params={}){
 const response=await fetch(apiConfig.supabaseUrl+"/rest/v1/rpc/"+name,{
 method:"POST",headers:{"apikey":apiConfig.supabasePublishableKey,"Content-Type":"application/json"},body:JSON.stringify(params)});
 const body=await response.json().catch(()=>null);
 if(!response.ok)throw Error(body?.message||"Database error "+response.status);
 return body;
}
function queueChange(kind,payload){
 const op={kind,payload,id:crypto.randomUUID()};
 if(kind==="vote")syncQueue=syncQueue.filter(q=>!(q.kind==="vote"&&q.payload.person===payload.person&&q.payload.activity===payload.activity));
 syncQueue.push(op);localStorage.setItem(SYNC_QUEUE_KEY,JSON.stringify(syncQueue));
 textStatus("Saving to family database…");void flushSync();
}
async function flushSync(){
 if(syncBusy||!navigator.onLine)return;
 syncBusy=true;
 try{
  while(syncQueue.length){
   const op=syncQueue[0];let name,args;
   if(op.kind==="vote"){name="save_family_vote";args={p_person:op.payload.person,p_activity:op.payload.activity,p_choice:op.payload.choice};}
   else if(op.kind==="add"){name="add_family_activity";args={p_activity:op.payload};}
   else if(op.kind==="delete"){name="delete_family_activity";args={p_activity:op.payload.id,p_pin:op.payload.pin};}
   else{syncQueue.shift();continue;}
   await rpc(name,{p_code:familyCode,p_operation:op.id,...args});
   syncQueue.shift();localStorage.setItem(SYNC_QUEUE_KEY,JSON.stringify(syncQueue));
  }
  textStatus("Saved to family database");
 }catch(err){textStatus("Not synced — retrying",true);console.error("Family sync failed",err);}
 finally{syncBusy=false;}
}
function mergeRemote(remote){
 const pendingDeletes=new Set(syncQueue.filter(x=>x.kind==="delete").map(x=>x.payload.id));
 const deleted=new Set([...(remote.deletedIds||[]),...pendingDeletes]);
 const pendingAdds=syncQueue.filter(x=>x.kind==="add").map(x=>x.payload);
 const custom=[...(remote.activities||[]),...pendingAdds];
 const ids=new Set();
 state.activities=[...seed,...custom].filter(a=>{
  if(deleted.has(a.id)||ids.has(a.id))return false;ids.add(a.id);return true;
 }).map(a=>({...a}));
 state.deletedIds=[...deleted];
 const votes={};
 for(const v of remote.votes||[]){if(!votes[v.person])votes[v.person]={};votes[v.person][v.id]=v.choice;}
 for(const op of syncQueue.filter(x=>x.kind==="vote")){
  const {person,activity,choice}=op.payload;
  if(!votes[person])votes[person]={};
  if(choice==="unsorted")delete votes[person][activity];else votes[person][activity]=choice;
 }
 state.votes=votes;persist();if(!drag&&!touchPending)render();
}
async function refreshFamily(){
 if(syncBusy||!navigator.onLine)return;
 try{const remote=await rpc("get_family_trip",{p_code:familyCode});mergeRemote(remote);syncReady=true;if(!syncQueue.length)textStatus("Saved to family database");}
 catch(err){textStatus("Sync unavailable — retrying",true);console.error(err);}
}
async function connectSharedFamily(){
 try{
  textStatus("Connecting to family database…");
  const remote=await rpc("get_family_trip",{p_code:familyCode});
  if(!localStorage.getItem(SHARED_MIGRATED_KEY)){
   // Import old device rankings only where the shared database has no vote.
   await rpc("import_family_choices",{p_code:familyCode,p_payload:{
    activities:state.activities.filter(a=>a.id.startsWith("custom-")),votes:state.votes
   }});
   localStorage.setItem(SHARED_MIGRATED_KEY,"1");
  }
  await flushSync();
  await refreshFamily();
  if(!syncPoll)syncPoll=setInterval(async()=>{await flushSync();await refreshFamily();},12000);
 }catch(err){textStatus("Family database unavailable — retrying",true);console.error("Family connection",err);}
}
async function exportFamilyBackup(){
 const button=$("#backupDataBtn");
 button.disabled=true;
 const previous=button.textContent;
 button.textContent="Downloading…";
 try{
  // Read fresh shared rankings; never overwrite the database during export.
  const remote=await rpc("get_family_trip",{p_code:familyCode});
  if(!remote||!Array.isArray(remote.votes))throw Error("Family votes were not returned");
  const activities=[...seed,...(remote.activities||[])];
  const byId=new Map(activities.map(a=>[a.id,a]));
  const records=remote.votes.map(v=>({
   person:v.person,activity_id:v.id,
   activity_name:byId.get(v.id)?.name||"(Unknown activity)",
   category:byId.get(v.id)?.category||"",
   area:byId.get(v.id)?.area||"",
   choice:v.choice
  }));
  if(!records.length)throw Error("No saved votes returned. No empty backup downloaded.");
  const columns=["person","activity_id","activity_name","category","area","choice"];
  const csv=[columns.join(","),...records.map(r=>columns.map(k=>'"'+String(r[k]??"").replace(/"/g,'""')+'"').join(","))].join("\r\n");
  const blob=new Blob(["\uFEFF"+csv],{type:"text/csv;charset=utf-8"});
  const url=URL.createObjectURL(blob);
  const link=document.createElement("a");
  link.href=url;link.download="gatlinburg-family-choices-"+new Date().toISOString().slice(0,10)+".csv";
  document.body.appendChild(link);link.click();link.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
  showToast("Downloaded "+records.length+" saved family choices.");
 }catch(err){
  console.error("Download family choices failed",err);
  showToast("Download failed. Saved database choices were not changed.");
 }finally{button.disabled=false;button.textContent=previous;}
}
function showSyncDialog(){
 $("#syncShade").classList.remove("hidden");
 $("#syncMessage").textContent=syncQueue.length?"Pending offline changes: "+syncQueue.length:"Family syncing is automatic.";
}
window.addEventListener("online",async()=>{await flushSync();await refreshFamily();});

function voteFor(person,id){return CATS.some(c=>c.key===state.votes?.[person]?.[id])?state.votes[person][id]:"unsorted";}
function setVote(id,key){if(!CATS.some(c=>c.key===key))return;if(!state.votes[state.profile])state.votes[state.profile]={};if(key==="unsorted")delete state.votes[state.profile][id];else state.votes[state.profile][id]=key;persist();queueChange("vote",{person:state.profile,activity:id,choice:key});render();}
function totalFor(key){return state.activities.filter(a=>voteFor(state.profile,a.id)===key).length;}
const PHOTO_FALLBACKS={
"default-42":["https://piratesvoyage.com/media/63fcd4e7dbca58e9d472e839/xlarge.webp"],
"default-44":["https://cdn2.smokymountains.com/uploads/2013/09/Comedy-Barn-Pigeon-Forge-12.jpg"],
"default-83":["https://a-us.storyblok.com/f/1018389/1920x1080/7fd8678701/homepage-winterfest-blog-image-1920-x-1080.jpg/m/2048x1536/smart/filters%3Aquality%2890%29"],
"default-85":["https://i.postimg.cc/13Cqfwmp/dollywoodchristmas.jpg"],
"default-90":["https://www.greatsmokies.com/wp-content/uploads/2018/06/TwoAtStateLine900.jpg"]
};
function photoMarkup(a){
const valid=/^(https:\/\/|data:image\/|\.\/images\/|images\/)/i.test(a.photo||"");
if(!valid)return "";
const urls=[a.photo,...(PHOTO_FALLBACKS[a.id]||[])];
for(const u of [...urls]){if(/^https:\/\//i.test(u))urls.push("https://wsrv.nl/?url="+encodeURIComponent(u)+"&w=900");}
return `<img loading="lazy" src="${safe(urls[0])}" data-photo-options="${safe(JSON.stringify(urls))}" data-photo-index="0" alt="${safe(a.name)}" onerror="const options=JSON.parse(this.dataset.photoOptions);const next=Number(this.dataset.photoIndex)+1;if(next<options.length){this.dataset.photoIndex=String(next);this.src=options[next];}else{this.remove();this.parentElement.querySelector('.card-emoji').hidden=false;}">`;
}
const palette=["#d5e7e4","#eedec7","#e2e2ee","#d4e6d2","#f6decf","#d9e8ee","#ece5d5"];
function renderProfiles(){const target=$("#profiles");target.innerHTML=PEOPLE.map(([name,emoji])=>`<button type="button" class="profile ${state.profile===name?"selected":""}" data-person="${name}" aria-pressed="${state.profile===name}"><span class="profile-face">${avatarFor(name,emoji)}</span><span>${name}<small class="profile-sub">${name===state.profile?"Currently choosing":"Tap to choose"}</small></span></button>`).join("");}
function renderTabs(){$$(".tab").forEach(b=>{b.classList.toggle("active",b.dataset.view===state.view)});$("#boardView").classList.toggle("hidden",state.view!=="board");$("#matchesView").classList.toggle("hidden",state.view!=="matches");$("#compareView").classList.toggle("hidden",state.view!=="compare");}
function renderBuckets(){$("#buckets").innerHTML=CATS.map(c=>`<button type="button" class="bucket ${state.active===c.key?"selected":""}" data-bucket="${c.key}" style="--tint:${c.tint};--accent:${c.color}" aria-pressed="${state.active===c.key}"><span class="bucket-emoji">${c.icon}</span><span><span class="bucket-title">${c.label}</span><span class="bucket-count">${totalFor(c.key)} activities</span></span></button>`).join("");}
function renderCards(){const term=state.search.trim().toLowerCase();const arr=state.activities.filter(a=>voteFor(state.profile,a.id)===state.active&&(!state.filter||a.category===state.filter)&&(!term||(a.name+" "+a.area+" "+a.category).toLowerCase().includes(term)));$("#cards").innerHTML=arr.map((a,i)=>{const valid=/^https:\/\//i.test(a.photo||"");const color=palette[(state.activities.indexOf(a))%palette.length];const q="https://www.google.com/search?tbm=isch&q="+encodeURIComponent(a.name+" "+a.area+" attraction");return `<article class="card" data-id="${safe(a.id)}"><div class="card-image" style="--shade:${color}">${photoMarkup(a)}<span class="card-emoji" ${valid?"hidden":""}>${safe(a.emoji||"📍")}</span><span class="card-area">${safe(a.area)}</span></div><div class="card-content"><div class="card-type"><span class="type-emoji">${safe(categoryEmoji(a.category))}</span><span>${safe(a.category)}</span></div><h3>${safe(a.name)}</h3><div class="card-bottom"><select aria-label="Rank ${safe(a.name)}" data-vote="${safe(a.id)}">${CATS.map(c=>`<option value="${c.key}" ${voteFor(state.profile,a.id)===c.key?"selected":""}>${c.icon} ${c.label}</option>`).join("")}</select><a class="photo-search" href="${q}" target="_blank" rel="noopener noreferrer" title="Find photos">↗</a><button type="button" class="delete-activity" data-delete="${safe(a.id)}" aria-label="Delete ${safe(a.name)}" title="Delete activity (PIN required)" style="border:0;background:transparent;color:#a43e49;font-size:20px;cursor:pointer;padding:4px 8px" >🗑</button></div></div></article>`;}).join("");$("#emptyState").classList.toggle("hidden",arr.length>0);$("#boardTitle").textContent=state.profile+"'s adventure board";}
function compareInfo(a){const votes=PEOPLE.map(p=>voteFor(p[0],a.id));const ranked=votes.filter(v=>v!=="unsorted");const positive=ranked.filter(v=>v==="must"||v==="want").length;const negative=ranked.filter(v=>v==="no").length;let type="pending";if(positive>=2&&negative===0)type="match";if(positive>0&&negative>0)type="conflict";return {votes,type,positive,ranked:ranked.length,score:votes.reduce((n,v)=>n+({must:3,want:1,unknown:0,no:-2,unsorted:0}[v]||0),0)};}
function statusLabel(k){return CATS.find(c=>c.key===k)?.label||"UNSORTED";}
function renderMatch(){const items=state.activities.map(a=>({...a,info:compareInfo(a)})).sort((a,b)=>b.info.score-a.info.score||b.info.ranked-a.info.ranked||a.name.localeCompare(b.name));const matches=items.filter(a=>a.info.type==="match").length;const conflicts=items.filter(a=>a.info.type==="conflict").length;$("#summaryStats").innerHTML=`<div class="stat"><strong>${matches}</strong><span>Shared favorites</span></div><div class="stat"><strong>${conflicts}</strong><span>Disagreements</span></div><div class="stat"><strong>${items.filter(a=>a.info.ranked).length}</strong><span>Activities voted on</span></div>`;$("#matchFilters").innerHTML=[["all","All"],["match","Shared favorites"],["conflict","Disagreements"],["pending","Still deciding"]].map(([k,v])=>`<button type="button" class="chip ${state.matchFilter===k?"active":""}" data-match="${k}">${v}</button>`).join("");const displayed=items.filter(a=>state.matchFilter==="all"?a.info.ranked>0:a.info.type===state.matchFilter);$("#matchCards").innerHTML=displayed.map(a=>`<div class="match"><span class="match-tag ${a.info.type}">${a.info.type==="match"?"♥ Shared favorite":a.info.type==="conflict"?"↔ Different opinions":"◷ Still deciding"}</span><h3>${safe(categoryEmoji(a.category))} ${safe(a.name)}</h3><small>${safe(a.area)}</small><div class="votes">${PEOPLE.map((p,i)=>`<div class="vote"><b>${avatarFor(p[0],p[1])} ${p[0]}</b><span>${statusLabel(a.info.votes[i])}</span></div>`).join("")}</div></div>`).join("")||'<div class="empty-state">No matching activities yet. Start sorting!</div>';}
function renderCompare(){const search=$("#compareSearch").value.trim().toLowerCase();const arr=state.activities.filter(a=>a.name.toLowerCase().includes(search)).sort((a,b)=>a.name.localeCompare(b.name));$("#comparisonRows").innerHTML=arr.map(a=>`<tr><td>${safe(categoryEmoji(a.category))} ${safe(a.name)}</td>${PEOPLE.map(p=>{const v=voteFor(p[0],a.id);return `<td><span class="pill ${v}">${statusLabel(v)}</span></td>`}).join("")}</tr>`).join("");}
function render(){renderProfiles();renderTabs();renderBuckets();if(topView!=="board"){if(topView==="costs")renderCosts();else renderPlanner();return;}if(state.view==="board")renderCards();if(state.view==="matches")renderMatch();if(state.view==="compare")renderCompare();}
function showToast(t){const el=$("#toast");el.textContent=t;el.classList.remove("hidden");clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>el.classList.add("hidden"),2500);}
function closeDialog(id){$("#"+id).classList.add("hidden");}
function openAdd(){$("#activityForm").reset();$("#activityCategory").innerHTML=ACTIVITY_CATEGORIES.map(c=>`<option value="${safe(c.name)}">${safe(c.emoji)} ${safe(c.name)}</option>`).join("");$("#modalShade").classList.remove("hidden");$("#activityName").focus();}
function addActivity(e){e.preventDefault();const name=$("#activityName").value.trim();if(!name)return;const match=state.activities.find(a=>a.name.toLowerCase()===name.toLowerCase());if(match){showToast("That activity is already on the list");return;}const photo=$("#activityPhoto").value.trim();if(photo&&!/^https:\/\//i.test(photo)){showToast("Photo needs an https:// link");return;}const id="custom-"+(globalThis.crypto?.randomUUID?.()||Date.now()+"-"+Math.random().toString(36).slice(2));state.activities.push({id,name,area:$("#activityArea").value,category:$("#activityCategory").value,photo,emoji:categoryEmoji($("#activityCategory").value)});state.active="unsorted";state.filter="";$("#activityFilter").value="";state.search="";$("#search").value="";persist();queueChange("add",state.activities[state.activities.length-1]);closeDialog("modalShade");state.view="board";render();showToast("Added to everyone's Unsorted list");}
function deleteActivity(id){
 const activity=state.activities.find(a=>a.id===id);
 if(!activity)return;
 const pin=window.prompt("Enter parent PIN to delete "+activity.name+":");
 if(pin===null)return;
 if(pin!=="3394"){showToast("Incorrect PIN. Activity not deleted.");return;}
 if(!window.confirm("Permanently remove "+activity.name+" from everyone's lists and rankings on this device?"))return;
 state.deletedIds=Array.from(new Set([...(state.deletedIds||[]),id]));
 state.activities=state.activities.filter(a=>a.id!==id);
 for(const votes of Object.values(state.votes)){if(votes&&typeof votes==="object")delete votes[id];}
 persist();queueChange("delete",{id,pin});render();showToast("Activity deleted");
}
function initFilter(){$("#activityFilter").innerHTML='<option value="">All activity types</option>'+ACTIVITY_CATEGORIES.map(c=>`<option value="${safe(c.name)}">${safe(c.emoji)} ${safe(c.name)}</option>`).join("");}
function downloadBackup(){const blob=new Blob([JSON.stringify({savedAt:new Date().toISOString(),...state},null,2)],{type:"application/json"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="gatlinburg2026-backup.json";a.click();setTimeout(()=>URL.revokeObjectURL(url),500);}
let drag=null;
function dragStart(x,y,card){
  cancelDrag();
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
    drag.ghost.style.pointerEvents="none";
    drag.ghost.style.userSelect="none";
    drag.ghost.querySelectorAll("select").forEach(el=>{el.disabled=true;el.tabIndex=-1;});
    drag.ghost.querySelectorAll("a").forEach(el=>{el.removeAttribute("href");el.tabIndex=-1;});
    drag.ghost.style.width=Math.min(drag.card.getBoundingClientRect().width,245)+"px";
    document.body.append(drag.ghost);
    drag.card.style.opacity=".5";
  }
  if(!drag?.ghost)return;
  drag.ghost.style.left=(x+12)+"px";
  drag.ghost.style.top=(y+10)+"px";
  document.querySelectorAll(".bucket").forEach(el=>el.classList.remove("drag-over"));
  document.elementFromPoint(x,y)?.closest(".bucket[data-bucket]")?.classList.add("drag-over");
}
function dragEnd(x,y){
  if(!drag)return;
  const id=drag.id;
  const to=drag.moved?document.elementFromPoint(x,y)?.closest(".bucket[data-bucket]")?.dataset.bucket:null;
  drag.ghost?.remove();
  if(drag.card)drag.card.style.opacity="";
  document.querySelectorAll(".bucket").forEach(el=>el.classList.remove("drag-over"));
  drag=null;
  if(to){setVote(id,to);showToast("Moved to "+statusLabel(to));}else{render();}
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
  dragStart(e.clientX,e.clientY,card);
  try{document.documentElement.setPointerCapture(e.pointerId);}catch(_){}
});
document.addEventListener("pointermove",e=>{if(drag&&e.pointerType!=="touch")dragMove(e.clientX,e.clientY);});
document.addEventListener("pointerup",e=>{if(drag&&e.pointerType!=="touch")dragEnd(e.clientX,e.clientY);});
window.addEventListener("blur",()=>{clearTimeout(touchPending?.timer);touchPending=null;cancelDrag();});
document.addEventListener("visibilitychange",()=>{if(document.hidden){clearTimeout(touchPending?.timer);touchPending=null;cancelDrag();}});
document.addEventListener("pointercancel",e=>{if(e.pointerType!=="touch")cancelDrag();});
// On iPad/iPhone, hold briefly to pick up a card. Ordinary swipes still scroll.
let touchPending=null;
document.addEventListener("touchstart",e=>{
  if(e.touches.length!==1){clearTimeout(touchPending?.timer);touchPending=null;cancelDrag();return;}
  const card=cardFromEvent(e);
  if(!card)return;
  const t=e.touches[0];
  const pending={x:t.clientX,y:t.clientY,card,activated:false,timer:null};
  pending.timer=setTimeout(()=>{
    if(touchPending!==pending)return;
    pending.activated=true;
    dragStart(pending.x,pending.y,pending.card);
    if(navigator.vibrate)navigator.vibrate(12);
  },180);
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
    if(Math.abs(dx)>12 && Math.abs(dx)>Math.abs(dy)*1.5){
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
  void refreshFamily();
},{passive:false});
document.addEventListener("touchcancel",()=>{
  clearTimeout(touchPending?.timer);
  touchPending=null;cancelDrag();
});
document.addEventListener("click",e=>{const del=e.target.closest("[data-delete]");if(del){e.preventDefault();deleteActivity(del.dataset.delete);return;}const p=e.target.closest("[data-person]");if(p){state.profile=p.dataset.person;persist();render();return;}const b=e.target.closest("[data-bucket]");if(b){state.active=b.dataset.bucket;persist();render();return;}const tab=e.target.closest("[data-view]");if(tab){showTopView("board");state.view=tab.dataset.view;render();return;}const chip=e.target.closest("[data-match]");if(chip){state.matchFilter=chip.dataset.match;renderMatch();}});
document.addEventListener("change",e=>{if(e.target.matches("[data-vote]"))setVote(e.target.dataset.vote,e.target.value);});
$("#search").addEventListener("input",e=>{state.search=e.target.value;renderCards();});
$("#activityFilter").addEventListener("change",e=>{state.filter=e.target.value;renderCards();});
$("#compareSearch").addEventListener("input",renderCompare);
$("#addActivityBtn").addEventListener("click",openAdd);
$("#activityForm").addEventListener("submit",addActivity);
$("#cancelModal").addEventListener("click",()=>closeDialog("modalShade"));
$("#closeModal").addEventListener("click",()=>closeDialog("modalShade"));
$("#modalShade").addEventListener("click",e=>{if(e.target.id==="modalShade")closeDialog("modalShade");});
$("#syncSettingsBtn").addEventListener("click",showSyncDialog);
$("#closeSync").addEventListener("click",()=>closeDialog("syncShade"));
$("#syncShade").addEventListener("click",e=>{if(e.target.id==="syncShade")closeDialog("syncShade");});
document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeDialog("modalShade");closeDialog("syncShade");}});

/* Development-only cost and itinerary tools. Saved independently from family votes. */
const PLAN_STORAGE_KEY="gatlinburg-planning-v1";
const DURATION_ESTIMATES=Object.fromEntries((window.GATLINBURG_DURATION_ESTIMATES||[]).map(x=>[x.id,x.minutes]));
const ACTIVITY_HOURS = {
 "Anakeesta": {open:"10:00",close:"21:00"},
 "Ober Mountain": {open:"",close:""},
 "Cades Cove": {open:"Sunrise",close:"Sunset"}
};
function displayClockTime(value){
 const match=String(value??"").trim().match(/^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/i);
 if(!match)return value??"";
 let hour=Number(match[1]),minute=Number(match[2]);
 if(hour>23||minute>59)return value;
 if(match[3]){if(hour<1||hour>12)return value;hour=hour%12+(match[3].toUpperCase()==="PM"?12:0);}
 return (hour%12||12)+":"+String(minute).padStart(2,"0")+(hour>=12?" PM":" AM");
}
function getActivityHours(stop,activity){
 const defaults=ACTIVITY_HOURS[activity?.name]||{};
 return {open:stop.open??defaults.open??"",close:stop.close??defaults.close??""};
}
let planning={costs:{},included:{},days:{},day:"",start:{}};
try{const stored=JSON.parse(localStorage.getItem(PLAN_STORAGE_KEY)||"null");if(stored&&typeof stored==="object")planning={...planning,...stored};}catch(e){console.warn("Planning data could not load",e);}
let topView="board",costFilter="all",costPerson=state.profile;
const COST_ESTIMATES=Object.fromEntries((window.GATLINBURG_COST_ESTIMATES||[]).map(x=>[x.id,x]));
const costFor=id=>planning.costs[id]!==undefined?Number(planning.costs[id])||0:COST_ESTIMATES[id]?.amount||0;
const money=n=>new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(Number(n)||0);
const savePlanning=()=>{try{localStorage.setItem(PLAN_STORAGE_KEY,JSON.stringify(planning));}catch(e){showToast("Planning changes could not be saved");}};
const rankOf=(person,id)=>state.votes[person]?.[id]||"unsorted";
function showTopView(view){
 topView=view;
 $("#planningToolsView").classList.toggle("hidden",view==="board");
 $("#costsPanel").classList.toggle("hidden",view!=="costs");
 $("#plannerPanel").classList.toggle("hidden",view!=="planner");
 $(".hero").classList.toggle("hidden",view!=="board");
 $(".profile-section").classList.toggle("hidden",view!=="board");
 $(".tabs").classList.remove("hidden");
 ["boardView","matchesView","compareView"].forEach(id=>$("#"+id).classList.toggle("hidden",view!=="board"||(id!==(state.view==="board"?"boardView":state.view==="matches"?"matchesView":"compareView"))));
 document.querySelectorAll("[data-top-view]").forEach(b=>b.classList.toggle("selected",b.dataset.topView===view));
 if(view==="costs"){ $("#planningTitle").textContent="Trip costs";renderCosts();}
 if(view==="planner"){ $("#planningTitle").textContent="Day planner";renderPlanner();}
}
function renderCosts(){
 const people=PEOPLE.map(p=>p[0]);
 $("#costPerson").innerHTML=people.map(p=>'<option value="'+safe(p)+'" '+(p===costPerson?"selected":"")+'>'+safe(p)+'</option>').join("");
 $("#costRankFilter").innerHTML='<option value="all">All rankings</option>'+CATS.map(c=>'<option value="'+c.key+'" '+(c.key===costFilter?"selected":"")+'>'+safe(c.label)+'</option>').join("");
 const visible=state.activities.filter(a=>costFilter==="all"||rankOf(costPerson,a.id)===costFilter);
 const total=visible.reduce((sum,a)=>sum+(costFor(a.id)),0);
 const checked=visible.reduce((sum,a)=>sum+(planning.included[a.id]?costFor(a.id):0),0);
 $("#costGrandTotal").textContent=money(total);$("#costCheckedTotal").textContent=money(checked);
 $("#costRows").innerHTML=visible.map(a=>'<div class="planning-row cost-row"><label class="check-name"><input type="checkbox" data-cost-check="'+safe(a.id)+'" '+(planning.included[a.id]?"checked":"")+'><span><strong>'+safe(a.name)+'</strong><small>'+safe(statusLabel(rankOf(costPerson,a.id)))+' · '+safe(a.area)+'</small></span></label><label class="money-entry">$ <input type="number" min="0" step="0.01" inputmode="decimal" aria-label="Cost for '+safe(a.name)+'" data-cost-amount="'+safe(a.id)+'" value="'+safe(planning.costs[a.id]??COST_ESTIMATES[a.id]?.amount??"")+'" placeholder="0.00"></label><small class="cost-note">'+safe(COST_ESTIMATES[a.id]?.kind||"Custom")+': '+safe(COST_ESTIMATES[a.id]?.note||"Enter your own total")+(COST_ESTIMATES[a.id]?.source?' <a href="'+safe(COST_ESTIMATES[a.id].source)+'" target="_blank" rel="noopener noreferrer">Price source</a>':"")+'</small></div>').join("")||'<p>No activities in this ranking.</p>';
}
function dayKey(){return planning.day||new Date().toLocaleDateString("en-CA");}
function minutesFromTime(t){const [h,m]=String(t||"09:00").split(":").map(Number);return (h||0)*60+(m||0);}
function timeLabel(min){return new Date(2000,0,1,0,Math.max(0,min)).toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"});}
function renderPlanner(){
 const day=dayKey();planning.day=day;$("#plannerDate").value=day;
 const start=planning.start[day]||"09:00";$("#plannerStart").value=start;
 const rows=planning.days[day]||[];
 $("#plannerAddActivity").innerHTML=state.activities.map(a=>'<option value="'+safe(a.id)+'">'+safe(a.name)+'</option>').join("");
 let cursor=minutesFromTime(start);
 $("#plannerRows").innerHTML=rows.map((stop,i)=>{
 const a=state.activities.find(x=>x.id===stop.id);
 const duration=Math.max(0,Number(stop.duration)||0),travel=Math.max(0,Number(stop.travel)||0);
 const begin=timeLabel(cursor);cursor+=duration;const end=timeLabel(cursor);cursor+=travel;const hours=getActivityHours(stop,a);
 return '<div class="planning-row itinerary-row"><div class="itinerary-top"><label class="check-name"><input type="checkbox" data-stop-check="'+i+'" '+(stop.done?"checked":"")+'><span><strong class="'+(stop.done?"done-stop":"")+'">'+safe(a?.name||"Removed activity")+'</strong><small>'+safe(begin)+' – '+safe(end)+'</small></span></label><button class="secondary-button" data-stop-remove="'+i+'" type="button">Remove</button></div><div class="itinerary-fields"><label>Opens<input class="input" type="text" placeholder="Unknown" data-stop-open="'+i+'" value="'+safe(displayClockTime(hours.open))+'"></label><label>Closes<input class="input" type="text" placeholder="Unknown" data-stop-close="'+i+'" value="'+safe(displayClockTime(hours.close))+'"></label><label>Stay (min)<input class="input" type="number" min="0" step="5" data-stop-duration="'+i+'" value="'+duration+'"></label><label>Travel to next (min)<input class="input" type="number" min="0" step="5" data-stop-travel="'+i+'" value="'+travel+'"></label><div class="move-stop"><button type="button" data-stop-up="'+i+'" '+(i===0?"disabled":"")+'>↑</button><button type="button" data-stop-down="'+i+'" '+(i===rows.length-1?"disabled":"")+'>↓</button></div></div></div>';
 }).join("")||'<p class="empty-plan">No stops yet. Choose an activity and add it above.</p>';
 $("#plannerStopCount").textContent=rows.length;
 $("#plannerFinish").textContent=rows.length?timeLabel(cursor-Math.max(0,Number(rows.at(-1).travel)||0)):"—";
}
$("#costPerson").addEventListener("change",e=>{costPerson=e.target.value;renderCosts();});
$("#costRankFilter").addEventListener("change",e=>{costFilter=e.target.value;renderCosts();});
$("#costRows").addEventListener("change",e=>{const amount=e.target.dataset.costAmount,check=e.target.dataset.costCheck;if(amount){planning.costs[amount]=Math.max(0,Number(e.target.value)||0);}if(check){planning.included[check]=e.target.checked;}savePlanning();renderCosts();});
$("#plannerDate").addEventListener("change",e=>{planning.day=e.target.value;savePlanning();renderPlanner();});
$("#plannerStart").addEventListener("change",e=>{planning.start[dayKey()]=e.target.value;savePlanning();renderPlanner();});
$("#plannerAddBtn").addEventListener("click",()=>{const id=$("#plannerAddActivity").value;if(!id)return;(planning.days[dayKey()]??=[]).push({id,duration:DURATION_ESTIMATES[id]??60,travel:15,done:false});savePlanning();renderPlanner();});
$("#plannerRows").addEventListener("change",e=>{const rows=planning.days[dayKey()]||[];const t=e.target.dataset;const index=Number(t.stopDuration??t.stopTravel??t.stopCheck??t.stopOpen??t.stopClose);if(!rows[index])return;if(t.stopDuration!==undefined)rows[index].duration=Math.max(0,Number(e.target.value)||0);if(t.stopTravel!==undefined)rows[index].travel=Math.max(0,Number(e.target.value)||0);if(t.stopCheck!==undefined)rows[index].done=e.target.checked;if(t.stopOpen!==undefined)rows[index].open=e.target.value;if(t.stopClose!==undefined)rows[index].close=e.target.value;savePlanning();renderPlanner();});
$("#plannerRows").addEventListener("click",e=>{const btn=e.target.closest("[data-stop-remove],[data-stop-up],[data-stop-down]");if(!btn)return;const rows=planning.days[dayKey()]||[];const t=btn.dataset;const i=Number(t.stopRemove??t.stopUp??t.stopDown);if(t.stopRemove!==undefined)rows.splice(i,1);else{const j=i+(t.stopUp!==undefined?-1:1);if(j<0||j>=rows.length)return;[rows[i],rows[j]]=[rows[j],rows[i]];}savePlanning();renderPlanner();});
document.querySelectorAll("[data-top-view]").forEach(b=>b.addEventListener("click",()=>showTopView(b.dataset.topView)));
$("#backToBoard").addEventListener("click",()=>{showTopView("board");render();});

load();initFilter();render();$("#backupDataBtn").addEventListener("click",exportFamilyBackup);void connectSharedFamily();
// Future deployments are detected on already-open pages, without changing the URL.
const RUNNING_SITE_VERSION="18";
async function checkSiteVersion(){
 if(drag||touchPending||syncBusy||syncQueue.length)return;
 try{
  const response=await fetch("./site-version.json?check="+Date.now(),{cache:"no-store"});
  if(!response.ok)return;
  const latest=await response.json();
  if(String(latest.version)!==RUNNING_SITE_VERSION){
   await flushSync();
   if(!syncQueue.length)location.reload();
  }
 }catch(e){console.warn("Update check unavailable",e);}
}
setInterval(checkSiteVersion,30000);
document.addEventListener("visibilitychange",()=>{if(!document.hidden)void checkSiteVersion();});
