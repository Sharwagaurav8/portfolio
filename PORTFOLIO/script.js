// Scroll progress bar
window.addEventListener('scroll', () => {
  const bar = document.getElementById('scrollBar');
  const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
  bar.style.width = pct + '%';
});

// Custom cursor
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove', e => {
  mx=e.clientX; my=e.clientY;
  cursor.style.left=mx+'px'; cursor.style.top=my+'px';
});
(function animRing(){
  rx+=(mx-rx)*.12; ry+=(my-ry)*.12;
  ring.style.left=rx+'px'; ring.style.top=ry+'px';
  requestAnimationFrame(animRing);
})();

// Typing animation
const phrases = [
  "Building clean, functional websites.",
  "Learning every single day.",
  "Turning ideas into code.",
  "PHP · Python · HTML · CSS · MySQL"
];
let pi=0, ci=0, deleting=false;
const el = document.getElementById('typingText');
function type(){
  const phrase = phrases[pi];
  if(!deleting){
    el.innerHTML = phrase.slice(0,++ci) + '<span class="typing-cursor">|</span>';
    if(ci===phrase.length){ deleting=true; setTimeout(type,1800); return; }
  } else {
    el.innerHTML = phrase.slice(0,--ci) + '<span class="typing-cursor">|</span>';
    if(ci===0){ deleting=false; pi=(pi+1)%phrases.length; }
  }
  setTimeout(type, deleting ? 40 : 70);
}
setTimeout(type, 1200);

// Scroll reveal
const reveals = document.querySelectorAll('.reveal');
const obs = new IntersectionObserver(entries => {
  entries.forEach((e,i) => {
    if(e.isIntersecting){ setTimeout(()=>e.target.classList.add('visible'), i*80); obs.unobserve(e.target); }
  });
}, {threshold:.12});
reveals.forEach(el=>obs.observe(el));

// Skill bars
const barObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if(e.isIntersecting){
      e.target.querySelectorAll('.skill-bar-fill').forEach(b=>{ b.style.width=b.dataset.width+'%'; });
      barObs.unobserve(e.target);
    }
  });
}, {threshold:.3});
document.querySelectorAll('#skills .skill-category').forEach(el=>barObs.observe(el));

// Particles
(function(){
  const canvas=document.getElementById('bgCanvas');
  const ctx=canvas.getContext('2d');
  let W,H,particles=[];
  const COLORS=['rgba(0,212,255,','rgba(124,58,237,','rgba(0,255,159,'];
  function count(){ const a=window.innerWidth*window.innerHeight; return a<300000?30:a<600000?50:90; }
  function dist(){ return window.innerWidth<480?60:100; }
  function resize(){
    W=canvas.width=window.innerWidth; H=canvas.height=window.innerHeight;
    const t=count();
    while(particles.length<t) particles.push(mkP());
    while(particles.length>t) particles.pop();
  }
  window.addEventListener('resize',resize);
  function rand(a,b){ return Math.random()*(b-a)+a; }
  function mkP(){
    return {x:rand(0,window.innerWidth||800),y:rand(0,window.innerHeight||600),
      r:rand(.5,window.innerWidth<480?1.5:2.2),vx:rand(-.18,.18),vy:rand(-.22,-.06),
      alpha:rand(.15,.55),aDir:rand(.002,.006),
      color:COLORS[Math.floor(Math.random()*COLORS.length)],pulse:rand(0,Math.PI*2)};
  }
  resize();
  for(let i=0;i<count();i++) particles.push(mkP());
  function draw(){
    ctx.clearRect(0,0,W,H);
    const t=performance.now()/1000, cd=dist();
    particles.forEach(p=>{
      const a=Math.max(.05,Math.min(.6,p.alpha+Math.sin(t*.8+p.pulse)*.15));
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle=p.color+a+')'; ctx.fill();
      p.x+=p.vx; p.y+=p.vy; p.alpha+=p.aDir;
      if(p.alpha>.6||p.alpha<.1) p.aDir*=-1;
      if(p.y<-10) p.y=H+10; if(p.x<-10) p.x=W+10; if(p.x>W+10) p.x=-10;
    });
    if(W>360){
      for(let i=0;i<particles.length;i++)
        for(let j=i+1;j<particles.length;j++){
          const dx=particles[i].x-particles[j].x, dy=particles[i].y-particles[j].y;
          const d=Math.sqrt(dx*dx+dy*dy);
          if(d<cd){ ctx.beginPath(); ctx.moveTo(particles[i].x,particles[i].y); ctx.lineTo(particles[j].x,particles[j].y);
            ctx.strokeStyle=`rgba(0,212,255,${.04*(1-d/cd)})`; ctx.lineWidth=.5; ctx.stroke(); }
        }
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

// Load real photo
(function(){
  const img = document.getElementById('profilePhoto');
  // The photo will be embedded separately — placeholder shows until you add your base64
  // To add your photo: replace the src with data:image/jpeg;base64,YOUR_BASE64_HERE
})();

// ── EmailJS ──
emailjs.init('k1wAwihr7VV8RT4Ig');

function sendEmail() {
  const name    = document.getElementById('from_name').value.trim();
  const email   = document.getElementById('from_email').value.trim();
  const message = document.getElementById('message').value.trim();
  const btn     = document.getElementById('sendBtn');
  const msg     = document.getElementById('formMsg');

  if (!name || !email || !message) {
    msg.style.display = 'block';
    msg.style.color   = '#ff6b6b';
    msg.textContent   = '⚠ Please fill in all fields.';
    return;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    msg.style.display = 'block';
    msg.style.color   = '#ff6b6b';
    msg.textContent   = '⚠ Please enter a valid email address.';
    return;
  }

  btn.textContent   = 'Sending...';
  btn.disabled      = true;
  btn.style.opacity = '0.7';
  msg.style.display = 'none';

  emailjs.send('service_iywipf4', 'template_ddttdlm', { from_name: name, from_email: email, message: message })
    .then(() => {
      msg.style.display      = 'block';
      msg.style.color        = '#00ff9f';
      msg.textContent        = '✅ Message sent! I will reply within 24 hours.';
      btn.textContent        = 'Sent ✓';
      btn.style.background   = '#00ff9f';
      document.getElementById('from_name').value  = '';
      document.getElementById('from_email').value = '';
      document.getElementById('message').value    = '';
      setTimeout(() => {
        btn.textContent      = 'Send Message →';
        btn.disabled         = false;
        btn.style.opacity    = '1';
        btn.style.background = 'var(--accent)';
      }, 4000);
    })
    .catch((err) => {
      msg.style.display = 'block';
      msg.style.color   = '#ff6b6b';
      msg.textContent   = '❌ Failed to send. Email me at gauravsharwa8@gmail.com';
      btn.textContent   = 'Send Message →';
      btn.disabled      = false;
      btn.style.opacity = '1';
    });
}

document.addEventListener('DOMContentLoaded', () => {
  const nameEl  = document.getElementById('from_name');
  const emailEl = document.getElementById('from_email');
  const msgEl   = document.getElementById('message');
  if(nameEl)  nameEl.addEventListener('keydown',  e => { if(e.key==='Enter'){ e.preventDefault(); emailEl.focus(); }});
  if(emailEl) emailEl.addEventListener('keydown', e => { if(e.key==='Enter'){ e.preventDefault(); msgEl.focus(); }});
  if(msgEl)   msgEl.addEventListener('keydown',   e => { if(e.key==='Enter' && e.ctrlKey){ sendEmail(); }});
});