const fs=require('fs'),assert=require('assert');
const fn=fs.readFileSync('chanse4/firebase-functions/index.js','utf8');
const ui=fs.readFileSync('chanse3/admin-monitor.js','utf8');
const css=fs.readFileSync('chanse3/admin-monitor.css','utf8');
const v=JSON.parse(fs.readFileSync('chanse4/version.json','utf8'));
const checks=[
 ['version is v148 (wallet retained)',v.build===148],
 ['wallet backend endpoints exist',['getPlatformWallet','recordPlatformEarning','requestPlatformWithdrawal','resolvePlatformWithdrawal'].every(x=>fn.includes('exports.'+x+' = onCall'))],
 ['every wallet mutation checks server-side admin access',(fn.match(/await requireSquadAdmin\(request\)/g)||[]).length>=5],
 ['money amounts validated and bounded',fn.includes('validMoneyAmount')&&fn.includes('n > 10000000')],
 ['withdrawal method allowlist exists',fn.includes("'Vodafone Cash'")&&fn.includes("'Bank transfer'")],
 ['balance change uses Firestore transaction',fn.includes('db.runTransaction(async (tx) =>')&&fn.includes('pendingWithdrawals')],
 ['wallet UI has earning and withdrawal actions',ui.includes('sqWalletAdd')&&ui.includes('sqWalletRequest')],
 ['wallet UI invokes server functions',ui.includes("walletCall('recordPlatformEarning'")&&ui.includes("walletCall('requestPlatformWithdrawal'")],
 ['manual payout limitation stated',ui.includes('لم يتم تحويل أموال تلقائيًا')&&ui.includes('التحويل المالي الفعلي يتم يدويًا')&&fn.includes("'mark_paid'") && ui.includes('تسجيل إتمام التحويل')],
 ['approval does not falsely count as a completed withdrawal',fn.includes("decision === 'approve'")&&fn.includes("decision === 'mark_paid'")&&fn.includes("totalWithdrawn:Number(w.totalWithdrawn||0)+Number(r.amount||0)")],
 ['untrusted report text is escaped before HTML rendering',ui.includes('esc(String(r.reason||\'بلاغ\').slice(0,90))')],
 ['unknown service checks are not shown as available',fn.includes("'Firebase Storage': null")&&ui.includes("v===true?'متاح':v===false?'تعذر الفحص':'غير متحقق'")],
 ['responsive wallet styling exists',css.includes('.am-wallet-form')&&css.includes('@media(max-width:520px)')]
];
let fail=0;for(const [n,ok] of checks){console.log((ok?'PASS ':'FAIL ')+n);if(!ok)fail++}console.log(`${checks.length-fail}/${checks.length} checks passed`);if(fail)process.exit(1);
