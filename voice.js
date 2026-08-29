// Voice study: the app reads each question and its choices out loud, then
// listens for a spoken answer ("B", "option C", or the words of the choice).
// Speech synthesis and recognition are both stopped whenever the user leaves
// the section. Tapping a choice always works as a fallback.
const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
const HAS_TTS='speechSynthesis' in window;
if(S.voiceRate==null)S.voiceRate=1;

let V={on:false,phase:'idle',rec:null,cat:null,qs:[],i:0,ans:[],doneQs:[],ending:false,micBlocked:false};

function setVoiceRate(v){ S.voiceRate=parseFloat(v)||1; save(); }

function vOrb(state,label){ const o=$('vorb'); o.className='vorb'+(state?' '+state:''); $('vstate').textContent=label||''; }
function vHeard(t){ $('vheard').textContent=t||''; }

function vStopRec(){ if(V.rec){ try{V.rec.onend=null;V.rec.onresult=null;V.rec.onerror=null;V.rec.abort();}catch(e){} V.rec=null; } }
function voiceStopAll(){ V.on=false; V.phase='idle'; vStopRec(); if(HAS_TTS){ try{speechSynthesis.cancel()}catch(e){} } }
function voiceLeave(){ if(V.ending){ V.ending=false; V.on=false; V.phase='idle'; vStopRec(); return; } voiceStopAll(); }

// Chunked TTS: long utterances can stall on some browsers, so split by sentence.
// SPEAK_ID guards against stale onend callbacks from utterances cancelled by a
// newer speak() call, which would otherwise interleave old and new speech.
let SPEAK_ID=0;
function speak(text,cb){
  if(!HAS_TTS){ if(cb)cb(); return; }
  const sid=++SPEAK_ID;
  try{speechSynthesis.cancel()}catch(e){}
  const parts=String(text).match(/[^.!?]+[.!?]*/g)||[String(text)];
  let k=0; V.phase='speaking'; vOrb('speaking','Reading…');
  const sayNext=()=>{
    if(sid!==SPEAK_ID)return;
    if(!V.on&&!V.ending){ return; }
    if(k>=parts.length){ if(cb)cb(); return; }
    const u=new SpeechSynthesisUtterance(parts[k++].trim());
    u.lang='en-US'; u.rate=S.voiceRate||1;
    u.onend=sayNext; u.onerror=sayNext;
    speechSynthesis.speak(u);
  };
  sayNext();
}

function renderVoice(){
  V.on=false; V.phase='idle';
  $('vsetup').classList.remove('hidden'); $('vplay').classList.add('hidden'); $('vscore').textContent='';
  $('vrate').value=String(S.voiceRate||1);
  const sup=$('vsupport');
  if(!HAS_TTS){ sup.style.display='block'; sup.innerHTML='<b>Heads up:</b> this browser can’t speak out loud, so voice study won’t work here. Try Safari on your iPhone or Chrome.'; }
  else if(!SR){ sup.style.display='block'; sup.innerHTML='<b>Heads up:</b> this browser can’t hear you answer. I’ll still read every question out loud — just tap your answer instead of speaking.'; }
  else sup.style.display='none';
  const pool=BANK.filter(q=>!q.t&&!q.stem);
  const cats=[...new Set(pool.map(q=>q.c))];
  $('vtopics').innerHTML='<button class="chip" onclick="startVoice(null)">Mixed — everything<span class="n">10</span></button>'+
    cats.map(c=>`<button class="chip" onclick="startVoice('${c.replace(/'/g,"\\'")}')">${c}<span class="n">${pool.filter(q=>q.c===c).length}</span></button>`).join('');
}

function startVoice(cat){
  if(!HAS_TTS){ alert("This browser can't speak out loud. Try Safari or Chrome."); return; }
  const pool=BANK.filter(q=>!q.t&&!q.stem&&(!cat||q.c===cat));
  if(!pool.length){ alert('No spoken questions for that topic yet.'); return; }
  V={on:true,phase:'idle',rec:null,cat,qs:weightedPick(Math.min(10,pool.length),pool),i:0,ans:[],doneQs:[],ending:false,micBlocked:false};
  $('vsetup').classList.add('hidden'); $('vplay').classList.remove('hidden');
  vAsk();
}

