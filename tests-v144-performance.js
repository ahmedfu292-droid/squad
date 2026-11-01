const fs=require('fs'),path=require('path'),assert=require('assert');
const root=__dirname;
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const html=read('chanse3/index.html'), sw=read('chanse2/sw.js'), css=read('chanse3/performance-v144.css'), ver=JSON.parse(read('chanse4/version.json'));
const checks=[
 ['build version 148',ver.build===148],
 ['versioned service worker cache',sw.includes('squad-v148-full-audit-fix')],
 ['network-first document strategy',sw.includes('if(isPage||u.pathname.endsWith')],
 ['cache-first static strategy',sw.includes('caches.match(q).then(hit=>hit||fetch(q)')],
 ['no per-hit background revalidation',!sw.includes('fetch(q).then(r=>{if(r.ok)caches.open(C)')],
 ['low-end device detection',html.includes('navigator.hardwareConcurrency')&&html.includes('navigator.deviceMemory')],
 ['save-data detection',html.includes('connection&&navigator.connection.saveData')],
 ['lightweight stylesheet linked',html.includes('href="performance-v144.css"')],
 ['low-end blur reduction',css.includes('backdrop-filter:none!important')],
 ['reduced motion support',css.includes('prefers-reduced-motion:reduce')],
 ['unused Manrope font removed',!html.includes('family=Manrope')],
 ['existing city adaptive quality retained',read('chanse2/district.js').includes('ren.setPixelRatio(next)')]
];
for(const [name,ok] of checks){console.log(`${ok?'PASS':'FAIL'} ${name}`);if(!ok)process.exitCode=1}
console.log(`${checks.filter(x=>x[1]).length}/${checks.length} checks passed`);
