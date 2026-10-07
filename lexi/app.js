// Lexi's A&P Study Room — core engine.
// Accessibility defaults: no timers anywhere (optional mock timer off by default),
// 5-question drills, every piece of text can be read aloud, missed questions
// return often, and feedback is always gentle.

const KEY='lexi-ap-v1';
let S; try{ S=JSON.parse(localStorage.getItem(KEY))||{} }catch(e){ S={} }
S.answered=S.answered||0; S.correct=S.correct||0; S.mocks=S.mocks||[]; S.missed=S.missed||{}; S.cat=S.cat||{}; S.cards=S.cards||{};
S.days=S.days||[]; S.vq=S.vq||{}; S.lab=S.lab||{}; S.unlocked=S.unlocked||{}; S.hist=S.hist||{};
if(S.sound==null)S.sound=true; if(S.fx==null)S.fx=true; if(S.rate==null)S.rate=0.95; if(S.big==null)S.big=false; if(S.mockTimer==null)S.mockTimer=false;
S.bestStreak=S.bestStreak||0; S.best60=S.best60||0;
function save(){ try{ localStorage.setItem(KEY,JSON.stringify(S)) }catch(e){} }
function today(){ return new Date().toISOString().slice(0,10) }
function touchDay(){ const t=today(); if(!S.days.includes(t)){S.days.push(t); S.days=S.days.slice(-400); save();} }
function streak(){ let n=0; const d=new Date(); for(;;){ const k=d.toISOString().slice(0,10); if(S.days.includes(k)){n++; d.setDate(d.getDate()-1);} else if(n===0 && k===today()){ d.setDate(d.getDate()-1); } else break; } return n; }
function logDay(ok){ const t=today(); S.hist[t]=S.hist[t]||{t:0,c:0}; S.hist[t].t++; if(ok)S.hist[t].c++; }

const $=id=>document.getElementById(id);
const pick=a=>a[Math.floor(Math.random()*a.length)];
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};

// Stable ids, then shuffle each question's answer positions so the correct
// letter never becomes a pattern.
BANK.forEach((q,i)=>{ q.id=i;
  const idx=shuffle(q.o.map((_,k)=>k));
  q.o=idx.map(k=>q.o[k]); q.a=idx.indexOf(q.a);
});

const CHEER_OK=["Yes, Lexi! That's it.","You got it.","Exactly right.","Nice — you knew that one.","Correct! Keep rolling.","That's the one. Well done.","Look at you go."];
const CHEER_NO=["Not this one — and that's completely okay. Here's the why.","Almost. Read the why and it'll stick.","Not yet — it'll come back around until it's yours.","Good try. This is exactly how learning works.","No worries at all — here's the helpful part."];

// ---------- Read-aloud (used everywhere) ----------
const HAS_TTS='speechSynthesis' in window;
let SPEAK_ID=0;
function stopSpeak(){ SPEAK_ID++; if(HAS_TTS){ try{speechSynthesis.cancel()}catch(e){} } document.querySelectorAll('.speak.on').forEach(b=>b.classList.remove('on')); }
function speak(text,cb){
  if(!HAS_TTS){ if(cb)cb(); return; }
  stopSpeak(); const sid=SPEAK_ID;
  const parts=String(text).match(/[^.!?]+[.!?]*/g)||[String(text)];
  let k=0;
  const sayNext=()=>{
    if(sid!==SPEAK_ID)return;
    if(k>=parts.length){ document.querySelectorAll('.speak.on').forEach(b=>b.classList.remove('on')); if(cb)cb(); return; }
    const u=new SpeechSynthesisUtterance(parts[k++].trim());
    u.lang='en-US'; u.rate=S.rate||0.95;
    u.onend=sayNext; u.onerror=sayNext;
    speechSynthesis.speak(u);
  };
  sayNext();
}
// Speaker-button helper: tap to read, tap again to stop.
function spk(btn,text){ if(btn.classList.contains('on')){ stopSpeak(); return; } stopSpeak(); btn.classList.add('on'); speak(text,()=>btn.classList.remove('on')); }
function qSpeechText(q){ return q.q+' '+q.o.map((t,n)=>`${'ABCD'[n]}. ${t}.`).join(' '); }