function vRenderQ(){
  const q=V.qs[V.i];
  $('vscore').textContent=`${V.ans.filter(a=>a.ok).length}/${V.ans.length}`;
  $('vcat').textContent=`${q.c} · question ${V.i+1} of ${V.qs.length}`;
  $('vqtext').textContent=q.q; $('vwhy').style.display='none'; vHeard('');
  $('vopts').innerHTML='';
  q.o.forEach((t,n)=>{ const b=document.createElement('button'); b.className='opt'; b.innerHTML=`<b>${'ABCDEF'[n]}</b><span>${t}</span>`; b.onclick=()=>vAnswer(n); $('vopts').appendChild(b); });
}

function vQuestionScript(){
  const q=V.qs[V.i];
  return `Question ${V.i+1}. ${q.q} `+q.o.map((t,n)=>`${'ABCDEF'[n]}. ${t}.`).join(' ');
}
function vAsk(){
  vRenderQ();
  speak(vQuestionScript(),vListen);
}
function vOptionsScript(){ const q=V.qs[V.i]; return 'The choices are. '+q.o.map((t,n)=>`${'ABCDEF'[n]}. ${t}.`).join(' '); }

function vListen(){
  if(!V.on)return;
  V.phase='listening';
  if(!SR||V.micBlocked){ vOrb('listening','Tap your answer'); return; }
  vOrb('listening','Listening… say A, B, C, or D');
  vStopRec();
  const r=new SR(); V.rec=r;
  r.lang='en-US'; r.interimResults=true; r.continuous=false; r.maxAlternatives=3;
  r.onresult=e=>{
    let fin='',intr='';
    for(let i=e.resultIndex;i<e.results.length;i++){ const t=e.results[i][0].transcript; if(e.results[i].isFinal)fin+=t; else intr+=t; }
    if(intr)vHeard('“'+intr.trim()+'”');
    if(fin){ vHeard('“'+fin.trim()+'”'); vParse(fin); }
  };
  r.onerror=e=>{
    if(e.error==='not-allowed'||e.error==='service-not-allowed'){ V.micBlocked=true; vOrb('listening','Mic blocked — tap your answer'); vStopRec(); }
  };
  r.onend=()=>{ V.rec=null; if(V.on&&V.phase==='listening'&&!V.micBlocked){ setTimeout(()=>{ if(V.on&&V.phase==='listening')vListen(); },250); } };
  try{ r.start(); }catch(e){}
}

const V_LETTERS={a:['a','ay','eh','hey','hay','alpha'],b:['b','be','bee','bravo'],c:['c','see','sea','si','charlie'],d:['d','dee','de','delta'],e:['e','ee','echo'],f:['f','ef','eff','foxtrot']};
const V_NUMS={one:0,'1':0,first:0,two:1,'2':1,second:1,three:2,'3':2,third:2,four:3,'4':3,fourth:3,five:4,'5':4,fifth:4,six:5,'6':5,sixth:5};
function vParse(raw){
  if(V.phase!=='listening')return;
  const t=raw.toLowerCase().replace(/[^a-z0-9\s]/g,' ').replace(/\s+/g,' ').trim();
  if(!t)return;
  const q=V.qs[V.i], nOpts=q.o.length;
  // commands
  if(/\b(stop|quit|exit|end (the )?session|finish|i m done|im done)\b/.test(t)){ voiceEnd(); return; }
  if(/\b(skip|pass|next question)\b/.test(t)){ voiceSkip(); return; }
  if(/\b(choices|options)\b/.test(t)&&!/\b(answer|option) [a-f]\b/.test(t)){ voiceOptions(); return; }
  if(/\b(repeat|again|one more time|say that)\b/.test(t)){ voiceRepeat(); return; }
  // "option b" / "answer c" / "letter d" / "number two"
  let m=t.match(/\b(?:option|answer|letter|choice|number)\s+([a-f]|one|two|three|four|five|six|[1-6])\b/);
  if(m){ const k=m[1]; const n=(k.length===1&&/[a-f]/.test(k))?'abcdef'.indexOf(k):V_NUMS[k]; if(n!=null&&n<nOpts){ vAnswer(n); return; } }
  // a bare letter or its homophone as the whole (short) utterance
  const words=t.split(' ');
  if(words.length<=3){
    for(const [L,alts] of Object.entries(V_LETTERS)){
      const n='abcdef'.indexOf(L); if(n>=nOpts)continue;
      if(alts.includes(t)||(words.length<=2&&alts.some(a=>words.includes(a)&&a.length>1))||(words.length===1&&alts.includes(words[0]))){ vAnswer(n); return; }
    }
  }
  // fuzzy: match the words of the transcript against a choice's words
  const sig=s=>s.toLowerCase().replace(/[^a-z\s]/g,' ').split(/\s+/).filter(w=>w.length>=4);
  const heard=new Set(sig(t));
  if(heard.size){
    const scores=q.o.map(o=>{const w=sig(o);return w.filter(x=>heard.has(x)).length;});
    const best=Math.max(...scores);
    if(best>=2&&scores.filter(s=>s===best).length===1){ vAnswer(scores.indexOf(best)); return; }
  }
  vOrb('listening',"Didn't catch that — say A, B, C, or D");
}

