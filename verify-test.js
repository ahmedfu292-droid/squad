/* اختبار منطق التوثيق. مهم: ده مش محاكي Firebase الحقيقي. ده نموذج (model) كتبته بإيدي بيترجم شروط firestore.rules
   لنفس المنطق (حالة قبل الـ batch = get/exists، وحالة بعدها = getAfter/existsAfter) وبيشغّل كود toggleFollow و VFB الحقيقيين من stories.js. */
const fs=require('fs');
let pass=0,fail=0;const ok=(c,m)=>{c?pass++:(fail++,console.log('  ✗ FAIL:',m));c&&console.log('  ✓',m)};

/* ---- قاعدة بيانات وهمية ---- */
const TS={t:'ts'},DEL={del:1};
const inc=n=>({inc:n}),aU=v=>({aU:v}),aR=v=>({aR:v});
const FV={increment:inc,arrayUnion:aU,arrayRemove:aR,serverTimestamp:()=>TS,delete:()=>DEL};
const apply=(old,o,merge)=>{const r=merge?{...(old||{})}:{};for(const[k,v]of Object.entries(o)){
  if(v&&v.inc!==undefined)r[k]=(r[k]||0)+v.inc;else if(v&&v.aU!==undefined)r[k]=[...new Set([...(r[k]||[]),v.aU])];
  else if(v&&v.aR!==undefined)r[k]=(r[k]||[]).filter(x=>x!=v.aR);else if(v===DEL)delete r[k];else r[k]=v}return r};
function mkDB(){const D=new Map();let uid=null;
 const rules={
  /* نموذج مطابق لـ firestore.rules (قسم القنوات + المتابعين + users) */
  check(op,path,pre,post,A){const [c1,i1,c2,i2]=path.split('/'),me=A.uid;
   const official=()=>((A.get('users/'+me)||{}).sid=='1000000000');
   if(c1=='users'&&!c2){ if(i1!=me)return false; return true }
   if(c1=='channels'&&!c2){
    if(op=='create'){return post.o==me&&Object.keys(post).every(k=>['nm','ds','o','on','off','fc','t'].includes(k))&&post.fc===0&&(!post.off||official())}
    if(op=='update'){
     const owner=pre.o==me&&post.o==pre.o&&post.fc===pre.fc&&!!post.off==!!pre.off;
     const diff=Object.keys({...pre,...post}).filter(k=>JSON.stringify(pre[k])!=JSON.stringify(post[k]));
     const fp=`channels/${i1}/followers/${me}`;
     const other=pre.o!=me&&diff.length==1&&diff[0]=='fc'&&(
       (post.fc-pre.fc==1&&!A.exists(fp)&&A.existsAfter(fp))||(post.fc-pre.fc==-1&&A.exists(fp)&&!A.existsAfter(fp)));
     return owner||other}
    if(op=='delete')return pre.o==me}
   if(c1=='channels'&&c2=='followers'){const ch='channels/'+i1;
    if(op=='create')return i2==me&&A.get(ch).o!=me&&Object.keys(post).every(k=>k=='t')&&A.getAfter(ch).fc==A.get(ch).fc+1;
    if(op=='update')return false;
    if(op=='delete')return i2==me&&A.getAfter(ch).fc==A.get(ch).fc-1}
   return false}};
 const db={_D:D,as(u){uid=u},
  doc(p){return{path:p,async get(){const v=D.get(p);return{exists:v!==undefined,data:()=>v}}}},
  batch(){const ops=[];const b={set(r,o){ops.push(['set',r.path,o]);return b},update(r,o){ops.push(['update',r.path,o]);return b},delete(r){ops.push(['delete',r.path]);return b},
   async commit(){const post=new Map(D);const kinds=[];
    for(const[t,p,o]of ops){const had=post.has(p);
     if(t=='set'){kinds.push([had?'update':'create',p]);post.set(p,apply(null,o,false))}
     else if(t=='update'){if(!had)throw new Error('NOT_FOUND '+p);kinds.push(['update',p]);post.set(p,apply(post.get(p),o,true))}
     else{kinds.push(['delete',p]);post.delete(p)}}
    const A={uid,get:p=>D.get(p),getAfter:p=>post.get(p),exists:p=>D.has(p),existsAfter:p=>post.has(p)};
    /* تقييم كل عملية: pre من الحالة قبل الـ batch، post من الحالة بعد تطبيق كل العمليات (زي Firestore) */
    for(const[k,p]of kinds){if(!rules.check(k,p,D.get(p)||{},post.get(p)||{},A))throw new Error('PERMISSION_DENIED '+k+' '+p)}
    D.clear();post.forEach((v,k)=>D.set(k,v))}};return b},
  seed(p,v){D.set(p,v)}};
 return db}