// ---------- Navigation ----------
const SECTIONS=['home','drill','quiz','result','label','cards','voice','game','rewards','install','settings'];
function go(id){
  const keepTalking=(typeof V!=='undefined')&&V.ending;
  if(typeof voiceLeave==='function')voiceLeave();
  if(!keepTalking)stopSpeak();
  SECTIONS.forEach(x=>$(x).classList.toggle('hidden',x!==id)); window.scrollTo({top:0}); stopTimer();
  if(id==='home')renderHome(); if(id==='drill')renderTopics(); if(id==='cards')initCards();
  if(id==='label')renderLabelHome(); if(id==='voice')renderVoice(); if(id==='game')gameHome();
  if(id==='rewards')renderRewards();
  if(id==='settings'){$('snd').checked=S.sound;$('cfx').checked=S.fx;$('vrate').value=String(S.rate);$('bigt').checked=S.big;$('mtimer').checked=S.mockTimer;}
}
function renderHome(){
  $('s-streak').textContent=streak(); $('s-done').textContent=S.answered; $('s-acc').textContent=S.answered?Math.round(S.correct/S.answered*100)+'%':'–';
  $('mockcount').textContent=S.mocks.length; $('misscount').textContent=Object.keys(S.missed).length;
  $('bankcount').textContent=BANK.length; $('cardcount').textContent=CARDS.length+' cards';
  $('labelcount').textContent=DIAGRAMS.length+' diagrams';
  const h=new Date().getHours(); $('greet').textContent=(h<12?'Good morning, Lexi.':h<17?'Good afternoon, Lexi.':'Good evening, Lexi.');
}
function catStats(){ const r={}; BANK.forEach(q=>{r[q.c]=r[q.c]||{n:0,t:0,c:0}; r[q.c].n++}); Object.entries(S.cat).forEach(([c,v])=>{if(r[c]){r[c].t=v.t;r[c].c=v.c}}); return r; }
function renderTopics(){
  const st=catStats(); const list=Object.entries(st).sort((a,b)=>{const pa=a[1].t?a[1].c/a[1].t:0.5, pb=b[1].t?b[1].c/b[1].t:0.5; return pa-pb});
  $('topics').innerHTML='<button class="chip" onclick="startDrill(null)">A little of everything<span class="n">5</span></button>'+list.map(([c,v])=>`<button class="chip" onclick="startDrill('${c.replace(/'/g,"\\'")}')">${c}<span class="n">${v.t?Math.round(v.c/v.t*100)+'%':'new'}</span></button>`).join('');
}

