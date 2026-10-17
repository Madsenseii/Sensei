// ===== CURSOR =====
const cursor=document.getElementById('cursor');
const trail=document.getElementById('cursor-trail');
let mx=0,my=0,tx=0,ty=0;
document.addEventListener('mousemove',e=>{
  mx=e.clientX;my=e.clientY;
  cursor.style.transform=`translate(${mx-7}px,${my-7}px)`;
});
setInterval(()=>{
  tx+=(mx-tx)*0.12;ty+=(my-ty)*0.12;
  trail.style.transform=`translate(${tx-19}px,${ty-19}px)`;
},16);
document.querySelectorAll('a,button,.team-card,.vertical-card,.stat-box,.mie-info-box,.iconic-card,.t-card,.omni-node,.collab-close-btn,.collab-action-btn,.collab-skip-btn,.collab-slide,.collab-dot,.ev-btn,.ev-pass,.ev-shot,.ev-poster-frame,.collab-image-box').forEach(el=>{
  el.addEventListener('mouseenter',()=>cursor.classList.add('hovering'));
  el.addEventListener('mouseleave',()=>cursor.classList.remove('hovering'));
});

// ===== CLICK ANIMATION SYSTEM — EVERY CLICK TRIGGERS NEW ANIMATION =====
const clickKanjis=['狂','賢','師','創','造','映','音','技','橋','書','魂','炎','影','嵐','夢','神','龍','鬼','刀','道','力','気','愛','命'];
let clickCount=0;
const clickAnimations=[
  (x,y)=>{
    // Ripple + particles
    const r=document.createElement('div');
    r.className='click-ripple';r.style.left=x+'px';r.style.top=y+'px';
    document.body.appendChild(r);
    const s=document.createElement('div');
    s.className='click-shockwave';s.style.left=x+'px';s.style.top=y+'px';
    document.body.appendChild(s);
    for(let i=0;i<8;i++){
      const p=document.createElement('div');
      p.className='click-particle';
      const angle=(i/8)*Math.PI*2;const dist=40+Math.random()*40;
      const dx=Math.cos(angle)*dist;const dy=Math.sin(angle)*dist;
      p.style.cssText=`left:${x}px;top:${y}px;width:4px;height:4px;background:var(--gold);--dx:${dx}px;--dy:${dy}px;animation-duration:${0.5+Math.random()*0.3}s`;
      document.body.appendChild(p);
      setTimeout(()=>p.remove(),800);
    }
    setTimeout(()=>{r.remove();s.remove();},1200);
  },
  (x,y)=>{
    // Kanji pop
    const k=document.createElement('div');
    k.className='click-kanji-pop';
    k.textContent=clickKanjis[Math.floor(Math.random()*clickKanjis.length)];
    k.style.left=x+'px';k.style.top=y+'px';
    document.body.appendChild(k);
    setTimeout(()=>k.remove(),1000);
    // Also do small ripple
    const r=document.createElement('div');
    r.className='click-ripple';r.style.left=x+'px';r.style.top=y+'px';
    document.body.appendChild(r);
    setTimeout(()=>r.remove(),900);
  },
  (x,y)=>{
    // Multi-ring burst
    for(let i=0;i<3;i++){
      setTimeout(()=>{
        const r=document.createElement('div');
        r.className='click-ripple';r.style.left=x+'px';r.style.top=y+'px';
        r.style.borderColor=i===0?'rgba(200,168,75,0.9)':i===1?'rgba(230,32,32,0.6)':'rgba(255,224,102,0.4)';
        document.body.appendChild(r);
        setTimeout(()=>r.remove(),900);
      },i*120);
    }
    // DNA spiral particles
    for(let i=0;i<12;i++){
      const p=document.createElement('div');
      p.className='click-particle';
      const angle=(i/12)*Math.PI*2;const dist=20+i*6;
      const dx=Math.cos(angle)*dist;const dy=Math.sin(angle)*dist;
      p.style.cssText=`left:${x}px;top:${y}px;width:3px;height:3px;background:rgba(200,168,75,${0.8-i*0.05});--dx:${dx}px;--dy:${dy}px;animation-duration:${0.4+i*0.04}s`;
      document.body.appendChild(p);
      setTimeout(()=>p.remove(),800);
    }
  },
  (x,y)=>{
    // Kanji + particles + shockwave
    const k=document.createElement('div');
    k.className='click-kanji-pop';
    k.textContent=clickKanjis[Math.floor(Math.random()*clickKanjis.length)];
    k.style.left=x+'px';k.style.top=y+'px';k.style.fontSize='28px';
    document.body.appendChild(k);
    const s=document.createElement('div');
    s.className='click-shockwave';s.style.left=x+'px';s.style.top=y+'px';
    document.body.appendChild(s);
    for(let i=0;i<6;i++){
      const p=document.createElement('div');
      p.className='click-particle';
      const angle=((i/6)*Math.PI*2)-(Math.PI/2);const dist=50+Math.random()*30;
      p.style.cssText=`left:${x}px;top:${y}px;width:5px;height:5px;border-radius:0;background:var(--red);--dx:${Math.cos(angle)*dist}px;--dy:${Math.sin(angle)*dist}px;animation-duration:0.6s`;
      document.body.appendChild(p);
      setTimeout(()=>p.remove(),700);
    }
    setTimeout(()=>{k.remove();s.remove();},1100);
  }
];

document.addEventListener('click',e=>{
  const anim=clickAnimations[clickCount%clickAnimations.length];
  anim(e.clientX,e.clientY);
  clickCount++;
  cursor.classList.add('clicking');
  setTimeout(()=>cursor.classList.remove('clicking'),200);
});

// ===== INTRO SPOTLIGHT — ambient gold dust =====
(function initIntroDust(){
  const overlay=document.getElementById('intro-overlay');
  if(!overlay)return;
  for(let i=0;i<14;i++){
    const d=document.createElement('div');
    d.className='intro-dust';
    const size=1+Math.random()*2;
    const dur=3+Math.random()*3;
    d.style.cssText=`
      left:${30+Math.random()*40}vw;
      bottom:${30+Math.random()*10}vh;
      width:${size}px;height:${size}px;
      --ido:${0.2+Math.random()*0.3};
      animation-duration:${dur}s;
      animation-delay:${Math.random()*dur}s;
    `;
    overlay.appendChild(d);
  }
})();

// ===== HERO — EMAIL REGISTRATION =====
//
// PASTE your deployed Google Apps Script "Web app URL" below (see Code.gs
// setup instructions). It looks like:
//   https://script.google.com/macros/s/XXXXXXXXXXXX/exec
const SHEET_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbxe-COSnn1IAPA9dMavt0T1npXSMp6bvx9tq3_qXWc8p1x84oQJ5w1EYb52vKb2ALwJ/exec';

(function(){
  const form=document.getElementById('hero-register-form');
  const input=document.getElementById('hero-register-email');
  const msg=document.getElementById('hero-register-msg');
  const consent=document.getElementById('hero-register-consent');
  if(!form) return;
  form.addEventListener('submit', e=>{
    e.preventDefault();
    const email=input.value.trim();
    const isValid=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if(!isValid){
      msg.textContent='Please enter a valid email address.';
      msg.style.color='rgba(230,32,32,0.85)';
      return;
    }
    if(consent && !consent.checked){
      msg.textContent='Please agree to the Terms & Conditions and Privacy Policy to continue.';
      msg.style.color='rgba(230,32,32,0.85)';
      return;
    }

    const submitBtn = form.querySelector('.register-btn');
    if(submitBtn){ submitBtn.disabled = true; submitBtn.style.opacity = '0.6'; }
    msg.textContent = 'Submitting...';
    msg.style.color = 'rgba(200,168,75,0.85)';

    // Always keep a local backup copy too.
    try{
      const list=JSON.parse(localStorage.getItem('msRegisteredEmails')||'[]');
      list.push({email,ts:Date.now(),consent:true});
      localStorage.setItem('msRegisteredEmails', JSON.stringify(list));
    }catch(err){}

    const finish = (success) => {
      if(submitBtn){ submitBtn.disabled = false; submitBtn.style.opacity = ''; }
      if(success){
        msg.textContent = "You're on the list. We'll be in touch.";
        msg.style.color = 'rgba(200,168,75,0.85)';
        form.reset();
        if(consent) consent.checked = false;
      } else {
        msg.textContent = 'Something went wrong. Please try again in a moment.';
        msg.style.color = 'rgba(230,32,32,0.85)';
      }
    };

    if(!SHEET_WEB_APP_URL || SHEET_WEB_APP_URL.indexOf('PASTE_YOUR') === 0){
      // Google Sheets link not configured yet — falls back to local-only storage.
      console.warn('SHEET_WEB_APP_URL is not set in script.js — emails are only saved locally in this browser.');
      finish(true);
      return;
    }

    // mode:'no-cors' + text/plain avoids Apps Script's CORS preflight issues.
    // We can't read the response body in this mode, so we optimistically
    // treat the request as successful once it's sent without a network error.
    fetch(SHEET_WEB_APP_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ email, consent: true, timestamp: Date.now() })
    })
      .then(() => finish(true))
      .catch(() => finish(false));
  });
})();

// ===== LEGAL & COLLABORATION MODALS =====
function openLegalModal(type){
  const modal=document.getElementById(type+'-modal');
  if(modal) modal.classList.add('open');
}
function closeLegalModal(type){
  const modal=document.getElementById(type+'-modal');
  if(modal) modal.classList.remove('open');
}

function openCollabModal(){
  const modal=document.getElementById('collab-modal');
  if(modal) modal.classList.add('open');
}
function closeCollabModal(){
  const modal=document.getElementById('collab-modal');
  if(modal) modal.classList.remove('open');
}

document.addEventListener('click', e=>{
  if(e.target.classList && e.target.classList.contains('legal-modal')){
    e.target.classList.remove('open');
  }
  const collabModal=document.getElementById('collab-modal');
  if(collabModal && e.target === collabModal){
    closeCollabModal();
  }
});
document.addEventListener('keydown', e=>{
  if(e.key==='Escape'){
    document.querySelectorAll('.legal-modal.open').forEach(m=>m.classList.remove('open'));
    closeCollabModal();
  }
});

// ===== NEAC COUNTDOWN =====
(function(){
  const d=document.getElementById('ev-d');
  if(!d) return;
  const h=document.getElementById('ev-h'),m=document.getElementById('ev-m'),sc=document.getElementById('ev-s'),st=document.getElementById('ev-status');
  const START=new Date('2026-10-24T00:00:00+05:30').getTime();
  const END=new Date('2026-10-26T00:00:00+05:30').getTime();
  const pad=n=>String(n).padStart(2,'0');
  function tick(){
    const now=Date.now();
    if(now>=END){
      d.textContent=h.textContent=m.textContent=sc.textContent='00';
      st.textContent='NEAC 2026 has wrapped. Thank you for being part of it!';
      return;
    }
    if(now>=START){
      d.textContent=h.textContent=m.textContent=sc.textContent='00';
      st.textContent='LIVE NOW · the realm is open';
      return;
    }
    let diff=Math.floor((START-now)/1000);
    d.textContent=pad(Math.floor(diff/86400));
    h.textContent=pad(Math.floor(diff%86400/3600));
    m.textContent=pad(Math.floor(diff%3600/60));
    sc.textContent=pad(diff%60);
    st.textContent='until the gates open';
  }
  tick(); setInterval(tick,1000);
})();

// ===== EVENT POPUP POSTER SLIDER =====
(function(){
  const box=document.querySelector('.collab-slider');
  if(!box) return;
  const slides=box.querySelectorAll('.collab-slide');
  const dots=box.querySelectorAll('.collab-dot');
  let idx=0,timer=null;
  function show(n){
    idx=(n+slides.length)%slides.length;
    slides.forEach((s,k)=>s.classList.toggle('active',k===idx));
    dots.forEach((d,k)=>d.classList.toggle('active',k===idx));
  }
  function start(){ stop(); timer=setInterval(()=>show(idx+1),4500); }
  function stop(){ if(timer){clearInterval(timer);timer=null;} }
  dots.forEach((d,k)=>d.addEventListener('click',()=>{show(k);start();}));
  box.addEventListener('mouseenter',stop);
  box.addEventListener('mouseleave',start);
  const _open=window.openCollabModal;
  window.openCollabModal=function(){ _open(); show(0); start(); };
  const _close=window.closeCollabModal;
  window.closeCollabModal=function(){ _close(); stop(); };
})();

// ===== INTRO LOADER & POPUP TRIGGER =====
setTimeout(()=>{
  const overlay=document.getElementById('intro-overlay');
  if(overlay){
    overlay.classList.add('intro-glitch-out');
    setTimeout(()=>{
      overlay.style.display='none';
      const mainNav=document.getElementById('main-nav');
      if(mainNav) mainNav.classList.add('visible');
      initReveal();
      setTimeout(openCollabModal, 300);
    },700);
  } else {
    setTimeout(openCollabModal, 600);
  }
},3200);

// ===== OMNIVERSE DATA =====
const IPS=[
  {kanji:'魂',title:'TAMASHII',status:'IN PRODUCTION',desc:'A soul reincarnated across centuries of war and silence. Where dharma meets bushido, and fate is written in blood.',extra:'IP_001 · WEBTOON + ANIME · LIVE'},
  {kanji:'炎',title:'KAEN',status:'IN DEVELOPMENT',desc:'A prodigy pyromancer hunted by the empire she once served. Fire is memory. And some memories cannot be extinguished.',extra:'IP_002 · WEBTOON · IN SERIALIZATION'},
  {kanji:'影',title:'KAGE',status:'IN DEVELOPMENT',desc:'The shadow that follows every hero. An assassin\'s journey through the moral wreckage of loyalty and betrayal.',extra:'IP_003 · WEB NOVEL · IN PRODUCTION'},
  {kanji:'嵐',title:'ARASHI',status:'ANNOUNCED',desc:'A storm god stripped of divinity, forced to walk among mortals. The price of godhood: everything human.',extra:'IP_004 · ANIME PILOT · ANNOUNCED'},
  {kanji:'夢',title:'YUME',status:'IN CONCEPT',desc:'A dream architect who builds worlds for the dying — and gets lost inside one. A love story told in hallucinations.',extra:'IP_005 · MANGA FORMAT · CONCEPT'},
  {kanji:'神',title:'KAMI',status:'IN CONCEPT',desc:'The origin story of the Mad Sensei Omniverse. All six IPs converge here. The god that created the universe — and the mistake that fractured it.',extra:'IP_006 · CROSSOVER EVENT · ORIGIN'}
];
let omniRotation=0;
const omniSvg=document.getElementById('omni-svg');
function showIP(index){
  const omniverseSection=document.getElementById('omniverse');
  if(omniverseSection && omniverseSection.classList.contains('omni-locked')) return; // COMING SOON — interaction disabled
  const ip=IPS[index];
  document.getElementById('panel-kanji').textContent=ip.kanji;
  document.getElementById('panel-name').textContent=ip.title;
  document.getElementById('panel-status-label').textContent=ip.status;
  document.getElementById('panel-desc').textContent=ip.desc;
  document.getElementById('panel-extra').textContent=ip.extra;
  document.getElementById('ip-panel').classList.add('active');
  omniRotation+=60;
  omniSvg.style.animation='none';
  omniSvg.style.transform=`rotate(${omniRotation}deg)`;
  setTimeout(()=>{omniSvg.style.animation='';omniSvg.style.transform='';},700);
  document.querySelectorAll('.omni-node').forEach((n,i)=>{n.style.opacity=i===index?'1':'0.5';});
}

