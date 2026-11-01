const fs=require('fs'),path=require('path'),assert=require('assert');
const root=__dirname,read=p=>fs.readFileSync(path.join(root,p),'utf8');
const app=read('chanse1/app.js'),stage4=read('chanse3/stage4-chat-ui.js'),sw=read('chanse2/sw.js'),v=JSON.parse(read('chanse4/version.json'));
const checks=[
 ['build version 148',v.build===148],
 ['chat attachments tagged per message',app.includes('data-im-path=')&&app.includes('data-au-path=')],
 ['chat media loaded only near viewport',app.includes('function loadVisibleChatMedia()')&&app.includes('r.bottom<top||r.top>bottom')],
 ['chat media loading scheduled on animation frame',app.includes('function queueVisibleChatMedia()')&&app.includes('requestAnimationFrame')],
 ['chat scroll uses passive listener',app.includes("addEventListener('scroll',queueVisibleChatMedia,{passive:true})")],
 ['eager download of every attachment removed',!app.includes("Object.values(M).forEach(m=>{if(m.imPath)loadChatMedia(m.imPath)")],
 ['unread badge polling interval removed',!stage4.includes('setInterval(refreshBadge,2500)')],
 ['unread badge refresh hooks retained',stage4.includes("addEventListener('squad:unread-change',refreshBadge)")&&stage4.includes('window.renderHome=function()')],
 ['service worker cache version bumped',sw.includes('squad-v148-full-audit-fix')]
];
for(const [n,ok] of checks){console.log(`${ok?'PASS':'FAIL'} ${n}`);if(!ok)process.exitCode=1}
console.log(`${checks.filter(x=>x[1]).length}/${checks.length} checks passed`);
