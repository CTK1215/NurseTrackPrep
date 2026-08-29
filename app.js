const CARDS = [
 ["Lab values","Potassium (K+)","3.5 – 5.0 mEq/L"],["Lab values","Sodium (Na+)","135 – 145 mEq/L"],["Lab values","Calcium (total)","8.5 – 10.5 mg/dL"],["Lab values","Magnesium","1.5 – 2.5 mg/dL"],["Lab values","Chloride","95 – 105 mEq/L"],["Lab values","Phosphorus","2.5 – 4.5 mg/dL"],
 ["Lab values","BUN","10 – 20 mg/dL"],["Lab values","Creatinine","0.6 – 1.2 mg/dL"],["Lab values","Fasting glucose","70 – 100 mg/dL"],["Lab values","Hemoglobin A1c goal (diabetic)","Below 7%"],
 ["Lab values","Hemoglobin","Women 12 – 16 g/dL · Men 14 – 18 g/dL"],["Lab values","Hematocrit","Women 37 – 47% · Men 42 – 52%"],["Lab values","WBC","5,000 – 10,000/mm³"],["Lab values","Platelets","150,000 – 400,000/mm³"],
 ["Lab values","INR on warfarin (target)","2.0 – 3.0 (2.5 – 3.5 for mechanical valves)"],["Lab values","aPTT on heparin (target)","1.5 – 2.5 × control (about 46 – 70 sec)"],["Lab values","Albumin","3.5 – 5.0 g/dL"],["Lab values","Urine specific gravity","1.005 – 1.030"],
 ["Lab values","Arterial pH","7.35 – 7.45"],["Lab values","PaCO2","35 – 45 mm Hg"],["Lab values","HCO3 (bicarbonate)","22 – 26 mEq/L"],["Lab values","PaO2","80 – 100 mm Hg"],["Lab values","Digoxin therapeutic level","0.5 – 2.0 ng/mL"],["Lab values","Lithium therapeutic level","0.6 – 1.2 mEq/L"],["Lab values","Phenytoin therapeutic level","10 – 20 mcg/mL"],
 ["Antidotes","Antidote: heparin","Protamine sulfate"],["Antidotes","Antidote: warfarin","Vitamin K (phytonadione)"],["Antidotes","Antidote: opioids","Naloxone"],["Antidotes","Antidote: benzodiazepines","Flumazenil"],["Antidotes","Antidote: acetaminophen","Acetylcysteine"],["Antidotes","Antidote: magnesium sulfate toxicity","Calcium gluconate"],["Antidotes","Antidote: digoxin toxicity","Digoxin immune Fab (Digibind)"],["Antidotes","First-line drug for anaphylaxis","Epinephrine IM"],["Antidotes","Treatment: severe hypoglycemia, can't swallow","IV dextrose 50% or glucagon IM"],
 ["Drug facts","Hold digoxin if apical pulse is…","Below 60/min (adult) — and check K+ level"],["Drug facts","Insulin that can be given IV","Regular insulin only"],["Drug facts","Mixing insulins: draw up first","Regular (clear) before NPH (cloudy)"],["Drug facts","Rapid-acting insulin (lispro) peak","1 – 3 hours; eat within 15 min of dose"],["Drug facts","NPH insulin peak","4 – 12 hours; watch for afternoon hypoglycemia"],["Drug facts","Lithium: what raises the level?","Dehydration and low sodium intake"],["Drug facts","MAOIs: avoid which foods?","Tyramine: aged cheese, cured meats, red wine, soy"],["Drug facts","ACE inhibitor hallmark side effects","Dry cough, hyperkalemia, angioedema"],["Drug facts","Aminoglycosides (gentamicin) toxicities","Ototoxicity and nephrotoxicity"],["Drug facts","Vancomycin infused too fast causes…","Red man syndrome — slow the rate"],["Drug facts","IV potassium rule","Never IV push; always dilute and use a pump"],["Drug facts","Nitroglycerin SL dosing","1 tab q5min × 3 max; call EMS if unrelieved"],["Drug facts","Tetracyclines: avoid with…","Dairy, antacids, iron; use sunscreen"],["Drug facts","Levothyroxine timing","Empty stomach, morning, same time daily"],["Drug facts","Opioid side effect with no tolerance","Constipation — start a bowel regimen"],
 ["Isolation","Airborne precautions diseases","TB, measles, varicella, disseminated zoster — N95 + negative pressure"],["Isolation","Droplet precautions diseases","Flu, meningitis, pertussis, mumps, rubella — surgical mask"],["Isolation","Contact precautions diseases","MRSA, VRE, C. diff, RSV, scabies — gown + gloves"],["Isolation","C. diff hand hygiene","Soap and water (alcohol gel doesn't kill spores)"],["Isolation","Order for removing PPE","Gloves → goggles → gown → mask"],["Isolation","Order for putting on PPE","Gown → mask → goggles → gloves"],
 ["Quick rules","Fire: RACE","Rescue · Alarm · Confine · Extinguish"],["Quick rules","Extinguisher: PASS","Pull · Aim · Squeeze · Sweep"],["Quick rules","Hypoglycemia: rule of 15","15 g carb → recheck in 15 min → repeat if <70"],["Quick rules","Cane goes on which side?","Strong side; moves with the weak leg"],["Quick rules","Crutches on stairs","Up with the good, down with the bad"],["Quick rules","Reposition immobile client every…","2 hours"],["Quick rules","Max IM volume, deltoid","1 mL (ventrogluteal up to 3 mL)"],["Quick rules","1 kg weight change equals…","About 1 liter of fluid"],["Quick rules","Two acceptable client identifiers","Name + date of birth (never room number)"],["Quick rules","Neutropenic fever threshold","100.4°F / 38°C — report immediately"],["Quick rules","Pressure injury stage 3 vs 4","3 = fat visible · 4 = bone/tendon/muscle"],["Quick rules","Earliest sign of increased ICP","Change in level of consciousness"],["Quick rules","Signs of hypocalcemia","Tingling, tetany, Chvostek & Trousseau signs"],["Quick rules","Signs of hyperkalemia on ECG","Tall peaked T waves, wide QRS"],["Quick rules","Signs of hypokalemia","Weakness, constipation, flat T waves, U waves"],["Quick rules","Abdominal assessment order","Inspect → Auscultate → Percuss → Palpate"]
].map((c,i)=>({id:i,d:c[0],f:c[1],b:c[2]}));

