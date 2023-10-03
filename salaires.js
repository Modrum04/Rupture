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
  }
}
function calculSalaireRef() {
    
}