// ---------- Quiz engine ----------
let Q={}, sel=null;
function weightedPick(n,pool){
  const w=pool.map(q=>S.missed[q.id]?4:(S.cat[q.c]&&S.cat[q.c].seen&&S.cat[q.c].seen[q.id])?1:2);
  const out=[]; const idx=pool.map((_,i)=>i);
  while(out.length<n&&idx.length){ let tot=0; idx.forEach(i=>tot+=w[i]); let r=Math.random()*tot, k=0; for(;k<idx.length;k++){ r-=w[idx[k]]; if(r<=0)break; } k=Math.min(k,idx.length-1); out.push(pool[idx[k]]); idx.splice(k,1); }
  return out;
}
function startDrill(cat){ const pool=cat?BANK.filter(q=>q.c===cat):BANK; Q={mode:'drill',title:cat||'A little of everything',qs:weightedPick(Math.min(5,pool.length),pool),i:0,ans:[],feedback:true}; $('again').onclick=()=>startDrill(cat); beginQuiz(); }
function startMissed(){ const ids=Object.keys(S.missed).map(Number); if(!ids.length){ alert("Nothing to practice again yet — you haven't missed anything!"); return; } const pool=BANK.filter(q=>ids.includes(q.id)); Q={mode:'missed',title:'Practice my misses',qs:shuffle(pool).slice(0,10),i:0,ans:[],feedback:true}; $('again').onclick=startMissed; beginQuiz(); }
function startMock(){
  let qs=[]; [...new Set(BANK.map(q=>q.c))].forEach(c=>{ qs=qs.concat(shuffle(BANK.filter(q=>q.c===c)).slice(0,4)); });
  qs=shuffle(qs).slice(0,50);
  Q={mode:'mock',title:'Practice test',qs,i:0,ans:[],feedback:false};
  if(S.mockTimer)Q.secs=75*60;
  $('again').onclick=startMock; beginQuiz(); if(Q.secs)startTimer();
}
function beginQuiz(){ go('quiz'); $('qtitle').textContent=Q.title; renderQ(); }
function renderQ(){
  const q=Q.qs[Q.i]; sel=null; $('count').textContent=`Question ${Q.i+1} of ${Q.qs.length}`; $('fill').style.width=(Q.i/Q.qs.length*100)+'%';
  $('cat').textContent=q.c; $('qtext').textContent=q.q;
  $('qsay').onclick=()=>spk($('qsay'),qSpeechText(q));
  $('opts').innerHTML='';
  q.o.forEach((t,n)=>{ const b=document.createElement('button'); b.className='opt'; b.innerHTML=`<b>${'ABCD'[n]}</b><span>${t}</span>`; b.onclick=()=>{sel=n;[...$('opts').children].forEach((c,m)=>c.classList.toggle('sel',m===n));$('check').disabled=false;}; $('opts').appendChild(b); });
  $('why').style.display='none'; $('check').disabled=true; $('check').classList.remove('hidden'); $('next').classList.add('hidden');
  $('check').textContent=Q.feedback?'Check answer':(Q.i===Q.qs.length-1?'Finish test':'Next question');
}
function record(q,ok){ S.answered++; if(ok)S.correct++; S.cat[q.c]=S.cat[q.c]||{t:0,c:0,seen:{}}; S.cat[q.c].t++; if(ok)S.cat[q.c].c++; S.cat[q.c].seen[q.id]=1; if(ok){ if(S.missed[q.id]){ S.missed[q.id]--; if(S.missed[q.id]<=0)delete S.missed[q.id]; } } else S.missed[q.id]=2; touchDay(); logDay(ok); save(); }
function check(){
  const q=Q.qs[Q.i], ok=sel===q.a; Q.ans.push({ok,sel}); record(q,ok);
  if(!Q.feedback){ next(); return; }
  [...$('opts').children].forEach((c,n)=>{ c.disabled=true; c.classList.remove('sel'); if(n===q.a)c.classList.add('right'); else if(n===sel)c.classList.add('wrong'); });
  const cheer=ok?pick(CHEER_OK):pick(CHEER_NO);
  $('why').className='why '+(ok?'ok':'no'); $('cheer').textContent=cheer; $('expl').textContent=(ok?'':'The answer is '+'ABCD'[q.a]+': '+q.o[q.a]+'. ')+q.e; $('why').style.display='block';
  $('wsay').onclick=()=>spk($('wsay'),cheer+' '+$('expl').textContent);
  if(ok)ding(); else soft();
  $('check').classList.add('hidden'); $('next').classList.remove('hidden'); $('next').textContent=Q.i===Q.qs.length-1?'See how I did':'Next question'; $('next').focus();
  checkRewards();
}
function next(){ Q.i++; if(Q.i<Q.qs.length)renderQ(); else finish(); }
function finish(){
  stopTimer(); const n=Q.ans.filter(a=>a.ok).length, tot=Q.ans.length, pct=Math.round(n/tot*100);
  if(Q.mode==='mock'){ S.mocks.push({d:today(),pct}); save(); }
  $('rtitle').textContent=Q.title;
  $('rhead').textContent=pct>=80?"Amazing work, Lexi!":pct>=60?"Really solid — you're learning this.":"Every one of these will come back around until it sticks. Good work showing up.";
  $('pct').textContent=pct+'%'; $('raw').textContent=`${n} of ${tot} right`;
  const cats={}; Q.qs.slice(0,tot).forEach((q,k)=>{cats[q.c]=cats[q.c]||{t:0,r:0};cats[q.c].t++;if(Q.ans[k].ok)cats[q.c].r++});
  $('bycat').innerHTML=Object.keys(cats).length>1?Object.entries(cats).sort((a,b)=>(a[1].r/a[1].t)-(b[1].r/b[1].t)).map(([c,v])=>`<div class="cs"><div class="l">${c}</div><div class="v">${v.r}/${v.t}</div><div class="t"><i style="width:${v.r/v.t*100}%"></i></div></div>`).join(''):'';
  $('review').innerHTML=Q.qs.slice(0,tot).map((q,k)=>`<div class="rv ${Q.ans[k].ok?'hit':'miss'}"><div class="cat">${q.c}</div>${q.q}<br><span class="muted">${Q.ans[k].ok?'You got it. ':'The answer: '+q.o[q.a]+'. '}${q.e}</span></div>`).join('');
  go('result'); if(pct>=80){confetti();fanfare();} checkRewards();
}
function confirmQuit(){ if(Q.ans&&Q.ans.length&&Q.ans.length<Q.qs.length){ if(confirm('Stop here and see how you did so far?')){ Q.qs=Q.qs.slice(0,Q.ans.length); finish(); } } else go('home'); }
let tmr=null;
function startTimer(){ stopTimer(); tick(); tmr=setInterval(()=>{Q.secs--; tick(); if(Q.secs<=0){ stopTimer(); Q.qs=Q.qs.slice(0,Q.ans.length||1); if(!Q.ans.length)Q.ans.push({ok:false,sel:null}); finish(); }},1000); }
function tick(){ if(Q.secs==null){$('timer').textContent='';return;} const m=Math.floor(Q.secs/60), s=Q.secs%60; $('timer').textContent=`${m}:${String(s).padStart(2,'0')}`; }
function stopTimer(){ if(tmr){clearInterval(tmr);tmr=null;} $('timer').textContent=''; }