const LABS = [
 {n:"Potassium",u:"mEq/L",lo:3.5,hi:5.0,step:.1,span:2},{n:"Sodium",u:"mEq/L",lo:135,hi:145,step:1,span:15},{n:"Calcium",u:"mg/dL",lo:8.5,hi:10.5,step:.1,span:3},{n:"Magnesium",u:"mg/dL",lo:1.5,hi:2.5,step:.1,span:1.5},
 {n:"BUN",u:"mg/dL",lo:10,hi:20,step:1,span:25},{n:"Creatinine",u:"mg/dL",lo:0.6,hi:1.2,step:.1,span:2},{n:"Fasting glucose",u:"mg/dL",lo:70,hi:100,step:1,span:90},{n:"Hemoglobin (female)",u:"g/dL",lo:12,hi:16,step:.1,span:5},
 {n:"Platelets",u:"/mm³",lo:150000,hi:400000,step:1000,span:120000},{n:"WBC",u:"/mm³",lo:5000,hi:10000,step:100,span:6000},{n:"Arterial pH",u:"",lo:7.35,hi:7.45,step:.01,span:.15},{n:"PaCO2",u:"mm Hg",lo:35,hi:45,step:1,span:20},
 {n:"HCO3",u:"mEq/L",lo:22,hi:26,step:1,span:8},{n:"INR (on warfarin)",u:"",lo:2.0,hi:3.0,step:.1,span:2},{n:"Digoxin level",u:"ng/mL",lo:0.5,hi:2.0,step:.1,span:1.5},{n:"Lithium level",u:"mEq/L",lo:0.6,hi:1.2,step:.1,span:.9},
 {n:"Adult heart rate",u:"bpm",lo:60,hi:100,step:1,span:40},{n:"Adult respiratory rate",u:"/min",lo:12,hi:20,step:1,span:10},{n:"SpO2",u:"%",lo:95,hi:100,step:1,span:10,noHigh:true},{n:"Albumin",u:"g/dL",lo:3.5,hi:5.0,step:.1,span:2}
];