// ===== TEAM DATA =====
const TEAM=[
  {num:'01',nickname:'The Architect',name:'Mad Sensei',role:'Founder & Creative Director',kanji:'狂',bio:'The architect of worlds that don\'t yet exist. Once a lone creator with nothing but an idea and an iron will — now the force behind a studio that refuses to be ordinary.',quote:'"The story doesn\'t end. It only escalates."',img:'images/js_000.jpg'},
  {num:'02',nickname:'The Voice',name:'Himanshu Gohel',role:'PR',kanji:'声',bio:'Every story needs a voice that carries it beyond the studio. Himanshu builds the bridges between Mad Sensei and the world — media, partners and community — so the work gets heard.',quote:'"A story only lives when people hear it."',img:'images/himanshu-gohel.png'},
  {num:'03',nickname:'The Visionary',name:'Deepak Baraskar',role:'Assistant Director',kanji:'導',bio:'Vision without execution is just a dream. Deepak turns creative chaos into structured brilliance — directing the studio\'s narrative with clarity, passion, and an unflinching eye for detail.',quote:'"Direction is not control. It\'s alignment."',img:'data:image/jpeg;base64,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'},
  {num:'04',nickname:'The Strategist',name:'Anshul Pandit',role:'Company Manager',kanji:'策',bio:'Behind every great creative force is a mind that keeps it all together. Anshul manages the company with precision — balancing growth, people, and purpose in perfect proportion.',quote:'"Great companies are built on great decisions."',img:'images/js_004.jpg'}
];
function buildTeam(){
  const grid=document.getElementById('team-grid');
  const EL_MAP=['sage','lunar','fire','earth'];

  grid.innerHTML=TEAM.map((m,i)=>`
    <div class="team-card reveal" data-el="${EL_MAP[i]}" style="transition-delay:${i*0.08}s">
      <div class="team-card-inner">
        <div class="team-card-front">
          <div class="team-img-wrapper" style="position:relative">
            <img class="team-img" src="${m.img}" alt="${m.name}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
            <div class="team-img-fallback" style="display:none">${m.kanji}</div>
            <canvas class="elem-canvas" data-idx="${i}"></canvas>
          </div>
          <div class="team-front-overlay"></div>
          <div class="team-scan"></div>
          <div class="team-corner tl"></div>
          <div class="team-corner tr"></div>
          <div class="team-card-info">
            <span class="team-card-num">${m.num}</span>
            <span class="team-card-nickname">${m.nickname}</span>
            <span class="team-card-realname">${m.name}</span>
            <span class="team-card-role">${m.role}</span>
          </div>
        </div>
        <div class="team-card-back">
          <div class="team-back-kanji">${m.kanji}</div>
          <div class="team-back-role-label">${m.nickname}</div>
          <div class="team-back-name">${m.name}</div>
          <div class="team-back-subrole">${m.role}</div>
          <div class="team-divider"></div>
          <p class="team-back-bio">${m.bio}</p>
          <div class="team-back-quote">${m.quote}</div>
        </div>
      </div>
    </div>
  `).join('');

  /* ══════════════════════════════════════════════════════════════
     PARTICLE ENGINE — one canvas per card, RAF-driven
     ══════════════════════════════════════════════════════════════ */
  const KANJI_SET = ['狂','賢','氣','道','魂','智','無','悟','炎','剣','師','光','力','夢','幻','神'];

  // ── helpers ──
  function rand(a,b){return a+Math.random()*(b-a);}
  function randInt(a,b){return Math.floor(rand(a,b));}
  function lerp(a,b,t){return a+(b-a)*t;}

  // ══════════════════════════════════════════
  //  SAGE — Mad Sensei
  // ══════════════════════════════════════════
  function SageSystem(ctx,W,H){
    const particles=[];
    const rings=[];
    const orbs=[];
    let scanY=0, t=0;

    // Pre-spawn
    for(let i=0;i<8;i++) spawnRune();
    for(let i=0;i<5;i++) spawnOrb();
    spawnRing(); spawnRing(); spawnRing();

    function spawnRune(){
      particles.push({
        x:rand(0.05,0.95)*W, y:rand(0.1,0.8)*H,
        char:KANJI_SET[randInt(0,KANJI_SET.length)],
        size:rand(14,32), alpha:0, maxAlpha:rand(0.5,0.95),
        phase:'in', age:0, life:rand(120,220),
        vx:rand(-0.2,0.2), vy:rand(-0.6,-0.15),
        glow:rand(8,20)
      });
    }
    function spawnRing(){
      rings.push({r:0, maxR:Math.max(W,H)*rand(0.4,0.7), alpha:1, speed:rand(1.8,3.2), lineW:rand(0.8,1.8)});
    }
    function spawnOrb(){
      orbs.push({
        x:rand(0.1,0.9)*W, y:rand(0.2,0.85)*H,
        r:rand(3,9), alpha:rand(0.4,0.9),
        vx:rand(-0.4,0.4), vy:rand(-0.8,-0.2),
        life:rand(80,160), age:0
      });
    }

    return function draw(){
      t++;
      ctx.clearRect(0,0,W,H);

      // Ambient vignette gold
      const grd=ctx.createRadialGradient(W/2,H*0.6,0,W/2,H*0.4,W*0.8);
      grd.addColorStop(0,'rgba(200,168,75,0.06)');
      grd.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=grd; ctx.fillRect(0,0,W,H);

      // Rings
      for(let i=rings.length-1;i>=0;i--){
        const rg=rings[i];
        rg.r+=rg.speed; rg.alpha=Math.max(0,1-rg.r/rg.maxR);
        ctx.save();
        ctx.strokeStyle=`rgba(200,168,75,${rg.alpha*0.8})`;
        ctx.lineWidth=rg.lineW;
        ctx.shadowColor='rgba(200,168,75,0.9)';
        ctx.shadowBlur=12;
        ctx.beginPath();
        ctx.arc(W/2,H/2,rg.r,0,Math.PI*2);
        ctx.stroke();
        ctx.restore();
        if(rg.r>=rg.maxR){ rings.splice(i,1); spawnRing(); }
      }

      // Orbs
      for(let i=orbs.length-1;i>=0;i--){
        const o=orbs[i];
        o.x+=o.vx; o.y+=o.vy; o.age++;
        const life=o.age/o.life;
        const a=o.alpha*(life<0.2?life/0.2:life>0.8?(1-life)/0.2:1);
        const grad=ctx.createRadialGradient(o.x,o.y,0,o.x,o.y,o.r*2.5);
        grad.addColorStop(0,`rgba(255,230,100,${a})`);
        grad.addColorStop(0.5,`rgba(200,168,75,${a*0.6})`);
        grad.addColorStop(1,'rgba(200,168,75,0)');
        ctx.fillStyle=grad;
        ctx.beginPath(); ctx.arc(o.x,o.y,o.r*2.5,0,Math.PI*2); ctx.fill();
        if(o.age>=o.life){ orbs.splice(i,1); spawnOrb(); }
      }

      // Runes
      for(let i=particles.length-1;i>=0;i--){
        const p=particles[i];
        p.x+=p.vx; p.y+=p.vy; p.age++;
        const life=p.age/p.life;
        p.alpha=p.maxAlpha*(life<0.2?life/0.2:life>0.75?(1-life)/0.25:1);
        ctx.save();
        ctx.font=`900 ${p.size}px 'Noto Serif JP',serif`;
        ctx.textAlign='center'; ctx.textBaseline='middle';
        ctx.shadowColor='rgba(255,215,0,1)';
        ctx.shadowBlur=p.glow;
        ctx.fillStyle=`rgba(200,168,75,${p.alpha})`;
        ctx.fillText(p.char,p.x,p.y);
        ctx.restore();
        if(p.age>=p.life){ particles.splice(i,1); spawnRune(); }
      }

      // Gold scan beam
      scanY+=1.5; if(scanY>H) scanY=0;
      const sg=ctx.createLinearGradient(0,scanY-30,0,scanY+30);
      sg.addColorStop(0,'rgba(200,168,75,0)');
      sg.addColorStop(0.5,'rgba(255,220,80,0.7)');
      sg.addColorStop(1,'rgba(200,168,75,0)');
      ctx.fillStyle=sg; ctx.fillRect(0,scanY-30,W,60);

      // Secondary shimmer lines
      if(t%40<20){
        ctx.strokeStyle=`rgba(200,168,75,${0.15+0.1*Math.sin(t*0.1)})`;
        ctx.lineWidth=0.5;
        for(let y=0;y<H;y+=6){
          ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke();
        }
      }
    };
  }

  // ══════════════════════════════════════════
  //  DIGITAL (unused)
  // ══════════════════════════════════════════
  function DigitalSystem(ctx,W,H){
    const lightning=[];
    const nodes=[];
    let scanY=0,t=0;

    // Circuit nodes
    for(let i=0;i<12;i++) nodes.push({x:rand(0.05,0.95)*W,y:rand(0.05,0.95)*H,pulse:rand(0,Math.PI*2),r:rand(2,5)});

    function spawnLightning(){
      const x=rand(0.1,0.9)*W;
      const segs=[];
      let cy=0, cx=x;
      while(cy<H){ cy+=rand(15,35); cx+=rand(-30,30); segs.push({x:cx,y:cy}); }
      lightning.push({segs,alpha:1,x});
    }

    return function draw(){
      t++;
      ctx.clearRect(0,0,W,H);

      // Dark green bg tint
      ctx.fillStyle='rgba(0,20,5,0.35)'; ctx.fillRect(0,0,W,H);

      // Circuit nodes + connections
      ctx.save();
      for(let i=0;i<nodes.length;i++){
        nodes[i].pulse+=0.04;
        const glow=0.5+0.5*Math.sin(nodes[i].pulse);
        // Connect to nearest 2
        for(let j=i+1;j<nodes.length;j++){
          const dx=nodes[j].x-nodes[i].x, dy=nodes[j].y-nodes[i].y;
          const dist=Math.sqrt(dx*dx+dy*dy);
          if(dist<150){
            const a=(1-dist/150)*0.5*glow;
            ctx.strokeStyle=`rgba(0,255,80,${a})`;
            ctx.lineWidth=0.8;
            ctx.shadowColor='rgba(0,255,80,0.8)'; ctx.shadowBlur=6;
            ctx.beginPath(); ctx.moveTo(nodes[i].x,nodes[i].y); ctx.lineTo(nodes[j].x,nodes[j].y); ctx.stroke();
          }
        }
        // Node dot
        ctx.fillStyle=`rgba(0,255,80,${0.6+0.4*glow})`;
        ctx.shadowColor='rgba(0,255,120,1)'; ctx.shadowBlur=12*glow;
        ctx.beginPath(); ctx.arc(nodes[i].x,nodes[i].y,nodes[i].r,0,Math.PI*2); ctx.fill();
      }
      ctx.restore();

      // Scan line
      scanY+=3; if(scanY>H) scanY=0;
      const sg=ctx.createLinearGradient(0,scanY-8,0,scanY+8);
      sg.addColorStop(0,'rgba(0,255,80,0)');
      sg.addColorStop(0.5,'rgba(0,255,80,0.9)');
      sg.addColorStop(1,'rgba(0,255,80,0)');
      ctx.fillStyle=sg; ctx.fillRect(0,scanY-8,W,16);

      // Lightning
      if(t%90===0) spawnLightning();
      for(let i=lightning.length-1;i>=0;i--){
        const l=lightning[i];
        l.alpha-=0.06;
        ctx.save();
        ctx.strokeStyle=`rgba(100,255,150,${l.alpha})`;
        ctx.lineWidth=1.5; ctx.shadowColor='rgba(0,255,80,1)'; ctx.shadowBlur=20;
        ctx.beginPath(); ctx.moveTo(l.x,0);
        l.segs.forEach(s=>ctx.lineTo(s.x,s.y));
        ctx.stroke(); ctx.restore();
        if(l.alpha<=0) lightning.splice(i,1);
      }
    };
  }

  // ══════════════════════════════════════════
  //  LUNAR — Luna
  // ══════════════════════════════════════════
  function LunarSystem(ctx,W,H){
    const stars=[];
    const beams=[];
    const dust=[];
    let moonAngle=0, t=0;

    for(let i=0;i<40;i++) stars.push({x:rand(0,W),y:rand(0,H),r:rand(0.5,2.5),twinkle:rand(0,Math.PI*2),speed:rand(0.02,0.06),alpha:rand(0.3,1)});
    for(let i=0;i<6;i++) beams.push({x:rand(0.1,0.9)*W,width:rand(1.5,4),alpha:rand(0.2,0.6),speed:rand(0.003,0.008),phase:rand(0,Math.PI*2)});
    for(let i=0;i<20;i++) dust.push({x:rand(0,W),y:rand(0,H),vx:rand(-0.3,0.3),vy:rand(-0.5,-0.1),r:rand(1,3),alpha:rand(0.2,0.7),life:rand(60,150),age:randInt(0,150)});

    return function draw(){
      t++; moonAngle+=0.008;
      ctx.clearRect(0,0,W,H);

      // Deep space bg
      const bg=ctx.createRadialGradient(W/2,0,0,W/2,H*0.5,H);
      bg.addColorStop(0,'rgba(20,20,60,0.4)');
      bg.addColorStop(1,'rgba(0,0,10,0)');
      ctx.fillStyle=bg; ctx.fillRect(0,0,W,H);

      // Moon beams (light rays from top)
      for(const b of beams){
        b.phase+=b.speed;
        const a=b.alpha*(0.5+0.5*Math.sin(b.phase));
        const grad=ctx.createLinearGradient(b.x,0,b.x+Math.sin(b.phase)*30,H);
        grad.addColorStop(0,`rgba(200,215,255,${a})`);
        grad.addColorStop(0.5,`rgba(180,200,255,${a*0.4})`);
        grad.addColorStop(1,'rgba(160,185,255,0)');
        ctx.save();
        ctx.fillStyle=grad;
        const hw=b.width+(Math.sin(b.phase)*1.5);
        ctx.fillRect(b.x-hw,0,hw*2,H);
        ctx.restore();
      }

      // Stars
      for(const s of stars){
        s.twinkle+=s.speed;
        const a=s.alpha*(0.4+0.6*Math.sin(s.twinkle));
        ctx.save();
        ctx.fillStyle=`rgba(220,230,255,${a})`;
        ctx.shadowColor='rgba(200,215,255,0.9)';
        ctx.shadowBlur=s.r*6;
        ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fill();
        ctx.restore();
      }

      // Floating moon dust
      for(let i=dust.length-1;i>=0;i--){
        const d=dust[i];
        d.x+=d.vx; d.y+=d.vy; d.age++;
        const life=d.age/d.life;
        const a=d.alpha*(life<0.2?life/0.2:life>0.8?(1-life)/0.2:1);
        ctx.fillStyle=`rgba(200,215,255,${a})`;
        ctx.beginPath(); ctx.arc(d.x,d.y,d.r,0,Math.PI*2); ctx.fill();
        if(d.age>=d.life){ d.x=rand(0,W); d.y=H+10; d.age=0; d.vy=rand(-0.5,-0.1); }
      }

      // Crescent moon top-right
      ctx.save();
      const mx=W-50, my=45, mr=28;
      ctx.shadowColor='rgba(200,215,255,0.9)'; ctx.shadowBlur=30;
      ctx.strokeStyle=`rgba(200,220,255,${0.6+0.3*Math.sin(moonAngle)})`;
      ctx.lineWidth=2;
      ctx.beginPath(); ctx.arc(mx,my,mr,0,Math.PI*2); ctx.stroke();
      // Inner crescent mask
      ctx.fillStyle='rgba(0,0,10,0.92)';
      ctx.beginPath(); ctx.arc(mx+8,my-4,mr-3,0,Math.PI*2); ctx.fill();
      // 月 kanji
      ctx.font=`bold 16px 'Noto Serif JP',serif`;
      ctx.fillStyle=`rgba(200,220,255,${0.5+0.4*Math.sin(moonAngle)})`;
      ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.shadowBlur=15;
      ctx.fillText('月',mx+12,my+4);
      ctx.restore();

      // Concentric silver rings from moon
      for(let k=0;k<3;k++){
        const phase=(t*0.012+k*2.1)%(Math.PI*2);
        const expR=20+((phase/(Math.PI*2))*120);
        const a=Math.max(0,0.5-expR/130);
        ctx.save();
        ctx.strokeStyle=`rgba(180,200,255,${a})`;
        ctx.lineWidth=1; ctx.shadowColor='rgba(180,200,255,0.6)'; ctx.shadowBlur=8;
        ctx.beginPath(); ctx.arc(mx,my,expR,0,Math.PI*2); ctx.stroke();
        ctx.restore();
      }
    };
  }

  // ══════════════════════════════════════════
  //  FIRE — Shubhangi
  // ══════════════════════════════════════════
  function FireSystem(ctx,W,H){
    const embers=[];
    const flames=[];
    let scanY=H, t=0;

    // Flame particles at base
    for(let i=0;i<50;i++) spawnFlame();
    for(let i=0;i<30;i++) spawnEmber();

    function spawnFlame(){
      flames.push({
        x:rand(0.1,0.9)*W, y:H+rand(0,20),
        vx:rand(-0.8,0.8), vy:rand(-3,-1.2),
        life:rand(60,120), age:0,
        size:rand(12,28), wobble:rand(0,Math.PI*2), wobbleSpeed:rand(0.05,0.12)
      });
    }
    function spawnEmber(){
      embers.push({
        x:rand(0.15,0.85)*W, y:H*rand(0.5,1),
        vx:rand(-1.5,1.5), vy:rand(-4,-1.5),
        life:rand(80,180), age:0,
        r:rand(1.5,4), alpha:rand(0.7,1),
        color:Math.random()>0.5?'255,200,50':'255,100,20'
      });
    }

    return function draw(){
      t++;
      ctx.clearRect(0,0,W,H);

      // Heat haze bg
      const hg=ctx.createLinearGradient(0,H,0,H*0.3);
      hg.addColorStop(0,'rgba(40,5,0,0.5)');
      hg.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=hg; ctx.fillRect(0,0,W,H);

      // Flame blobs
      for(let i=flames.length-1;i>=0;i--){
        const f=flames[i];
        f.x+=f.vx; f.y+=f.vy; f.age++; f.wobble+=f.wobbleSpeed;
        f.x+=Math.sin(f.wobble)*0.8;
        const life=f.age/f.life;
        const a=life<0.3?life/0.3:life>0.6?(1-life)/0.4:1;
        const sz=f.size*(1-life*0.4);
        const hue=life<0.4?`rgba(255,${Math.floor(200-life*400)},0,${a*0.6})`:`rgba(255,${Math.floor(60-life*100)},0,${a*0.4})`;
        const grd=ctx.createRadialGradient(f.x,f.y,0,f.x,f.y,sz);
        grd.addColorStop(0,`rgba(255,255,180,${a*0.8})`);
        grd.addColorStop(0.3,hue);
        grd.addColorStop(1,'rgba(255,30,0,0)');
        ctx.fillStyle=grd;
        ctx.beginPath(); ctx.arc(f.x,f.y,sz,0,Math.PI*2); ctx.fill();
        if(f.age>=f.life){ flames.splice(i,1); spawnFlame(); }
      }

      // Embers
      for(let i=embers.length-1;i>=0;i--){
        const e=embers[i];
        e.x+=e.vx; e.y+=e.vy; e.age++;
        e.vx+=rand(-0.08,0.08);
        const life=e.age/e.life;
        const a=e.alpha*(life<0.2?life/0.2:life>0.7?(1-life)/0.3:1);
        ctx.save();
        ctx.shadowColor=`rgba(${e.color},1)`; ctx.shadowBlur=10;
        ctx.fillStyle=`rgba(${e.color},${a})`;
        ctx.beginPath(); ctx.arc(e.x,e.y,e.r,0,Math.PI*2); ctx.fill();
        ctx.restore();
        if(e.age>=e.life){ embers.splice(i,1); spawnEmber(); }
      }

      // Rising scan from bottom
      scanY-=2; if(scanY<0) scanY=H;
      const sg=ctx.createLinearGradient(0,scanY-20,0,scanY+20);
      sg.addColorStop(0,'rgba(255,80,0,0)');
      sg.addColorStop(0.5,'rgba(255,180,50,0.8)');
      sg.addColorStop(1,'rgba(255,80,0,0)');
      ctx.fillStyle=sg; ctx.fillRect(0,scanY-20,W,40);

      // Heat distortion lines
      if(t%3===0){
        ctx.save(); ctx.globalAlpha=0.08;
        ctx.strokeStyle='rgba(255,120,0,1)';
        ctx.lineWidth=0.5;
        for(let y=H*0.4;y<H;y+=4){
          ctx.beginPath();
          ctx.moveTo(0,y+Math.sin(t*0.05+y*0.02)*3);
          ctx.lineTo(W,y+Math.cos(t*0.04+y*0.015)*3);
          ctx.stroke();
        }
        ctx.restore();
      }
    };
  }

  // ══════════════════════════════════════════
  //  EARTH — Anshul
  // ══════════════════════════════════════════
  function EarthSystem(ctx,W,H){
    const stones=[];
    const cracks=[];
    const glows=[];
    let pulseR=0, t=0;

    for(let i=0;i<20;i++) spawnStone();
    for(let i=0;i<5;i++) spawnCrack();

    function spawnStone(){
      stones.push({
        x:rand(0.05,0.95)*W, y:H+rand(0,30),
        vx:rand(-0.6,0.6), vy:rand(-2.5,-0.8),
        w:rand(4,14), h:rand(3,10),
        rot:rand(0,Math.PI*2), rotV:rand(-0.04,0.04),
        life:rand(80,200), age:0, alpha:rand(0.6,1)
      });
    }
    function spawnCrack(){
      const sx=rand(0.05,0.95)*W, sy=rand(0.2,0.95)*H;
      const segs=[{x:sx,y:sy}];
      let cx=sx,cy=sy;
      const len=randInt(4,8);
      for(let i=0;i<len;i++){ cx+=rand(-20,20); cy+=rand(-15,15); segs.push({x:cx,y:cy}); }
      cracks.push({segs,alpha:0,phase:'in',age:0,life:rand(100,180),delay:randInt(0,60)});
    }

    return function draw(){
      t++;
      ctx.clearRect(0,0,W,H);

      // Stone texture bg
      const bg=ctx.createRadialGradient(W/2,H,0,W/2,H*0.3,H);
      bg.addColorStop(0,'rgba(60,35,5,0.3)');
      bg.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=bg; ctx.fillRect(0,0,W,H);

      // Ground pulse rings
      pulseR+=2.5;
      if(pulseR>Math.max(W,H)) pulseR=0;
      for(let k=0;k<3;k++){
        const r=pulseR-k*80; if(r<0) continue;
        const a=Math.max(0,0.4-r/Math.max(W,H)*0.6);
        ctx.save();
        ctx.strokeStyle=`rgba(180,110,20,${a})`;
        ctx.lineWidth=1.5; ctx.shadowColor='rgba(200,130,30,0.8)'; ctx.shadowBlur=10;
        ctx.beginPath(); ctx.arc(W/2,H,r,Math.PI,Math.PI*2); ctx.stroke();
        ctx.restore();
      }

      // Cracks
      for(let i=cracks.length-1;i>=0;i--){
        const cr=cracks[i];
        if(cr.age<cr.delay){cr.age++;continue;}
        cr.age++;
        const age2=cr.age-cr.delay;
        const lifeRel=age2/cr.life;
        if(cr.phase==='in') cr.alpha=Math.min(1,lifeRel*4);
        if(lifeRel>0.6) cr.alpha=Math.max(0,(1-lifeRel)/0.4);
        ctx.save();
        ctx.strokeStyle=`rgba(200,130,30,${cr.alpha*0.9})`;
        ctx.lineWidth=rand(0.8,2.5);
        ctx.shadowColor='rgba(220,150,40,0.8)'; ctx.shadowBlur=8;
        ctx.beginPath();
        const draw_len=Math.floor(cr.segs.length*Math.min(1,lifeRel*3));
        ctx.moveTo(cr.segs[0].x,cr.segs[0].y);
        for(let j=1;j<draw_len;j++) ctx.lineTo(cr.segs[j].x,cr.segs[j].y);
        ctx.stroke();
        ctx.restore();
        if(age2>=cr.life){ cracks.splice(i,1); spawnCrack(); }
      }

      // Stones
      for(let i=stones.length-1;i>=0;i--){
        const s=stones[i];
        s.x+=s.vx; s.y+=s.vy; s.rot+=s.rotV; s.age++;
        const life=s.age/s.life;
        const a=s.alpha*(life<0.15?life/0.15:life>0.75?(1-life)/0.25:1);
        ctx.save();
        ctx.translate(s.x,s.y); ctx.rotate(s.rot);
        ctx.shadowColor='rgba(200,130,30,0.7)'; ctx.shadowBlur=8;
        const grad=ctx.createLinearGradient(-s.w/2,-s.h/2,s.w/2,s.h/2);
        grad.addColorStop(0,`rgba(190,130,40,${a})`);
        grad.addColorStop(1,`rgba(100,65,10,${a})`);
        ctx.fillStyle=grad;
        ctx.fillRect(-s.w/2,-s.h/2,s.w,s.h);
        ctx.restore();
        if(s.age>=s.life){ stones.splice(i,1); spawnStone(); }
      }

      // Lava glow cracks in bottom
      ctx.save();
      ctx.globalCompositeOperation='screen';
      const lg=ctx.createLinearGradient(0,H*0.7,0,H);
      lg.addColorStop(0,'rgba(0,0,0,0)');
      lg.addColorStop(1,`rgba(180,80,0,${0.15+0.1*Math.sin(t*0.03)})`);
      ctx.fillStyle=lg; ctx.fillRect(0,H*0.7,W,H*0.3);
      ctx.restore();
    };
  }

  // ══════════════════════════════════════════
  //  WIND (unused)
  // ══════════════════════════════════════════
  function WindSystem(ctx,W,H){
    const petals=[];
    const ribbons=[];
    const sparkles=[];
    let t=0;

    for(let i=0;i<25;i++) spawnPetal(true);
    for(let i=0;i<8;i++) spawnRibbon();
    for(let i=0;i<15;i++) sparkles.push({x:rand(0,W),y:rand(0,H),phase:rand(0,Math.PI*2),speed:rand(0.04,0.1),r:rand(2,5)});

    function spawnPetal(init){
      petals.push({
        x:rand(0,W), y:init?rand(0,H):H+10,
        vx:rand(-1.5,1.5), vy:rand(-3,-0.8),
        rot:rand(0,Math.PI*2), rotV:rand(-0.06,0.06),
        life:rand(100,200), age:init?randInt(0,200):0,
        size:rand(5,12), alpha:rand(0.6,1),
        color:`hsl(${rand(320,360)},${rand(70,95)}%,${rand(65,80)}%)`
      });
    }
    function spawnRibbon(){
      ribbons.push({
        y:rand(0.05,0.95)*H, width:rand(0.4,0.9)*W,
        x:rand(-0.1,0.1)*W, alpha:rand(0.2,0.55),
        speed:rand(0.004,0.01), phase:rand(0,Math.PI*2),
        hue:rand(310,360), thickness:rand(1,3)
      });
    }

    return function draw(){
      t++;
      ctx.clearRect(0,0,W,H);

      // Warm gradient bg
      const bg=ctx.createRadialGradient(W/2,H/2,0,W/2,H/2,W*0.8);
      bg.addColorStop(0,'rgba(255,100,150,0.05)');
      bg.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=bg; ctx.fillRect(0,0,W,H);

      // Ribbons (flowing wind streams)
      for(const rib of ribbons){
        rib.phase+=rib.speed;
        const a=rib.alpha*(0.5+0.5*Math.sin(rib.phase));
        ctx.save();
        ctx.strokeStyle=`hsla(${rib.hue},90%,75%,${a})`;
        ctx.lineWidth=rib.thickness;
        ctx.shadowColor=`hsla(${rib.hue},90%,70%,0.8)`; ctx.shadowBlur=8;
        ctx.beginPath();
        ctx.moveTo(rib.x,rib.y);
        const steps=40;
        for(let s=0;s<=steps;s++){
          const px=rib.x+s*(rib.width/steps);
          const py=rib.y+Math.sin(rib.phase+s*0.3)*12+Math.cos(rib.phase*0.5+s*0.15)*6;
          ctx.lineTo(px,py);
        }
        ctx.stroke(); ctx.restore();
      }

      // Cherry blossom petals
      for(let i=petals.length-1;i>=0;i--){
        const p=petals[i];
        p.x+=p.vx+Math.sin(t*0.02+p.phase)*0.5;
        p.y+=p.vy; p.rot+=p.rotV; p.age++;
        if(!p.phase) p.phase=rand(0,Math.PI*2);
        const life=p.age/p.life;
        const a=p.alpha*(life<0.2?life/0.2:life>0.8?(1-life)/0.2:1);
        ctx.save();
        ctx.translate(p.x,p.y); ctx.rotate(p.rot);
        ctx.shadowColor=p.color; ctx.shadowBlur=8;
        ctx.globalAlpha=a;
        // Petal shape
        ctx.fillStyle=p.color;
        ctx.beginPath();
        ctx.moveTo(0,0);
        ctx.bezierCurveTo(p.size,0,p.size,p.size*0.7,0,p.size*0.8);
        ctx.bezierCurveTo(-p.size,p.size*0.7,-p.size,0,0,0);
        ctx.fill();
        // Petal vein
        ctx.strokeStyle='rgba(255,255,255,0.4)';
        ctx.lineWidth=0.5;
        ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(0,p.size*0.7); ctx.stroke();
        ctx.restore();
        if(p.age>=p.life){ petals.splice(i,1); spawnPetal(false); }
      }

      // Sparkle crosses
      for(const sp of sparkles){
        sp.phase+=sp.speed;
        const a=0.4+0.6*Math.abs(Math.sin(sp.phase));
        const r=sp.r*a;
        ctx.save();
        ctx.strokeStyle=`rgba(255,180,220,${a})`;
        ctx.lineWidth=1.2; ctx.shadowColor='rgba(255,150,200,0.9)'; ctx.shadowBlur=8;
        ctx.beginPath();
        ctx.moveTo(sp.x-r,sp.y); ctx.lineTo(sp.x+r,sp.y);
        ctx.moveTo(sp.x,sp.y-r); ctx.lineTo(sp.x,sp.y+r);
        // Diagonal arms
        const dr=r*0.6;
        ctx.moveTo(sp.x-dr,sp.y-dr); ctx.lineTo(sp.x+dr,sp.y+dr);
        ctx.moveTo(sp.x+dr,sp.y-dr); ctx.lineTo(sp.x-dr,sp.y+dr);
        ctx.stroke(); ctx.restore();
      }

      // Soft center glow
      const cg=ctx.createRadialGradient(W/2,H/2,0,W/2,H/2,W*0.5);
      cg.addColorStop(0,`rgba(255,150,200,${0.05+0.03*Math.sin(t*0.02)})`);
      cg.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=cg; ctx.fillRect(0,0,W,H);
    };
  }

  // ── Wire up each canvas ──────────────────────────────────────────────────
  const SYSTEMS=[SageSystem,LunarSystem,FireSystem,EarthSystem];

  grid.querySelectorAll('.elem-canvas').forEach((canvas,i)=>{
    const card=canvas.closest('.team-card');
    const ctx=canvas.getContext('2d');
    let raf=null, running=false;

    function resize(){
      canvas.width=canvas.offsetWidth||canvas.parentElement.offsetWidth||300;
      canvas.height=canvas.offsetHeight||canvas.parentElement.offsetHeight||400;
    }
    resize();
    new ResizeObserver(resize).observe(canvas);

    const drawFn=SYSTEMS[i](ctx,canvas.width,canvas.height);

    function loop(){
      if(!running) return;
      // Rebuild system if canvas resized
      drawFn();
      raf=requestAnimationFrame(loop);
    }

    card.addEventListener('mouseenter',()=>{
      running=true;
      resize();
      loop();
    });
    card.addEventListener('mouseleave',()=>{
      running=false;
      if(raf){cancelAnimationFrame(raf);raf=null;}
      const ctx2=canvas.getContext('2d');
      ctx2.clearRect(0,0,canvas.width,canvas.height);
    });

    // Touch support
    card.addEventListener('touchstart',()=>{
      running=true; resize(); loop();
    },{passive:true});
    card.addEventListener('touchend',()=>{
      running=false;
      if(raf){cancelAnimationFrame(raf);raf=null;}
    });
  });

}
buildTeam();

