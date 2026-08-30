S.exam=S.exam||'2027-01-15'; if(S.exam==='2026-11-14'){S.exam='2027-01-15';} if(S.sound==null)S.sound=true; if(S.fx==null)S.fx=true; S.plan=S.plan||{}; S.unlocked=S.unlocked||{}; S.hist=S.hist||{};
const SECTIONS=['home','drill','quiz','result','cards','dose','game','plan','report','rewards','sheets','install','settings'];
function go(id){ SECTIONS.forEach(x=>$(x).classList.toggle('hidden',x!==id)); window.scrollTo({top:0}); stopTimer();
  if(id==='home')renderHome(); if(id==='drill')renderTopics(); if(id==='cards')initCards(); if(id==='dose')newDose();
  if(id==='game'){$('gstart').classList.remove('hidden');$('gplay').classList.add('hidden');$('gover').classList.add('hidden');$('gbest').textContent=S.best;}
  if(id==='plan')renderPlan(); if(id==='report')renderReport(); if(id==='rewards')renderRewards(); if(id==='sheets')renderSheets(); if(id==='settings'){$('examdate').value=S.exam;$('snd').checked=S.sound;$('cfx').checked=S.fx;} }

function daysLeft(){ const e=new Date(S.exam+'T12:00:00'), n=new Date(); n.setHours(12,0,0,0); return Math.round((e-n)/864e5); }
function setExam(v){ if(v){S.exam=v; save();} }
const PLAN=[
 {f:"Pharmacology foundations",d:["Drill: Pharmacology ×2","Flashcards: Drug facts deck","Dosage lab: 10 oral/liquid problems","Drill: Pharmacology","Cheat sheet: Drug classes — read twice","Lab Lightning: beat 150","Rest or a light mixed drill"]},
 {f:"Dosage math",d:["Dosage lab: 10 mL/hr + 10 drops/min","Dosage lab: 10 weight-based","Drill: Dosage calculation","Dosage lab: conversions until 10 in a row","Drill: Pharmacology","Mock exam #1 — just to get a baseline","Review every miss from the mock"]},
 {f:"Fluids & electrolytes",d:["Cheat sheet: Electrolytes — read it out loud","Drill: Fluids & electrolytes ×2","Flashcards: Lab values deck","Drill: Fluids & electrolytes","Lab Lightning ×3 rounds","Fix my misses","Rest"]},
 {f:"Lab values & ABGs",d:["Cheat sheet: ABGs (ROME)","Drill: Lab values ×2","Flashcards: Lab values until all 'got it'","Drill: Fluids & electrolytes","Lab Lightning: beat your best","Mock exam #2","Review the mock by category — pick next week's extra drill"]},
 {f:"Prioritization",d:["Cheat sheet: Prioritization rules","Drill: Prioritization ×2","Drill: Vital signs & assessment","Drill: Prioritization","Drill: Oxygenation","Fix my misses","Rest"]},
 {f:"Delegation & legal",d:["Cheat sheet: Delegation","Drill: Delegation ×2","Drill: Ethics & legal","Drill: Delegation","Drill: Communication","Mock exam #3","Review misses; flashcards for 10 minutes"]},
 {f:"Infection control & safety",d:["Flashcards: Isolation deck","Drill: Infection control ×2","Drill: Safety ×2","Cheat sheet: Isolation","Drill: Mixed","Fix my misses","Rest"]},
 {f:"Review week — weak spots",d:["Drill: your lowest topic ×2","Drill: second-lowest topic ×2","Dosage lab: 15 mixed","Fix my misses until the list is empty","Flashcards: Antidotes + Quick rules","Mock exam #4","Celebrate — you're two-thirds there"]},
 {f:"Pharmacology, round two",d:["Drill: Pharmacology ×2","Flashcards: Antidotes deck","Dosage lab: 10 injection problems","Drill: Pharmacology","Cheat sheet: Insulin timing","Lab Lightning ×2","Rest"]},
 {f:"Electrolytes & labs, round two",d:["Drill: Fluids & electrolytes","Drill: Lab values","Flashcards: Lab values deck","Cheat sheet: ABGs — do 5 from memory","Lab Lightning: beat your best","Fix my misses","Rest"]},
 {f:"Case studies & SATA practice",d:["Mixed drill ×2 (watch for select-all questions)","Drill: Prioritization","Drill: Delegation","Mixed drill","Cheat sheet: Prioritization rules","Mock exam #5","Review every miss"]},
 {f:"Oxygenation, perioperative, pain",d:["Drill: Oxygenation","Drill: Perioperative ×2","Drill: Pain & comfort","Drill: Vital signs & assessment","Mixed drill","Fix my misses","Rest"]},
 {f:"Review week — rebuild the basics",d:["Drill: your lowest topic ×2","Drill: second-lowest topic","All flashcard decks once","Dosage lab: 15 mixed","Fix my misses until the list is empty","Mock exam #6","Report card — send it to Chris"]},
 {f:"Safety, infection control, legal — round two",d:["Drill: Safety","Drill: Infection control","Drill: Ethics & legal","Drill: Communication","Flashcards: Isolation deck","Fix my misses","Rest"]},
 {f:"Mixed endurance",d:["Mixed drill ×3 in one sitting","Dosage lab: 20 mixed","Mixed drill ×2","Flashcards: Quick rules","Mixed drill","Mock exam #7","Review by category"]},
 {f:"Holiday week — keep the streak alive",d:["One mixed drill (10 min)","Flashcards for 10 min","Lab Lightning for fun","One mixed drill","Dosage lab: 5 problems","Rest","Rest — you've earned it"]},
 {f:"Nursing process, skin, mobility",d:["Drill: Nursing process","Drill: Mobility & skin ×2","Drill: Nutrition & elimination","Drill: Perioperative","Drill: Pain & comfort","Fix my misses","Rest"]},
 {f:"Growth & development, OB, mental health",d:["Drill: Growth & development ×2","Cheat sheet: Erikson + Apgar","Drill: Growth & development","Drill: Communication","Drill: Mixed","Mock exam #8","Review by category"]},
 {f:"Full review",d:["Mixed drill ×2","Dosage lab: 20 mixed, aim for 18+","All flashcard decks once","Fix my misses","Drill: your lowest topic","Mock exam #9 — aim for 80%+","Light review only"]},
 {f:"Exam week — taper",d:["Mixed drill + flashcards (30 min max)","Dosage lab: 10 problems","Lab Lightning for fun, then stop","Skim every cheat sheet once","Short mixed drill; pack ID and confirm the testing site","Rest. Sleep. You're ready.","Exam day — breathe, read every question twice, trust your first instinct"]}
];
const NWEEKS=PLAN.length; function weekIndex(){ const d=daysLeft(); const w=NWEEKS-Math.ceil(d/7); return Math.max(0,Math.min(NWEEKS-1,w)); }
function renderHome(){
  $('s-streak').textContent=streak(); $('s-done').textContent=S.answered; $('s-acc').textContent=S.answered?Math.round(S.correct/S.answered*100)+'%':'–';
  $('mockcount').textContent=S.mocks.length; $('best').textContent=S.best; $('misscount').textContent=Object.keys(S.missed).length; $('bankcount').textContent=BANK.length; $('cardcount').textContent=CARDS.length+' cards';
  const h=new Date().getHours(); $('greet').textContent=(h<12?'Good morning, Tina.':h<17?'Good afternoon, Tina.':'Good evening, Tina.');
  const d=daysLeft(); $('days-left').textContent=d>0?d:(d===0?'Today':'Done'); $('exam-label').textContent=d>0?(d===1?'day until your exam':'days until your exam'):(d===0?"It's exam day, Tina.":'Exam complete');
  $('exam-sub').textContent=new Date(S.exam+'T12:00:00').toLocaleDateString(undefined,{weekday:'long',month:'long',day:'numeric'});
  const wi=weekIndex(), wk=PLAN[wi], dayi=Math.min(6,(new Date().getDay()+6)%7); const done=S.plan[wi+'-'+dayi];
  $('today').innerHTML=`<div class="cat">Week ${wi+1} · ${wk.f}</div><label class="day ${done?'done':''}"><input type="checkbox" ${done?'checked':''} onchange="togglePlan(${wi},${dayi},this.checked);renderHome()"><span><b>Today:</b> ${wk.d[dayi]}</span></label>`;
}
function togglePlan(w,d,v){ if(v)S.plan[w+'-'+d]=1; else delete S.plan[w+'-'+d]; touchDay(); save(); if(v)ding(); }
function renderPlan(){ const cur=weekIndex(); $('plan-pos').textContent=`Week ${cur+1} of ${NWEEKS}`;
  $('weeks').innerHTML=PLAN.map((w,i)=>{ const n=w.d.filter((_,k)=>S.plan[i+'-'+k]).length; return `<div class="week ${i===cur?'now':''}"><h3>Week ${i+1} — ${w.f}</h3><div class="prog mono" style="font-size:.75rem;color:var(--ink-2)">${n}/7 done${i===cur?' · this week':''}</div><div class="days">${w.d.map((t,k)=>`<label class="day ${S.plan[i+'-'+k]?'done':''}"><input type="checkbox" ${S.plan[i+'-'+k]?'checked':''} onchange="togglePlan(${i},${k},this.checked);renderPlan()"><span><b>${['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][k]}</b> · ${t}</span></label>`).join('')}</div></div>`; }).join(''); }

function backupCode(){ return 'TINA1.'+btoa(unescape(encodeURIComponent(JSON.stringify(S)))); }
function copyBackup(){ const c=backupCode(); const done=()=>flash('Backup copied — save it somewhere safe',true); if(navigator.share){ navigator.share({title:'Tina NACE backup',text:c}).then(done).catch(()=>{}); } else if(navigator.clipboard){ navigator.clipboard.writeText(c).then(done).catch(()=>prompt('Copy this backup code:',c)); } else prompt('Copy this backup code:',c); }
function restoreBackup(){ const c=prompt('Paste your backup code:'); if(!c)return; try{ const j=JSON.parse(decodeURIComponent(escape(atob(c.trim().replace(/^TINA1\./,''))))); if(!j||typeof j.answered!=='number')throw 0; if(confirm(`Restore ${j.answered} answered questions and all progress? This replaces what's on this device.`)){ S=j; save(); location.reload(); } }catch(e){ alert("That code didn't work. Make sure you pasted the whole thing.") } }
// A link like /#restore=TINA1.… restores a backup with one tap — no pasting.
// The code rides in the URL fragment, which never leaves the device.
function tryLinkRestore(){
  const m=location.hash.match(/^#restore=(.+)$/); if(!m)return;
  history.replaceState(null,'',location.pathname+location.search);
  let j=null;
  try{ const raw=decodeURIComponent(m[1]).replace(/\s+/g,'').replace(/^TINA1\./,''); j=JSON.parse(decodeURIComponent(escape(atob(raw)))); }catch(e){}
  if(!j||typeof j.answered!=='number'){ alert("That restore link didn't work — ask Chris to send a fresh one."); return; }
  if(confirm(`Restore ${j.answered} answered questions and all saved progress from this link? This replaces what's on this device.`)){ S=j; save(); location.reload(); }
}
function logDay(ok){ const t=today(); S.hist[t]=S.hist[t]||{t:0,c:0}; S.hist[t].t++; if(ok)S.hist[t].c++; }
function weekStats(){ const out=[]; for(let i=6;i>=0;i--){ const d=new Date(); d.setDate(d.getDate()-i); const k=d.toISOString().slice(0,10); out.push({k,...(S.hist[k]||{t:0,c:0})}); } return out; }
function reportText(){ const w=weekStats(); const t=w.reduce((a,b)=>a+b.t,0), c=w.reduce((a,b)=>a+b.c,0); const st=catStats(); const ranked=Object.entries(st).filter(([,v])=>v.t>=3).sort((a,b)=>(a[1].c/a[1].t)-(b[1].c/b[1].t));
  const weakest=ranked.slice(0,2).map(([k,v])=>`${k} ${Math.round(v.c/v.t*100)}%`).join(', ')||'not enough data yet'; const strongest=ranked.slice(-2).reverse().map(([k,v])=>`${k} ${Math.round(v.c/v.t*100)}%`).join(', ')||'—';
  const lastMock=S.mocks.length?S.mocks[S.mocks.length-1].pct+'%':'none yet';
  return {t,c,weakest,strongest,lastMock,text:`Tina's NACE report — ${new Date().toLocaleDateString()}\n${daysLeft()} days to exam · ${streak()}-day streak\nThis week: ${t} questions, ${t?Math.round(c/t*100):0}% correct\nAll time: ${S.answered} questions, ${S.answered?Math.round(S.correct/S.answered*100):0}%\nLast mock: ${lastMock} (${S.mocks.length} taken)\nStrongest: ${strongest}\nWorking on: ${weakest}\nLab Lightning best: ${S.best}`}; }
function renderReport(){ const r=reportText(), w=weekStats(), mx=Math.max(1,...w.map(x=>x.t));
  $('rep').innerHTML=`<div class="eyebrow">Last 7 days</div><div class="score" style="font-size:2.6rem">${r.t}</div><div class="muted">questions · ${r.t?Math.round(r.c/r.t*100):0}% correct</div><div class="spark">${w.map(x=>`<i style="height:${x.t/mx*100}%" title="${x.k}: ${x.t}"></i>`).join('')}</div>
  <div class="row"><span>Days to exam</span><b>${daysLeft()}</b></div><div class="row"><span>Streak</span><b>${streak()} days</b></div><div class="row"><span>All-time accuracy</span><b>${S.answered?Math.round(S.correct/S.answered*100)+'%':'–'}</b></div><div class="row"><span>Mock exams</span><b>${S.mocks.map(m=>m.pct+'%').join(' → ')||'none yet'}</b></div><div class="row"><span>Strongest</span><b style="text-align:right">${r.strongest}</b></div><div class="row"><span>Working on</span><b style="text-align:right">${r.weakest}</b></div><div class="row"><span>Lab Lightning best</span><b>${S.best}</b></div>`; }
function copyReport(){ navigator.clipboard&&navigator.clipboard.writeText(reportText().text).then(()=>flash('Copied — paste it to Chris',true)).catch(()=>alert(reportText().text)); }
function shareReport(){ const t=reportText().text; if(navigator.share){ navigator.share({title:"Tina's NACE report",text:t}).catch(()=>{}); } else copyReport(); }

const REWARDS=[
 {id:'q50',n:50,l:'50 questions',m:"Fifty down. You showed up and that's the hardest part. Keep going — I'm proud of you already. — Chris"},
 {id:'s3',streak:3,l:'3-day streak',m:"Three days in a row. That's not luck, that's discipline. Coffee's on me tomorrow. — Chris"},
 {id:'m1',mocks:1,l:'First mock exam',m:"You sat through a full mock. Whatever the score was, it only goes up from here. Dinner's on me this week — your pick. — Chris"},
 {id:'q200',n:200,l:'200 questions',m:"Two hundred questions. You know more than you did a week ago, and it shows. Redeem this for one guilt-free night off — no studying, no lab values, just us. — Chris"},
 {id:'s7',streak:7,l:'7-day streak',m:"A full week without missing a day. That's who you are when you want something. Massage or a movie — your call, my treat. — Chris"},
 {id:'m80',mockpct:80,l:'A mock at 80%+',m:"Eighty percent on a mock. That's passing territory. I knew it before you did. Let's celebrate properly this weekend. — Chris"},
 {id:'q500',n:500,l:'500 questions',m:"Five hundred. Tina, future RN — I'm saying it now so you hear it first. Whatever you want to do to mark this, we're doing it. — Chris"},
 {id:'done',exam:true,l:'Exam day',m:"Whatever happens in that room today, you did the work. Read every question twice, breathe, and trust yourself. I love you and I'm right outside when you're done. — Chris"}
];
function earned(r){ if(r.n)return S.answered>=r.n; if(r.streak)return streak()>=r.streak||(S.maxStreak||0)>=r.streak; if(r.mocks)return S.mocks.length>=r.mocks; if(r.mockpct)return S.mocks.some(m=>m.pct>=r.mockpct); if(r.exam)return daysLeft()<=0; return false; }
function progressOf(r){ if(r.n)return `${Math.min(S.answered,r.n)}/${r.n} questions`; if(r.streak)return `${Math.min(streak(),r.streak)}/${r.streak} days`; if(r.mocks)return `${Math.min(S.mocks.length,r.mocks)}/${r.mocks} mock`; if(r.mockpct)return `best mock ${S.mocks.length?Math.max(...S.mocks.map(m=>m.pct))+'%':'–'}`; if(r.exam)return `${Math.max(0,daysLeft())} days`; return ''; }
function renderRewards(){ $('rwlist').innerHTML=REWARDS.map(r=>{ const ok=earned(r); if(ok&&!S.unlocked[r.id]){S.unlocked[r.id]=today();save();} const u=!!S.unlocked[r.id]; return `<div class="rw ${u?'open':'locked'}"><div class="badge">${u?'★':'🔒'}</div><div><div class="cat">${r.l}</div><div class="msg">${u?r.m:r.m.replace(/[^ ]/g,'•')}</div><div class="prog">${u?'Unlocked '+S.unlocked[r.id]:progressOf(r)}</div></div></div>`; }).join(''); }
function checkRewards(){ S.maxStreak=Math.max(S.maxStreak||0,streak()); const fresh=REWARDS.filter(r=>!S.unlocked[r.id]&&earned(r)); if(fresh.length){ fresh.forEach(r=>S.unlocked[r.id]=today()); save(); confetti(); fanfare(); setTimeout(()=>{ if(confirm(`🎉 You unlocked "${fresh[0].l}" — a note from Chris is waiting. Read it now?`)) go('rewards'); },400); } }

const SHEETS=[
 {t:"Electrolytes at a glance",b:`<div class="tablewrap"><table><tr><th>Lyte</th><th>Normal</th><th>Low looks like</th><th>High looks like</th></tr><tr><td>K+</td><td>3.5–5.0</td><td>Weak, constipated, flat T / U waves</td><td>Peaked T, wide QRS, arrest</td></tr><tr><td>Na+</td><td>135–145</td><td>Confusion, seizures, headache</td><td>Thirst, dry, restless</td></tr><tr><td>Ca++</td><td>8.5–10.5</td><td>Tingling, tetany, Chvostek/Trousseau</td><td>Lethargy, constipation, stones</td></tr><tr><td>Mg++</td><td>1.5–2.5</td><td>Tremor, hyperreflexia, dysrhythmia</td><td>Lost reflexes, low RR (antidote: Ca gluconate)</td></tr></table></div><p><b>Memory trick:</b> Calcium and magnesium are sedatives — low = twitchy, high = sleepy. Potassium is the opposite for the heart: low = slow/weak, high = peaked and dangerous.</p>`},
 {t:"ABGs in 30 seconds (ROME)",b:`<p><b>R</b>espiratory <b>O</b>pposite · <b>M</b>etabolic <b>E</b>qual.</p><p>Step 1: pH &lt;7.35 acidosis, &gt;7.45 alkalosis.<br>Step 2: Does CO2 go the <i>opposite</i> way from pH? → respiratory. Does HCO3 go the <i>same</i> way? → metabolic.</p><p>Respiratory acidosis = hypoventilation (COPD, opioids). Respiratory alkalosis = hyperventilation (anxiety, pain). Metabolic acidosis = DKA, diarrhea, kidney failure. Metabolic alkalosis = vomiting, NG suction, antacids.</p><p><b>Normal:</b> pH 7.35–7.45 · CO2 35–45 · HCO3 22–26.</p>`},
 {t:"Antidotes",b:`<p>Heparin → <b>protamine sulfate</b> · Warfarin → <b>vitamin K</b> · Opioids → <b>naloxone</b> · Benzos → <b>flumazenil</b> · Acetaminophen → <b>acetylcysteine</b> · Magnesium → <b>calcium gluconate</b> · Digoxin → <b>Digoxin immune Fab</b> · Anaphylaxis → <b>epinephrine IM</b> · Hypoglycemia (can't swallow) → <b>D50 IV or glucagon IM</b>.</p>`},
 {t:"Drug class clues",b:`<p><b>-pril</b> ACE inhibitor (cough, angioedema, high K) · <b>-sartan</b> ARB · <b>-olol</b> beta-blocker (check pulse, don't stop abruptly) · <b>-dipine</b> calcium channel blocker · <b>-statin</b> cholesterol (muscle pain, liver) · <b>-prazole</b> PPI · <b>-tidine</b> H2 blocker · <b>-mycin</b> aminoglycoside (ears, kidneys) · <b>-cillin</b> penicillin · <b>-cef/ceph</b> cephalosporin · <b>-floxacin</b> fluoroquinolone (tendon rupture) · <b>-azepam/-zolam</b> benzodiazepine · <b>-triptan</b> migraine · <b>-sone/-lone</b> steroid (glucose up, taper off).</p>`},
 {t:"Insulin timing",b:`<div class="tablewrap"><table><tr><th>Type</th><th>Onset</th><th>Peak</th><th>Notes</th></tr><tr><td>Lispro / aspart (rapid)</td><td>15 min</td><td>1–3 hr</td><td>Eat right away</td></tr><tr><td>Regular (short)</td><td>30–60 min</td><td>2–4 hr</td><td>Only insulin given IV</td></tr><tr><td>NPH (intermediate)</td><td>1–2 hr</td><td>4–12 hr</td><td>Cloudy; afternoon hypoglycemia</td></tr><tr><td>Glargine / detemir (long)</td><td>1–2 hr</td><td>none</td><td>Never mix</td></tr></table></div><p><b>Clear before cloudy</b> when mixing regular + NPH.</p>`},
 {t:"Isolation precautions",b:`<p><b>Airborne</b> (N95, negative pressure): <i>My Chicken Hez TB</i> — Measles, Chickenpox, Herpes zoster (disseminated), TB.</p><p><b>Droplet</b> (surgical mask): <i>SPIDERMAN</i> — Sepsis/Scarlet fever, Pertussis/Pneumonia, Influenza, Diphtheria, Epiglottitis, Rubella, Mumps/Meningitis, Adenovirus, N. meningitidis.</p><p><b>Contact</b> (gown + gloves): MRSA, VRE, C. diff (soap &amp; water!), RSV, scabies, wound drainage.</p><p>PPE on: gown → mask → goggles → gloves. Off: gloves → goggles → gown → mask.</p>`},
 {t:"Prioritization rules",b:`<p><b>ABCs</b> first — then safety, then pain/comfort, then teaching and psychosocial.</p><p><b>Maslow:</b> physiologic → safety → love/belonging → esteem → self-actualization.</p><p><b>Acute beats chronic. Unstable beats stable. Actual beats risk.</b></p><p>Sudden change in condition = see that client first. "Expected" findings for the diagnosis are lower priority than unexpected ones.</p><p>When two answers are both right, pick the one that <i>assesses</i> before the one that <i>acts</i> — unless the scenario is an emergency where the action is obvious (stop the blood, stop the infusion, give epinephrine).</p>`},
 {t:"Delegation",b:`<p><b>RN keeps:</b> assessment, teaching, evaluation, care planning, unstable clients, IV push meds, blood initiation.</p><p><b>LPN/LVN:</b> stable clients, oral/IM/subcut meds, wound care, reinforcing teaching, data collection.</p><p><b>UAP:</b> vitals, I&amp;O, hygiene, ambulation, feeding, positioning — stable clients only.</p><p>Five rights of delegation: right task, circumstance, person, direction, supervision. <b>Accountability never transfers.</b></p>`},
 {t:"Erikson & Apgar",b:`<p><b>Erikson:</b> Infant trust/mistrust · Toddler autonomy/shame · Preschool initiative/guilt · School age industry/inferiority · Adolescent identity/role confusion · Young adult intimacy/isolation · Middle adult generativity/stagnation · Older adult integrity/despair.</p><p><b>Apgar</b> at 1 and 5 min: Appearance, Pulse, Grimace, Activity, Respirations — each 0–2. 7–10 normal, 4–6 moderate distress, 0–3 severe.</p>`},
 {t:"Dosage formulas",b:`<p><b>Tablets/mL:</b> Desired ÷ Have × Quantity.</p><p><b>mL/hr:</b> total mL ÷ hours.</p><p><b>gtt/min:</b> total mL ÷ minutes × drop factor.</p><p><b>Weight-based:</b> lb ÷ 2.2 = kg, then kg × mg/kg.</p><p><b>Conversions:</b> 1 g = 1,000 mg · 1 mg = 1,000 mcg · 1 L = 1,000 mL · 1 kg = 2.2 lb · 1 tsp = 5 mL · 1 oz = 30 mL.</p><p>Always ask: does the answer make sense? 0.5 mL of morphine, yes. 50 mL IM, no.</p>`},
 {t:"Classic mnemonics",b:`<p><b>MONA</b> for chest pain: Morphine, Oxygen, Nitro, Aspirin (order given: O, A, N, M). <b>RACE / PASS</b> for fire. <b>6 P's</b> of neurovascular checks: pain, pallor, pulselessness, paresthesia, paralysis, pressure. <b>Cushing's triad</b>: wide pulse pressure, bradycardia, irregular breathing. <b>CAUTION</b> cancer warning signs. <b>Post-op 5 W's</b> of fever: Wind (day 1–2), Water (day 3–5), Wound (day 5–7), Walking (DVT), Wonder drugs.</p>`}
];
function renderSheets(){ $('sheetlist').innerHTML=SHEETS.map(s=>`<details class="sheet"><summary>${s.t}</summary><div class="body">${s.b}</div></details>`).join(''); }

let order=[];
function renderQ(){
  const q=Q.qs[Q.i]; sel=null; order=[]; $('count').textContent=`Question ${Q.i+1} of ${Q.qs.length}`; $('fill').style.width=(Q.i/Q.qs.length*100)+'%';
  $('cat').textContent=q.c+(q.t==='sata'?' · select all that apply':q.t==='order'?' · put in order':''); $('qtext').textContent=q.q; $('opts').innerHTML=''; $('opts').className='opts';
  if(q.stem){ $('stem').innerHTML=`<b>${q.caseTitle}</b>${q.stem}`; $('stem').classList.remove('hidden'); } else $('stem').classList.add('hidden');
  if(q.t==='sata'){ sel=new Set(); q.o.forEach((t,n)=>{ const b=document.createElement('button'); b.className='opt multi'; b.innerHTML=`<b></b><span>${t}</span>`; b.onclick=()=>{ if(sel.has(n))sel.delete(n); else sel.add(n); b.classList.toggle('sel'); $('check').disabled=sel.size===0; }; $('opts').appendChild(b); }); }
  else if(q.t==='order'){ order=shuffle(q.o.map((_,i)=>i)); if(order.every((v,i)=>v===i))order.reverse(); $('opts').className='opts ord'; drawOrder(q); $('check').disabled=false; }
  else { q.o.forEach((t,n)=>{ const b=document.createElement('button'); b.className='opt'; b.innerHTML=`<b>${'ABCDEF'[n]}</b><span>${t}</span>`; b.onclick=()=>{sel=n;[...$('opts').children].forEach((c,m)=>c.classList.toggle('sel',m===n));$('check').disabled=false;}; $('opts').appendChild(b); }); }
  $('why').style.display='none'; if(q.t!=='order')$('check').disabled=true; $('check').classList.remove('hidden'); $('next').classList.add('hidden');
  $('check').textContent=Q.feedback?'Check answer':(Q.i===Q.qs.length-1?'Submit exam':'Next question');
}
function drawOrder(q){ $('opts').innerHTML=''; order.forEach((oi,pos)=>{ const d=document.createElement('div'); d.className='opt'; d.innerHTML=`<b>${pos+1}</b><span>${q.o[oi]}</span><span class="mv"><button aria-label="Move up" ${pos===0?'disabled':''} onclick="mv(${pos},-1)">↑</button><button aria-label="Move down" ${pos===order.length-1?'disabled':''} onclick="mv(${pos},1)">↓</button></span>`; $('opts').appendChild(d); }); }
function mv(pos,dir){ const j=pos+dir; [order[pos],order[j]]=[order[j],order[pos]]; drawOrder(Q.qs[Q.i]); }
function isRight(q){ if(q.t==='sata'){ return q.a.length===sel.size&&q.a.every(i=>sel.has(i)); } if(q.t==='order'){ return order.every((v,i)=>v===i); } return sel===q.a; }
function answerLabel(q){ if(q.t==='sata')return q.a.map(i=>'ABCDEF'[i]).join(', '); if(q.t==='order')return 'shown in order above'; return 'ABCDEF'[q.a]; }
function chosenLabel(q,a){ if(q.t==='sata')return [...a.sel].sort().map(i=>'ABCDEF'[i]).join(', ')||'nothing'; if(q.t==='order')return 'your order'; return a.sel==null?'nothing':'ABCDEF'[a.sel]; }
function check(){
  const q=Q.qs[Q.i], ok=isRight(q); Q.ans.push({ok,sel:q.t==='sata'?new Set(sel):q.t==='order'?order.slice():sel}); record(q,ok); logDay(ok); save();
  if(!Q.feedback){ next(); return; }
  if(q.t==='sata'){ [...$('opts').children].forEach((c,n)=>{ c.disabled=true; c.classList.remove('sel'); if(q.a.includes(n))c.classList.add('right'); else if(sel.has(n))c.classList.add('wrong'); }); }
  else if(q.t==='order'){ order=q.o.map((_,i)=>i); drawOrder(q); [...$('opts').children].forEach(c=>{c.classList.add(ok?'right':'wrong'); c.querySelector('.mv').remove();}); }
  else { [...$('opts').children].forEach((c,n)=>{ c.disabled=true; c.classList.remove('sel'); if(n===q.a)c.classList.add('right'); else if(n===sel)c.classList.add('wrong'); }); }
  $('why').className='why '+(ok?'ok':'no'); $('cheer').textContent=ok?pick(CHEER_OK):pick(CHEER_NO)+(q.t==='order'?' The correct order is shown above.':' Correct answer: '+answerLabel(q)+'.'); $('expl').textContent=q.e; $('why').style.display='block';
  if(ok)ding(); else buzz();
  $('check').classList.add('hidden'); $('next').classList.remove('hidden'); $('next').textContent=Q.i===Q.qs.length-1?'See results':'Next question'; $('next').focus();
  checkRewards();
}
function finish(){
  stopTimer(); const n=Q.ans.filter(a=>a.ok).length, tot=Q.ans.length, pct=Math.round(n/tot*100);
  if(Q.mode==='mock'){ S.mocks.push({d:today(),pct}); save(); }
  $('rtitle').textContent=Q.title; $('rhead').textContent=pct>=80?"That's exam-ready work, Tina.":pct>=65?"Solid — you're getting there.":"Good effort. Now we know what to work on.";
  $('pct').textContent=pct+'%'; $('raw').textContent=`${n} of ${tot} correct`+(Q.mode==='mock'&&S.mocks.length>1?` · previous mocks: ${S.mocks.slice(0,-1).map(m=>m.pct+'%').join(', ')}`:'');
  const cats={}; Q.qs.slice(0,tot).forEach((q,k)=>{cats[q.c]=cats[q.c]||{t:0,r:0};cats[q.c].t++;if(Q.ans[k].ok)cats[q.c].r++});
  $('bycat').innerHTML=Object.entries(cats).sort((a,b)=>(a[1].r/a[1].t)-(b[1].r/b[1].t)).map(([c,v])=>`<div class="cs"><div class="l">${c}</div><div class="v">${v.r}/${v.t}</div><div class="t"><i style="width:${v.r/v.t*100}%"></i></div></div>`).join('');
  $('review').innerHTML=Q.qs.slice(0,tot).map((q,k)=>`<div class="rv ${Q.ans[k].ok?'hit':'miss'}"><div class="cat">${q.c}</div>${q.q}<br><span class="muted">${Q.ans[k].ok?'Correct. ':'You chose '+chosenLabel(q,Q.ans[k])+' · correct: '+(q.t==='order'?q.o.join(' → '):answerLabel(q))+'. '}${q.e}</span></div>`).join('');
  go('result'); if(pct>=80){confetti();fanfare();} checkRewards();
}
function endGame(quiet){ const wasBest=G&&G.score>S.best; endGame0(quiet); if(!quiet&&wasBest){confetti();fanfare();} }
function rate(ok){ rate0(ok); if(ok)ding(); }
function checkDose(){ const before=S.dose.r; checkDose0(); if(S.dose.r>before)ding(); else if($('dwhy').style.display==='block')buzz(); logDay(S.dose.r>before); save(); }

let AC=null; function tone(f,d,type='sine',g=.08){ if(!S.sound)return; try{ AC=AC||new (window.AudioContext||window.webkitAudioContext)(); const o=AC.createOscillator(), v=AC.createGain(); o.type=type; o.frequency.value=f; v.gain.value=g; o.connect(v); v.connect(AC.destination); o.start(); v.gain.exponentialRampToValueAtTime(.0001,AC.currentTime+d); o.stop(AC.currentTime+d);}catch(e){} }
function ding(){ tone(880,.12); setTimeout(()=>tone(1320,.18),90); }
function buzz(){ tone(220,.18,'triangle',.05); }
function fanfare(){ [523,659,784,1047].forEach((f,i)=>setTimeout(()=>tone(f,.25),i*110)); }
function confetti(){ if(!S.fx||matchMedia('(prefers-reduced-motion: reduce)').matches)return; const c=$('confetti'), x=c.getContext('2d'); c.width=innerWidth; c.height=innerHeight; const cols=['#B03A6B','#EE7FA9','#3E4C8C','#F5C451','#6FD198']; const P=Array.from({length:140},()=>({x:Math.random()*c.width,y:-20-Math.random()*c.height*.5,r:4+Math.random()*6,c:pick(cols),vy:2+Math.random()*3,vx:(Math.random()-.5)*2,a:Math.random()*6.3,va:(Math.random()-.5)*.3})); let t=0; (function f(){ x.clearRect(0,0,c.width,c.height); P.forEach(p=>{p.y+=p.vy;p.x+=p.vx;p.a+=p.va; x.save(); x.translate(p.x,p.y); x.rotate(p.a); x.fillStyle=p.c; x.fillRect(-p.r/2,-p.r/4,p.r,p.r/2); x.restore();}); if(++t<170)requestAnimationFrame(f); else x.clearRect(0,0,c.width,c.height); })(); }
function resetAll(){ if(confirm('Erase all of Tina\'s progress on this device? This cannot be undone.')){ try{localStorage.removeItem(KEY)}catch(e){} location.reload(); } }
renderHome();
tryLinkRestore();