const KEY='tina-nace-v1';
let S; try{ S=JSON.parse(localStorage.getItem(KEY))||{} }catch(e){ S={} }
S.answered=S.answered||0; S.correct=S.correct||0; S.mocks=S.mocks||[]; S.missed=S.missed||{}; S.cat=S.cat||{}; S.cards=S.cards||{}; S.best=S.best||0; S.days=S.days||[]; S.dose=S.dose||{r:0,t:0};
function save(){ try{ localStorage.setItem(KEY,JSON.stringify(S)) }catch(e){} }
function today(){ return new Date().toISOString().slice(0,10) }
function touchDay(){ const t=today(); if(!S.days.includes(t)){S.days.push(t); S.days=S.days.slice(-400); save();} }
function streak(){ let n=0; const d=new Date(); for(;;){ const k=d.toISOString().slice(0,10); if(S.days.includes(k)){n++; d.setDate(d.getDate()-1);} else if(n===0 && k===today()){ d.setDate(d.getDate()-1); } else break; } return n; }

const $=id=>document.getElementById(id);
const CHEER_OK=["Yes, Tina! That's exactly right.","Nailed it.","That's RN thinking right there.","Beautiful — you knew that one cold.","Correct. Keep that momentum going.","Look at you go.","Right on. Exam day won't know what hit it.","That's the one. Well done."];
const CHEER_NO=["Not this time — but now you'll remember it. You've got this.","Close. Read the why and it'll stick.","That's a tricky one. You'll get it next time, Tina.","Miss now, nail it on exam day. That's how studying works.","Don't sweat it — this is exactly what practice is for.","Every wrong answer here is one you won't get wrong when it counts.","Shake it off. You're learning, and that's the whole point."];
const pick=a=>a[Math.floor(Math.random()*a.length)];
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};

function go(id){ ['home','drill','quiz','result','cards','dose','game'].forEach(x=>$(x).classList.toggle('hidden',x!==id)); window.scrollTo({top:0}); stopTimer(); if(id==='home')renderHome(); if(id==='drill')renderTopics(); if(id==='cards')initCards(); if(id==='dose')newDose(); if(id==='game'){$('gstart').classList.remove('hidden');$('gplay').classList.add('hidden');$('gover').classList.add('hidden');$('gbest').textContent=S.best;} }
function renderHome(){
  $('s-streak').textContent=streak(); $('s-done').textContent=S.answered; $('s-acc').textContent=S.answered?Math.round(S.correct/S.answered*100)+'%':'–';
  $('mockcount').textContent=S.mocks.length; $('best').textContent=S.best; $('misscount').textContent=Object.keys(S.missed).length; $('bankcount').textContent=BANK.length; $('cardcount').textContent=CARDS.length+' cards';
  const h=new Date().getHours(); $('greet').textContent=(h<12?'Good morning, Tina.':h<17?'Good afternoon, Tina.':'Good evening, Tina.');
}
function catStats(){ const r={}; BANK.forEach(q=>{r[q.c]=r[q.c]||{n:0,t:0,c:0}; r[q.c].n++}); Object.entries(S.cat).forEach(([c,v])=>{if(r[c]){r[c].t=v.t;r[c].c=v.c}}); return r; }
function renderTopics(){
  const st=catStats(); const list=Object.entries(st).sort((a,b)=>{const pa=a[1].t?a[1].c/a[1].t:0.5, pb=b[1].t?b[1].c/b[1].t:0.5; return pa-pb});
  $('topics').innerHTML='<button class="chip" onclick="startDrill(null)">Mixed — everything<span class="n">10</span></button>'+list.map(([c,v])=>`<button class="chip" onclick="startDrill('${c.replace(/'/g,"\\'")}')">${c}<span class="n">${v.t?Math.round(v.c/v.t*100)+'%':'new'}</span></button>`).join('');
}