// ===== FLIGHT ANIMATION =====
let flightActive=false,flightProgress=0;
function initFlightCanvas(){
  const canvas=document.getElementById('flight-canvas');
  const ctx=canvas.getContext('2d');
  function resize(){canvas.width=canvas.offsetWidth;canvas.height=canvas.offsetHeight;}
  resize();window.addEventListener('resize',resize);
  function drawBg(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle='#030303';ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.strokeStyle='rgba(200,168,75,0.05)';ctx.lineWidth=0.5;
    for(let x=0;x<canvas.width;x+=24){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,canvas.height);ctx.stroke();}
    for(let y=0;y<canvas.height;y+=24){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(canvas.width,y);ctx.stroke();}
    const iX=canvas.width*0.15,iY=canvas.height*0.62;
    const jX=canvas.width*0.82,jY=canvas.height*0.32;
    const cpX=canvas.width*0.5,cpY=canvas.height*0.08;
    // India marker
    ctx.fillStyle='rgba(230,32,32,0.9)';ctx.beginPath();ctx.arc(iX,iY,7,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='rgba(230,32,32,0.2)';ctx.beginPath();ctx.arc(iX,iY,20,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#e62020';ctx.font='bold 9px Share Tech Mono';ctx.fillText('🇮🇳 INDIA',iX-8,iY-24);
    // Japan marker
    ctx.fillStyle='rgba(200,168,75,0.9)';ctx.beginPath();ctx.arc(jX,jY,7,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='rgba(200,168,75,0.2)';ctx.beginPath();ctx.arc(jX,jY,20,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#c8a84b';ctx.fillText('🇯🇵 MIE, JAPAN',jX-52,jY-24);
    ctx.setLineDash([4,7]);ctx.strokeStyle='rgba(200,168,75,0.15)';ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(iX,iY);ctx.quadraticCurveTo(cpX,cpY,jX,jY);ctx.stroke();
    ctx.setLineDash([]);
    return{iX,iY,jX,jY,cpX,cpY};
  }
  function qPoint(x0,y0,cx,cy,x1,y1,t){const m=1-t;return{x:m*m*x0+2*m*t*cx+t*t*x1,y:m*m*y0+2*m*t*cy+t*t*y1};}
  function frame(){
    const c=drawBg();
    if(flightActive&&flightProgress<1){
      flightProgress+=0.003;
      const pos=qPoint(c.iX,c.iY,c.cpX,c.cpY,c.jX,c.jY,flightProgress);
      const nxt=qPoint(c.iX,c.iY,c.cpX,c.cpY,c.jX,c.jY,Math.min(flightProgress+0.01,1));
      const ang=Math.atan2(nxt.y-pos.y,nxt.x-pos.x);
      const grad=ctx.createLinearGradient(c.iX,c.iY,pos.x,pos.y);
      grad.addColorStop(0,'rgba(200,168,75,0.04)');grad.addColorStop(1,'rgba(200,168,75,0.7)');
      ctx.strokeStyle=grad;ctx.lineWidth=1.5;
      ctx.beginPath();ctx.moveTo(c.iX,c.iY);ctx.quadraticCurveTo(c.cpX,c.cpY,pos.x,pos.y);ctx.stroke();
      ctx.fillStyle='rgba(200,168,75,0.1)';ctx.beginPath();ctx.arc(pos.x,pos.y,26,0,Math.PI*2);ctx.fill();
      ctx.save();ctx.translate(pos.x,pos.y);ctx.rotate(ang);
      ctx.fillStyle='#c8a84b';ctx.font='18px Arial';ctx.fillText('✈',-9,7);ctx.restore();
      if(flightProgress>=1){
        flightActive=false;
        for(let r=10;r<80;r+=12){
          ctx.beginPath();ctx.arc(c.jX,c.jY,r,0,Math.PI*2);
          ctx.strokeStyle=`rgba(200,168,75,${0.7-r/120})`;ctx.lineWidth=1;ctx.stroke();
        }
        ctx.fillStyle='#c8a84b';ctx.font='bold 10px Share Tech Mono';ctx.textAlign='center';
        ctx.fillText('着陸！ARRIVED IN MIE',c.jX,c.jY+40);ctx.textAlign='left';
      }
    }
    requestAnimationFrame(frame);
  }
  frame();
}
function triggerFlight(){flightProgress=0;flightActive=true;}
initFlightCanvas();

// ===== SCROLL REVEAL =====
function initReveal(){
  const els=document.querySelectorAll('.reveal,.reveal-left,.reveal-right');
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible');});
  },{threshold:0.07});
  els.forEach(el=>obs.observe(el));
}
document.addEventListener('DOMContentLoaded',()=>setTimeout(initReveal,4200));

// ===== STAT COUNTER =====
let countersFired=false;
function animateCounters(){
  if(countersFired)return;
  countersFired=true;
  document.querySelectorAll('.stat-num[data-target]').forEach(el=>{
    const target=parseInt(el.dataset.target);let current=0;
    const step=Math.ceil(target/40);
    const t=setInterval(()=>{current=Math.min(current+step,target);el.textContent=current;if(current>=target)clearInterval(t);},30);
  });
}
const aboutEl=document.getElementById('about');

function checkAboutVisible(){
  if(!aboutEl||countersFired)return;
  const r=aboutEl.getBoundingClientRect();
  if(r.top<window.innerHeight*0.85 && r.bottom>0) animateCounters();
}

if(aboutEl){
  const aboutObs=new IntersectionObserver(entries=>{if(entries[0].isIntersecting)animateCounters();},{threshold:0.1});
  aboutObs.observe(aboutEl);

  // Fallbacks for WebViews (e.g. Instagram in-app browser) where IntersectionObserver
  // can fail to fire on a page that loads pre-transitioned/hidden.
  window.addEventListener('scroll',checkAboutVisible,{passive:true});
  window.addEventListener('load',checkAboutVisible);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)checkAboutVisible();});
  setTimeout(checkAboutVisible,1500);
  setTimeout(animateCounters,6000); // last-resort: force it after 6s no matter what
}

