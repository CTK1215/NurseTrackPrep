// Chooses the active study track before app.js binds to BANK.
// NACE question ids stay 0-based; NCLEX ids are offset so saved progress
// (missed lists, per-question "seen" flags) never collides across tracks.
let TRACK='nace';
try{ const s=JSON.parse(localStorage.getItem('tina-nace-v1'))||{}; if(s.track==='nclex')TRACK='nclex'; }catch(e){}
NACE_BANK.forEach((q,i)=>q.id=i);
NCLEX_BANK.forEach((q,i)=>q.id=10000+i);
var BANK = TRACK==='nclex' ? NCLEX_BANK : NACE_BANK;

const TRACKS={
 nace:{
  label:'NACE I · Foundations of Nursing',
  blurb:'Unofficial practice content written to match the NLN NACE I blueprint — not actual exam items.',
  mockGroups:{"Pharmacology":9,"Dosage calculation":4,"Fluids & electrolytes":5,"Lab values":5,"Prioritization":4,"Delegation":4,"Infection control":3,"Safety":3,"Nursing process":2,"Ethics & legal":2,"Communication":1,"Oxygenation":2,"Mobility & skin":2,"Nutrition & elimination":2,"Perioperative":1,"Growth & development":2,"Pain & comfort":1,"Vital signs & assessment":2}
 },
 nclex:{
  label:'NCLEX-RN · Practice',
  blurb:'Unofficial practice content organized by the NCLEX-RN test plan — not actual exam items.',
  mockGroups:{"Management of Care":10,"Pharmacological & Parenteral Therapies":8,"Physiological Adaptation":7,"Reduction of Risk Potential":6,"Safety & Infection Control":6,"Health Promotion & Maintenance":5,"Psychosocial Integrity":4,"Basic Care & Comfort":4}
 }
};