let Q={};
function weightedPick(n,pool){
  const w=pool.map(q=>S.missed[q.id]?3:(S.cat[q.c]&&S.cat[q.c].seen&&S.cat[q.c].seen[q.id])?1:2);
  const out=[]; const idx=pool.map((_,i)=>i);
  while(out.length<n&&idx.length){ let tot=0; idx.forEach(i=>tot+=w[i]); let r=Math.random()*tot, k=0; for(;k<idx.length;k++){ r-=w[idx[k]]; if(r<=0)break; } k=Math.min(k,idx.length-1); out.push(pool[idx[k]]); idx.splice(k,1); }
  return out;
}
function startDrill(cat){ const pool=cat?BANK.filter(q=>q.c===cat):BANK; Q={mode:'drill',title:cat||'Mixed drill',qs:weightedPick(Math.min(10,pool.length),pool),i:0,ans:[],feedback:true}; $('again').onclick=()=>startDrill(cat); beginQuiz(); }
function startMissed(){ const ids=Object.keys(S.missed).map(Number); if(!ids.length){ alert("Nothing to review yet — you haven't missed anything! Go do a drill."); return; } const pool=BANK.filter(q=>ids.includes(q.id)); Q={mode:'missed',title:'Fix my misses',qs:shuffle(pool).slice(0,15),i:0,ans:[],feedback:true}; $('again').onclick=startMissed; beginQuiz(); }
function startMock(){
  const groups={"Pharmacology":9,"Dosage calculation":4,"Fluids & electrolytes":5,"Lab values":5,"Prioritization":4,"Delegation":4,"Infection control":3,"Safety":3,"Nursing process":2,"Ethics & legal":2,"Communication":1,"Oxygenation":2,"Mobility & skin":2,"Nutrition & elimination":2,"Perioperative":1,"Growth & development":2,"Pain & comfort":1,"Vital signs & assessment":2};
  let qs=[]; Object.entries(groups).forEach(([c,n])=>{ qs=qs.concat(shuffle(BANK.filter(q=>q.c===c)).slice(0,n)); });
  qs=shuffle(qs).slice(0,50);
  Q={mode:'mock',title:'Mock exam',qs,i:0,ans:[],feedback:false,secs:60*60}; $('again').onclick=startMock; beginQuiz(); startTimer();
}
function beginQuiz(){ go('quiz'); $('qtitle').textContent=Q.title; renderQ(); }
let sel=null;
function renderQ(){
  const q=Q.qs[Q.i]; sel=null; $('count').textContent=`Question ${Q.i+1} of ${Q.qs.length}`; $('fill').style.width=(Q.i/Q.qs.length*100)+'%';
  $('cat').textContent=q.c; $('qtext').textContent=q.q; $('opts').innerHTML='';
  q.o.forEach((t,n)=>{ const b=document.createElement('button'); b.className='opt'; b.innerHTML=`<b>${'ABCD'[n]}</b><span>${t}</span>`; b.onclick=()=>{sel=n;[...$('opts').children].forEach((c,m)=>c.classList.toggle('sel',m===n));$('check').disabled=false;}; $('opts').appendChild(b); });
  $('why').style.display='none'; $('check').disabled=true; $('check').classList.remove('hidden'); $('next').classList.add('hidden');
  $('check').textContent=Q.feedback?'Check answer':(Q.i===Q.qs.length-1?'Submit exam':'Next question');
}
function record(q,ok){ S.answered++; if(ok)S.correct++; S.cat[q.c]=S.cat[q.c]||{t:0,c:0,seen:{}}; S.cat[q.c].t++; if(ok)S.cat[q.c].c++; S.cat[q.c].seen[q.id]=1; if(ok){ if(S.missed[q.id]){ S.missed[q.id]--; if(S.missed[q.id]<=0)delete S.missed[q.id]; } } else S.missed[q.id]=2; touchDay(); save(); }
function check(){
  const q=Q.qs[Q.i], ok=sel===q.a; Q.ans.push({ok,sel}); record(q,ok);
  if(!Q.feedback){ next(); return; }
  [...$('opts').children].forEach((c,n)=>{ c.disabled=true; c.classList.remove('sel'); if(n===q.a)c.classList.add('right'); else if(n===sel)c.classList.add('wrong'); });
  $('why').className='why '+(ok?'ok':'no'); $('cheer').textContent=ok?pick(CHEER_OK):pick(CHEER_NO)+' Correct answer: '+'ABCD'[q.a]+'.'; $('expl').textContent=q.e; $('why').style.display='block';
  $('check').classList.add('hidden'); $('next').classList.remove('hidden'); $('next').textContent=Q.i===Q.qs.length-1?'See results':'Next question'; $('next').focus();
}
function next(){ Q.i++; if(Q.i<Q.qs.length)renderQ(); else finish(); }
function finish(){
  stopTimer(); const n=Q.ans.filter(a=>a.ok).length, tot=Q.ans.length, pct=Math.round(n/tot*100);
  if(Q.mode==='mock'){ S.mocks.push({d:today(),pct}); save(); }
  $('rtitle').textContent=Q.title; $('rhead').textContent=pct>=80?"That's exam-ready work, Tina.":pct>=65?"Solid — you're getting there.":"Good effort. Now we know what to work on.";
  $('pct').textContent=pct+'%'; $('raw').textContent=`${n} of ${tot} correct`;
  go('result');
}
function confirmQuit(){ if(Q.ans.length&&Q.ans.length<Q.qs.length){ if(confirm('Stop and score what you have so far?')){ Q.qs=Q.qs.slice(0,Q.ans.length); finish(); } } else go('home'); }
let tmr=null;
function startTimer(){ stopTimer(); tick(); tmr=setInterval(()=>{Q.secs--; tick(); if(Q.secs<=0){ stopTimer(); alert("Time's up! Let's see how you did."); Q.qs=Q.qs.slice(0,Q.ans.length||1); if(!Q.ans.length)Q.ans.push({ok:false,sel:null}); finish(); }},1000); }
function tick(){ if(Q.secs==null){$('timer').textContent='';return;} const m=Math.floor(Q.secs/60), s=Q.secs%60; $('timer').textContent=`${m}:${String(s).padStart(2,'0')}`; $('timer').classList.toggle('low',Q.secs<300); }
function stopTimer(){ if(tmr){clearInterval(tmr);tmr=null;} $('timer').textContent=''; }