// ===== ACTIVE NAV =====
window.addEventListener('scroll',()=>{
  const curr=Array.from(document.querySelectorAll('section[id]')).filter(s=>window.scrollY>=s.offsetTop-120).pop();
  document.querySelectorAll('.nav-links a').forEach(a=>{a.style.color=curr&&a.getAttribute('href')==='#'+curr.id?'var(--gold)':'';});
});

// ===== PARALLAX HERO KANJI =====
window.addEventListener('scroll',()=>{
  const bg=document.querySelector('.hero-kanji-bg');
  if(bg)bg.style.transform=`translate(-50%, calc(-50% + ${window.scrollY*0.25}px))`;
});

// ===== VERTICAL CARD CLICK BURST =====
document.querySelectorAll('.vertical-card').forEach(card=>{
  card.addEventListener('click',()=>{
    const b=document.createElement('div');b.className='card-click-burst';card.appendChild(b);
    setTimeout(()=>b.remove(),500);
  });
});

// ===== ICONIC CARD CLICK BURST =====
document.querySelectorAll('.iconic-card').forEach(card=>{
  card.addEventListener('click',()=>{
    const b=document.createElement('div');b.className='card-click-burst';card.appendChild(b);
    setTimeout(()=>b.remove(),500);
  });
});


// ==================== MASCOT DATA ====================
const MASCOTS = [
  {
    id: 'kazuya',
    name: 'KAZUYA',
    fullname: 'Kazuya Satomi',
    role: 'Main Protagonist',
    power: 'Bond Conversion',
    powerDesc: 'Turns the love and trust of others into overwhelming strength.',
    trait: 'THE LIGHT',
    desc: 'Average-looking, extraordinary soul. He fights for those he loves and the future he believes in.',
    img: 'images/js_006.jpg', chibImg: 'images/js_007.jpg',
    color: 'rgba(255,200,80,0.95)',
    glowColor: '255,200,80',
    personality: 'warm',
    side: 'LIGHT',
    quotes: {
      idle: ["I'll protect everyone — that's my promise.", "As long as people believe in me, I won't stop.", "Every bond makes me stronger. Even this one.", "You came here... that means something."],
      scroll: ["There's so much to discover here!", "Keep going — the best parts are ahead.", "Every scroll is a new horizon!", "I can feel the energy of this place."],
      click: ["That's the spirit! Forward!", "Every choice shapes who we are.", "Bold move. I respect that.", "That click just changed something."],
      hover: ["Careful — that one matters.", "I can feel the pull too.", "You sense it, right? Something's here.", "Don't hesitate. Trust your instincts."],
      nav: ["New ground, new strength!", "Every place we visit builds us up.", "I've never been somewhere I didn't learn from.", "Lead on — I'll follow."],
      idle_long: ["I was just thinking about everyone who got us here...", "The quiet moments are when I feel it most.", "Even now, I can feel their energy around me.", "Rest when you can. The journey's long."]
    }
  },
  {
    id: 'elisia',
    name: 'ELISIA',
    fullname: 'Elisia',
    role: "Kazuya's Lover",
    power: 'Unwavering Support',
    powerDesc: "Kazuya's lover. Cheerful, kind, and full of life.",
    trait: 'THE CHEERFUL ONE',
    desc: 'Bright and bubbly, her unwavering love inspires Kazuya to keep moving forward no matter what.',
    img: 'images/js_008.jpg', chibImg: 'images/js_009.jpg',
    color: 'rgba(120,220,100,0.95)',
    glowColor: '120,220,100',
    personality: 'cheerful',
    side: 'LIGHT',
    quotes: {
      idle: ["Kyaa~! Everything here is so amazing! ✨", "I just know something wonderful is about to happen!", "Heehee, can you feel how alive this place is?!", "This whole universe is one big adventure~!"],
      scroll: ["Oh WOW there's so much to see!!", "Keep going, keep going — it only gets better!", "Every pixel is a little gift I didn't expect!", "The further we go the more I love it here~!"],
      click: ["YES! That was perfect!!", "You made something happen — I felt it!", "Ahhh so satisfying!! Do it again!", "Every click is a tiny celebration~!"],
      hover: ["Ooooh what's THAT?! Tell me everything!", "I have a good feeling about this one...", "My heart is literally racing right now~!", "Don't be shy — you clearly want to click it!"],
      nav: ["New section?! NEW SECTION!!!", "I love going new places with you~!", "Every corner of this site is a treasure chest!", "Let's gooo! Together always~!"],
      idle_long: ["I wonder what Kazuya is doing right now...", "You're still here! That makes me so happy~", "I could stay in this moment forever, honestly.", "You know what? You're my favourite visitor~!"]
    }
  },
  {
    id: 'shinna',
    name: 'SHINNA',
    fullname: 'Shinna Takahashi',
    role: "Kazuya's Pillar",
    power: 'Steadfast Anchor',
    powerDesc: 'The strongest pillar of his heart. Her love is his only light.',
    trait: 'THE CALM STRENGTH',
    desc: "Kazuya's unwavering support. Her quiet presence and deep love remain his only light in the darkest times.",
    img: 'images/js_010.jpg', chibImg: 'images/js_011.jpg',
    color: 'rgba(180,180,210,0.95)',
    glowColor: '180,180,210',
    personality: 'calm',
    side: 'LIGHT',
    quotes: {
      idle: ["I'm watching. I always am.", "Strength isn't loud. It just endures.", "Take your time. I'll be right here.", "The steadiest things move the quietest."],
      scroll: ["Pace yourself. Everything is worth seeing.", "Methodical. That's the right approach.", "Each section has its own weight.", "I appreciate the discipline in your browsing."],
      click: ["Deliberate. Good.", "You chose well.", "That was the right call.", "Measured action. I respect it."],
      hover: ["You're considering this. That's wise.", "Don't rush. Feel it out.", "The careful ones always find more.", "I'll wait while you decide."],
      nav: ["New territory. Stay grounded.", "Moving forward — but don't forget where we came from.", "I'll map this place in my mind.", "Forward. Always forward."],
      idle_long: ["The silence tells me you're thinking deeply.", "Take as long as you need.", "I've been here this whole time. Did you notice?", "Stillness is its own kind of strength."]
    }
  },
  {
    id: 'wino',
    name: 'WINO',
    fullname: 'Wino Izukaya',
    role: 'Antagonist',
    power: 'Despair Absorption',
    powerDesc: 'Transforms hatred, fear and despair of the world into destructive power.',
    trait: 'THE DARKNESS',
    desc: 'Betrayed by society, abused by his father, tortured by his peers. The world took everything — now he will return the favour.',
    img: 'images/js_012.jpg', chibImg: 'images/js_013.jpg',
    color: 'rgba(150,100,255,0.95)',
    glowColor: '150,100,255',
    personality: 'intense',
    side: 'DARK',
    quotes: {
      idle: ["You came to this place. Interesting.", "Don't mistake curiosity for courage.", "I've seen what this world does to people. I remember.", "Every system has a breaking point."],
      scroll: ["Looking for something? Or running from it?", "Dig deeper. The truth is never on the surface.", "Every scroll takes you further from comfort.", "You want to see the whole picture? Keep going."],
      click: ["You chose to act. Finally.", "Destruction and creation — same motion.", "Something changes with every choice. Remember that.", "Don't pretend you didn't mean to."],
      hover: ["You linger. You're not sure. I understand.", "There's something here that scares you a little.", "Hesitation is honest.", "Whatever you're feeling right now — it's valid."],
      nav: ["New section. Different face, same world.", "Every room hides something.", "I've mapped darker places than this.", "I go where I choose. Always."],
      idle_long: ["Still here. So am I.", "The world keeps moving. I'm still standing.", "What are you waiting for? Ask me anything.", "I grew up waiting in silence. I'm used to it."]
    }
  },
  {
    id: 'oliver',
    name: 'OLIVER',
    fullname: 'Oliver',
    role: "Kazuya's Best Friend",
    power: 'Reliable Backup',
    powerDesc: "Kazuya's closest friend. Skilled, reliable, always there to back him up.",
    trait: 'THE BACKBONE',
    desc: 'Cool, capable, and always three steps ahead. No matter how bad things get, Oliver shows up.',
    img: 'images/js_014.jpg', chibImg: 'images/js_015.jpg',
    color: 'rgba(80,180,255,0.95)',
    glowColor: '80,180,255',
    personality: 'cool',
    side: 'LIGHT',
    quotes: {
      idle: ["Already scoped the whole place. We're good.", "I've seen worse. Much worse.", "Not bad. I've been studying the layout.", "Don't worry — I've got eyes on everything."],
      scroll: ["Smart. Check the whole field before acting.", "This site is well-defended. Good build.", "I'm cataloguing as we go.", "Every detail matters. Keep scrolling."],
      click: ["Efficient. Direct. I like your style.", "Target acquired. Nice.", "Clean execution.", "That's how you do it."],
      hover: ["Assessing. Hold on.", "Could be useful. Could be a trap.", "I already know what that does. Still checking.", "Your instincts are sound."],
      nav: ["Repositioning. Stay close.", "New zone. Threat level: zero. Proceed.", "I've already been here and scouted it.", "Moving. Don't fall behind."],
      idle_long: ["Running diagnostics on this whole operation.", "The quiet means I'm working. Don't sweat it.", "Still here. Still watching. Always.", "You know I never actually leave, right?"]
    }
  },
  {
    id: 'miyaki',
    name: 'MIYAKI',
    fullname: 'Miyaki Izukaya',
    role: "Wino's Little Sister",
    power: 'Pure Belief',
    powerDesc: "The only one who sees Wino as her hero. Her belief in him is absolute.",
    trait: 'THE INNOCENT HEART',
    desc: "Wino's adorable little sister. Bright, cheerful, and the only one who never stopped believing in her big brother.",
    img: 'images/js_016.jpg', chibImg: 'images/js_017.jpg',
    color: 'rgba(120,200,255,0.95)',
    glowColor: '120,200,255',
    personality: 'childlike',
    side: 'LIGHT',
    quotes: {
      idle: ["Onii-chan said I could come help today!", "Everything here looks so shiny and cool~!", "I'm gonna find all the secret things!", "You seem nice. I decided already."],
      scroll: ["Waaah there's SO MUCH here!!!", "I want to see ALL of it!!", "Scroll faster!! Faster!!", "Every part is my favourite part so far~!"],
      click: ["Kyaaaa you did it!! You clicked!!", "That was so cool I wanna do it too!!", "I knew you'd pick that one~!", "YAAAY!! Something happened!!"],
      hover: ["Oooooh is that a secret button?!", "I bet something super cool happens if you click it~", "I'm not supposed to touch things but... just one look...", "Onii-chan said be careful but THIS LOOKS IMPORTANT"],
      nav: ["NEW ROOM NEW ROOM NEW ROOM!!", "Wait up!! Don't leave me behind!!", "Where are we going?! I love it already!!", "Lead the way~ I'll follow forever~!"],
      idle_long: ["Are you busy? Can we play?", "I've been waiting forever... okay like two minutes.", "I drew a picture of this place. Want to see?", "Onii-chan says patience is important. I'm being patient!! Mostly."]
    }
  },
  {
    id: 'mrs_izukaya',
    name: 'MRS. IZUKAYA',
    fullname: 'Mrs. Izukaya',
    role: "Wino's Mother",
    power: 'Unconditional Love',
    powerDesc: "The only one who never gave up on Wino. Her love is his anchor.",
    trait: 'THE ANCHOR',
    desc: "Wino's mother. The only one who never gave up on him. Her love is his reason for living and the last light in his darkest moments.",
    img: 'images/js_018.jpg', chibImg: 'images/js_019.jpg',
    color: 'rgba(80,200,160,0.95)',
    glowColor: '80,200,160',
    personality: 'warm',
    side: 'LIGHT',
    quotes: {
      idle: ["Take care of yourself, okay? I mean it.", "You've come a long way to be here. I see that.", "This place holds a lot of love in it.", "Sit with me for a moment. No rush."],
      scroll: ["There's no hurry. Every part deserves attention.", "Take it all in. You have time.", "The journey matters more than the speed.", "I'll be right here while you explore."],
      click: ["Good. You trusted your instincts.", "Every small action means something.", "That was the right thing to do.", "I always knew you'd make the right call."],
      hover: ["Something drew you here. Listen to that.", "Take your time. I'll wait.", "You feel it, don't you? That quiet pull.", "The careful heart finds what it needs."],
      nav: ["Wherever you go, bring warmth with you.", "New paths are just old ones we haven't walked yet.", "I'll be proud of you no matter where you end up.", "Go on. I'll be right behind you."],
      idle_long: ["Rest a little. You deserve it.", "I've been watching over this place. It's safe here.", "You remind me of someone I love very much.", "No matter what happens — someone out there is proud of you."]
    }
  }
];