function vAnswer(n){
  if(!V.on||(V.phase!=='listening'&&V.phase!=='speaking'))return;
  if(V.phase==='speaking'){ try{speechSynthesis.cancel()}catch(e){} }
  V.phase='feedback'; vStopRec();
  const q=V.qs[V.i], ok=n===q.a;
  V.ans.push({ok,sel:n}); V.doneQs.push(q);
  record(q,ok); logDay(ok); save();
  [...$('vopts').children].forEach((c,m)=>{ c.disabled=true; if(m===q.a)c.classList.add('right'); else if(m===n)c.classList.add('wrong'); });
  $('vwhy').className='why '+(ok?'ok':'no'); $('vcheer').textContent=ok?pick(CHEER_OK):pick(CHEER_NO); $('vexpl').textContent=(ok?'':'Correct answer: '+'ABCDEF'[q.a]+'. ')+q.e; $('vwhy').style.display='block';
  $('vscore').textContent=`${V.ans.filter(a=>a.ok).length}/${V.ans.length}`;
  if(ok)ding(); else buzz();
  vOrb('speaking','Reading…');
  const fb=(ok?`Correct! `:`Not quite. The answer is ${'ABCDEF'[q.a]}: ${q.o[q.a]}. `)+q.e;
  speak(fb,()=>{ if(!V.on)return; setTimeout(vNext,500); });
  checkRewards();
}
function vNext(){ if(!V.on)return; V.i++; if(V.i<V.qs.length)vAsk(); else voiceEnd(); }

function voiceRepeat(){ if(!V.on||V.phase==='feedback')return; vStopRec(); speak(vQuestionScript(),vListen); }
function voiceOptions(){ if(!V.on||V.phase==='feedback')return; vStopRec(); speak(vOptionsScript(),vListen); }
function voiceSkip(){ if(!V.on||V.phase==='feedback')return; vStopRec(); speak('Skipping.',()=>{ if(!V.on)return; V.i++; if(V.i<V.qs.length)vAsk(); else voiceEnd(); }); }
function voiceEnd(){
  if(!V.on)return;
  vStopRec();
  const n=V.ans.filter(a=>a.ok).length, tot=V.ans.length;
  if(!tot){ voiceStopAll(); go('home'); return; }
  V.on=false; V.ending=true;
  Q={mode:'voice',title:'Voice study'+(V.cat?' — '+V.cat:''),qs:V.doneQs.slice(),i:tot,ans:V.ans.slice(),feedback:true};
  const cat=V.cat; $('again').onclick=()=>{ go('voice'); startVoice(cat); };
  speak(`That's the session. You got ${n} out of ${tot}. ${n>=tot*0.8?"That's exam-ready work, Tina.":n>=tot*0.65?'Solid work — keep going.':"Good effort. Now we know what to work on."}`);
  finish();
}