let deck='Lab values', cq=[], cc=null;
function initCards(){ const decks=[...new Set(CARDS.map(c=>c.d))]; $('decks').innerHTML=decks.map(d=>`<button class="chip" style="${d===deck?'border-color:var(--accent);background:var(--accent-soft)':''}" onclick="setDeck('${d}')">${d}<span class="n">${CARDS.filter(c=>c.d===d).length}</span></button>`).join(''); buildQueue(); showCard(); }
function setDeck(d){ deck=d; initCards(); }
function buildQueue(){ const cards=CARDS.filter(c=>c.d===deck); const learning=cards.filter(c=>S.cards[c.id]===0), rest=cards.filter(c=>S.cards[c.id]!==0); cq=shuffle(learning).concat(shuffle(rest)); }
function showCard(){ if(!cq.length)buildQueue(); cc=cq.shift(); $('fc').classList.remove('flip'); $('cdeck').textContent=cc.d; $('cfront').textContent=cc.f; $('cback').textContent=cc.b; const known=CARDS.filter(c=>c.d===deck&&S.cards[c.id]===1).length; $('cpos').textContent=`${known}/${CARDS.filter(c=>c.d===deck).length} known`; }
function flipCard(){ $('fc').classList.toggle('flip'); }
function rate0(ok){ S.cards[cc.id]=ok?1:0; touchDay(); save(); if(!ok)cq.splice(Math.min(3,cq.length),0,cc); flash(ok?pick(["Got it!","Locked in.","Yes!"]):"It'll come back soon.",ok); setTimeout(showCard,150); }
function flash(t,ok){ const f=$('flash'); f.textContent=t; f.className='flash show '+(ok?'ok':'no'); clearTimeout(f._t); f._t=setTimeout(()=>f.className='flash',900); }

