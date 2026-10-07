// Voice study: 5 questions read aloud; Lexi answers by speaking ("B", "option C",
// or the words of the answer). Tapping always works too. Reuses app.js speak().
const SR=window.SpeechRecognition||window.webkitSpeechRecognition;

let V={on:false,phase:'idle',rec:null,cat:null,qs:[],i:0,ans:[],doneQs:[],ending:false,micBlocked:false};

function vOrb(state,label){ const o=$('vorb'); o.className='vorb'+(state?' '+state:''); $('vstate').textContent=label||''; }
function vHeard(t){ $('vheard').textContent=t||''; }
function vStopRec(){ if(V.rec){ try{V.rec.onend=null;V.rec.onresult=null;V.rec.onerror=null;V.rec.abort();}catch(e){} V.rec=null; } }
function voiceStopAll(){ V.on=false; V.phase='idle'; vStopRec(); stopSpeak(); }
function voiceLeave(){ if(V.ending){ V.ending=false; V.on=false; V.phase='idle'; vStopRec(); return; } if(V.on)voiceStopAll(); }

function vSpeak(text,cb){ V.phase='speaking'; vOrb('speaking','Reading…'); speak(text,()=>{ if(V.on||V.ending){ if(cb)cb(); } }); }

function renderVoice(){
  V.on=false; V.phase='idle';
  $('vsetup').classList.remove('hidden'); $('vplay').classList.add('hidden'); $('vscore').textContent='';
  const sup=$('vsupport');
  if(!HAS_TTS){ sup.style.display='block'; sup.innerHTML='<b>Heads up:</b> this browser can\'t speak out loud, so voice study won\'t work here. Try Safari or Chrome.'; }
  else if(!SR){ sup.style.display='block'; sup.innerHTML='<b>Heads up:</b> this browser can\'t hear answers. I\'ll still read every question out loud — just tap your answer instead of speaking.'; }
  else sup.style.display='none';
  const cats=[...new Set(BANK.map(q=>q.c))];
  const chipFor=(label,qs,onclick)=>{
    const done=qs.filter(q=>S.vq[q.id]!=null), right=done.filter(q=>S.vq[q.id]===1);
    const full=done.length===qs.length&&qs.length>0;
    const n=full?('✓ '+Math.round(right.length/qs.length*100)+'%'):(done.length?done.length+'/'+qs.length:qs.length);
    return `<button class="chip${full?' done':''}" onclick="${onclick}">${label}<span class="n">${n}</span></button>`;
  };
  $('vtopics').innerHTML=chipFor('A little of everything',BANK,"startVoice(null)")+
    cats.map(c=>chipFor(c,BANK.filter(q=>q.c===c),`startVoice('${c.replace(/'/g,"\\'")}')`)).join('');
}
function startVoice(cat){
  if(!HAS_TTS){ alert("This browser can't speak out loud. Try Safari or Chrome."); return; }
  const pool=BANK.filter(q=>!cat||q.c===cat);
  const fresh=shuffle(pool.filter(q=>S.vq[q.id]==null));
  const seen=pool.filter(q=>S.vq[q.id]!=null);
  const n=Math.min(5,pool.length);
  const qs=fresh.slice(0,n).concat(weightedPick(Math.max(0,n-fresh.length),seen));
  V={on:true,phase:'idle',rec:null,cat,qs,i:0,ans:[],doneQs:[],ending:false,micBlocked:false};
  $('vsetup').classList.add('hidden'); $('vplay').classList.remove('hidden');
  vAsk();
}
function vRenderQ(){
  const q=V.qs[V.i];
  $('vscore').textContent=`${V.ans.filter(a=>a.ok).length}/${V.ans.length}`;
  $('vcat').textContent=`${q.c} · question ${V.i+1} of ${V.qs.length}`;
  $('vqtext').textContent=q.q; $('vwhy').style.display='none'; vHeard('');
  $('vopts').innerHTML='';
  q.o.forEach((t,n)=>{ const b=document.createElement('button'); b.className='opt'; b.innerHTML=`<b>${'ABCD'[n]}</b><span>${t}</span>`; b.onclick=()=>vAnswer(n); $('vopts').appendChild(b); });
}
function vScript(){ const q=V.qs[V.i]; return `Question ${V.i+1}. `+qSpeechText(q); }
function vAsk(){ vRenderQ(); vSpeak(vScript(),vListen); }
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
  r.onerror=e=>{ if(e.error==='not-allowed'||e.error==='service-not-allowed'){ V.micBlocked=true; vOrb('listening','Mic blocked — tap your answer'); vStopRec(); } };
  r.onend=()=>{ V.rec=null; if(V.on&&V.phase==='listening'&&!V.micBlocked){ setTimeout(()=>{ if(V.on&&V.phase==='listening')vListen(); },250); } };
  try{ r.start(); }catch(e){}
}
const V_LETTERS={a:['a','ay','eh','hey','hay','alpha'],b:['b','be','bee','bravo'],c:['c','see','sea','si','charlie'],d:['d','dee','de','delta']};
const V_NUMS={one:0,'1':0,first:0,two:1,'2':1,second:1,three:2,'3':2,third:2,four:3,'4':3,fourth:3};
function vParse(raw){
  if(V.phase!=='listening')return;
  const t=raw.toLowerCase().replace(/[^a-z0-9\s]/g,' ').replace(/\s+/g,' ').trim();
  if(!t)return;
  const q=V.qs[V.i], nOpts=q.o.length;
  if(/\b(stop|quit|exit|end (the )?session|finish|i m done|im done)\b/.test(t)){ voiceEnd(); return; }
  if(/\b(skip|pass|next question)\b/.test(t)){ voiceSkip(); return; }
  if(/\b(choices|options)\b/.test(t)&&!/\b(answer|option) [a-d]\b/.test(t)){ voiceOptions(); return; }
  if(/\b(repeat|again|one more time|say that)\b/.test(t)){ voiceRepeat(); return; }
  let m=t.match(/\b(?:option|answer|letter|choice|number)\s+([a-d]|one|two|three|four|[1-4])\b/);
  if(m){ const k=m[1]; const n=(k.length===1&&/[a-d]/.test(k))?'abcd'.indexOf(k):V_NUMS[k]; if(n!=null&&n<nOpts){ vAnswer(n); return; } }
  const words=t.split(' ');
  if(words.length<=3){
    for(const [LT,alts] of Object.entries(V_LETTERS)){
      const n='abcd'.indexOf(LT); if(n>=nOpts)continue;
      if(alts.includes(t)||(words.length<=2&&alts.some(a=>words.includes(a)&&a.length>1))||(words.length===1&&alts.includes(words[0]))){ vAnswer(n); return; }
    }
  }
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
  if(V.phase==='speaking'){ stopSpeak(); }
  V.phase='feedback'; vStopRec();
  const q=V.qs[V.i], ok=n===q.a;
  S.vq[q.id]=ok?1:0;
  V.ans.push({ok,sel:n}); V.doneQs.push(q);
  record(q,ok);
  [...$('vopts').children].forEach((c,m)=>{ c.disabled=true; if(m===q.a)c.classList.add('right'); else if(m===n)c.classList.add('wrong'); });
  $('vwhy').className='why '+(ok?'ok':'no'); $('vcheer').textContent=ok?pick(CHEER_OK):pick(CHEER_NO); $('vexpl').textContent=(ok?'':'The answer is '+'ABCD'[q.a]+': '+q.o[q.a]+'. ')+q.e; $('vwhy').style.display='block';
  $('vscore').textContent=`${V.ans.filter(a=>a.ok).length}/${V.ans.length}`;
  if(ok)ding(); else soft();
  vOrb('speaking','Reading…');
  const fb=(ok?`Correct! `:`Not quite — and that's okay. The answer is ${'ABCD'[q.a]}: ${q.o[q.a]}. `)+q.e;
  V.phase='feedback';
  speak(fb,()=>{ if(!V.on)return; setTimeout(vNext,600); });
  checkRewards();
}
function vNext(){ if(!V.on)return; V.i++; if(V.i<V.qs.length)vAsk(); else voiceEnd(); }
function voiceRepeat(){ if(!V.on||V.phase==='feedback')return; vStopRec(); vSpeak(vScript(),vListen); }
function voiceOptions(){ if(!V.on||V.phase==='feedback')return; vStopRec(); const q=V.qs[V.i]; vSpeak('The choices are. '+q.o.map((t,n)=>`${'ABCD'[n]}. ${t}.`).join(' '),vListen); }
function voiceSkip(){ if(!V.on||V.phase==='feedback')return; vStopRec(); vSpeak('Skipping.',()=>{ if(!V.on)return; V.i++; if(V.i<V.qs.length)vAsk(); else voiceEnd(); }); }
function voiceEnd(){
  if(!V.on)return;
  vStopRec();
  const n=V.ans.filter(a=>a.ok).length, tot=V.ans.length;
  if(!tot){ voiceStopAll(); go('home'); return; }
  V.on=false; V.ending=true;
  Q={mode:'voice',title:'Voice study'+(V.cat?' — '+V.cat:''),qs:V.doneQs.slice(),i:tot,ans:V.ans.slice(),feedback:true};
  const cat=V.cat; $('again').onclick=()=>{ go('voice'); startVoice(cat); };
  speak(`That's the session, Lexi. You got ${n} out of ${tot}. ${n>=tot*0.8?'Wonderful work!':n>=tot*0.6?'Really solid.':'Every round makes it stick a little more.'}`);
  finish();
}