let currentMascotIndex = 0;
let activeMascot = null;
let bubbleTimeout = null;
let longIdleTimeout = null;
let lastAction = 'idle';
let musicPlaying = false;
let senseitrixOpen = true;

// AUDIO CONTEXT for sound effects
let audioCtx = null;
function getAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

function playTone(freq, type, duration, vol=0.15) {
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = type; osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + duration);
  } catch(e) {}
}

function playClickSfx() { playTone(800, 'sine', 0.1); setTimeout(()=>playTone(1200,'sine',0.08),60); }
function playHoverSfx() { playTone(600, 'sine', 0.05, 0.05); }
function playNavSfx() { playTone(400,'triangle',0.2); setTimeout(()=>playTone(600,'triangle',0.15),100); setTimeout(()=>playTone(800,'triangle',0.1),200); }
function playScrollSfx() { playTone(300,'sine',0.05,0.03); }

// ===== SECTION-AWARE QUOTES =====
function getSectionAwareQuote() {
  if (!activeMascot) return null;
  const sections = document.querySelectorAll('section[id]');
  const mid = window.scrollY + window.innerHeight * 0.5;
  let currentSection = null;
  sections.forEach(s => { if (s.offsetTop <= mid) currentSection = s.id; });
  const sectionQuotes = {
    'works': {
      'kazuya': "This is where the dreams take shape — I can feel the energy!",
      'elisia': "Eeeek these projects are SO GOOD I can't even handle it~!!",
      'wino': "Creation is the only act of defiance worth taking seriously.",
      'oliver': "Quality output. The studio is building something real here.",
      'shinna': "Every work here carries intention. That's rare.",
      'miyaki': "ONII-CHAN LOOK AT ALL THE COOL THINGS THEY MADE!!!",
      'mrs_izukaya': "Look at what they've built. I feel pride in every piece."
    },
    'team': {
      'kazuya': "Every great story starts with the people who believe in it.",
      'elisia': "They all look so AMAZING I want to be friends with everyone~!",
      'wino': "...These people actually built something. I notice that.",
      'oliver': "Solid team. Good skill distribution. They'll hold together.",
      'shinna': "A team is only as strong as the bonds between them.",
      'miyaki': "So many cool people!! Can I join the team? Please??",
      'mrs_izukaya': "These young ones remind me why I never gave up."
    },
    'about': {
      'kazuya': "A studio born from passion — the best kind of origin story.",
      'elisia': "This whole story makes my heart want to BURST with happiness~!",
      'wino': "Born in India. That means something. Origins always do.",
      'oliver': "Statistically impressive for a studio this young.",
      'shinna': "A foundation built on authentic purpose. That endures.",
      'miyaki': "India AND Japan?! That's like TWO whole adventures~!!",
      'mrs_izukaya': "What a journey to have taken. I hope they know how far they've come."
    }
  };
  if (currentSection && sectionQuotes[currentSection] && activeMascot) {
    const id = activeMascot.id;
    return sectionQuotes[currentSection][id] || null;
  }
  return null;
}
function playSenseitrixSfx() {
  // Power-up opening sound
  playOpenSfx();
}
function playActivateSfx() {
  // SenseiTrix activation sequence - ascending power-up
  [200,300,500,800,1200,1600,2000,2500].forEach((f,i)=>setTimeout(()=>playTone(f,'sawtooth',0.18,0.25),i*55));
  // Flash burst at the end
  setTimeout(()=>{
    [3000,2000,1000].forEach((f,i)=>setTimeout(()=>playTone(f,'sine',0.12,0.2),i*80));
  }, 500);
}
function playDialSfx() {
  // Dial click - mechanical tick
  playTone(800,'square',0.05,0.06);
  setTimeout(()=>playTone(600,'square',0.03,0.04),40);
}
// playHoverSfx already defined above
function playScrollSfx2() { 
  playTone(300 + Math.random()*200,'sine',0.03,0.08); 
}
function playSelectSfx() {
  // Selection confirm beep
  [500,700,900].forEach((f,i)=>setTimeout(()=>playTone(f,'triangle',0.08,0.12),i*60));
}
function playOpenSfx() {
  // SenseiTrix opening power sound
  [100,150,200,300,500,800].forEach((f,i)=>setTimeout(()=>playTone(f,'sawtooth',0.15,0.2),i*40));
}

