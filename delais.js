document.getElementById("boutonDelais").addEventListener("click",()=>calculDelais()) ///BLOC DES DELAIS

export function calculDelais() {
  const tabFeries = [
    "01/01",
    "21/04",
    "01/05",
    "08/05",
    "29/05",
    "09/06",
    "14/07",
    "15/08",
    "01/11",
    "11/11",
    "25/12",
  ]; //ce tableau est amené à être remplacé par l'API jours fériés d'Api : https://calendrier.api.gouv.fr/jours-feries/metropole.json
    
  const saisieDateSignature = document.getElementById("saisieDateSignature");

  if (saisieDateSignature.value === "") {
    return alert("La date de signature de la convention n'est pas renseignée");
  }

  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  let calendrier = document.getElementById("calendrier");

  if (calendrier === null) {
    calendrier = document.createElement("div");
    calendrier.setAttribute("id", "calendrier");
  } else {
    calendrier = document.getElementById("calendrier");
    calendrier.innerHTML = "";
  }

  const wrapperCalendrier = document.getElementById("wrapperCalendrier")
  wrapperCalendrier.appendChild(calendrier);



  let date = new Date(saisieDateSignature.value);

  addDate(1);
  addDescription("Début du délai de reflexion :");

  addDate(14);
  controleSamediDimanche();
  controleFeries();
  addDescription("Fin du délai de reflexion :");

  addDate(1);
  addDescription("Envoi de la convention :");

  addDate(1);
  controleSamediDimanche();
  controleFeries();
  addDescription(`Debut du délai d'homologation :`);

  jourFerieInDelai(16);

  addDate(16);

  controleSamediDimanche();
  controleFeries();
  addDescription(`Fin du délai d'homologation :`);

  addDate(1);
  addDescription(`Rupture possible à partir du :`);

  let notice = document.getElementById("notice");

  if (notice === null) {
    notice = document.createElement("div");
    notice.setAttribute("id", "notice");
  } else {
    notice = document.getElementById("notice");
    notice.innerHTML = "";
  }
  wrapperCalendrier.appendChild(notice);

  const texteNotice = `La présente simulation tient compte du fait que lorsque le dernier jour du délai tombe un samedi, un dimanche, ou un jour férié, il est prorogé jusqu'au premier jour ouvrable suivant. 
     Elle tient également compte du fait que le délai d'homologation est établi sur la base de jours ouvrables, excluant les jours fériés, et est susceptible d'être prorogé en conséquence.`;
  notice.innerText = texteNotice;

  ///////////////////////DECLARATION DES FONCTIONS LOCALES/////////////////////////////

  // Mets simplement à jour la date du nombre de jours à ajouter au délai
  function addDate(nbDaysAdd) {
    date = new Date(date.setDate(date.getDate() + nbDaysAdd));
  } 

  //controle si le dernier jour est un samedi ou un dimanche
  function controleSamediDimanche() {
    if (date.getDay() === 0) {
      date.setDate(date.getDate() + 1); // si c'est un dimanche reporte au lundi
    } else {
      if (date.getDay() === 6) {
        date.setDate(date.getDate() + 2); // si c'est un samedi reporte au lundi
      }
    }
  }

  //ajoute à l'affichage du DOM les dates parcourues aux différentes étapes
  function addDescription(description) {
    const elementDescription = document.createElement("p");
    const elementDate = document.createElement("p");
    const elementCaps = document.createElement("div");
    elementDescription.innerText = description;
    elementDate.innerText = date.toLocaleDateString("fr", options);
    calendrier.appendChild(elementCaps);
    elementCaps.appendChild(elementDescription);
    elementCaps.appendChild(elementDate);
  }

  // controle si le dernier jour d'un délai est un jour férié présent dans le tableau des jours fériés
  function controleFeries() {
    const dayMonthYear = date.toLocaleDateString("fr");
    const dayMonth = dayMonthYear.slice(0, 5);
    if (tabFeries.find((jFerie) => jFerie === dayMonth)) {
      date.setDate(date.getDate() + 1);
    }
  }

  //controle si un jour férié est présent pendant le délai d'homologation (spécificité de cette nature de délai)
  function jourFerieInDelai(nbDaysAdd) {
    const tabFinal = [];
    for (let i = 0; i < nbDaysAdd; i++) {
      //construit un tableau avec l'ensemble des jours existant dans le délai artyhmétique d'homologation
      const currentDate = new Date(date);
      currentDate.setDate(date.getDate() + i);
      tabFinal.push(currentDate.toLocaleDateString("fr"));
    }
    console.log(tabFinal);

    for (let i = 0; i < tabFinal.length; i++) {
      // boucle pour vérifier s'il existe dans le tableau précédement crée un jour férié qui correspond
      const dayMonth = tabFinal[i].slice(0, 5);
      if (tabFeries.find((jFerie) => jFerie === dayMonth)) {
        console.log(`le jour férié est le ${dayMonth}`);
        addDate(1); //ajoute une journée au délai d'homologation
      }
    }
  }
}
