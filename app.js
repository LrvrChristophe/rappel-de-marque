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

function imprimer(){
  window.print();
}

// --- PWA install
if ("serviceWorker" in navigator) {
   navigator.serviceWorker.register("sw.js");
}
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(resp => {
      return resp || fetch(event.request);
    })
  );
});