// ==================== SPACE BACKGROUND ====================
function initSpaceCanvas() {
  const canvas = document.getElementById('space-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth; canvas.height = window.innerHeight;
  window.addEventListener('resize', ()=>{ canvas.width=window.innerWidth; canvas.height=window.innerHeight; });
  
  // Interactive mouse tracking
  let mouseX = canvas.width/2, mouseY = canvas.height/2;
  canvas.addEventListener('mousemove', e=>{
    mouseX = e.clientX; mouseY = e.clientY;
  });
  
  // Stars - more varied
  const stars = Array.from({length: 400}, ()=>({
    x: Math.random()*canvas.width,
    y: Math.random()*canvas.height,
    r: Math.random()*2.2+0.3,
    speed: Math.random()*0.4+0.05,
    twinkle: Math.random()*Math.PI*2,
    twinkleSpeed: 0.015+Math.random()*0.04,
    color: ['255,255,255','200,230,255','255,230,200','180,255,220'][Math.floor(Math.random()*4)]
  }));
  
  // Nebulas
  const nebulas = Array.from({length: 6}, ()=>({
    x: Math.random()*canvas.width,
    y: Math.random()*canvas.height,
    r: 60+Math.random()*180,
    hue: [160,200,280,120,320,40][Math.floor(Math.random()*6)],
    alpha: 0.025+Math.random()*0.035
  }));
  
  // Shooting stars
  const shootingStars = [];
  function spawnShootingStar() {
    shootingStars.push({
      x: Math.random()*canvas.width*0.6,
      y: Math.random()*canvas.height*0.4,
      vx: 4+Math.random()*6, vy: 1.5+Math.random()*3,
      life: 1, maxLife: 35+Math.random()*45, trail: []
    });
  }
  setInterval(spawnShootingStar, 1800);
  
  // Floating kanji particles in space
  const kanjiParticles = [];
  const spaceKanji = ['狂','賢','師','創','造','魂','炎','影','嵐','夢','神','龍'];
  function spawnKanjiParticle() {
    kanjiParticles.push({
      x: Math.random()*canvas.width,
      y: canvas.height + 20,
      char: spaceKanji[Math.floor(Math.random()*spaceKanji.length)],
      speed: 0.3 + Math.random()*0.5,
      alpha: 0,
      maxAlpha: 0.08 + Math.random()*0.1,
      size: 14 + Math.random()*24,
      drift: (Math.random()-0.5)*0.3,
      life: 0,
      maxLife: 200 + Math.random()*200
    });
  }
  setInterval(spawnKanjiParticle, 1200);
  
  // Mouse parallax orbs
  const orbs = Array.from({length: 4}, (_, i)=>({
    x: canvas.width*(0.2+i*0.2), y: canvas.height*0.5,
    targetX: canvas.width*0.5, targetY: canvas.height*0.5,
    r: 30+i*15, alpha: 0.04+i*0.01,
    hue: [160,180,200,140][i], speed: 0.02+i*0.01
  }));
  
  let t = 0;
  function drawSpace() {
    ctx.fillStyle = 'rgba(0,0,4,0.2)';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    
    // Nebulas
    nebulas.forEach(n=>{
      const grd = ctx.createRadialGradient(n.x,n.y,0,n.x,n.y,n.r);
      grd.addColorStop(0,`hsla(${n.hue},65%,45%,${n.alpha})`);
      grd.addColorStop(0.5,`hsla(${n.hue+30},50%,35%,${n.alpha*0.4})`);
      grd.addColorStop(1,'transparent');
      ctx.fillStyle = grd;
      ctx.beginPath(); ctx.arc(n.x,n.y,n.r,0,Math.PI*2); ctx.fill();
    });
    
    // Mouse-interactive orbs
    orbs.forEach(orb=>{
      orb.targetX += (mouseX - canvas.width/2) * orb.speed * 0.01;
      orb.targetY += (mouseY - canvas.height/2) * orb.speed * 0.01;
      orb.x += (orb.targetX - orb.x) * 0.03;
      orb.y += (orb.targetY - orb.y) * 0.03;
      const grd = ctx.createRadialGradient(orb.x,orb.y,0,orb.x,orb.y,orb.r);
      grd.addColorStop(0,`hsla(${orb.hue},80%,60%,${orb.alpha})`);
      grd.addColorStop(1,'transparent');
      ctx.fillStyle = grd;
      ctx.beginPath(); ctx.arc(orb.x,orb.y,orb.r,0,Math.PI*2); ctx.fill();
    });
    
    // Stars
    stars.forEach(s=>{
      s.y -= s.speed; s.twinkle += s.twinkleSpeed;
      if (s.y < -2) { s.y = canvas.height+2; s.x = Math.random()*canvas.width; }
      const alpha = 0.4 + 0.6*Math.sin(s.twinkle);
      ctx.fillStyle = `rgba(${s.color},${alpha})`;
      ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fill();
    });
    
    // Shooting stars
    for(let i=shootingStars.length-1;i>=0;i--) {
      const ss = shootingStars[i];
      ss.x += ss.vx; ss.y += ss.vy; ss.life++;
      ss.trail.push({x:ss.x,y:ss.y});
      if(ss.trail.length>18) ss.trail.shift();
      if(ss.life >= ss.maxLife || ss.x > canvas.width) { shootingStars.splice(i,1); continue; }
      // Trail gradient
      ss.trail.forEach((pt,pi)=>{
        if(pi===0) return;
        const a = (pi/ss.trail.length)*0.7;
        const prev = ss.trail[pi-1];
        ctx.beginPath();
        ctx.moveTo(prev.x,prev.y); ctx.lineTo(pt.x,pt.y);
        ctx.strokeStyle=`rgba(180,230,255,${a})`; ctx.lineWidth=1.5; ctx.stroke();
      });
      ctx.fillStyle='rgba(255,255,255,0.95)';
      ctx.beginPath(); ctx.arc(ss.x,ss.y,2,0,Math.PI*2); ctx.fill();
    }
    
    // Kanji particles drifting up
    ctx.font = 'bold 18px "Noto Serif JP",serif';
    for(let i=kanjiParticles.length-1;i>=0;i--) {
      const kp = kanjiParticles[i];
      kp.y -= kp.speed; kp.x += kp.drift; kp.life++;
      if (kp.life < 30) kp.alpha = (kp.life/30)*kp.maxAlpha;
      else if (kp.life > kp.maxLife-40) kp.alpha = ((kp.maxLife-kp.life)/40)*kp.maxAlpha;
      if (kp.life >= kp.maxLife || kp.y < -30) { kanjiParticles.splice(i,1); continue; }
      ctx.font = `bold ${kp.size}px "Noto Serif JP",serif`;
      ctx.fillStyle = `rgba(200,168,75,${kp.alpha})`;
      ctx.fillText(kp.char, kp.x, kp.y);
    }
    
    t++;
    requestAnimationFrame(drawSpace); // always keep space canvas running
  }
  drawSpace();
}

// ==================== SENSEITRIX LOGIC ====================
function buildSenseitrixSelectors() {
  const cont = document.getElementById('omni-selectors');
  cont.innerHTML = '';
  MASCOTS.forEach((m,i)=>{
    const btn = document.createElement('div');
    btn.className = 'char-card-btn' + (i===currentMascotIndex?' active':'');
    btn.setAttribute('data-index', i);
    btn.innerHTML = `
      <div class="char-card-img-wrap">
        <img src="${m.img}" alt="${m.name}" 
          onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"
          style="width:100%;height:100%;object-fit:cover;object-position:top center;display:block;">
        <div class="char-card-fallback" style="display:none;width:100%;height:100%;align-items:center;justify-content:center;font-family:'Noto Serif JP',serif;font-size:28px;font-weight:900;color:${m.color};">
          ${m.name[0]}
        </div>
        <div class="char-card-scan"></div>
        <div class="char-card-side-badge ${m.side==='DARK'?'dark':''}">${m.side}</div>
      </div>
      <div class="char-card-info">
        <div class="char-card-name" style="color:${m.color};">${m.name}</div>
        <div class="char-card-role">${m.role}</div>
        <div class="char-card-power-tag">⬡ ${m.power}</div>
      </div>
      <div class="char-card-hover-overlay">
        <div class="char-card-hover-name" style="color:${m.color};">${m.fullname}</div>
        <div class="char-card-hover-desc">${m.desc}</div>
        <div class="char-card-hover-power">
          <span style="color:${m.color};font-size:7px;letter-spacing:0.3em;">POWER: ${m.power}</span>
          <span style="color:rgba(232,228,216,0.5);font-size:9px;margin-top:3px;">${m.powerDesc}</span>
        </div>
        <div class="char-card-select-hint">▶ SELECT</div>
      </div>
    `;
    btn.addEventListener('click', ()=>{ selectMascot(i); playDialSfx(); });
    cont.appendChild(btn);
  });
}

function dialClick(index) {
  selectMascot(index);
  // Flash click sound
  [350, 600, 900].forEach((f,i)=>setTimeout(()=>playTone(f,'sine',0.1,0.12), i*55));
  // Visual flash on selected segment
  const seg = document.getElementById('dial-seg-' + index);
  if (seg) {
    seg.style.filter = 'brightness(2) drop-shadow(0 0 14px rgba(0,255,157,1))';
    setTimeout(()=>{ seg.style.filter = ''; }, 500);
  }
}

function selectMascot(index) {
  currentMascotIndex = index;
  const m = MASCOTS[index];

  // ── Update SVG mascot image ──
  const omniImg = document.getElementById('omni-mascot-img');
  if (omniImg) {
    omniImg.style.opacity = '0';
    setTimeout(() => {
      omniImg.setAttribute('href', m.chibImg || m.img || '');
      omniImg.setAttribute('xlink:href', m.chibImg || m.img || '');
      omniImg.style.opacity = '1';
    }, 240);
  }

  // ── Digital display text ──
  const dispName = document.getElementById('omni-display-name');
  if (dispName) { dispName.textContent = '◈ ' + m.name + ' ◈'; dispName.setAttribute('fill', m.color); }
  const dispTrait = document.getElementById('omni-display-trait');
  if (dispTrait) dispTrait.textContent = '· ' + m.power + ' ·';

  // ── Rotate selection pointer ──
  const pointer = document.getElementById('omni-pointer');
  if (pointer) pointer.style.transform = 'rotate(' + (index * 60) + 'deg)';

  // ── Highlight active segment ──
  document.querySelectorAll('.dial-seg').forEach((seg, i) => {
    const path = seg.querySelector('path');
    const dot  = seg.querySelector('circle');
    const txt  = seg.querySelector('text');
    if (i === index) {
      if (path) path.setAttribute('fill', 'url(#seg-on)');
      if (dot)  { dot.setAttribute('stroke', 'rgba(0,255,157,0.95)'); dot.setAttribute('fill', 'rgba(0,70,44,0.95)'); }
      if (txt)  txt.setAttribute('fill', 'rgba(0,255,157,1)');
      seg.style.filter = 'drop-shadow(0 0 10px rgba(0,255,157,0.7))';
    } else {
      if (path) path.setAttribute('fill', 'url(#seg-off)');
      if (dot)  { dot.setAttribute('stroke', 'rgba(0,255,157,0.35)'); dot.setAttribute('fill', 'rgba(0,30,18,0.9)'); }
      if (txt)  txt.setAttribute('fill', 'rgba(0,255,157,0.6)');
      seg.style.filter = '';
    }
  });

  // ── Character card buttons ──
  document.querySelectorAll('.char-card-btn').forEach((btn, i) => {
    btn.classList.toggle('active', i === index);
  });

  // ── Description / name blocks ──
  const descEl = document.getElementById('omni-char-desc');
  if (descEl) descEl.textContent = m.desc;
  const nameEl = document.getElementById('omni-char-name');
  if (nameEl) { nameEl.textContent = m.fullname || m.name; nameEl.style.color = m.color; }
  const traitEl = document.getElementById('omni-char-trait');
  if (traitEl) traitEl.textContent = '⬡ ' + m.trait + ' ⬡';
  // Update mini portrait
  const portrait = document.getElementById('omni-info-portrait-img');
  if (portrait) { portrait.src = m.img || m.chibImg; portrait.style.transition='opacity 0.3s'; portrait.style.opacity='0'; setTimeout(()=>{portrait.style.opacity='1';},80); }
  const portraitWrap = document.getElementById('omni-info-portrait');
  if (portraitWrap) portraitWrap.style.borderColor = m.color.replace('0.95','0.5');
  // Update status
  const statusEl = document.getElementById('omni-status-text');
  if (statusEl) statusEl.textContent = '// ' + (m.side||'READY');

  // ── Tint dial with mascot colour ──
  const dialSvg = document.getElementById('omni-dial-svg');
  if (dialSvg && m.color) {
    dialSvg.style.filter = 'drop-shadow(0 0 20px ' + m.color.replace('0.9','0.22') + ')';
  }
}


function activateMascot(index) {
  playActivateSfx();
  activeMascot = MASCOTS[index];
  tryAutoStartMusic();
  
  // Flash animation (guard null)
  const plate = document.getElementById('omni-faceplate');
  if (plate) {
    plate.style.animation = 'omni-activate-flash 0.5s ease';
  }
  
  // Particle burst from faceplate
  const rect = plate ? plate.getBoundingClientRect() : {left: window.innerWidth/2, top: window.innerHeight/2, width:0, height:0};
  for(let i=0;i<20;i++){
    const p = document.createElement('div');
    const angle = (i/20)*Math.PI*2;
    const dist = 60+Math.random()*80;
    p.style.cssText=`position:fixed;left:${rect.left+rect.width/2}px;top:${rect.top+rect.height/2}px;
      width:6px;height:6px;border-radius:50%;background:rgba(0,255,180,0.9);
      pointer-events:none;z-index:200001;
      --dx:${Math.cos(angle)*dist}px;--dy:${Math.sin(angle)*dist}px;
      animation:particle-burst 0.8s ease forwards;`;
    document.body.appendChild(p);
    setTimeout(()=>p.remove(), 900);
  }
  
  setTimeout(()=>{
    // Close SenseiTrix screen
    const screen = document.getElementById('senseitrix-screen');
    screen.style.animation = 'glitch-exit 0.6s ease forwards';
    setTimeout(()=>{
      screen.style.display='none';
      senseitrixOpen = false;
      
      // Show mascot companion
      const companion = document.getElementById('mascot-companion');
      companion.style.display = 'flex';
      document.getElementById('mascot-sprite').src = activeMascot.chibImg || activeMascot.img;
      document.getElementById('mascot-label').textContent = activeMascot.name;
      const traitEl = document.getElementById('mascot-trait-label');
      if(traitEl) traitEl.textContent = activeMascot.trait;
      
      // Show music player
      document.getElementById('music-player').style.display = 'flex';
      
      // Show welcome bubble with character intro
      const welcomeMsg = `${activeMascot.name} is ready! ${activeMascot.quotes.idle[0]}`;
      showMascotBubble(welcomeMsg, 5000);
      
      // Per-character entrance animation
      const sw = document.getElementById('mascot-sprite-wrap');
      const glowCol = activeMascot.glowColor || '200,168,75';
      sw.style.animation = 'none';
      sw.style.opacity = '0';
      sw.style.transform = 'scale(0) rotate(-180deg)';
      // Power-up flash on the whole companion
      companion.style.filter = `drop-shadow(0 0 40px rgba(${glowCol},0.9))`;
      setTimeout(()=>{
        sw.style.transition = 'transform 0.7s cubic-bezier(0.34,1.56,0.64,1), opacity 0.4s ease';
        sw.style.transform = 'scale(1.3) rotate(10deg)';
        sw.style.opacity = '1';
        sw.style.filter = `drop-shadow(0 0 30px rgba(${glowCol},0.8)) brightness(1.4)`;
      }, 50);
      setTimeout(()=>{
        sw.style.transform = 'scale(0.92) rotate(-4deg)';
        sw.style.filter = `drop-shadow(0 0 16px rgba(${glowCol},0.6)) brightness(1.1)`;
      }, 500);
      setTimeout(()=>{
        sw.style.transform = 'scale(1) rotate(0deg)';
        sw.style.filter = `drop-shadow(0 0 12px rgba(${glowCol},0.45))`;
        companion.style.filter = '';
      }, 700);
      setTimeout(()=>{
        sw.style.transition = '';
        sw.style.animation = 'float-rotate 4s ease-in-out infinite';
        // Apply per-character glow to sprite
        document.getElementById('mascot-sprite').style.filter = `drop-shadow(0 0 10px rgba(${glowCol},0.35))`;
      }, 900);
      // Tint the companion border to the character colour
      companion.style.setProperty('--char-glow', glowCol);
      
      // Start idle detection
      startIdleDetection();
    }, 600);
  }, 400);
}

function openSenseitrixOnStart() {
  const screen = document.getElementById('senseitrix-screen');
  screen.style.display = 'flex';
  screen.style.animation = '';
  senseitrixOpen = true;
  // Reset hourglass
  const hg = document.getElementById('omni-hourglass');
  if(hg) hg.style.opacity = '1';
  initSpaceCanvas();
  playSenseitrixSfx();
  // Scanning animation before selectors appear
  const selectors = document.getElementById('omni-selectors');
  const info = document.getElementById('omni-info');
  const nav = document.querySelector('#senseitrix-device > div:last-of-type');
  if(selectors) selectors.style.opacity = '0';
  if(info) info.style.opacity = '0';
  // Animate in after brief delay
  setTimeout(()=>{
    buildSenseitrixSelectors();
    selectMascot(0);
    if(selectors) { selectors.style.transition='opacity 0.5s'; selectors.style.opacity='1'; }
    setTimeout(()=>{ if(info) { info.style.transition='opacity 0.6s'; info.style.opacity='1'; } }, 200);

    // Wire up buttons (safe to call multiple times — cloneNode removes old listeners)
    const confirmBtn = document.getElementById('omni-confirm');
    if (confirmBtn) {
      const newConfirm = confirmBtn.cloneNode(true);
      confirmBtn.parentNode.replaceChild(newConfirm, confirmBtn);
      newConfirm.addEventListener('click', () => {
        activateMascot(currentMascotIndex);
      });
    }

    const prevBtn = document.getElementById('omni-prev');
    if (prevBtn) {
      const newPrev = prevBtn.cloneNode(true);
      prevBtn.parentNode.replaceChild(newPrev, prevBtn);
      newPrev.addEventListener('click', () => {
        currentMascotIndex = (currentMascotIndex - 1 + MASCOTS.length) % MASCOTS.length;
        selectMascot(currentMascotIndex);
        playDialSfx();
      });
    }

    const nextBtn = document.getElementById('omni-next');
    if (nextBtn) {
      const newNext = nextBtn.cloneNode(true);
      nextBtn.parentNode.replaceChild(newNext, nextBtn);
      newNext.addEventListener('click', () => {
        currentMascotIndex = (currentMascotIndex + 1) % MASCOTS.length;
        selectMascot(currentMascotIndex);
        playDialSfx();
      });
    }

    // Note: faceplate click not wired separately — use LOCK ON button or dial segments
  }, 600);
}

function openSenseitrix() {
  const screen = document.getElementById('senseitrix-screen');
  screen.style.display = 'flex';
  screen.style.animation = '';
  senseitrixOpen = true;
  initSpaceCanvas();
  playSenseitrixSfx();
  const idx = activeMascot ? MASCOTS.indexOf(activeMascot) : 0;
  buildSenseitrixSelectors();
  selectMascot(idx >= 0 ? idx : 0);

  // Re-wire confirm button
  const confirmBtn = document.getElementById('omni-confirm');
  if (confirmBtn) {
    const nc = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(nc, confirmBtn);
    nc.addEventListener('click', () => activateMascot(currentMascotIndex));
  }
  const prevBtn = document.getElementById('omni-prev');
  if (prevBtn) {
    const np = prevBtn.cloneNode(true);
    prevBtn.parentNode.replaceChild(np, prevBtn);
    np.addEventListener('click', () => { currentMascotIndex=(currentMascotIndex-1+MASCOTS.length)%MASCOTS.length; selectMascot(currentMascotIndex); playDialSfx(); });
  }
  const nextBtn = document.getElementById('omni-next');
  if (nextBtn) {
    const nn = nextBtn.cloneNode(true);
    nextBtn.parentNode.replaceChild(nn, nextBtn);
    nn.addEventListener('click', () => { currentMascotIndex=(currentMascotIndex+1)%MASCOTS.length; selectMascot(currentMascotIndex); playDialSfx(); });
  }
  // faceplate click not separately wired
}

// ==================== MASCOT QUOTES ====================
function showMascotBubble(text, duration=3000) {
  const bubble = document.getElementById('mascot-bubble');
  const bubbleText = document.getElementById('bubble-text');
  clearTimeout(bubbleTimeout);
  bubbleText.textContent = text;
  // Tint bubble to mascot color
  if(activeMascot) {
    bubble.style.borderColor = activeMascot.color.replace('0.9','0.5');
    bubble.style.boxShadow = `0 0 20px ${activeMascot.color.replace('0.9','0.15')}, 0 4px 16px rgba(0,0,0,0.6)`;
  }
  bubble.style.opacity = '1';
  bubbleTimeout = setTimeout(()=>{ bubble.style.opacity='0'; }, duration);
}

// Expression crop map for sprite sheets
// Format: [col, row] in 0-indexed grid (from left-top)
const EXPRESSION_MAP = {
  idle:      [0, 0],  // top-left = default/normal face
  scroll:    [0, 1],  // surprised/curious 
  click:     [0, 0],  // happy
  hover:     [2, 1],  // curious/inquisitive
  nav:       [0, 0],  // happy/cheerful
  idle_long: [1, 1],  // sleepy/bored (zz)
};

// Mascot expression grid sizes
const GRID_COLS = {
  'blonde-girl': 3, 'grey-girl': 4, 'red-boy': 3,
  'whitehair-expressive': 3, 'whitehair-calm': 3, 'purple-boy': 3
};

function setMascotExpression(action) {
  if (!activeMascot) return;
  const spriteWrap = document.getElementById('mascot-sprite-wrap');
  const sprite = document.getElementById('mascot-sprite');

  // Pose configs: transform the portrait to simulate different stances
  const POSES = {
    idle:      { scale:1,    rotate:0,  ty:0,   brightness:1,    posY:'top center',    glow:'0 0 12px rgba(200,168,75,0.35)' },
    scroll:    { scale:1.08, rotate:-2, ty:-6,  brightness:1.12, posY:'top center',    glow:'0 0 22px rgba(200,168,75,0.55)' },
    click:     { scale:1.18, rotate:6,  ty:-12, brightness:1.25, posY:'top center',    glow:'0 0 32px rgba(200,168,75,0.75)' },
    hover:     { scale:1.06, rotate:-4, ty:0,   brightness:1.08, posY:'10% center',    glow:'0 0 18px rgba(200,168,75,0.45)' },
    nav:       { scale:1.12, rotate:4,  ty:-8,  brightness:1.18, posY:'top center',    glow:'0 0 26px rgba(200,168,75,0.65)' },
    idle_long: { scale:0.94, rotate:-1, ty:6,   brightness:0.82, posY:'20% center',    glow:'0 0 8px rgba(200,168,75,0.2)'  },
    action:    { scale:1.22, rotate:-8, ty:-16, brightness:1.35, posY:'top center',    glow:'0 0 40px rgba(200,168,75,0.9)' },
  };
  const EFFECTS = { idle:null, scroll:'✨', click:'💥', hover:'👀', nav:'⚡', idle_long:'💤', action:'🔥' };

  const p = POSES[action] || POSES.idle;

  // Animate out → in
  spriteWrap.style.transition = 'all 0.15s ease';
  spriteWrap.style.transform = 'scale(0.85) translateY(10px)';
  spriteWrap.style.opacity = '0.6';

  setTimeout(() => {
    if (sprite) {
      sprite.style.transition = 'object-position 0.4s ease, filter 0.3s';
      sprite.style.objectPosition = p.posY;
    }
    spriteWrap.style.transition = 'all 0.35s cubic-bezier(0.34,1.56,0.64,1)';
    spriteWrap.style.transform = `scale(${p.scale}) rotate(${p.rotate}deg) translateY(${p.ty}px)`;
    spriteWrap.style.filter = `drop-shadow(${p.glow}) brightness(${p.brightness})`;
    spriteWrap.style.opacity = '1';

    // Re-apply float animation variant
    spriteWrap.style.animation = 'none';
    void spriteWrap.offsetWidth; // reflow
    if (action === 'idle_long') {
      spriteWrap.style.animation = 'mascot-float 4s ease-in-out infinite';
    } else if (action === 'click' || action === 'action') {
      spriteWrap.style.animation = 'mascot-bounce 0.5s ease-in-out infinite';
    } else {
      spriteWrap.style.animation = 'mascot-float 2.8s ease-in-out infinite';
    }

    // Floating emoji effect
    const eff = EFFECTS[action];
    if (eff) {
      const el = document.createElement('div');
      el.style.cssText = 'position:absolute;top:-22px;right:-8px;font-size:16px;animation:pose-pop 1s ease forwards;pointer-events:none;z-index:20;';
      el.textContent = eff;
      spriteWrap.appendChild(el);
      setTimeout(() => el.remove(), 1000);
    }
  }, 150);
}

function mascotReact(action) {
  if (!activeMascot) return;
  const quotes = activeMascot.quotes[action] || activeMascot.quotes.idle;
  const quote = quotes[Math.floor(Math.random()*quotes.length)];
  showMascotBubble(quote, 3000);
  lastAction = action;
  setMascotExpression(action);
  
  // Visual reaction on sprite
  const sprite = document.getElementById('mascot-sprite');
  const filterMap = {
    click: 'drop-shadow(0 0 20px rgba(200,168,75,1)) brightness(1.2)',
    scroll: 'drop-shadow(0 0 12px rgba(100,200,255,0.7))',
    nav: 'drop-shadow(0 0 15px rgba(0,255,157,0.7))',
    hover: 'drop-shadow(0 0 10px rgba(200,168,75,0.5))',
    idle_long: 'drop-shadow(0 0 8px rgba(200,168,75,0.2)) brightness(0.9)',
  };
  const glowCol = activeMascot ? (activeMascot.glowColor || '200,168,75') : '200,168,75';
  sprite.style.filter = filterMap[action] || `drop-shadow(0 0 10px rgba(${glowCol},0.35))`;
  setTimeout(()=>{ sprite.style.filter=`drop-shadow(0 0 10px rgba(${glowCol},0.35))`; }, 700);

  // Extra animation override per action type
  const sw = document.getElementById('mascot-sprite-wrap');
  if (action === 'click') {
    sw.style.animation = 'mascot-excited 0.9s cubic-bezier(0.34,1.56,0.64,1)';
    setTimeout(()=>{ sw.style.animation='float-rotate 4s ease-in-out infinite'; }, 950);
  } else if (action === 'nav') {
    sw.style.animation = 'mascot-spin-in 0.7s cubic-bezier(0.34,1.56,0.64,1)';
    setTimeout(()=>{ sw.style.animation='float-rotate 4s ease-in-out infinite'; }, 750);
  } else if (action === 'idle_long') {
    sw.style.animation = 'mascot-sway 3s ease-in-out infinite';
  } else if (action === 'scroll') {
    sw.style.animation = 'mascot-breathe 1s ease-in-out 3';
    setTimeout(()=>{ sw.style.animation='float-rotate 4s ease-in-out infinite'; }, 3200);
  }
}

// ==================== INTERACTION LISTENERS ====================
let scrollThrottle = false;
window.addEventListener('scroll', ()=>{
  if (!activeMascot || scrollThrottle) return;
  scrollThrottle = true;
  playScrollSfx2();
  mascotReact('scroll');
  // Mascot bob animation on scroll
  const sw = document.getElementById('mascot-sprite-wrap');
  if(sw) {
    sw.style.animation = 'none';
    sw.style.transform = 'translateY(-5px) scale(1.05)';
    setTimeout(()=>{
      sw.style.transform = '';
      sw.style.animation = 'mascot-float 3s ease-in-out infinite';
    }, 300);
  }
  setTimeout(()=>scrollThrottle=false, 2000);
});

let clickThrottle = false;
document.addEventListener('click', (e)=>{
  if (!activeMascot) return;
  if (e.target.closest('#mascot-companion') || e.target.closest('#senseitrix-screen') || e.target.closest('#music-player')) return;
  if (clickThrottle) return;
  clickThrottle = true;
  mascotReact('click');
  setTimeout(()=>clickThrottle=false, 1500);
});

let hoverThrottle = false;
document.querySelectorAll && document.addEventListener('mouseover', (e)=>{
  if (!activeMascot || hoverThrottle) return;
  const el = e.target;
  if (el.matches('a,button,.team-card,.vertical-card,.omni-node,.stat-box,.iconic-card,.t-card')) {
    hoverThrottle = true;
    if(Math.random()<0.3) mascotReact('hover');
    setTimeout(()=>hoverThrottle=false, 3000);
  }
});

// Nav link reactions
document.querySelectorAll && setTimeout(()=>{
  document.querySelectorAll('.nav-links a').forEach(a=>{
    a.addEventListener('click', ()=>{ if(activeMascot) { mascotReact('nav'); playNavSfx(); } });
  });
  // Button/CTA click reactions
  document.querySelectorAll('.btn-gold, .btn-ghost').forEach(btn=>{
    btn.addEventListener('click', ()=>{ if(activeMascot) mascotReact('click'); });
  });
  // Section enter reactions via IntersectionObserver
  const sections = document.querySelectorAll('section[id]');
  const sectionObserver = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting && activeMascot) {
        const sectionId = entry.target.id;
        const sectionReactions = {
          'hero': 'idle', 'about': 'scroll', 'verticals': 'hover',
          'omniverse': 'nav', 'team': 'hover', 'japan': 'scroll', 'contact': 'nav'
        };
        const action = sectionReactions[sectionId] || 'scroll';
        setTimeout(()=>{ 
          if(activeMascot) {
            mascotReact(action);
            // Check for a section-specific quote
            const sq = getSectionAwareQuote();
            if(sq) setTimeout(()=>showMascotBubble(sq, 4000), 600);
          }
        }, 400);
      }
    });
  }, { threshold: 0.3 });
  sections.forEach(s=>sectionObserver.observe(s));
}, 1000);