/* ---- تحميل الكود الحقيقي من stories.js ---- */
const src=fs.readFileSync(__dirname+'/../stories.js','utf8');
const grab=(a,b)=>{const i=src.indexOf(a),j=src.indexOf(b,i);if(i<0||j<0)throw new Error('marker '+a);return src.slice(i,j)};
const code=grab('const VF_MIN=5000;','await b.commit()}')+'await b.commit()}';
function env(db,uid){const state={me:{uid},U:{follow:[]},CH:{},toasts:[]};
 const fn=new Function('db','FV','state','toast',`const me=state.me;const U=state.U;const CH=state.CH;${code};return{toggleFollow,VFB,VF_MIN}`);
 return{...fn(db,FV,state,t=>state.toasts.push(t)),state}}
const mkUser=(db,uid)=>{db.seed('users/'+uid,{sid:'2'+String(uid).padStart(900009,'0'),follow:[]});return uid};
const sync=(db,e,uid,ch)=>{e.state.me.uid=uid;e.state.U.follow=(db._D.get('users/'+uid)||{}).follow||[];e.state.CH[ch]={id:ch,...db._D.get('channels/'+ch)}};
const expectDenied=async(fnc,m)=>{try{await fnc();ok(false,m+' (اتقبلت وكان لازم تترفض)')}catch(e){ok(/PERMISSION_DENIED/.test(e.message),m+' → '+e.message.slice(0,60))}};

