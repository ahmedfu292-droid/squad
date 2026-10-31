/* The Squad — Living Palace foundation v70. Isolated from vehicle rendering and Firebase auth. */
(()=>{
 'use strict';
 const auth=document.getElementById('auth'); if(!auth) return;
 const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const scene=document.createElement('canvas'); scene.id='lp-scene'; scene.setAttribute('aria-hidden','true');
 const overlay=document.createElement('canvas'); overlay.id='lp-rope'; overlay.setAttribute('aria-label','اسحب خيط المصباح لفتح القصر');
 auth.prepend(scene,overlay); auth.classList.add('lp-locked');
 const intro=document.createElement('div'); intro.id='lp-intro'; intro.innerHTML='<div class="lp-eyebrow">THE SQUAD · LIVING PALACE</div><div class="lp-title">القصر الحي</div><p>اسحب خيط المصباح… ودع النور يكشف القصر</p><button type="button" id="lp-pull">اسحب خيط المصباح</button><span class="lp-hint">يمكنك أيضاً الضغط على الخيط أو استخدام زر الدخول</span>';
 auth.append(intro);
 const gl=scene.getContext('webgl2',{alpha:false,antialias:false,powerPreference:'low-power'});
 let program=null,buf=null,uniforms={},quality=1,frames=0,last=performance.now(),fps=60,raf=0;
 if(gl){
  const vs=`#version 300 es\n in vec2 p; void main(){gl_Position=vec4(p,0.,1.);}`;
  const fs=`#version 300 es\n precision highp float; out vec4 o; uniform vec2 res; uniform float tm; uniform vec2 lamp; uniform float power;\n float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}\n void main(){vec2 uv=gl_FragCoord.xy/res; vec2 p=uv; float vign= smoothstep(1.15,.18,length((uv-.5)*vec2(1.0,.78))); vec3 col=vec3(.008,.007,.006);\n float wall=smoothstep(.0,.22,uv.y)*smoothstep(1.,.82,uv.y); col+=vec3(.035,.027,.018)*wall;\n float arch=abs(length((uv-vec2(.5,.48))*vec2(1.0,.72))-.36); float lines=(1.-smoothstep(.002,.008,arch))*.18; col+=vec3(.48,.30,.09)*lines;\n float dx=uv.x-lamp.x; float dy=lamp.y-uv.y; float cone=smoothstep(.34,.015,abs(dx)-dy*.30)*smoothstep(-.03,.48,dy); float beam=cone*exp(-max(dy,0.)*2.8)*power; col+=vec3(1.,.66,.25)*beam*.34;\n float glow=exp(-length((uv-lamp)*vec2(1.,1.4))*13.)*power; col+=vec3(1.,.69,.31)*glow*.75;\n float dust=hash(floor(uv*res*.35)+floor(tm*8.)); col+=vec3(.16,.11,.055)*step(.996,dust)*power;\n col*=vign; col+= (hash(uv*res+tm)-.5)*.009; o=vec4(col,1.);}`;
  const sh=(type,src)=>{const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s};
  try{program=gl.createProgram();gl.attachShader(program,sh(gl.VERTEX_SHADER,vs));gl.attachShader(program,sh(gl.FRAGMENT_SHADER,fs));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));gl.useProgram(program);buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);const loc=gl.getAttribLocation(program,'p');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);['res','tm','lamp','power'].forEach(k=>uniforms[k]=gl.getUniformLocation(program,k));}catch(e){console.warn('Living Palace WebGL2 fallback',e);program=null}
 }
 const ctx=overlay.getContext('2d');let pts=[],drag=false,opened=false,power=.35,pull=0;
 const lamp={x:.79,y:.29};
 function resize(){const d=Math.min(devicePixelRatio||1,quality);scene.width=Math.max(1,Math.floor(innerWidth*d));scene.height=Math.max(1,Math.floor(innerHeight*d));overlay.width=innerWidth;overlay.height=innerHeight;if(gl)gl.viewport(0,0,scene.width,scene.height);const n=26;pts=[];for(let i=0;i<n;i++)pts.push({x:innerWidth*lamp.x,y:innerHeight*lamp.y+ i*5,px:innerWidth*lamp.x,py:innerHeight*lamp.y+i*5});}
 function rope(){if(!ctx)return;ctx.clearRect(0,0,overlay.width,overlay.height);const ax=innerWidth*lamp.x,ay=innerHeight*lamp.y;ctx.save();ctx.translate(ax,ay);ctx.fillStyle='#b68b3c';ctx.shadowColor='#d8a94c';ctx.shadowBlur=18*power;ctx.beginPath();ctx.moveTo(-32,-12);ctx.quadraticCurveTo(0,-38,32,-12);ctx.lineTo(21,8);ctx.quadraticCurveTo(0,20,-21,8);ctx.closePath();ctx.fill();ctx.fillStyle='#ffe3a1';ctx.globalAlpha=.8;ctx.beginPath();ctx.ellipse(0,12,11,5,0,0,Math.PI*2);ctx.fill();ctx.restore();
  ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.strokeStyle='rgba(226,190,117,.9)';ctx.lineWidth=2;ctx.shadowColor='#e2b35e';ctx.shadowBlur=5;ctx.stroke();const q=pts[pts.length-1];ctx.shadowBlur=14;ctx.fillStyle='#f4d28a';ctx.beginPath();ctx.arc(q.x,q.y,5,0,Math.PI*2);ctx.fill();ctx.restore();
 }
 function physics(){if(!pts.length)return;const a={x:innerWidth*lamp.x,y:innerHeight*lamp.y+15};pts[0].x=a.x;pts[0].y=a.y;for(let i=1;i<pts.length;i++){const p=pts[i],vx=(p.x-p.px)*.985,vy=(p.y-p.py)*.985;p.px=p.x;p.py=p.y;p.x+=vx;p.y+=vy+(reduce?0:.16);}
  for(let k=0;k<5;k++)for(let i=0;i<pts.length-1;i++){const p=pts[i],q=pts[i+1],dx=q.x-p.x,dy=q.y-p.y,d=Math.hypot(dx,dy)||1,diff=(d-5)/d*.5;if(i)p.x+=dx*diff,p.y+=dy*diff;q.x-=dx*diff;q.y-=dy*diff;}
 }
 function draw(t){if(!auth.isConnected)return;frames++;if(t-last>1000){fps=frames*1000/(t-last);frames=0;last=t;if(fps<27&&quality>.65){quality=.65;resize()}else if(fps>53&&quality<Math.min(devicePixelRatio||1,1.25)){quality=Math.min(devicePixelRatio||1,1.25);resize()}}
  if(gl&&program){gl.useProgram(program);gl.uniform2f(uniforms.res,scene.width,scene.height);gl.uniform1f(uniforms.tm,t*.001);gl.uniform2f(uniforms.lamp,lamp.x,1-lamp.y);gl.uniform1f(uniforms.power,power);gl.drawArrays(gl.TRIANGLE_STRIP,0,4)}
  physics();rope();if(!reduce)power=.32+Math.sin(t*.0012)*.045+(drag?.28:0);raf=requestAnimationFrame(draw);
 }
 function reveal(){if(opened)return;opened=true;auth.classList.remove('lp-locked');auth.classList.add('lp-open');intro.classList.add('lp-gone');power=1;setTimeout(()=>intro.remove(),650);}
 function pos(e){const r=overlay.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top}}
 function down(e){const p=pos(e),q=pts[pts.length-1];if(Math.hypot(p.x-q.x,p.y-q.y)<44){drag=true;e.preventDefault()}}
 function move(e){if(!drag)return;const p=pos(e),q=pts[pts.length-1];q.x=p.x;q.y=p.y;pull=Math.max(pull,p.y-innerHeight*lamp.y);power=Math.min(1,.4+Math.max(0,pull)/150);if(pull>68)reveal()}
 function up(){if(drag&&pull>24)reveal();drag=false;pull=0}
 document.addEventListener('pointerdown',down);document.addEventListener('pointermove',move);document.addEventListener('pointerup',up);document.addEventListener('pointercancel',up);
 document.getElementById('lp-pull').addEventListener('click',reveal);
 window.addEventListener('resize',resize,{passive:true});document.addEventListener('visibilitychange',()=>{if(document.hidden)cancelAnimationFrame(raf);else if(!raf)raf=requestAnimationFrame(draw)});
 resize();raf=requestAnimationFrame(draw);
 window.LIVING_PALACE={open:reveal,get quality(){return quality},get fps(){return Math.round(fps)}};
})();