function startIdleDetection() {
  let idleTimer;
  let longIdleTimer;
  
  function resetIdle() {
    clearTimeout(idleTimer);
    clearTimeout(longIdleTimer);
    idleTimer = setTimeout(()=>{
      if(activeMascot) mascotReact('idle');
    }, 6000);
    longIdleTimer = setTimeout(()=>{
      if(activeMascot) mascotReact('idle_long');
    }, 15000);
  }
  
  ['mousemove','keydown','click','scroll'].forEach(ev=>window.addEventListener(ev, resetIdle));
  resetIdle();
}

// Mascot click — react
document.getElementById('mascot-sprite-wrap').addEventListener('mouseenter', ()=>{
  document.getElementById('mascot-shine').style.opacity = '1';
});
document.getElementById('mascot-sprite-wrap').addEventListener('mouseleave', ()=>{
  document.getElementById('mascot-shine').style.opacity = '0';
});
document.getElementById('mascot-sprite-wrap').addEventListener('click', ()=>{
  if(!activeMascot) return;
  playClickSfx();
  const quote = activeMascot.quotes.idle[Math.floor(Math.random()*activeMascot.quotes.idle.length)];
  showMascotBubble(quote, 4000);
  const pokeSw = document.getElementById('mascot-sprite-wrap');
  pokeSw.style.animation = 'mascot-excited 0.9s cubic-bezier(0.34,1.56,0.64,1)';
  const glowP = activeMascot ? (activeMascot.glowColor||'200,168,75') : '200,168,75';
  pokeSw.style.filter = `drop-shadow(0 0 28px rgba(${glowP},0.9)) brightness(1.35)`;
  playTone(880, 'sine', 0.1, 0.12);
  setTimeout(()=>playTone(1100, 'sine', 0.08, 0.1), 100);
  setTimeout(()=>{
    pokeSw.style.filter = `drop-shadow(0 0 10px rgba(${glowP},0.4))`;
    pokeSw.style.animation = 'float-rotate 4s ease-in-out infinite';
  }, 950);
});

// ==================== MUSIC ====================
function toggleMusic() {
  const audio = document.getElementById('bg-music');
  audio.volume = 0.5;  // Ensure reasonable volume
  const btn = document.getElementById('music-toggle');
  const bars = document.querySelectorAll('.mbar');
  if(musicPlaying) {
    audio.pause();
    musicPlaying = false;
    btn.textContent = '▶';
    bars.forEach(b=>b.style.animationPlayState='paused');
  } else {
    audio.play().then(()=>{
      musicPlaying = true;
      btn.textContent = '⏸';
      bars.forEach(b=>b.style.animationPlayState='running');
    }).catch(()=>{});
  }
}

// ==================== INIT ====================
// Init space bg immediately
initSpaceCanvas();

// Auto-start music on first interaction
let musicAutoStarted = false;
function tryAutoStartMusic() {
  if(!musicAutoStarted) {
    musicAutoStarted = true;
    const audio = document.getElementById('bg-music');
    if(audio) {
      audio.volume = 0.4;
      audio.play().then(()=>{
        musicPlaying = true;
        const btn = document.getElementById('music-toggle');
        if(btn) btn.textContent = '⏸';
        document.querySelectorAll('.mbar').forEach(b=>b.style.animationPlayState='running');
      }).catch(()=>{});
    }
  }
}

// Selectors built when SenseiTrix opens

// Keyboard shortcut: press O to open SenseiTrix
window.addEventListener('keydown', e=>{
  if(e.key.toLowerCase()==='o' && !senseitrixOpen && activeMascot) openSenseitrix();
  // Arrow key navigation in SenseiTrix
  if(senseitrixOpen) {
    if(e.key === 'ArrowLeft') {
      currentMascotIndex = (currentMascotIndex - 1 + MASCOTS.length) % MASCOTS.length;
      selectMascot(currentMascotIndex); playDialSfx();
    }
    if(e.key === 'ArrowRight') {
      currentMascotIndex = (currentMascotIndex + 1) % MASCOTS.length;
      selectMascot(currentMascotIndex); playDialSfx();
    }
    if(e.key === 'Enter' && senseitrixOpen) {
      activateMascot(currentMascotIndex);
    }
  }
});

