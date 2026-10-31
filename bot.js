(()=>{
/* The Squad — مساعدين مثبتين في قائمة المحادثات: مساعد عام ومساعد ألعاب. خوارزميات قواعد جوه التطبيق */
const RB=`<svg viewBox="0 0 120 120"><defs><linearGradient id="gk" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f3d77a"/><stop offset="1" stop-color="#b8860b"/></linearGradient></defs><rect width="120" height="120" fill="#0e0d0a"/><path d="M60 22l9 24 25 9-25 9-9 25-9-25-25-9 25-9z" fill="url(#gk)"/></svg>`;
const BOTS={
 gen:{n:'مساعد The Squad',d:'مساعدك الشخصي',hi:'مرحباً! أنا مساعد The Squad. اكتب «مساعدة» أو دوس على زرار.',q:[['💡 معلومات عامة','الساعه كام'],['🌤 الطقس','الطقس'],['🌐 ترجمة','ترجم'],['📚 دراسة','ذاكر'],['🎮 ألعاب','العب'],['⏰ ذكّرني','ذكرني بعد 10 دقايق اشرب مياه'],['📝 ملاحظاتي','ملاحظاتي'],['⚙️ أوامر','مساعدة']]},
 game:{n:'مساعد الألعاب',d:'خبير عالم الألعاب 🎮',hi:'أهلاً يا جيمر 🎮 اسألني عن أي لعبة (ببجي، فورتنايت، ماين كرافت...)، أو اطلب ترشيح، أو اختبر معلوماتك. معلوماتي مدمجة في التطبيق وبتتحدّث مع كل نسخة، مش لحظياً.',q:[['🔥 رشحلي لعبة','رشحلي لعبة'],['🧠 اختبار ألعاب','اختبار'],['🎯 نصايح','نصايح'],['🖥 أي جهاز؟','جهاز'],['🎲 لعبة تخمين','العب']]}};
let RAW='';const pk=a=>a[Math.random()*a.length|0];
const nz=s=>s.replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d)).toLowerCase().replace(/[ًٌٍَُِّْـ]/g,'').replace(/[أإآ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').trim();
const KB=[
['ببجي|pubg','PUBG Mobile باتل رويال تكتيكي: انزل على الأطراف لو لسه بتتعلم، ادخل الدايرة بدري، والسماعة بتكشفلك الخطوات. ظبّط الحساسية من التدريب.'],
['فورتنايت|fortnite','Fortnite باتل رويال مع بناء. اتعلم الحيطة والرامب الأول، والأسلحة بتتغير كل سيزون.'],
['فري فاير|free fire','Free Fire خفيفة ومناسبة للأجهزة الضعيفة، الماتش حوالي 10 دقايق وللشخصيات قدرات خاصة.'],
['كول اوف|call of duty|warzone|cod','Call of Duty سلسلة FPS. Warzone باتل رويال مجانية وCOD Mobile على الموبايل. الـ ping والحساسية أهم حاجة.'],
['ماين كرافت|minecraft','Minecraft: Survival للبقاء والبناء وCreative للبناء الحر، وتتلعب مع صحابك على سيرفر.'],
['روبلوكس|roblox','Roblox منصة فيها آلاف الألعاب اللي بيعملها لاعبين. اظبط إعدادات الخصوصية لو الأطفال بيلعبوا.'],
['gta|جراند ثيفت|جي تي ايه','GTA V عالم مفتوح وفيه GTA Online للعب الجماعي. موعد GTA VI اتأكد منه من المصدر الرسمي.'],
['فيفا|fifa|ea fc|efootball|بيس','كرة القدم: EA FC (فيفا سابقاً) فيها Ultimate Team، وeFootball (بيس سابقاً) مجانية وتحكمها واقعي.'],
['فالورانت|valorant','Valorant تكتيكية 5 ضد 5 بعملاء بقدرات. ابدأ بعميل سهل زي Sage وركّز على التصويب للراس والتواصل.'],
['كاونتر|counter|cs2|csgo','CS2 تكتيكية كلاسيكية: الاقتصاد (شراء الأسلحة) والقنابل أهم من السرعة في البداية.'],
['ليج اوف ليجندز|league|lol|دوتا|dota','MOBA زي League وDota 2 محتاجة وقت. اتعلم بطل واحد الأول وركّز على ضرب الجنود (last hit).'],
['ابكس|apex','Apex Legends باتل رويال سريعة بأبطال وفرق من 3، والحركة (slide) هي سر المحترفين.'],
['جينشن|genshin','Genshin Impact: RPG عالم مفتوح مجانية بنظام Gacha. وفّر الجواهر وماتصرفش على أول بانر.'],
['كلاش|clash|براول|brawl','ألعاب Supercell: Clash Royale (كروت)، Clash of Clans (استراتيجي)، Brawl Stars (معارك سريعة).'],
['روكيت ليج|rocket league','Rocket League: كرة قدم بالعربيات، سهلة تبدأ وصعبة تتقنها.'],
['ايلدن|elden|سولز|souls','Elden Ring: RPG صعبة بعالم مفتوح. استخدم الاستدعاءات (Spirit Ashes) لو علقت.'],
['زيلدا|zelda|ماريو|mario|بوكيمون|pokemon|سويتش|switch','ألعاب Nintendo على Switch: Zelda للاستكشاف، Mario للمرح، Pokémon للتجميع.'],
['ويتشر|witcher|ريد ديد|red dead|god of war|سبايدر|last of us','ألعاب قصة قوية: The Witcher 3 وRed Dead 2 وGod of War وSpider-Man وThe Last of Us.'],
['امونج|among us','Among Us لعبة استنتاج اجتماعي، أحلى حاجة تتلعب مع صحابك على فويس.']];
const GN=[['باتل رويال|battle','Fortnite، PUBG، Free Fire، Apex، Warzone'],['رعب','Resident Evil، Dead Space، Phasmophobia (تعاوني)'],['استراتيجي|استراتيجيه','Clash of Clans، Civilization، Age of Empires'],['رياضه|كوره','EA FC، eFootball، NBA 2K'],['سباق','Forza، Need for Speed، Mario Kart'],['قتال','Tekken، Mortal Kombat، Street Fighter'],['عالم مفتوح','GTA V، Red Dead 2، Elden Ring، Zelda'],['تعاون|صحابي|اصحابي','Minecraft، Among Us، It Takes Two، Phasmophobia'],['موبايل|اندرويد|ايفون','COD Mobile، PUBG Mobile، Genshin، Brawl Stars'],['قصه|سينمائي','The Witcher 3، God of War، The Last of Us']];
const QZ=[['مين الشركة اللي صنعت Minecraft الأصلية؟',['موجانج','mojang']],['اسم بطل سلسلة Zelda؟',['لينك','link']],['كام لاعب في فريق Valorant؟',['5','خمسه','خمسة']],['اللعبة اللي فيها مدينة Los Santos؟',['gta','جي تي ايه','جراند']],['شركة Nintendo بتصنع جهاز اسمه إيه؟',['سويتش','switch']]];
let BG=null,QS=null,B=null,H={};try{H=JSON.parse(localStorage.bh||'{}')}catch(e){}
Object.keys(BOTS).forEach(k=>H[k]=H[k]||[]);
const has=(s,ks)=>ks.split('|').some(k=>s.includes(nz(k)));
const bclose=()=>{hideBot();$('#app').classList.remove('in')};
const IN=[
 [/^(سلام|مرحب|اهلا|هاي|هلو|صباح|مساء|ازيك)/,()=>pk(['أهلاً '+nm()+' 👋 أؤمرني','مرحباً! عايز تعمل إيه النهارده؟'])],
 [/الساعه|الوقت/,()=>'الساعة دلوقتي '+new Date().toLocaleTimeString('ar-EG',{hour:'2-digit',minute:'2-digit'})],
 [/التاريخ|النهارده|يوم ايه/,()=>'النهارده '+new Date().toLocaleDateString('ar-EG',{weekday:'long',day:'numeric',month:'long',year:'numeric'})],
 [/(افتح|روح|وديني).*(حالات|تحديثات|قناه|قنوات)/,()=>(bclose(),go('up'),'فتحتلك التحديثات ✅')],
 [/(افتح|روح|وديني).*(استكشاف|بحث)/,()=>(bclose(),go('find'),'فتحتلك الاستكشاف ✅')],
 [/(افتح|روح|وديني).*(حسابي|ملفي|اعدادات)/,()=>(bclose(),go('me'),'فتحتلك حسابك ✅')],
 [/(انشي|اعمل|عايز).*(جروب|مجموعه)/,()=>(bclose(),go('find'),'اكتب اسم الجروب واضغط إنشاء ✅')],
 [/^(افتح|كلم|وديني ل)\s*(محادثه|شات)?\s*(.+)/,(_,m)=>{const q=m[3],c=Object.values(C).find(x=>nz(cname(x)).includes(q));if(!c)return 'ملقيتش محادثة باسم «'+q+'»';openChat(c.id);return 'فتحتلك '+cname(c)+' ✅'}],
 [/لعبه تخمين|العب|العاب/,()=>(BG={n:1+Math.random()*100|0,t:0},'🎮 فكرت في رقم من 1 لـ 100. خمّنه! (اكتب «خلاص» للوقف)')],
 [/نرد/,()=>'🎲 طلع '+(1+Math.random()*6|0)],[/عمله|طرة/,()=>'🪙 '+pk(['صورة','كتابة'])],
 [/نكته|ضحكني|هزار/,()=>pk(['واحد نسي باسورد الواي فاي... طلع مكتوب على الراوتر 😂','ليه الكمبيوتر مبيخافش؟ عشان عنده Windows 😎'])],
 [/ذاكر|مذاكره|دراسه|بومودورو/,()=>(setTimeout(()=>{toast('⏰ خلصت 25 دقيقة مذاكرة، خد راحة 5 دقايق');navigator.vibrate&&navigator.vibrate([300,150,300])},15e5),'📚 بدأت مؤقت مذاكرة 25 دقيقة وهنبّهك (طول ما التطبيق مفتوح)')],
 [/طقس|جو/,()=>'الطقس محتاج خدمة خارجية ولسه مش مربوطة.'],[/ترجم/,()=>'الترجمة الحية محتاجة خدمة خارجية ولسه مش مربوطة، وهتتضاف في مرحلة جاية.'],
 [/^ذكرني بعد\s*(\d+)\s*(ثانيه|ثواني|دقيقه|دقايق|ساعه|ساعات)?/,(_,m)=>{const n=+m[1],u=m[2]||'دقيقه',k=/ثان/.test(u)?1e3:/ساع/.test(u)?36e5:6e4,w=RAW.replace(/^.*?بعد\s*[\d٠-٩]+\s*\S*\s*/,'')||'التذكير بتاعك';if(n*k>864e5||!n)return 'اختار مدة لحد 24 ساعة';
  setTimeout(()=>{toast('⏰ '+w);navigator.vibrate&&navigator.vibrate([300,150,300]);window.Notification&&Notification.permission=='granted'&&new Notification('⏰ تذكير',{body:w,icon:'icon-192.png'})},n*k);return '⏰ تمام، هفكّرك بعد '+n+' '+u+' (طول ما التطبيق مفتوح)'}],
 [/^(احفظ|سجل|دون)\s/,()=>{const t=RAW.replace(/^\S+\s*(ملاحظ\S*)?\s*/,'').trim();if(!t)return 'اكتب الملاحظة بعد كلمة احفظ';const a=JSON.parse(localStorage.nts||'[]');a.unshift(t.slice(0,300));localStorage.nts=JSON.stringify(a.slice(0,30));return '📝 اتحفظت. اكتب «ملاحظاتي» تشوفها'}],
 [/^(ملاحظاتي|الملاحظات)/,()=>{const a=JSON.parse(localStorage.nts||'[]');return a.length?'📝 ملاحظاتك:\n'+a.map((x,i)=>(i+1)+') '+x).join('\n')+'\n(اكتب «امسح الملاحظات» للمسح)':'مفيش ملاحظات. اكتب «احفظ ...»'}],
 [/^امسح الملاحظات/,()=>(localStorage.removeItem('nts'),'🗑 اتمسحت الملاحظات')],
 [/مساعده|اوامر|تعمل ايه|ساعدني/,()=>'أقدر: أقولك الساعة والتاريخ | أحسب (اكتب 12*5) | أفتح التحديثات أو الاستكشاف أو حسابك | أفتح محادثة (اكتب «افتح أحمد») | أعمل جروب | لعبة تخمين | نرد وعملة ونكتة | مؤقت مذاكرة | «ذكرني بعد 10 دقايق ...» | «احفظ ...» و«ملاحظاتي». وللألعاب كلّم «مساعد الألعاب» 🎮']];
function common(s){
 if(BG){if(/^(خلاص|وقف|انهي)/.test(s)){BG=null;return 'تمام وقفنا اللعبة'}const n=+s;if(!Number.isInteger(n))return 'اكتب رقم من 1 لـ 100';BG.t++;if(n==BG.n){const t=BG.t;BG=null;return `🎉 صح! الرقم كان ${n} وخلصتها في ${t} محاولة`}return n<BG.n?'أكبر ⬆️':'أصغر ⬇️'}
 const ex=s.replace(/^(احسب|حساب)\s*/,'').replace(/[x×]/g,'*').replace(/÷/g,'/');
 if(/^[\d\s+\-*/().%]+$/.test(ex)&&/\d\s*[+\-*/%]\s*[\d(]/.test(ex)){try{const r=Function('return '+ex)();if(isFinite(r))return '🧮 '+ex+' = '+(+r.toFixed(6))}catch(e){}return 'مقدرتش أحسب المعادلة دي'}
 for(const[r,f]of IN){const m=s.match(r);if(m)return f(s,m)}}
function gameReply(s){
 if(QS){const q=QZ[QS.i],ok=q[1].some(a=>s.includes(nz(a)));if(ok)QS.s++;let r=(ok?'✅ صح!':'❌ غلط، الإجابة: '+q[1][0])+'\n';QS.i++;
  if(QS.i>=QZ.length){r+=`خلص الاختبار! نتيجتك ${QS.s}/${QZ.length} `+(QS.s>=4?'🏆 جيمر محترف':'💪 كمّل وهتبقى أحسن');QS=null;return r}return r+'\n'+QZ[QS.i][0]}
 if(/اختبار|اسئله|كويز/.test(s)){QS={i:0,s:0};return '🧠 اختبار من '+QZ.length+' أسئلة. أول سؤال:\n'+QZ[0][0]}
 for(const[k,t]of KB)if(has(s,k))return t;
 for(const[k,t]of GN)if(has(s,k))return '🔥 ترشيحاتي: '+t;
 if(/رشح|اقترح|ايه احسن|العب ايه/.test(s))return 'تحب نوع إيه؟ اكتب واحد: باتل رويال، رعب، استراتيجي، رياضة، سباق، قتال، عالم مفتوح، تعاوني، موبايل، قصة';
 if(/جهاز|بلايستيشن|ps5|اكسبوكس|xbox|pc|كمبيوتر/.test(s))return '🖥 PS5: أقوى ألعاب قصة حصرية. Xbox Series + Game Pass: أفضل قيمة. Switch: محمول ولعب عائلي. PC: حرية وألعاب أكتر ومجانيات. موبايل: أرخص بداية.';
 if(/نصايح|نصيحه|تحسين|لاج|ping|بنج/.test(s))return '🎯 1) سلك شبكة أحسن من الواي فاي 2) اقفل التحميلات وقت اللعب 3) ظبّط الحساسية في التدريب 4) سماعة كويسة 5) استراحة كل ساعة.'}
function botReply(k,raw){RAW=raw;const s=nz(raw);return (k=='game'?gameReply(s):0)||common(s)||(k=='game'?'ملقيتش المعلومة دي عندي 🎮 جرّب اسم لعبة أو «رشحلي لعبة» أو «اختبار».':'مفهمتش 😅 جرّب «مساعدة» أو دوس على واحد من الأزرار.')}
/* ---- الواجهة: شات مثبت جوه لوحة الشات ---- */
$('#chat').insertAdjacentHTML('beforeend',`<div id="bot" hidden><div class="bh"><button id="bbk" class="ic"></button><u class="av rb">${RB}</u><div><b id="bn"></b><small>متصل الآن</small></div></div><div id="bm"></div><div id="bq"></div><div class="bi"><input id="bin" placeholder="اكتب رسالتك..." maxlength="200"><button id="bs" class="ic pri"></button></div></div>`);
$('#bbk').innerHTML=ic('back');$('#bs').innerHTML=ic('send');
const drw=()=>{$('#bm').innerHTML=H[B].map(([m,t])=>`<div class="${m?'bu':'bb'}">${esc(t)}</div>`).join('');$('#bm').scrollTop=1e9};
function say(k,t,m){H[k].push([m,t]);H[k]=H[k].slice(-40);try{localStorage.bh=JSON.stringify(H)}catch(e){}B==k&&drw();renderHome()}
function hideBot(){B=null;$('#bot').hidden=true}
function openBot(k){B=k;cid=null;$('#app').classList.add('in');$('#bot').hidden=false;$('#bn').textContent=BOTS[k].n;
 $('#bq').innerHTML=BOTS[k].q.map(q=>`<button data-q="${q[1]}">${q[0]}</button>`).join('');H[k].length?drw():say(k,BOTS[k].hi,0);renderHome()}
window.SquadOpenAssistant=(k)=>openBot(k==='game'?'game':'gen');
function bsend(t){t=(t||$('#bin').value).trim();if(!t||!B)return;const k=B;$('#bin').value='';say(k,t,1);setTimeout(()=>say(k,botReply(k,t),0),350)}
$('#bbk').onclick=()=>{bclose();renderHome()};$('#bs').onclick=()=>bsend();$('#bin').onkeydown=e=>{if(e.key=='Enter')bsend()};$('#bq').onclick=e=>e.target.dataset.q&&bsend(e.target.dataset.q);
const rh0=renderHome;renderHome=function(){rh0();if(flt=='p'||flt=='g'||$('#q').value)return;
 $('#list').insertAdjacentHTML('afterbegin',Object.keys(BOTS).map(k=>{const l=H[k][H[k].length-1];return `<div class="wi${B==k?' on':''}" data-bot="${k}"><u class="av rb">${RB}</u><div><b>📌 ${BOTS[k].n} <i class="vf">✔</i></b><span>${l?esc(l[1].split('\n')[0].slice(0,60)):BOTS[k].d}</span></div><em></em></div>`}).join(''))};
$('#list').addEventListener('click',e=>{const w=e.target.closest('[data-bot]');w&&openBot(w.dataset.bot)});
const oc0=openChat;openChat=function(id){hideBot();return oc0(id)};
$('#side h2').innerHTML='The Squad<small>أكثر من مجرد دردشة</small>';const mb=document.querySelector('#nav [data-go=me]');mb&&(mb.lastChild.textContent='المزيد');
$('#gear').onclick=()=>go('me');
})();
