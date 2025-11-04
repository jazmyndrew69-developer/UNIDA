// role toggle
const roleB = document.getElementById("roleB");
if (roleB){
  const roles=["Developer","Designer"]; let i=0;
  setInterval(()=>{ i=(i+1)%roles.length; roleB.style.opacity=0; setTimeout(()=>{roleB.textContent=roles[i];roleB.style.opacity=1;},220); },2600);
}

// portals
const portals = Array.from(document.querySelectorAll(".portal"));
const footerB = document.querySelector(".footer");
let cur=0;

function showPortal(n){
  if(n===cur||n<0||n>=portals.length) return;
  portals[cur].classList.remove("active");
  portals[n].classList.add("active");
  cur=n;
  if (footerB) footerB.classList.toggle("show", cur===portals.length-1);
}

document.querySelectorAll("[data-index]").forEach(b=>b.addEventListener("click",()=>showPortal(Number(b.dataset.index))));

let lock=false;
window.addEventListener("wheel",(e)=>{ if(lock)return; lock=true; if(e.deltaY>0)showPortal(cur+1); else showPortal(cur-1); setTimeout(()=>lock=false,950) },{passive:true});
window.addEventListener("keydown",(e)=>{ if(e.key==="ArrowDown"||e.key==="PageDown")showPortal(cur+1); if(e.key==="ArrowUp"||e.key==="PageUp")showPortal(cur-1); });
