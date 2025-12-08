const p1=document.getElementById("p1");
const p2=document.getElementById("p2");
const p3=document.getElementById("p3");

const inputs=[v1,v2,v3];
const pv=[p1,p2,p3];

function maj(){
  const bg=bgColor.value;
  const text=textColor.value;

  inputs.forEach((e,i)=>{
    let t=e.value.toUpperCase();
    if(t.length>12){
      alert("Max 12 caractères");
      t=t.substr(0,12);
      e.value=t;
    }

    let size=120-(t.length*6);
    if(size<65) size=65;

    pv[i].style.background=bg;
    pv[i].style.color=text;
    pv[i].style.fontSize=size+"px";
    pv[i].textContent=t;
  });
}

inputs.forEach(e=> e.addEventListener("input",maj));
bgColor.addEventListener("input",maj);
textColor.addEventListener("input",maj);



// --- PWA install
if ("serviceWorker" in navigator) {
   navigator.serviceWorker.register("sw.js");
}

/* --------------------------
   IMPRESSION DIRECTE A4
   -------------------------- */

function imprimer() {

  const printArea = document.getElementById("printArea");
  printArea.innerHTML = ""; // reset

  const apercus = [p1, p2, p3];

  apercus.forEach(p => {
    const clone = p.cloneNode(true);

    // FORCER le centrage pour l'impression
    clone.style.display = "flex";
    clone.style.alignItems = "center";
    clone.style.justifyContent = "center";

    clone.style.margin = "1cm auto";
    clone.style.width = "16cm";
    clone.style.height = "7.8cm";

    printArea.appendChild(clone);
  });

  printArea.style.display = "block";
  window.print();

  setTimeout(() => {
    printArea.style.display = "none";
  }, 500);
}



/* --------------------------
   ÉCOUTEURS
   -------------------------- */
document.getElementById("v1").addEventListener("input", majApercu);
document.getElementById("v2").addEventListener("input", majApercu);
document.getElementById("v3").addEventListener("input", majApercu);

document.getElementById("bgColor").addEventListener("input", () => {
  majApercu({target: v1});
  majApercu({target: v2});
  majApercu({target: v3});
});

document.getElementById("textColor").addEventListener("input", () => {
  majApercu({target: v1});
  majApercu({target: v2});
  majApercu({target: v3});
});

