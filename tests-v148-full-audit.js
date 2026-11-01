const fs=require('fs'),assert=require('assert');
const version=JSON.parse(fs.readFileSync('chanse4/version.json','utf8'));
const sw=fs.readFileSync('chanse2/sw.js','utf8');
const ui=fs.readFileSync('chanse3/admin-monitor.js','utf8');
const css=fs.readFileSync('chanse3/admin-monitor.css','utf8');
const backend=fs.readFileSync('chanse4/firebase-functions/index.js','utf8');
const checks=[
 ['release metadata is v148',version.build===148&&version.version==='v148-full-audit-fix'],
 ['service worker cache matches release',sw.includes('squad-v148-full-audit-fix')],
 ['admin report content is HTML-escaped',ui.includes("esc(String(r.reason||'بلاغ').slice(0,90))")],
 ['admin report timestamp is HTML-escaped',ui.includes("esc(r.createdAt||'—')")],
 ['unknown service health remains unverified',backend.includes("'Firebase Storage': null")&&ui.includes("'غير متحقق'")],
 ['null metrics are not presented as zero',ui.includes("n===null||n===undefined||n===''?'غير متاح'")],
 ['manual withdrawal approval does not complete payout',backend.includes("status:'approved_for_manual_payout'")],
 ['manual payout completion is a separate admin decision',backend.includes("decision === 'mark_paid'")&&backend.includes("status:'paid_manually_recorded'")],
 ['wallet mutations remain admin-authorized',(backend.match(/await requireSquadAdmin\(request\)/g)||[]).length>=5],
 ['wallet form remains responsive',css.includes('.am-wallet-form')&&css.includes('@media(max-width:520px)')],
 ['four project folders remain', ['chanse1','chanse2','chanse3','chanse4'].every(x=>fs.existsSync(x))]
];
let fail=0;for(const [name,ok] of checks){console.log((ok?'PASS ':'FAIL ')+name);if(!ok)fail++}
console.log(`${checks.length-fail}/${checks.length} full-audit checks passed`);if(fail)process.exit(1);
