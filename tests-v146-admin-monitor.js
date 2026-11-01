const fs=require('fs'),assert=require('assert');
const ui=fs.readFileSync('chanse3/admin-monitor.js','utf8');
const css=fs.readFileSync('chanse3/admin-monitor.css','utf8');
const html=fs.readFileSync('chanse3/index.html','utf8');
const fn=fs.readFileSync('chanse4/firebase-functions/index.js','utf8');
const version=JSON.parse(fs.readFileSync('chanse4/version.json','utf8'));
const checks=[
 ['build is v147 (admin monitor retained)',version.build===148],
 ['admin SID fixed in server and UI',ui.includes("1000000000")&&fn.includes("'1000000000'")],
 ['server validates authenticated UID against private ids mapping',fn.includes("db.doc(`ids/${SQUAD_ADMIN_SID}`)")&&fn.includes('mapping.data()?.u !== uid')],
 ['dashboard endpoints are callable and region-bound',fn.includes('exports.checkAdminAccess = onCall')&&fn.includes('exports.getAdminDashboard = onCall')],
 ['dashboard does not read private chat message bodies',!ui.includes('messages/')&&!fn.includes("collectionGroup('messages')")],
 ['dashboard uses server-side aggregation',fn.includes("collection(name).count().get()")],
 ['dashboard has user/chat/report/service overview',ui.includes('إجمالي الحسابات')&&ui.includes('لاعبو المدينة النشطون')&&ui.includes('المحادثات')&&ui.includes('آخر البلاغات')&&ui.includes('حالة الخدمات')],
 ['admin dashboard CSS and JS are loaded',html.includes('admin-monitor.css')&&html.includes('admin-monitor.js')],
 ['dashboard refreshes at a restrained 60-second interval',ui.includes('setInterval(load,60000)')],
 ['no destructive admin actions are exposed',!ui.includes('deleteDoc')&&!ui.includes('banUser')&&!ui.includes('deleteUser')],
 ['low-overhead responsive layout exists',css.includes('auto-fit')&&css.includes('@media(max-width:520px)')]
];
let fail=0;for(const [name,ok] of checks){console.log((ok?'PASS':'FAIL')+' '+name);if(!ok)fail++}console.log(`${checks.length-fail}/${checks.length} checks passed`);if(fail)process.exit(1);