// ---------- Flashcards ----------
let deck='Word parts', cq=[], cc=null;
function initCards(){ const decks=[...new Set(CARDS.map(c=>c.d))]; $('decks').innerHTML=decks.map(d=>`<button class="chip" style="${d===deck?'border-color:var(--accent);background:var(--accent-soft)':''}" onclick="setDeck('${d.replace(/'/g,"\\'")}')">${d}<span class="n">${CARDS.filter(c=>c.d===d).length}</span></button>`).join(''); buildQueue(); showCard(); }
function setDeck(d){ deck=d; initCards(); }
function buildQueue(){ const cards=CARDS.filter(c=>c.d===deck); const learning=cards.filter(c=>S.cards[c.id]===0), rest=cards.filter(c=>S.cards[c.id]!==0); cq=shuffle(learning).concat(shuffle(rest)); }
function showCard(){ if(!cq.length)buildQueue(); cc=cq.shift(); $('fc').classList.remove('flip'); $('cdeck').textContent=cc.d; $('cfront').textContent=cc.f; $('cback').textContent=cc.b; const known=CARDS.filter(c=>c.d===deck&&S.cards[c.id]===1).length; $('cpos').textContent=`${known}/${CARDS.filter(c=>c.d===deck).length} known`; }
function flipCard(){ $('fc').classList.toggle('flip'); }
function sayCard(ev){ ev.stopPropagation(); const flipped=$('fc').classList.contains('flip'); spk($('csay'),flipped?cc.f+'. '+cc.b:cc.f); }
function rate(ok){ S.cards[cc.id]=ok?1:0; touchDay(); save(); if(!ok)cq.splice(Math.min(3,cq.length),0,cc); flash(ok?pick(["Got it!","Locked in.","Yes!"]):"It'll come back soon — that's the plan.",ok); if(ok)ding(); setTimeout(showCard,150); }
function flash(t,ok){ const f=$('flash'); f.textContent=t; f.className='flash show '+(ok?'ok':'no'); clearTimeout(f._t); f._t=setTimeout(()=>f.className='flash',1100); }

