// Track-aware UI: NACE/NCLEX switcher, mock blueprints per track, and the
// voice-study section. Loaded after features.js so its function declarations
// and wrappers take precedence.
SECTIONS.push('voice');

function curTrack(){ return S.track==='nclex'?'nclex':'nace'; }
function setTrack(t){ if(curTrack()===t)return; S.track=t; save(); location.reload(); }

const baseRenderHome=renderHome;
renderHome=function(){
  baseRenderHome();
  const t=curTrack();
  $('tk-nace').classList.toggle('on',t==='nace');
  $('tk-nclex').classList.toggle('on',t==='nclex');
  $('track-eyebrow').textContent=TRACKS[t].label;
  $('bank-blurb').textContent=TRACKS[t].blurb;
  const inBank=Object.keys(S.missed).map(Number).filter(id=>BANK.some(q=>q.id===id)).length;
  $('misscount').textContent=inBank;
};

const baseGo=go;
go=function(id){
  if(id!=='voice'&&typeof voiceLeave==='function')voiceLeave();
  baseGo(id);
  if(id==='voice')renderVoice();
};

function startMock(){
  const groups=TRACKS[curTrack()].mockGroups;
  let qs=[]; Object.entries(groups).forEach(([c,n])=>{ qs=qs.concat(shuffle(BANK.filter(q=>q.c===c)).slice(0,n)); });
  qs=shuffle(qs).slice(0,50);
  Q={mode:'mock',title:'Mock exam',qs,i:0,ans:[],feedback:false,secs:60*60}; $('again').onclick=startMock; beginQuiz(); startTimer();
}
function startMissed(){
  const ids=Object.keys(S.missed).map(Number);
  const pool=BANK.filter(q=>ids.includes(q.id));
  if(!pool.length){ alert("Nothing to review on this track yet — you haven't missed anything! Go do a drill."); return; }
  Q={mode:'missed',title:'Fix my misses',qs:shuffle(pool).slice(0,15),i:0,ans:[],feedback:true}; $('again').onclick=startMissed; beginQuiz();
}

renderHome();
