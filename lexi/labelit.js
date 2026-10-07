// Label It: interactive anatomy diagrams. Learn mode = tap anything to hear
// what it is. Quiz mode = "tap the ___", with gentle retries and no clock.
let L=null;

function labStat(d){ const s=S.lab[d.id]; if(!s)return null; return s; }
function renderLabelHome(){
  $('dview').classList.add('hidden'); $('dlist').classList.remove('hidden'); L=null;
  $('dchips').innerHTML=DIAGRAMS.map(d=>{
    const s=labStat(d); let n=d.parts.length+' parts', cls='';
    if(s){ n=(s.perfect?'✓ ':'')+s.best+'%'; if(s.perfect)cls=' done'; }
    return `<button class="chip${cls}" onclick="openDiagram('${d.id}')">${d.name}<span class="n">${n}</span></button>`;
  }).join('');
}
function openDiagram(id){
  const d=DIAGRAMS.find(x=>x.id===id); if(!d)return;
  L={d,mode:'learn',order:[],i:0,right:0,tries:0};
  $('dlist').classList.add('hidden'); $('dview').classList.remove('hidden');
  $('dtitle').textContent=d.name;
  $('dimg').innerHTML=`<svg viewBox="${d.vb}" role="img" aria-label="${d.name}">${d.art||''}${d.parts.map(p=>`<g class="dpart" data-p="${p.id}">${p.s}</g>`).join('')}</svg>`;
  [...$('dimg').querySelectorAll('.dpart')].forEach(g=>{ g.onclick=()=>tapPart(g.dataset.p); });
  $('dnote2').textContent=d.note||'';
  setLabelMode('learn');
}
function clearMarks(){ [...$('dimg').querySelectorAll('.dpart')].forEach(g=>g.classList.remove('hl','right','wrong')); }
function setLabelMode(m){
  L.mode=m; clearMarks(); stopSpeak();
  $('mlearn').classList.toggle('ghost',m!=='learn'); $('mquiz').classList.toggle('ghost',m!=='quiz');
  if(m==='learn'){
    $('dprompt').textContent='Tap any part to meet it.';
    cap('', L.d.intro);
    speak(L.d.name+'. '+L.d.intro+' Tap any part to hear what it is.');
  } else {
    L.order=shuffle(L.d.parts.map(p=>p.id)); L.i=0; L.right=0; L.tries=0;
    askPart();
  }
}
function cap(name,about){ $('dname').textContent=name; $('dabout').textContent=about;
  $('dsay').onclick=()=>spk($('dsay'),(name?name+'. ':'')+about);
}
function curPart(){ return L.d.parts.find(p=>p.id===L.order[L.i]); }
function askPart(){
  clearMarks(); L.tries=0;
  const p=curPart();
  $('dprompt').textContent=`Tap the: ${p.n}  (${L.i+1} of ${L.order.length})`;
  cap('', 'Take your time — there is no clock.');
  speak('Tap the '+p.n+'.');
}
function tapPart(id){
  if(!L)return;
  const part=L.d.parts.find(p=>p.id===id);
  if(L.mode==='learn'){
    clearMarks();
    const g=$('dimg').querySelector(`[data-p="${id}"]`); g.classList.add('hl');
    cap(part.n,part.say);
    speak(part.say);
    return;
  }
  // quiz mode
  const want=curPart();
  if(id===want.id){
    const g=$('dimg').querySelector(`[data-p="${id}"]`); clearMarks(); g.classList.add('right');
    if(L.tries===0)L.right++;
    ding(); cap(want.n,want.say);
    speak(L.tries===0?pick(['Yes!','That\'s it!','You found it!'])+' '+want.n+'.':want.n+'. '+want.say);
    L.i++;
    setTimeout(()=>{ if(!L||L.mode!=='quiz')return; if(L.i<L.order.length)askPart(); else labelDone(); },1400);
  } else {
    L.tries++;
    const g=$('dimg').querySelector(`[data-p="${id}"]`); g.classList.add('wrong'); soft();
    setTimeout(()=>g.classList.remove('wrong'),700);
    if(L.tries===1){
      cap(part.n,'That one is the '+part.n.toLowerCase()+'. Try once more — where is the '+want.n.toLowerCase()+'?');
      speak('That\'s the '+part.n+'. Try once more — tap the '+want.n+'.');
    } else {
      const w=$('dimg').querySelector(`[data-p="${want.id}"]`); clearMarks(); w.classList.add('right');
      cap(want.n,want.say);
      speak('Here it is — the '+want.n+'. '+want.say);
      L.i++;
      setTimeout(()=>{ if(!L||L.mode!=='quiz')return; if(L.i<L.order.length)askPart(); else labelDone(); },2300);
    }
  }
}
function labelDone(){
  const tot=L.order.length, pct=Math.round(L.right/tot*100), perfect=L.right===tot;
  const prev=S.lab[L.d.id]||{best:0};
  S.lab[L.d.id]={best:Math.max(prev.best||0,pct),perfect:!!(prev.perfect||perfect)};
  touchDay(); save();
  clearMarks();
  $('dprompt').textContent=perfect?'Perfect! Every part on the first try! 🎉':`You found ${L.right} of ${tot} on the first try.`;
  cap('', perfect?'This diagram is yours now.':'Run the quiz again any time — it only gets easier.');
  speak(perfect?('Perfect, Lexi! You found every part of '+L.d.name+' on the first try!'):('Nice work. '+L.right+' of '+tot+' on the first try. Each round makes it stick a little more.'));
  if(perfect){confetti();fanfare();}
  checkRewards();
}