(async()=>{
 const db=mkDB(),e=env(db,'x');
 const asU=u=>{db.as(u);sync(db,e,u,'ch1')};

 console.log('\n[1] قناة جديدة بتبدأ من غير توثيق');
 mkUser(db,900100);db.as(900100);
 await db.batch().set(db.doc('channels/ch1'),{nm:'قناتي',ds:'',o:900100,on:'a',fc:0,t:TS}).commit();
 sync(db,e,900100,'ch1');ok(e.VFB(e.state.CH.ch1)==='','القناة الجديدة fc=0 من غير علامة');
 await expectDenied(()=>db.batch().set(db.doc('channels/chBad'),{nm:'x',o:900100,fc:5000,t:TS}).commit(),'إنشاء قناة بـ fc=5000 مرفوض');
 await expectDenied(()=>db.batch().set(db.doc('channels/chBad2'),{nm:'x',o:900100,fc:0,off:true,t:TS}).commit(),'إنشاء قناة بـ off:true من حساب عادي مرفوض');

 console.log('\n[2] 4999 ثم 5000 ثم إلغاء متابعة');
 for(let u=1;u<=4999;u++){mkUser(db,u);asU(u);await e.toggleFollow('ch1')}
 sync(db,e,900100,'ch1');
 ok(db._D.get('channels/ch1').fc===4999,'العدد بعد 4999 مستخدم = 4999');
 ok([...db._D.keys()].filter(k=>k.startsWith('channels/ch1/followers/')).length===4999,'عدد مستندات المتابعين = 4999 (العدد مطابق للقاعدة)');
 ok(e.VFB(e.state.CH.ch1)==='','عند 4999: مفيش علامة');
 mkUser(db,5000);asU(5000);await e.toggleFollow('ch1');sync(db,e,5000,'ch1');
 ok(db._D.get('channels/ch1').fc===5000,'بعد المتابع رقم 5000 العدد = 5000');
 ok(/✔/.test(e.VFB(e.state.CH.ch1))&&/5000/.test(e.VFB(e.state.CH.ch1)),'عند 5000: العلامة الزرقاء ظهرت (توثيق وصول)');
 await e.toggleFollow('ch1');sync(db,e,5000,'ch1');
 ok(db._D.get('channels/ch1').fc===4999,'بعد إلغاء المتابعة العدد رجع 4999');
 ok(e.VFB(e.state.CH.ch1)==='','بعد إلغاء المتابعة (4999): العلامة اختفت');
 await e.toggleFollow('ch1');sync(db,e,5000,'ch1');
 ok(db._D.get('channels/ch1').fc===5000&&/✔/.test(e.VFB(e.state.CH.ch1)),'متابعة تاني: رجع 5000 والعلامة رجعت');
 ok(!db._D.get('users/5000').follow.length==false,'قايمة متابعات المستخدم اتحدّثت');

 console.log('\n[3] محاولات التزوير (لازم كلها تترفض)');
 asU(1);// المستخدم 1 متابع فعلاً
 await expectDenied(()=>db.batch().update(db.doc('channels/ch1'),{fc:FV.increment(1)}).commit(),'زيادة العداد من غير مستند متابع');
 await expectDenied(()=>db.batch().update(db.doc('channels/ch1'),{fc:FV.increment(500)}).commit(),'زيادة العداد +500');
 await expectDenied(()=>db.batch().set(db.doc('channels/ch1/followers/1'),{t:TS}).update(db.doc('channels/ch1'),{fc:FV.increment(1)}).commit(),'متابعة تاني لنفس المستخدم (مستند موجود) = عدّ مرتين');
 await expectDenied(()=>db.batch().delete(db.doc('channels/ch1/followers/1')).commit(),'مسح مستند المتابع من غير إنقاص العداد');
 await expectDenied(()=>db.batch().delete(db.doc('channels/ch1/followers/1')).update(db.doc('channels/ch1'),{fc:FV.increment(-2)}).commit(),'مسح متابع مع إنقاص -2');
 mkUser(db,7001);asU(7001);
 await expectDenied(()=>db.batch().set(db.doc('channels/ch1/followers/1'),{t:TS}).update(db.doc('channels/ch1'),{fc:FV.increment(1)}).commit(),'إنشاء مستند متابع باسم مستخدم تاني');
 await expectDenied(()=>db.batch().set(db.doc('channels/ch1/followers/7001'),{t:TS}).update(db.doc('channels/ch1'),{fc:FV.increment(2)}).commit(),'مستند متابع + عداد +2');
 await expectDenied(()=>db.batch().set(db.doc('channels/ch1/followers/7001'),{t:TS,x:1}).update(db.doc('channels/ch1'),{fc:FV.increment(1)}).commit(),'مستند متابع بحقول زيادة');
 await expectDenied(()=>db.batch().update(db.doc('channels/ch1'),{fc:FV.increment(1)}).update(db.doc('users/7001'),{follow:FV.arrayUnion('ch1')}).commit(),'تعديل قايمة المتابعات بس من غير مستند متابع');
 ok(db._D.get('channels/ch1').fc===5000,'العدد لسه 5000 بعد كل المحاولات');
 console.log('   صاحب القناة:');
 db.as(900100);sync(db,e,900100,'ch1');
 await expectDenied(()=>db.batch().set(db.doc('channels/ch1/followers/900100'),{t:TS}).update(db.doc('channels/ch1'),{fc:FV.increment(1)}).commit(),'المالك يتابع قناته');
 await expectDenied(()=>db.batch().update(db.doc('channels/ch1'),{fc:9999}).commit(),'المالك يكتب fc بإيده');
 await expectDenied(()=>db.batch().update(db.doc('channels/ch1'),{off:true}).commit(),'المالك يكتب off:true على قناته');
 await expectDenied(()=>db.batch().update(db.doc('channels/ch1'),{fc:FV.increment(1)}).commit(),'المالك يزوّد العداد');
 try{await db.batch().update(db.doc('channels/ch1'),{ds:'وصف جديد'}).commit();ok(true,'المالك يقدر يعدّل الوصف (مسموح)')}catch(x){ok(false,'تعديل الوصف اترفض: '+x.message)}
 await e.toggleFollow('ch1');ok(e.state.toasts.includes('دي قناتك')&&db._D.get('channels/ch1').fc===5000,'زرار المتابعة في الواجهة بيرفض المالك والعدد ما اتغيّرش');
 asU(7001);
 await expectDenied(()=>db.batch().update(db.doc('channels/ch1'),{ds:'اختراق'}).commit(),'مستخدم عادي يعدّل وصف القناة');

 console.log('\n[4] التوثيق اليدوي للقناة الرسمية منفصل');
 db.seed('users/900009',{sid:'1000000000',follow:[]});db.as(900009);
 await db.batch().set(db.doc('channels/squad'),{nm:'The Squad',ds:'',o:900009,on:'x',off:true,fc:0,t:TS}).commit();
 const sq=()=>({id:'squad',...db._D.get('channels/squad')});
 ok(/القناة الرسمية/.test(e.VFB(sq()))&&sq().fc===0,'الرسمية موثّقة يدوياً وهي على fc=0');
 for(let u=1;u<=5000;u++){db.as(u);e.state.me.uid=u;e.state.U.follow=db._D.get('users/'+u).follow||[];e.state.CH.squad=sq();await e.toggleFollow('squad')}
 ok(/القناة الرسمية/.test(e.VFB(sq()))&&sq().fc===5000,'عند 5000: لسه موثّقة كـ«رسمية» (مش كتوثيق وصول)');
 db.as(1);e.state.me.uid=1;e.state.U.follow=db._D.get('users/1').follow;await e.toggleFollow('squad');
 ok(sq().fc===4999&&/القناة الرسمية/.test(e.VFB(sq())),'بعد النزول لـ 4999: الرسمية محتفظة بعلامتها اليدوية');
 ok(!/الرسمية/.test(e.VFB(e.state.CH.ch1)),'القناة العادية عند 5000 علامتها «موثّقة 5000» مش «رسمية»');

 console.log('\n[5] متابعة قديمة (قبل نظام العدّ)');
 db.seed('users/8000',{sid:'200008000',follow:['ch1']});db.as(8000);sync(db,e,8000,'ch1');const before=db._D.get('channels/ch1').fc;
 await e.toggleFollow('ch1');
 ok(db._D.get('channels/ch1').fc===before&&!(db._D.get('users/8000').follow||[]).includes('ch1'),'المتابعة القديمة بتتشال من قايمة المستخدم بس والعدد ما بيتخرّبش');
 console.log(`\nالنتيجة: ${pass} نجح، ${fail} فشل`);process.exit(fail?1:0)})().catch(e=>{console.error('ERR',e);process.exit(2)});