const DRUGS=[["amoxicillin","mg",[250,500,875],[125,250,400],5],["acetaminophen","mg",[325,500,650,1000],[160,325,500],5],["furosemide","mg",[20,40,80],[10,40],1],["morphine","mg",[2,4,6,8],[4,10,15],1],["heparin","units",[3000,5000,7500],[5000,10000,20000],1],["ondansetron","mg",[4,8],[2,4],1],["digoxin","mg",[0.125,0.25,0.375],[0.25,0.5],1],["ceftriaxone","mg",[500,1000,2000],[250,350,1000],1]];
const FLUIDS=["0.9% sodium chloride","lactated Ringer's","D5W","0.45% sodium chloride"];
let dtype='mix', D=null;
const DT=[["mix","Mix"],["oral","Oral / liquid"],["inj","Injection"],["rate","mL/hr"],["drip","Drops/min"],["kg","Weight-based"],["time","Infusion time"]];
function r1(x){return Math.round(x*10)/10} function r2(x){return Math.round(x*100)/100}
function genDose(t){
  if(t==='mix') t=pick(['oral','inj','rate','drip','kg','time','conv']);
  const rnd=a=>a[Math.floor(Math.random()*a.length)];
  if(t==='oral'||t==='inj'){ const d=rnd(DRUGS); const dose=rnd(d[2]), conc=rnd(d[3]), per=d[4]; const ans=dose/conc*per; const a=ans<1?r2(ans):r1(ans);
    return {k:t==='oral'?'Oral liquid':'Injection',p:`Order: ${d[0]} ${dose} ${d[1]} ${t==='oral'?'PO':'IM'}. Available: ${d[0]} ${conc} ${d[1]}/${per} mL. How many mL will you give?`,u:'mL',a,w:`Desired ÷ Have × Volume\n${dose} ÷ ${conc} × ${per} mL = ${a} mL`}; }
  if(t==='rate'){ const vol=rnd([250,500,1000]), hrs=rnd([2,4,6,8,10,12]); const a=Math.round(vol/hrs);
    return {k:'Infusion rate',p:`Order: ${vol} mL ${rnd(FLUIDS)} to infuse over ${hrs} hours by pump. Set the pump at how many mL/hr?`,u:'mL/hr',a,w:`Total volume ÷ hours\n${vol} mL ÷ ${hrs} hr = ${a} mL/hr`}; }
  if(t==='drip'){ const vol=rnd([500,1000]), hrs=rnd([4,6,8,10,12]), df=rnd([10,15,20,60]); const a=Math.round(vol/(hrs*60)*df);
    return {k:'Drip rate',p:`Order: ${vol} mL ${rnd(FLUIDS)} over ${hrs} hours. Tubing drop factor: ${df} gtt/mL. How many drops per minute?`,u:'gtt/min',a,w:`Volume ÷ minutes × drop factor\n${vol} ÷ ${hrs*60} min × ${df} = ${r1(vol/(hrs*60)*df)} → ${a} gtt/min`}; }
  if(t==='kg'){ const lb=rnd([22,33,44,55,66,88,110,132,154,176]), kg=lb/2.2; const perkg=rnd([5,10,15,20,25]); const a=Math.round(kg*perkg);
    return {k:'Weight-based',p:`A client weighs ${lb} lb. Order: ${perkg} mg/kg. How many mg is the dose?`,u:'mg',a,w:`Convert lb → kg, then multiply\n${lb} ÷ 2.2 = ${r1(kg)} kg\n${r1(kg)} × ${perkg} mg = ${a} mg`}; }
  if(t==='time'){ const vol=rnd([250,500,1000]), rate=rnd([50,75,100,125,150,200]); const a=r1(vol/rate);
    return {k:'Infusion time',p:`An IV of ${vol} mL is infusing at ${rate} mL/hr. How many hours until it's finished?`,u:'hours',a,w:`Volume ÷ rate\n${vol} ÷ ${rate} = ${a} hours`}; }
  const c=rnd([["g","mg",1000,[0.5,1,1.5,2,0.25]],["mg","mcg",1000,[0.125,0.25,0.5,1]],["L","mL",1000,[0.5,1.5,2,0.75]],["kg","lb",2.2,[50,60,70,80]]]); const v=rnd(c[3]); const a=r1(v*c[2]);
  return {k:'Conversion',p:`Convert ${v} ${c[0]} to ${c[1]}.`,u:c[1],a,w:`1 ${c[0]} = ${c[2]} ${c[1]}\n${v} × ${c[2]} = ${a} ${c[1]}`};
}
function renderDT(){ $('dtypes').innerHTML=DT.map(([k,l])=>`<button class="chip" style="${k===dtype?'border-color:var(--accent);background:var(--accent-soft)':''}" onclick="dtype='${k}';newDose()">${l}</button>`).join(''); }
function newDose(){ renderDT(); D=genDose(dtype); $('dkind').textContent=D.k; $('dprob').textContent=D.p; $('dunit').textContent=D.u; $('dans').value=''; $('dans').disabled=false; $('dwhy').style.display='none'; $('dwork').classList.add('hidden'); $('dcheck').classList.remove('hidden'); $('dnext').classList.add('hidden'); $('dscore').textContent=S.dose.t?`${S.dose.r}/${S.dose.t} right`:''; $('dans').focus(); }
function checkDose0(){ const v=parseFloat($('dans').value); if(isNaN(v))return; const ok=Math.abs(v-D.a)<=Math.max(0.051,D.a*0.02); S.dose.t++; if(ok)S.dose.r++; touchDay(); save();
  $('dwhy').className='why '+(ok?'ok':'no'); $('dcheer').textContent=ok?pick(CHEER_OK):pick(CHEER_NO); $('dexpl').textContent=ok?`${D.a} ${D.u} is right.`:`The answer is ${D.a} ${D.u}. Here's the work:`; $('dwhy').style.display='block'; $('dwork').textContent=D.w; $('dwork').classList.remove('hidden'); $('dans').disabled=true; $('dcheck').classList.add('hidden'); $('dnext').classList.remove('hidden'); $('dnext').focus(); $('dscore').textContent=`${S.dose.r}/${S.dose.t} right`; }