console.log('🎓 MAD SENSEI COMPANION SYSTEM LOADED');

// ===== FAQ ACCORDION =====
function toggleFaq(qEl) {
  const item = qEl.parentElement;
  const wasOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
  if (!wasOpen) item.classList.add('open');
}

// ===== PIPELINE PROGRESS BARS =====
const pipeObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const bar = entry.target.querySelector('.ps-bar-fill');
      const w = getComputedStyle(entry.target).getPropertyValue('--bar-w').trim() || '80%';
      if (bar) setTimeout(() => { bar.style.width = w; }, 200);
      pipeObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.25 });
document.querySelectorAll('.pipeline-step').forEach(el => pipeObs.observe(el));


// ===== JAPAN LIGHTBOX =====
function openLightbox(el) {
  const img = el.querySelector('img');
  const caption = el.getAttribute('data-caption') || '';
  document.getElementById('lightbox-img').src = img.src;
  document.getElementById('lightbox-caption').textContent = caption;
  document.getElementById('japan-lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  document.getElementById('japan-lightbox').classList.remove('open');
  document.body.style.overflow = '';
}
document.getElementById('japan-lightbox').addEventListener('click', function(e) {
  if(e.target === this) closeLightbox();
});
document.addEventListener('keydown', function(e) {
  if(e.key === 'Escape') closeLightbox();
});

// ===== ENHANCED SCROLL REVEAL (also handles reveal-scale) =====
const revealObserver2 = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
    }
  });
},{threshold:0.08});
document.querySelectorAll('.reveal-scale').forEach(el=>revealObserver2.observe(el));

// ===== JAPAN PHOTO GRID — staggered entrance =====
const photoItems = document.querySelectorAll('.japan-photo-item');
const photoObserver = new IntersectionObserver((entries)=>{
  entries.forEach((entry, idx)=>{
    if(entry.isIntersecting){
      const i = Array.from(photoItems).indexOf(entry.target);
      setTimeout(()=>{
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0) scale(1)';
      }, i * 80);
      photoObserver.unobserve(entry.target);
    }
  });
},{threshold:0.05});
photoItems.forEach(item=>{
  item.style.opacity = '0';
  item.style.transform = 'translateY(30px) scale(0.97)';
  item.style.transition = 'opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1), border-color 0.4s';
  photoObserver.observe(item);
});

// ===== STUDIO GALLERY — staggered entrance =====
const galleryItems = document.querySelectorAll('.studio-gallery-item');
const galleryObserver = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      const i = Array.from(galleryItems).indexOf(entry.target);
      setTimeout(()=>{
        entry.target.style.opacity='1';
        entry.target.style.transform='translateY(0) scale(1)';
      }, i*120);
      galleryObserver.unobserve(entry.target);
    }
  });
},{threshold:0.1});
galleryItems.forEach(item=>{
  item.style.opacity='0';
  item.style.transform='translateY(40px) scale(0.95)';
  item.style.transition='opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)';
  galleryObserver.observe(item);
});


// ===== BUTTON RIPPLE EFFECT =====
document.addEventListener('click', e=>{
  const btn = e.target.closest('.btn-gold, .btn-ghost');
  if(!btn) return;
  const r = document.createElement('div');
  r.className = 'ripple-effect';
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  r.style.width = r.style.height = size + 'px';
  r.style.left = (e.clientX - rect.left - size/2) + 'px';
  r.style.top = (e.clientY - rect.top - size/2) + 'px';
  btn.appendChild(r);
  r.addEventListener('animationend', ()=>r.remove());
});


/* ============================================================
   MAD SENSEI — JAPANESE PROFESSIONAL ANIMATIONS
   All effects are VISIBLE and TESTED.
   Original cursor is KEPT and WORKING.
   ============================================================ */

(function MadSenseiJP() {
  'use strict';

  const KANJIS = ['狂','賢','師','魂','炎','龍','神','道','力','夢','創','造','映','剣','光'];

  /* ── 1. SCROLL PROGRESS BAR ── */
  const bar = document.createElement('div');
  bar.id = 'ms-progress';
  document.body.appendChild(bar);
  window.addEventListener('scroll', () => {
    const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    bar.style.width = Math.min(pct, 100) + '%';
  }, { passive: true });

  /* ── 2. TORII GATE — PAGE OPEN ── */
  const torii = document.createElement('div');
  torii.id = 'ms-torii';
  torii.innerHTML = `
    <svg width="520" height="340" viewBox="0 0 520 340" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Shadow base -->
      <ellipse cx="260" cy="330" rx="180" ry="6" fill="rgba(200,168,75,0.06)"/>
      <!-- Left pillar -->
      <rect x="88" y="90" width="22" height="240" rx="2" fill="#c8161c"/>
      <!-- Right pillar -->
      <rect x="410" y="90" width="22" height="240" rx="2" fill="#c8161c"/>
      <!-- Kasagi (top curved beam) -->
      <path d="M28 80 Q260 38 492 80 L492 100 Q260 62 28 100 Z" fill="#c8161c"/>
      <!-- Shimagi (under top beam) -->
      <rect x="68" y="100" width="384" height="10" rx="1" fill="#a01218"/>
      <!-- Nuki (middle beam) -->
      <rect x="90" y="155" width="340" height="12" rx="1" fill="#c8161c"/>
      <!-- Korobi (nuki support) -->
      <rect x="90" y="167" width="340" height="5" rx="1" fill="#a01218"/>
      <!-- Gakuzuka (sign plate) -->
      <rect x="200" y="108" width="120" height="44" rx="3" fill="rgba(200,168,75,0.12)" stroke="rgba(200,168,75,0.4)" stroke-width="0.5"/>
      <!-- Studio name on plate -->
      <text x="260" y="138" text-anchor="middle" font-family="Noto Serif JP,serif" font-size="26" font-weight="900" fill="rgba(200,168,75,0.95)">狂賢師</text>
      <!-- Decorative rings -->
      <circle cx="260" cy="190" r="130" stroke="rgba(200,168,75,0.08)" stroke-width="1" stroke-dasharray="3 7"/>
      <circle cx="260" cy="190" r="165" stroke="rgba(200,168,75,0.04)" stroke-width="0.5"/>
    </svg>
    <div class="ms-torii-name">MAD SENSEI STUDIOS</div>
  `;
  document.body.insertBefore(torii, document.body.firstChild);
  setTimeout(() => { if (torii.parentNode) torii.remove(); }, 5000);

  /* ── 3. MOON — AMBIENT ALWAYS VISIBLE ── */
  const moon = document.createElement('div');
  moon.id = 'ms-moon';
  moon.innerHTML = '<div class="ms-moon-k">月</div>';
  document.body.appendChild(moon);

  /* ── 6. KATANA SLASH — FAST MOUSE MOVE ── */
  let px = 0, py = 0, pt = Date.now(), slashCool = false;
  document.addEventListener('mousemove', e => {
    const now = Date.now();
    const dx  = e.clientX - px, dy = e.clientY - py;
    const spd = Math.sqrt(dx*dx + dy*dy) / Math.max(now - pt, 1);
    if (spd > 2.8 && !slashCool) {
      slashCool = true;
      setTimeout(() => slashCool = false, 120);
      const slash = document.createElement('div');
      slash.className = 'ms-slash';
      const ang  = Math.atan2(dy, dx) * 180 / Math.PI;
      const len  = 80 + Math.min(spd * 20, 160);
      slash.style.cssText = `
        left:   ${e.clientX}px;
        top:    ${e.clientY}px;
        width:  ${len}px;
        --ang:  ${ang}deg;
        animation-duration: 0.38s;
      `;
      document.body.appendChild(slash);
      setTimeout(() => slash.remove(), 450);
    }
    px = e.clientX; py = e.clientY; pt = now;
  });

  /* ── 7. CLICK INK RIPPLE + KANJI FLOAT ── */
  const kIdx = { v: 0 };
  document.addEventListener('click', e => {
    // Ink ripple
    const ink = document.createElement('div');
    ink.className = 'ms-ink';
    const sz = Math.min(window.innerWidth, window.innerHeight) * 0.45;
    ink.style.cssText = `left:${e.clientX}px; top:${e.clientY}px; width:${sz}px; height:${sz}px;`;
    document.body.appendChild(ink);
    setTimeout(() => ink.remove(), 900);

    // Kanji float
    const kf = document.createElement('div');
    kf.className = 'ms-kanji-float';
    kf.textContent = KANJIS[kIdx.v++ % KANJIS.length];
    kf.style.cssText = `left:${e.clientX}px; top:${e.clientY}px; font-size:${28 + Math.random()*20}px;`;
    document.body.appendChild(kf);
    setTimeout(() => kf.remove(), 1500);
  });

  /* ── 8. SCROLL REVEAL ── */
  const revealEls = document.querySelectorAll(
    '.vertical-card,.team-card,.stat-box,.t-card,.mie-info-box,.vision-point,.pipeline-step,.tier-card,.japan-collab-item'
  );
  revealEls.forEach((el, i) => {
    el.classList.add('ms-reveal');
    if (i % 3 === 1) el.classList.add('d1');
    if (i % 3 === 2) el.classList.add('d2');
  });
  const rObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('ms-visible'); rObs.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  revealEls.forEach(el => rObs.observe(el));

  /* ── 9. GOLD DIVIDERS BETWEEN SECTIONS ── */
  document.querySelectorAll('section').forEach(sec => {
    const d = document.createElement('div');
    d.className = 'ms-divider';
    sec.parentNode.insertBefore(d, sec);
  });

  /* ── 10. AMBIENT GOLD DUST ── */
  for (let i = 0; i < 22; i++) {
    const d   = document.createElement('div');
    const sz  = 1 + Math.random() * 2.5;
    const dur = 20 + Math.random() * 25;
    d.className = 'ms-dust';
    d.style.cssText = `
      left:   ${Math.random() * 100}vw;
      bottom: ${Math.random() * 40}vh;
      width:  ${sz}px; height: ${sz}px;
      --do:   ${0.1 + Math.random() * 0.25};
      --dx:   ${(Math.random() - 0.5) * 100}px;
      animation-duration: ${dur}s;
      animation-delay:    ${-Math.random() * dur}s;
    `;
    document.body.appendChild(d);
  }

  /* ── 11. MAGNETIC BUTTONS ── */
  document.querySelectorAll('.cta-btn,.nav-cta,button,.vertical-card,.team-card').forEach(btn => {
    btn.classList.add('ms-mag');
    btn.addEventListener('mousemove', e => {
      const r  = btn.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width  / 2) * 0.18;
      const dy = (e.clientY - r.top  - r.height / 2) * 0.18;
      btn.style.transform = `translate(${dx}px,${dy}px)`;
    });
    btn.addEventListener('mouseleave', () => btn.style.transform = '');
  });

  /* ── 12. CHAPTER WIPE LINE ── */
  const chap = document.createElement('div');
  chap.id = 'ms-chap';
  document.body.appendChild(chap);
  let lastSY = window.scrollY, lastDir = 0, chapCool = false;
  window.addEventListener('scroll', () => {
    const dir = window.scrollY > lastSY ? 1 : -1;
    if (dir !== lastDir && !chapCool) {
      chapCool = true;
      chap.classList.remove('run');
      void chap.offsetWidth;
      chap.classList.add('run');
      setTimeout(() => { chap.classList.remove('run'); chapCool = false; }, 900);
    }
    lastDir = lastSY = window.scrollY;
  }, { passive: true });

  console.log('%c狂賢師 MAD SENSEI STUDIOS — JP Animations Active', 'color:#c8a84b;font-size:14px;font-family:serif;font-weight:bold;');

})();


/* ============================================================
   MASCOTS / CHARACTER SHOWCASE — Data + 3D Tilt Logic
   ============================================================ */
const CHAR_SHOWCASE = [
  {
    kanji: '狂',
    name: 'The Architect',
    role: 'Founder Persona · Studio Avatar',
    img: 'images/js_020.jpg'
  },
  {
    kanji: '角',
    name: 'Kakuko',
    role: 'Original Character · IP Concept',
    img: 'images/js_021.jpg'
  },
  {
    kanji: '炎',
    name: 'Kaen Spirit',
    role: 'Brand Mascot · Mad Sensei',
    img: 'images/js_022.jpg'
  },
  {
    kanji: '導',
    name: 'The Reach',
    role: 'Original Character · IP Concept',
    img: 'images/js_023.jpg'
  }
];

function buildMascots() {
  const grid = document.getElementById('mascots-grid');
  if (!grid) return;

  grid.innerHTML = CHAR_SHOWCASE.map((m, i) => `
    <div class="mascot-card reveal" style="transition-delay:${i * 0.08}s">
      <div class="mascot-card-inner">
        <div class="mascot-img-wrap">
          <img src="${m.img}" alt="${m.name}">
        </div>
        <div class="mascot-sheen"></div>
        <div class="mascot-corner tl"></div>
        <div class="mascot-corner tr"></div>
        <div class="mascot-num">0${i + 1}</div>
        <div class="mascot-info">
          <div class="mascot-kanji-tag">${m.kanji}</div>
          <div class="mascot-name">${m.name}</div>
          <div class="mascot-role">${m.role}</div>
        </div>
      </div>
    </div>
  `).join('');

  // 3D tilt on mouse move
  const cards = grid.querySelectorAll('.mascot-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotateY = ((x - cx) / cx) * 10;
      const rotateX = ((cy - y) / cy) * 10;
      card.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg) scale(1.02)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'rotateY(0deg) rotateX(0deg) scale(1)';
    });
  });
}

// Build mascots once DOM is ready (after intro)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', buildMascots);
} else {
  buildMascots();
}

// ===== HERO 3D SPIRIT EMBLEM — mouse-tilt parallax =====
(function heroEmblemTilt() {
  const stage = document.getElementById('hero3d-stage');
  const tilt = document.getElementById('hero3d-tilt');
  if (!stage || !tilt) return;

  let targetX = 0, targetY = 0, curX = 0, curY = 0;

  window.addEventListener('mousemove', (e) => {
    const rect = stage.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / window.innerWidth;
    const dy = (e.clientY - cy) / window.innerHeight;
    targetX = -dy * 34;
    targetY = dx * 34;
  });

  function raf() {
    curX += (targetX - curX) * 0.08;
    curY += (targetY - curY) * 0.08;
    tilt.style.transform = `rotateX(${curX}deg) rotateY(${curY}deg)`;
    requestAnimationFrame(raf);
  }
  raf();
})();
// ===== MOBILE NAV: close menu when a link is tapped =====
(function(){
  const navLinks = document.getElementById('nav-links');
  const navBurger = document.getElementById('nav-burger');
  if(!navLinks || !navBurger) return;
  navLinks.querySelectorAll('a').forEach(a=>{
    a.addEventListener('click', ()=>{
      navLinks.classList.remove('open');
      navBurger.classList.remove('open');
    });
  });
})();
