/* v27: الضغط على أي صورة أو اسم صاحب حساب يفتح ملفه الشخصي (البيانات العامة بس؛ الهاتف والميلاد بتظهر حسب خصوصية صاحبها وقواعد Firebase) */
(()=>{
const open=u=>{if(!u||!window.ACCTUI||!ACCTUI.prof)return;ACCTUI.prof(u)};
document.addEventListener('click',e=>{
 const a=e.target.closest&&e.target.closest('u.av[data-u]');
 if(a&&!a.closest('.pw,.st-pf,.st-me,#sh')){e.preventDefault();e.stopPropagation();open(a.dataset.u);return}
 const h=e.target.closest&&e.target.closest('#ct');
 let c=null;try{c=C[cid]}catch(x){}
 if(h&&c&&c.type=='p'){const p=c.members.find(x=>x!=me.uid);if(p){e.stopPropagation();open(p)}}
},true);
})();
