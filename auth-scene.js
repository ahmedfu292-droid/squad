/* The Squad — Dark Room login scene. Visual layer only; auth.js/acct.js/accounts.js remain untouched. */
(()=>{
 'use strict';
 const root=document.getElementById('auth');
 if(!root)return;
 const pull=document.getElementById('lampPull');
 const card=root.querySelector('.card');
 const hint=document.getElementById('lampHint');
 const soundButton=document.getElementById('lampSound');
 const go=document.getElementById('go');
 const error=document.getElementById('aerr');
 if(!pull||!card)return;
 const reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 let lit=false,dragging=false,startY=0,lastY=0,soundOn=false,suppressClick=false,errorTimer=0;
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 const setState=(name)=>root.dataset.loginState=name;
 const setViewport=()=>{const h=window.visualViewport?window.visualViewport.height:window.innerHeight;root.style.setProperty('--vvh',h+'px');};
 setViewport();
 window.addEventListener('resize',setViewport,{passive:true});
 if(window.visualViewport){window.visualViewport.addEventListener('resize',setViewport,{passive:true});window.visualViewport.addEventListener('scroll',setViewport,{passive:true});}
 const setPull=(distance)=>{
  const threshold=clamp((window.visualViewport?window.visualViewport.height:window.innerHeight)*.13,54,120);
  const progress=clamp(distance/threshold,0,1.25);
  root.style.setProperty('--pull-progress',String(progress));
  pull.style.transform='translateY('+(Math.min(distance,threshold*1.2)*.72)+'px) scaleY('+(1+progress*.48)+')';
  root.classList.toggle('is-pulling',progress>.04);
  root.classList.toggle('is-threshold',progress>=.88&&progress<1);
  const bulb=root.querySelector('.lamp-bulb');
  if(bulb&&!lit)bulb.style.opacity=String(.08+progress*.7);
  if(progress>.04&&!lit)setState(progress>=.88?'threshold':'pulling');
  return {progress,threshold};
 };
 const resetPull=()=>{root.classList.remove('is-pulling','is-threshold');pull.classList.remove('is-dragging');pull.style.transform='';root.style.removeProperty('--pull-progress');const bulb=root.querySelector('.lamp-bulb');if(bulb&&!lit)bulb.style.opacity='';};
 const softClick=()=>{
  if(!soundOn)return;
  try{const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;const ctx=new AC();const osc=ctx.createOscillator();const gain=ctx.createGain();osc.type='sine';osc.frequency.setValueAtTime(760,ctx.currentTime);osc.frequency.exponentialRampToValueAtTime(430,ctx.currentTime+.055);gain.gain.setValueAtTime(.0001,ctx.currentTime);gain.gain.exponentialRampToValueAtTime(.045,ctx.currentTime+.008);gain.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+.085);osc.connect(gain);gain.connect(ctx.destination);osc.start();osc.stop(ctx.currentTime+.09);osc.onended=()=>ctx.close().catch(()=>{});}catch(_e){}
 };
 const activate=()=>{
  if(lit)return;lit=true;resetPull();root.classList.add('is-lighting','is-lit');root.classList.remove('is-threshold');setState('flash');pull.disabled=true;pull.setAttribute('aria-label','تم تشغيل الأباجورة');
  if(navigator.vibrate&&!reduced){try{navigator.vibrate(12);}catch(_e){}}
  softClick();
  window.setTimeout(()=>{root.classList.remove('is-lighting');card.hidden=false;requestAnimationFrame(()=>card.classList.add('is-visible'));root.classList.add('card-revealed');setState('card');if(hint)hint.hidden=true;},reduced?90:680);
 };
 pull.addEventListener('pointerdown',e=>{
  if(lit||e.button!==0&&e.pointerType==='mouse')return;
  dragging=true;startY=e.clientY;lastY=e.clientY;pull.classList.add('is-dragging');
  try{pull.setPointerCapture(e.pointerId);}catch(_e){}
 });
 pull.addEventListener('pointermove',e=>{if(!dragging||lit)return;lastY=e.clientY;setPull(Math.max(0,e.clientY-startY));});
 const finishDrag=e=>{if(!dragging)return;dragging=false;const dy=Math.max(0,(e&&e.clientY!==undefined?e.clientY:lastY)-startY);const result=setPull(dy);suppressClick=true;window.setTimeout(()=>{suppressClick=false;},450);if(result.progress>=1)activate();else resetPull();};
 pull.addEventListener('pointerup',finishDrag);pull.addEventListener('pointercancel',()=>{dragging=false;resetPull();setState(lit?'card':'before-pull');});
 pull.addEventListener('lostpointercapture',()=>{if(dragging){dragging=false;resetPull();setState(lit?'card':'before-pull');}});
 pull.addEventListener('click',e=>{if(suppressClick){e.preventDefault();return;}if(e.detail===0&&!lit)activate();});
 pull.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&!lit){e.preventDefault();activate();}});
 if(soundButton){soundButton.addEventListener('click',()=>{soundOn=!soundOn;soundButton.setAttribute('aria-pressed',String(soundOn));soundButton.querySelector('span').textContent=soundOn?'الصوت مفتوح':'الصوت مغلق';soundButton.setAttribute('aria-label',soundOn?'إيقاف صوت نقرة الأباجورة':'تشغيل صوت نقرة الأباجورة');});}
 const showHint=()=>{if(!lit&&!reduced)root.classList.add('hint-ready');};
 window.setTimeout(showHint,2000);
 document.addEventListener('visibilitychange',()=>root.classList.toggle('is-paused',document.hidden));
 const syncState=()=>{
  if(root.hidden){if(root.dataset.everShown==='1'){setState('success');const wash=document.createElement('div');wash.className='scene-exit-wash';wash.setAttribute('aria-hidden','true');document.body.appendChild(wash);window.setTimeout(()=>wash.remove(),reduced?220:820);}return;}
  root.classList.add('auth-active');
  if(root.querySelector('#vup:not([hidden])')){root.classList.add('is-new-account');root.classList.remove('is-account-switch');setState('new-account');}
  else if(root.querySelector('#vacc:not([hidden])')&&root.querySelector('#vacc').children.length){root.classList.add('is-account-switch');root.classList.remove('is-new-account');setState('account-switch');}
  else if(root.classList.contains('is-loading'))setState('loading');
  else if(root.classList.contains('is-error'))setState('error');
  else if(card.classList.contains('is-visible')){root.classList.remove('is-new-account','is-account-switch');setState('card');}
  else if(!lit)setState('before-pull');
  root.dataset.everShown='1';
 };
 const authObserver=new MutationObserver(syncState);
 authObserver.observe(root,{attributes:true,attributeFilter:['hidden','class'],childList:true,subtree:true});
 if(!root.hidden){root.dataset.everShown='1';setState('before-pull');}
 if(error){const errorObserver=new MutationObserver(()=>{const has=!!error.textContent.trim();root.classList.toggle('is-error',has);card.classList.toggle('is-error',has);if(has){setState('error');window.clearTimeout(errorTimer);errorTimer=window.setTimeout(()=>{root.classList.remove('is-error');card.classList.remove('is-error');syncState();},reduced?100:1800);}else syncState();});errorObserver.observe(error,{childList:true,subtree:true,characterData:true});}
 if(go){const loadingObserver=new MutationObserver(()=>{const loading=!!go.disabled;root.classList.toggle('is-loading',loading);if(loading)setState('loading');else syncState();});loadingObserver.observe(go,{attributes:true,attributeFilter:['disabled']});}
 const modeObserver=new MutationObserver(syncState);modeObserver.observe(root.querySelector('.tb')||card,{attributes:true,subtree:true,attributeFilter:['class','hidden']});
})();
