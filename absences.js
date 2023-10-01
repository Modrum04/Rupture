import {calculAnciennete} from './anciennete.js'

const debutAbsence = document.getElementById("debutAbsence");
const finAbsence = document.getElementById("finAbsence");
const natureAbsence = document.getElementById("natureAbsence");
export const tabAbsence = [];
let id = 0;
let totalAbsence = 0;

///fonction controle des dates
export function controleDate() {
  if (debutAbsence.value === "" || finAbsence.value === "") {
    alert("Les dates de début et de fin doivent être renseignées");
  } else if (debutAbsence.value > finAbsence.value) {
    alert("La date de début doit être antérieure à la date de fin");
  } else {
    console.log(debutAbsence.value);
    addDate(debutAbsence, finAbsence, tabAbsence);
  }
}

///fonction d'ajout d'absence
function addDate(debutAbsence, finAbsence, tabAbsence) {
  const absence = { id: "", duree: "" };
  const zoneAbsencesEnregistree = document.getElementById("datesEnregistrees");
  const ligne = document.createElement("div");
  const dateDebut = new Date(debutAbsence.value);
  const dateFin = new Date(finAbsence.value);
  const dateResult =
    ((dateFin - dateDebut) / (8.64 * Math.pow(10, 7)) + 1) *
    natureAbsence.value;

  ///vérification que l'id n'existe pas déjà dans tabAbsence pour éviter un blocage lors de la suppression de l'absence de l'affichage du DOM
  if (tabAbsence.find((element) => element.id === id)) {
    console.log(`j'ai déja trouvé l'element ${id}`);
    id = tabAbsence[tabAbsence.length - 1].id + 1;
    console.log(`la valeur a été remplacée par  ${id}`);
  } else {
    console.log("je n'ai rien trouvé");
  }

  absence.id = id;
  absence.duree = dateResult;
  tabAbsence.push(absence);

  zoneAbsencesEnregistree.appendChild(ligne);
  ligne.setAttribute("id", "ligne " + id);
  ligne.innerText = `Du ${debutAbsence.valueAsDate.toLocaleDateString(
    "fr",
  )} au ${finAbsence.valueAsDate.toLocaleDateString(
    "fr",
  )} soit ${dateResult} jours d'absence ${
    natureAbsence.value === "0.5"
      ? "en congé parental (déduite de l'ancienneté à 50%)"
      : "intégralement déduite de l'ancienneté"
  }`;

  const boutonSuppr = document.createElement("button");
  ligne.appendChild(boutonSuppr);
  boutonSuppr.innerText = "Supprimer cette absence";
  boutonSuppr.setAttribute("id", id);

  ////Gestion des suppression d'absence
  document.getElementById(id).addEventListener("click", (event) => {
    event.currentTarget.parentElement.parentElement.removeChild(
      event.currentTarget.parentElement,
    );
    const indexAbsence = tabAbsence.findIndex(
      (elem) =>
        elem.id === parseInt(event.currentTarget.id) &&
        elem.duree === dateResult,
    );
    tabAbsence.splice(indexAbsence, 1);
    calculAnciennete()


  });
  calculAnciennete()

}

///Calcul du total d'absence
export function calculTotalAbsence(tabAbsence) {
  let ligneSaisie = document.getElementById("affichageTotalAbsence");
  if (ligneSaisie === null) {
    ligneSaisie = document.createElement("div");
    ligneSaisie.setAttribute("id", "affichageTotalAbsence");
  } else {
    ligneSaisie = document.getElementById("affichageTotalAbsence");
  }
  const zoneAbsencesEnregistree = document.getElementById("blocAbsence");
  zoneAbsencesEnregistree.appendChild(ligneSaisie);
  totalAbsence = 0;
  for (let i = 0; i < tabAbsence.length; i++) {
    totalAbsence += tabAbsence[i].duree;
  }
  if (totalAbsence > 0) {
    ligneSaisie.innerText = `La somme des absences à déduire de l'ancienneté totalise ${totalAbsence} jours.`;
  } else {
    ligneSaisie.innerHTML = "";
  }
 console.log("total absence calculé :"+totalAbsence)

  return totalAbsence
}