$('dans').addEventListener('keydown',e=>{ if(e.key==='Enter'){ if($('dcheck').classList.contains('hidden'))newDose(); else checkDose(); }});

let G=null;
function fmt(n,step){ return step>=1?n.toLocaleString():n.toFixed(step<0.1?2:1); }
function genLab(){ const L=pick(LABS); const kinds=L.noHigh?['low','low','normal']:['low','normal','high']; const k=pick(kinds); let v;
  if(k==='normal') v=L.lo+Math.random()*(L.hi-L.lo); else if(k==='low') v=L.lo-(0.08+Math.random()*0.5)*L.span; else v=L.hi+(0.08+Math.random()*0.5)*L.span;
  v=Math.round(v/L.step)*L.step; if(v<0)v=L.step; return {L,k,v}; }
function startGame(){ G={t:60,score:0,streak:0,n:0}; $('gstart').classList.add('hidden'); $('gover').classList.add('hidden'); $('gplay').classList.remove('hidden'); nextLab(); clearInterval(G.tm); G.tm=setInterval(()=>{G.t--; $('gtime').textContent=G.t; $('gfill').style.width=(G.t/60*100)+'%'; if(G.t<=0)endGame(false);},1000); }
function nextLab(){ G.cur=genLab(); $('gq').innerHTML=`${G.cur.L.n}<br>${fmt(G.cur.v,G.cur.L.step)} ${G.cur.L.u}`; $('grange').textContent=''; $('gstreak').textContent=G.streak; $('gscore').textContent=G.score; }
function gAnswer(k){ if(!G||G.t<=0)return; const ok=k===G.cur.k; G.n++; if(ok){G.streak++; G.score+=10*Math.min(5,1+Math.floor(G.streak/3)); flash(G.streak>=6?'🔥 '+G.streak+' streak':pick(['Yes!','Sharp.','Quick!']),true);} else {G.streak=0; flash(`Nope — normal ${G.cur.L.n} is ${fmt(G.cur.L.lo,G.cur.L.step)}–${fmt(G.cur.L.hi,G.cur.L.step)}`,false);} nextLab(); }
function endGame0(quiet){ if(G){clearInterval(G.tm);} if(quiet||!G){ go('home'); return; } $('gplay').classList.add('hidden'); $('gover').classList.remove('hidden'); $('gfinal').textContent=G.score; const nb=G.score>S.best; if(nb){S.best=G.score;} touchDay(); save(); $('gbest').textContent=S.best; $('gmsg').textContent=nb?`New personal best, Tina! ${G.n} values in 60 seconds.`:`${G.n} values in 60 seconds. Your best is ${S.best} — you'll beat it.`; G.t=0; }
