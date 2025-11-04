// role toggle
const roleA = document.getElementById("roleA");
if (roleA){
  const roles = ["Developer","Designer"];
  let i=0;
  setInterval(()=>{
    i=(i+1)%roles.length;
    roleA.style.opacity=0;
    setTimeout(()=>{ roleA.textContent=roles[i]; roleA.style.opacity=1; },220);
  },2600);
}

// scene system
const scenes = Array.from(document.querySelectorAll(".scene"));
const footer = document.querySelector(".footer");
let current = 0;

// apply per-section background (CSS attr() support fallback)
scenes.forEach(s=>{
  const bg = s.getAttribute("data-bg");
  if (bg) s.style.setProperty("--bg-url", `url('${bg}')`);
  // older browsers fallback:
  if (bg) s.style.backgroundImage = `url('${bg}')`;
});

function showScene(index){
  if (index===current || index<0 || index>=scenes.length) return;
  scenes[current].classList.remove("active");
  scenes[index].classList.add("active");
  current=index;
  if (footer) footer.classList.toggle("show", current===scenes.length-1);
}

// nav + buttons
document.querySelectorAll("[data-index]").forEach(b=>{
  b.addEventListener("click", ()=>showScene(Number(b.dataset.index)));
});

// wheel (one slide per scroll)
let lock=false;
window.addEventListener("wheel",(e)=>{
  if(lock) return; lock=true;
  if(e.deltaY>0) showScene(current+1); else showScene(current-1);
  setTimeout(()=>lock=false,900);
},{passive:true});

// keyboard
window.addEventListener("keydown",(e)=>{
  if(e.key==="ArrowDown"||e.key==="PageDown") showScene(current+1);
  if(e.key==="ArrowUp"||e.key==="PageUp") showScene(current-1);
});
