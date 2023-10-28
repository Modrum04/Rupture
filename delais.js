const labelDate = document.querySelector('[for="startDate"]');
const selectorNatureDelais = document.getElementById("selectorNatureDelais");
selectorNatureDelais.value = "";
labelDate.innerText = "";
document.getElementById("startDate").style.display = "none";

selectorNatureDelais.addEventListener("change", () => {
  document.getElementById("startDate").style.display = "";
  calculDelais();
  selectorNatureDelais.value === "licenciement"
    ? (labelDate.innerText =
        "Date d'envoi de la convocation à entretien préalable :")
    : (labelDate.innerText = "Date de signature de la convention de rupture :");
});

function calculDelais() {
  document.getElementById("wrapperCalendrier").innerHTML = "";
  const startDate = document.getElementById("startDate");
  startDate.value = "";
  let date = 0;
  let tabFeries = [];

  startDate.addEventListener("change", async () => {
    document.getElementById("wrapperCalendrier").innerHTML = "";
    date = new Date(startDate.value);
    tabFeries =  (await getPublicHollidays(date,0)).concat(await getPublicHollidays(date,1))
    let calendrier = document.getElementById("calendrier");
    if (calendrier === null) {
      calendrier = document.createElement("ul");
      calendrier.setAttribute("id", "calendrier");
    } else {
      calendrier = document.getElementById("calendrier");
      calendrier.innerHTML = "";
    }
    const wrapperCalendrier = document.getElementById("wrapperCalendrier");
    wrapperCalendrier.appendChild(calendrier);

    selectorNatureDelais.value === "licenciement"
      ? calculDelaisLicenciement(date,tabFeries)
      : calculDelaisRuptureCo(date,tabFeries);
  });
}  

///////////////////////DECLARATION DES FONCTIONS LOCALES/////////////////////////////

function calculDelaisLicenciement(date,tabFeries) {
  addDate(date,6);
  controleSamediDimanche(date);
  controleFeries(date,tabFeries);
  addDescription(date,"Date d'entretien préalable :");

  addDate(date,3);
  controleSamediDimanche(date);
  controleFeries(date,tabFeries);
  addDescription(date,"Date d'envoi de la notification :");

  let notice = document.getElementById("notice");

  if (notice === null) {
    notice = document.createElement("div");
    notice.setAttribute("id", "notice");
  } else {
    notice = document.getElementById("notice");
    notice.innerHTML = "";
  }
  wrapperCalendrier.appendChild(notice);

  const texteNotice = `La présente simulation tient compte du fait que lorsque le dernier jour du délai tombe un samedi, un dimanche, ou un jour férié, il est prorogé jusqu'au premier jour ouvrable suivant.`;
  notice.innerText = texteNotice;
}


function calculDelaisRuptureCo(date,tabFeries) {
  addDate(date,1);
  addDescription(date,"Début du délai de reflexion :");

  addDate(date,14);
  controleSamediDimanche(date);
  controleFeries(date,tabFeries);
  addDescription(date,"Fin du délai de reflexion :");

  addDate(date,1);
  addDescription(date,"Envoi de la convention :");

  addDate(date,1);
  controleSamediDimanche(date);
  controleFeries(date,tabFeries);
  addDescription(date,`Debut du délai d'homologation :`);

  jourFerieInDelai(date,tabFeries,16);

  addDate(date,16);

  controleSamediDimanche(date);
  controleFeries(date,tabFeries);
  addDescription(date,`Fin du délai d'homologation :`);

  addDate(date,1);
  addDescription(date,`Rupture possible à partir du :`);

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
}
  //ajoute à l'affichage du DOM les dates parcourues aux différentes étapes
  function addDescription(enteredDate,description) {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };  
    const elementDescription = document.createElement("li");
    elementDescription.innerText =`${description} ${enteredDate.toLocaleDateString("fr", options)}`;
    calendrier.appendChild(elementDescription);
  }

  // controle si le dernier jour d'un délai est un jour férié présent dans le tableau des jours fériés
  async function controleFeries(enteredDate,tabFeries) {
    const dayToFind = enteredDate.toLocaleDateString("fr");

    if (tabFeries.find((jFerie) => jFerie === dayToFind)) {
      console.log("j'ai trouvé cette date à la fin du délai : " + dayToFind);
      enteredDate.setDate(enteredDate.getDate() + 1);
    } else {
      ("je n'ai rien trouvé");
    }
  }


  //controle si le dernier jour est un samedi ou un dimanche
  function controleSamediDimanche(enteredDate) {
    if (enteredDate.getDay() === 0) {
      enteredDate.setDate(enteredDate.getDate() + 1); // si c'est un dimanche reporte au lundi
    } else {
      if (enteredDate.getDay() === 6) {
        enteredDate.setDate(enteredDate.getDate() + 2); // si c'est un samedi reporte au lundi
      }
    }
  }
  // Mets simplement à jour la date du nombre de jours à ajouter au délai
  function addDate(enteredDate,nbDaysAdd) {
    enteredDate = new Date(enteredDate.setDate(enteredDate.getDate() + nbDaysAdd));
  }

  //controle si un jour férié est présent pendant le délai d'homologation (spécificité de cette nature de délai)
  function jourFerieInDelai(enteredDate,tabFeries,nbDaysAdd) {
    const tabFinal = [];
    for (let i = 0; i < nbDaysAdd; i++) {
      //construit un tableau avec l'ensemble des jours existant dans le délai artyhmétique d'homologation
      const currentDate = new Date(enteredDate);
      currentDate.setDate(enteredDate.getDate() + i);
      tabFinal.push(currentDate.toLocaleDateString("fr"));
    }
    for (let i = 0; i < tabFinal.length; i++) {
      // boucle pour vérifier s'il existe dans le tableau précédement crée un jour férié qui correspond
      if (tabFeries.find((jFerie) => jFerie === tabFinal[i])) {
        console.log(`le jour férié dans le délai d'homologation est le ${tabFinal[i]}`);
        addDate(enteredDate,1); //ajoute une journée au délai d'homologation
      } else {
        ("je n'ai rien trouvé");
      }
    }
  }

async function getPublicHollidays(enteredDate,x) {
    const response = await fetch(`https://calendrier.api.gouv.fr/jours-feries/metropole/${enteredDate.getFullYear()+x}.json`) 
    const hollidayList = await response.json();
    return  Object.keys(hollidayList).map((date) => new Date(date).toLocaleDateString("fr"))    
  }