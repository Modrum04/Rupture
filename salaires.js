const moisSalaireRef = document.getElementById("moisSalaireRef");
const dernierMois = document.getElementById("dernierMois");
const dernierAnnee = document.getElementById("annee");

const moisDeAnnee = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Aout",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

let now = new Date();
for (let i = 0; i < dernierAnnee.length; i++) {
  dernierAnnee[i].value = now.getFullYear() + 1 - i;
  dernierAnnee[i].innerText = now.getFullYear() + 1 - i;
}
dernierAnnee.value = dernierAnnee[1].value;
dernierMois.value = "";

dernierMois.addEventListener("change", () => displayMoisDeSalaire());
dernierAnnee.addEventListener("change", () => displayMoisDeSalaire());


function displayMoisDeSalaire() {
  now = new Date(dernierAnnee.value, dernierMois.value, 1);
  moisSalaireRef.innerHTML = "";
  for (let i = 0; i < moisDeAnnee.length; i++) {
    const past = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const mois = moisDeAnnee[past.getMonth()];
    const annee = past.getFullYear();

    const el = document.createElement("div");
    el.setAttribute("class", "item-v");

    const labelMoisSalaire = document.createElement("label");
    const moisSalaire = document.createElement("input");

    moisSalaire.setAttribute("id", `${mois}`);
    moisSalaire.setAttribute("type", "number");
    labelMoisSalaire.setAttribute("for", `${mois}`);
    labelMoisSalaire.innerText = `${mois} ${annee}`;
    moisSalaireRef.appendChild(el);
    el.appendChild(labelMoisSalaire);
    el.appendChild(moisSalaire);
    document.getElementById(mois).addEventListener("change", ()=>calculSalaireRef())
  }
}

function calculSalaireRef() {
const blocSalaireReference = document.getElementById("blocSalaireReference")
let affichageSalaireReference = document.getElementById("affichageSalaireReference");

if (affichageSalaireReference === null) {
  affichageSalaireReference = document.createElement("div");
  affichageSalaireReference.setAttribute("id", "affichageSalaireReference");
} else {
  affichageSalaireReference = document.getElementById("affichageSalaireReference");
}
let tabSalaires = Array.from(moisSalaireRef,(x) => isNaN(parseFloat(x.value)) ? x.value=0 : parseFloat(x.value) )
let salaireRef = 0
const moyenneTrois = tabSalaires.reduce((acc,element,i)=> i>2 ? acc :  acc+element)/3
const moyenneDouze = tabSalaires.reduce((acc,element)=> acc+element )/12
moyenneDouze < moyenneTrois ?  salaireRef = moyenneTrois : salaireRef = moyenneDouze


affichageSalaireReference.innerText = salaireRef === 0 ? "" : `Salaire de référence : ${Math.round(salaireRef*100)/100} euros`
blocSalaireReference.appendChild(affichageSalaireReference)
return salaireRef
}