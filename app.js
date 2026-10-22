
const MAX_LINE = 12;   // caractères par ligne
const MAX_TOTAL = 24;  // 2 lignes

// Découpe en 1 ou 2 lignes (coupe sur un espace si possible)
function splitLines(t) {
  t = t.slice(0, MAX_TOTAL);
  if (t.length <= MAX_LINE) return [t];

  const cut = t.lastIndexOf(" ", MAX_LINE);
  let l1, l2;
  if (cut > 0 && t.length - cut - 1 <= MAX_LINE) {
    l1 = t.slice(0, cut);
    l2 = t.slice(cut + 1);
  } else {
    l1 = t.slice(0, MAX_LINE);
    l2 = t.slice(MAX_LINE).trim();
  }
  return l2 ? [l1, l2] : [l1];
}

// Taille basée sur la ligne la plus longue (même logique qu'avant)
function fontSizeFor(lines) {
  const longest = Math.min(MAX_LINE, Math.max(...lines.map(l => l.length)));
  return Math.max(65, 120 - longest * 6);
}

const p1=document.getElementById("p1");
const p2=document.getElementById("p2");
const p3=document.getElementById("p3");

const inputs=[v1,v2,v3];
const pv=[p1,p2,p3];




function maj(){
  const bg = bgColor.value;
  const text = textColor.value;

  inputs.forEach((e,i)=>{
    let t = e.value.toUpperCase();
    if (t.length > MAX_TOTAL) {
      alert("Max " + MAX_TOTAL + " caractères (2 lignes de " + MAX_LINE + ")");
      t = t.slice(0, MAX_TOTAL);
      e.value = t;
    }

    const lines = splitLines(t);

    pv[i].style.background = bg;
    pv[i].style.color = text;
    pv[i].style.fontSize = fontSizeFor(lines) + "px";
    pv[i].style.whiteSpace = "pre";
    pv[i].style.lineHeight = "1.05";
    pv[i].textContent = lines.join("\n");
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
// Remplace ta fonction Imprimer() par ceci :
function Imprimer() {
  try {
    // Récupérer valeurs et couleurs depuis les inputs / aperçus
    const v1 = (document.getElementById('v1')?.value || '').toString().toUpperCase();
    const v2 = (document.getElementById('v2')?.value || '').toString().toUpperCase();
    const v3 = (document.getElementById('v3')?.value || '').toString().toUpperCase();

    const bg = document.getElementById('bgColor')?.value || '#ffffff';
    const tx = document.getElementById('textColor')?.value || '#000000';

    // Construire les blocs (3 étiquettes)
    const printArea = document.getElementById('printArea');
    printArea.innerHTML = ''; // reset

    const texts = [v1, v2, v3];

    texts.forEach(txt => {
  const lines = splitLines(txt);
  const div = document.createElement('div');
  div.className = 'label';
  div.style.background = bg;
  div.style.color = tx;
  div.style.fontSize = fontSizeFor(lines) + 'px';
  div.style.whiteSpace = 'pre';
  div.style.lineHeight = '1.05';
  div.textContent = lines.join('\n') || ' ';
  printArea.appendChild(div);
});

    // Afficher la zone d'impression (visible sur la page mais CSS @media print la masque sauf pendant impression)
    printArea.style.display = 'block';

    // Small delay to ensure rendering (100-200ms)
    setTimeout(() => {
      window.print();

      // Masquer printArea après impression pour revenir à l'UI normale
      setTimeout(() => {
        printArea.style.display = 'none';
        printArea.innerHTML = '';
      }, 500);
    }, 120);

  } catch (err) {
    console.error('Erreur Imprimer():', err);
    // fallback : ouvrir nouvelle fenêtre (moins fiable pour couleurs)
    fallbackPrintInNewWindow();
  }
}

// fonction simple pour estimer une taille de police adaptée (valeurs en px)
function calculateFontSizeForText(txt) {
  // contraintes demandées : min 65px, max 120px (approx. utilisable ici)
  const minPx = 65;
  const maxPx = 120;
  const len = Math.max(1, Math.min(10, txt.length)); // 1..10
  // plus de caractères => taille plus petite (linéaire)
  const size = Math.round(maxPx - (len - 1) * ((maxPx - minPx) / 9));
  return size + 'px';
}

// fallback : nouvelle fenêtre avec le même contenu (utiliser si erreur)
function fallbackPrintInNewWindow() {
  const v1 = (document.getElementById('v1')?.value || '').toString().toUpperCase();
  const v2 = (document.getElementById('v2')?.value || '').toString().toUpperCase();
  const v3 = (document.getElementById('v3')?.value || '').toString().toUpperCase();
  const bg = document.getElementById('bgColor')?.value || '#ffffff';
  const tx = document.getElementById('textColor')?.value || '#000000';
const labels = [v1, v2, v3].map(txt => {
  const lines = splitLines(txt);
  return `<div class="label" style="background:${bg}; color:${tx}; font-size:${fontSizeFor(lines)}px">${lines.join('\n')}</div>`;
}).join('');
  const html = `
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      @page { size: A4 portrait; margin: 0; }
      html,body { margin:0; padding:0; width:210mm; height:297mm; }
      .label { width:16cm; height:7.8cm; margin:0.5cm auto; display:flex; align-items:center; justify-content:center; font-weight:bold; text-transform:uppercase; overflow:hidden; white-space:pre; line-height:1.05; }
    </style>
  </head>
  <body>
    ${labels} 
    <script>window.onload = ()=>{ window.print(); setTimeout(()=>window.close(),500); };</script>
  </body>
  </html>`;

  const w = window.open('', '_blank');
  w.document.write(html);
  w.document.close();
}

function fermerApp() {
  if (window.matchMedia('(display-mode: standalone)').matches) {
    window.close();
  } else {
    window.location.href = 'about:blank';
  }
}

function checkEffacerButton() {
  const hasText =
    document.getElementById("v1").value ||
    document.getElementById("v2").value ||
    document.getElementById("v3").value;

  document.getElementById("btnEffacer").disabled = !hasText;
}

// surveille les changements
["v1","v2","v3"].forEach(id => {
  document.getElementById(id).addEventListener("input", checkEffacerButton);
});
function checkImprimeButton() {
  const hasText =
    document.getElementById("v1").value ||
    document.getElementById("v2").value ||
    document.getElementById("v3").value;

  document.getElementById("btnImprime").disabled = !hasText;
}

// surveille les changements
["v1","v2","v3"].forEach(id => {
  document.getElementById(id).addEventListener("input", checkImprimeButton);
});

function effacer() {
  Swal.fire({
    title: "Effacer ?",
    text: "Toutes les informations seront supprimées.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#999",
    confirmButtonText: "Oui, effacer"
  }).then((result) => {
    if (!result.isConfirmed) return;

    // vider les champs
    document.getElementById("v1").value = "";
    document.getElementById("v2").value = "";
    document.getElementById("v3").value = "";

    // remettre les couleurs
    document.getElementById("bgColor").value = "#713e5a";
    document.getElementById("textColor").value = "#d4ae77";

    // vider preview
    document.querySelectorAll(".preview").forEach(p => {
      p.innerHTML = "";
      p.style.backgroundColor = "#fff";
      p.style.color = "#000";
    });

    checkEffacerButton();
  });
}
if (window.matchMedia("(min-width: 800px)").matches){
  window.resizeTo(800, window.outerHeight);

  const x = (screen.width - 800) / 2;
  const y = (screen.height - window.outerHeight) / 2;

  window.moveTo(x, y);
}