// ---------- Lightning game (zen by default) ----------
let G=null;
function gameHome(){ $('gstart').classList.remove('hidden'); $('gplay').classList.add('hidden'); $('gover').classList.add('hidden'); $('gbests').textContent=S.bestStreak; $('gbest60').textContent=S.best60; }
function startGame(timed){ G={timed:!!timed,t:60,score:0,streak:0,n:0}; $('gstart').classList.add('hidden'); $('gover').classList.add('hidden'); $('gplay').classList.remove('hidden'); $('gtimer').style.display=timed?'':'none'; nextItem(); clearInterval(G.tm); if(timed){ G.tm=setInterval(()=>{G.t--; $('gtime').textContent=G.t; if(G.t<=0)endGame(false);},1000); } }
function nextItem(){ const it=pick(GAME_ITEMS); G.cur=it; $('gq').textContent=it[0];
  const others=shuffle(GAME_SYSTEMS.filter(s=>s!==it[1])).slice(0,3); const opts=shuffle([it[1],...others]);
  $('gbtns').innerHTML=opts.map(s=>`<button class="gb" onclick="gAnswer('${s.replace(/'/g,"\\'")}')">${s}</button>`).join('');
  $('gstreak').textContent=G.streak; $('gscore').textContent=G.score;
}
function gAnswer(s){ if(!G)return; const ok=s===G.cur[1]; G.n++;
  if(ok){ G.streak++; G.score+=10; if(G.streak>S.bestStreak){S.bestStreak=G.streak; save();} flash(G.streak>=5?'🔥 '+G.streak+' in a row!':pick(['Yes!','Quick!','Nice!']),true); ding(); }
  else { G.streak=0; flash(`${G.cur[0]} → ${G.cur[1]}`,false); soft(); }
  touchDay(); checkRewards(); nextItem();
}
function endGame(quiet){ if(G){clearInterval(G.tm);} if(quiet||!G){ G=null; go('home'); return; }
  $('gplay').classList.add('hidden'); $('gover').classList.remove('hidden'); $('gfinal').textContent=G.score;
  const nb=G.timed&&G.score>S.best60; if(nb){S.best60=G.score;} save();
  $('gmsg').textContent=nb?`New personal best, Lexi!`:`${G.n} answers this round. Best streak ever: ${S.bestStreak}.`;
  if(nb){confetti();fanfare();} G=null; gameHomeCounts();
}
function gameHomeCounts(){ $('gbests').textContent=S.bestStreak; $('gbest60').textContent=S.best60; }

// ---------- Rewards (unsigned) ----------
const REWARDS=[
 {id:'q25',n:25,l:'25 questions',m:"Twenty-five questions done! Starting is the hardest part, and it's already behind you. 🌱"},
 {id:'s3',streak:3,l:'3-day streak',m:"Three days in a row. That's not luck — that's a habit forming. ⭐"},
 {id:'q100',n:100,l:'100 questions',m:"One hundred questions! Your brain has officially met every body system. Treat yourself to something nice today. 🎉"},
 {id:'lab3',lab:3,l:'3 diagrams mastered',m:"Three diagrams labeled perfectly. You can SEE the anatomy now, not just read it. 🧠"},
 {id:'s7',streak:7,l:'7-day streak',m:"A full week, every single day. Quietly unstoppable. 💪"},
 {id:'m1',mocks:1,l:'First practice test',m:"You finished a full practice test — all fifty questions. Whatever the score, that took real focus. 🏅"},
 {id:'g10',gstreak:10,l:'Lightning streak of 10',m:"Ten lightning answers in a row! The names are becoming automatic. ⚡"},
 {id:'q250',n:250,l:'250 questions',m:"Two hundred and fifty questions. This is what mastery looks like while it's being built. 🏆"}
];
function labDone(){ return DIAGRAMS.filter(d=>S.lab[d.id]&&S.lab[d.id].perfect).length; }
function earned(r){ if(r.n)return S.answered>=r.n; if(r.streak)return streak()>=r.streak||(S.maxStreak||0)>=r.streak; if(r.mocks)return S.mocks.length>=r.mocks; if(r.lab)return labDone()>=r.lab; if(r.gstreak)return S.bestStreak>=r.gstreak; return false; }
function progressOf(r){ if(r.n)return `${Math.min(S.answered,r.n)}/${r.n} questions`; if(r.streak)return `${Math.min(streak(),r.streak)}/${r.streak} days`; if(r.mocks)return `${Math.min(S.mocks.length,r.mocks)}/${r.mocks} test`; if(r.lab)return `${Math.min(labDone(),r.lab)}/${r.lab} diagrams`; if(r.gstreak)return `best streak ${S.bestStreak}`; return ''; }
function renderRewards(){ S.maxStreak=Math.max(S.maxStreak||0,streak()); $('rwlist').innerHTML=REWARDS.map(r=>{ const ok=earned(r); if(ok&&!S.unlocked[r.id]){S.unlocked[r.id]=today();save();} const u=!!S.unlocked[r.id]; return `<div class="rw ${u?'open':'locked'}"><div class="badge">${u?'★':'🔒'}</div><div><div class="cat">${r.l}</div><div class="msg">${u?r.m:r.m.replace(/[^ ]/g,'•')}</div><div class="prog">${u?'Unlocked '+S.unlocked[r.id]:progressOf(r)}</div></div></div>`; }).join(''); }
function checkRewards(){ S.maxStreak=Math.max(S.maxStreak||0,streak()); const fresh=REWARDS.filter(r=>!S.unlocked[r.id]&&earned(r)); if(fresh.length){ fresh.forEach(r=>S.unlocked[r.id]=today()); save(); confetti(); fanfare(); flash('🎉 You unlocked: '+fresh[0].l+'!',true); } }

