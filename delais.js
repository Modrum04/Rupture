document
  .getElementById("saisieDateSignature")
  .addEventListener("change", () => {
    document.getElementById("wrapperCalendrier").innerHTML = "";
    calculDelais();
  });

export async function calculDelais() {
  const saisieDateSignature = document.getElementById("saisieDateSignature");
  let date = new Date(saisieDateSignature.value);
  const tabFeries = await getApiPublicHollidays();

  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  let calendrier = document.getElementById("calendrier");

  if (saisieDateSignature.value === "") {
    return alert("La date de signature de la convention n'est pas renseignée");
  }

  if (calendrier === null) {
    calendrier = document.createElement("div");
    calendrier.setAttribute("id", "calendrier");
  } else {
    calendrier = document.getElementById("calendrier");
    calendrier.innerHTML = "";
  }

  const wrapperCalendrier = document.getElementById("wrapperCalendrier");
  wrapperCalendrier.appendChild(calendrier);

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
  async function controleFeries() {
    const dayToFind = date.toLocaleDateString("fr");

    if (tabFeries.find((jFerie) => jFerie === dayToFind)) {
      console.log("j'ai trouvé cette date à la fin du délai : " + dayToFind);
      date.setDate(date.getDate() + 1);
    } else {
      ("je n'ai rien trouvé");
    }
  }

  //controle si un jour férié est présent pendant le délai d'homologation (spécificité de cette nature de délai)
  async function jourFerieInDelai(nbDaysAdd) {
    const tabFinal = [];
    for (let i = 0; i < nbDaysAdd; i++) {
      //construit un tableau avec l'ensemble des jours existant dans le délai artyhmétique d'homologation
      const currentDate = new Date(date);
      currentDate.setDate(date.getDate() + i);
      tabFinal.push(currentDate.toLocaleDateString("fr"));
    }

    for (let i = 0; i < tabFinal.length; i++) {
      // boucle pour vérifier s'il existe dans le tableau précédement crée un jour férié qui correspond
      if (tabFeries.find((jFerie) => jFerie === tabFinal[i])) {
        console.log(`le jour férié dans le délai est le ${tabFinal[i]}`);
        addDate(1); //ajoute une journée au délai d'homologation
      } else {
        ("je n'ai rien trouvé");
      }
    }
  }

  async function getApiPublicHollidays() {
    const [reponseYone, reponseYtwo] = await Promise.all([
      fetch(
        `https://calendrier.api.gouv.fr/jours-feries/metropole/${date.getFullYear()}.json`,
      ),
      fetch(
        `https://calendrier.api.gouv.fr/jours-feries/metropole/${
          date.getFullYear() + 1
        }.json`,
      ),
    ]);
    const [ferieApiOne, ferieApiTwo] = await Promise.all([
      reponseYone.json(),
      reponseYtwo.json(),
    ]);
    const mergedFeries = [
      ...Object.keys(ferieApiOne).map((date) =>
        new Date(date).toLocaleDateString("fr"),
      ),
      ...Object.keys(ferieApiTwo).map((date) =>
        new Date(date).toLocaleDateString("fr"),
      ),
    ];

    return mergedFeries;
  }
}
