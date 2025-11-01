// helpers
const $ = (q, c=document)=>c.querySelector(q);
const $$ = (q, c=document)=>Array.from(c.querySelectorAll(q));

// parallax bg
const bg = $('.bg-parallax');
window.addEventListener('scroll', () => {
  const speed = parseFloat(bg?.dataset.speed || '0.2');
  const y = window.scrollY * speed;
  if (bg) bg.style.transform = `translateY(${y}px)`;
});

// start flash
const start = $('#start-journey');
const flash = $('.red-flash');
if (start && flash){
  start.addEventListener('click', () => {
    flash.style.transition = 'opacity .25s ease';
    flash.style.opacity = 1;
    setTimeout(()=> flash.style.opacity = 0, 220);
    // Optionally: play audio if you add assets/engine-rev.mp3
    // const rev = new Audio('assets/engine-rev.mp3'); rev.play().catch(()=>{});
    document.getElementById('origin')?.scrollIntoView({behavior:'smooth'});
  });
}

// intersection reveal
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if (e.isIntersecting) e.target.classList.add('show');
  });
},{threshold:.18});
$$('.reveal').forEach(el=> io.observe(el));

// gauges (speed + rpm) tied to Lap 2 visibility
const speedArc = $('#speed-arc');
const speedVal = $('#speed-val');
const rpmFill = $('#rpm-fill');
const rpmVal = $('#rpm-val');

function clamp(n,a,b){ return Math.max(a, Math.min(b, n)); }

function updateGauges(){
  const perf = $('#craft');
  if (!perf) return;
  const rect = perf.getBoundingClientRect();
  const vh = window.innerHeight;

  // ratio 0..1 for how much Lap 2 is on screen
  const visible = clamp(1 - clamp(rect.top/vh,0,1) + clamp((vh - rect.bottom)/vh,0,1), 0, 1);

  const total = 157; // arc length dasharray
  const offset = total * (1 - visible);
  if (speedArc) speedArc.style.strokeDashoffset = String(offset);

  const speed = Math.round(visible * 240);
  if (speedVal) speedVal.textContent = String(speed);

  const rpm = Math.round(visible * 9000);
  if (rpmFill) rpmFill.style.width = `${visible*100}%`;
  if (rpmVal) rpmVal.textContent = String(rpm);
}
updateGauges();
window.addEventListener('scroll', updateGauges);
window.addEventListener('resize', updateGauges);