// ---------- Backup / restore ----------
function backupCode(){ return 'LEXI1.'+btoa(unescape(encodeURIComponent(JSON.stringify(S)))); }
function copyBackup(){ const c=backupCode(); const done=()=>flash('Backup copied — save it somewhere safe',true); if(navigator.share){ navigator.share({title:'Lexi A&P backup',text:c}).then(done).catch(()=>{}); } else if(navigator.clipboard){ navigator.clipboard.writeText(c).then(done).catch(()=>prompt('Copy this backup code:',c)); } else prompt('Copy this backup code:',c); }
function restoreBackup(){ const c=prompt('Paste your backup code:'); if(!c)return; try{ const j=JSON.parse(decodeURIComponent(escape(atob(c.trim().replace(/^LEXI1\./,''))))); if(!j||typeof j.answered!=='number')throw 0; if(confirm(`Restore ${j.answered} answered questions and all progress? This replaces what's on this device.`)){ S=j; save(); location.reload(); } }catch(e){ alert("That code didn't work. A restore link is easier — ask for one!") } }
function tryLinkRestore(){
  const m=location.hash.match(/^#restore=(.+)$/); if(!m)return;
  history.replaceState(null,'',location.pathname+location.search);
  let j=null;
  try{ const raw=decodeURIComponent(m[1]).replace(/\s+/g,'').replace(/^LEXI1\./,''); j=JSON.parse(decodeURIComponent(escape(atob(raw)))); }catch(e){}
  if(!j||typeof j.answered!=='number'){ alert("That restore link didn't work — ask for a fresh one."); return; }
  if(confirm(`Restore ${j.answered} answered questions and all saved progress from this link? This replaces what's on this device.`)){ S=j; save(); location.reload(); }
}
function resetAll(){ if(confirm('Erase all progress on this device? This cannot be undone.')){ try{localStorage.removeItem(KEY)}catch(e){} location.reload(); } }
function setRate(v){ S.rate=parseFloat(v)||0.95; save(); }
function setBig(v){ S.big=!!v; save(); applyBig(); }
function applyBig(){ if(S.big)document.body.setAttribute('data-big',''); else document.body.removeAttribute('data-big'); }

// ---------- Sounds & confetti ----------
let AC=null; function tone(f,d,type='sine',g=.07){ if(!S.sound)return; try{ AC=AC||new (window.AudioContext||window.webkitAudioContext)(); const o=AC.createOscillator(), v=AC.createGain(); o.type=type; o.frequency.value=f; v.gain.value=g; o.connect(v); v.connect(AC.destination); o.start(); v.gain.exponentialRampToValueAtTime(.0001,AC.currentTime+d); o.stop(AC.currentTime+d);}catch(e){} }
function ding(){ tone(880,.12); setTimeout(()=>tone(1320,.18),90); }
function soft(){ tone(330,.15,'sine',.04); }
function fanfare(){ [523,659,784,1047].forEach((f,i)=>setTimeout(()=>tone(f,.25),i*110)); }
function confetti(){ if(!S.fx||matchMedia('(prefers-reduced-motion: reduce)').matches)return; const c=$('confetti'), x=c.getContext('2d'); c.width=innerWidth; c.height=innerHeight; const cols=['#0E8B7F','#55C2B4','#3E6C8C','#F5C451','#6FD198']; const P=Array.from({length:140},()=>({x:Math.random()*c.width,y:-20-Math.random()*c.height*.5,r:4+Math.random()*6,c:pick(cols),vy:2+Math.random()*3,vx:(Math.random()-.5)*2,a:Math.random()*6.3,va:(Math.random()-.5)*.3})); let t=0; (function f(){ x.clearRect(0,0,c.width,c.height); P.forEach(p=>{p.y+=p.vy;p.x+=p.vx;p.a+=p.va; x.save(); x.translate(p.x,p.y); x.rotate(p.a); x.fillStyle=p.c; x.fillRect(-p.r/2,-p.r/4,p.r,p.r/2); x.restore();}); if(++t<170)requestAnimationFrame(f); else x.clearRect(0,0,c.width,c.height); })(); }

applyBig();
renderHome();
tryLinkRestore();
