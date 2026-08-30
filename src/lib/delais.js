// Règles de calcul reprises telles quelles de l'implémentation d'origine.
// Les fonctions ci-dessous mutent volontairement la date courante : chaque étape
// part de la date obtenue à l'étape précédente.

function ajouterJours(date, nbJours) {
  date.setDate(date.getDate() + nbJours);
}

// Si le dernier jour du délai tombe un samedi ou un dimanche, il est reporté au lundi.
function reporterWeekend(date) {
  if (date.getDay() === 0) {
    date.setDate(date.getDate() + 1);
  } else if (date.getDay() === 6) {
    date.setDate(date.getDate() + 2);
  }
}

// Si le dernier jour du délai est férié, il est reporté au jour suivant.
function reporterFerie(date, joursFeries) {
  const jour = date.toLocaleDateString("fr");
  if (joursFeries.includes(jour)) {
    date.setDate(date.getDate() + 1);
  }
}

// Le délai d'homologation se décompte en jours ouvrables : chaque jour férié
// compris dans la fenêtre le proroge d'une journée.
function prorogerFeriesDansDelai(date, joursFeries, nbJours) {
  const fenetre = [];
  for (let i = 0; i < nbJours; i++) {
    const jour = new Date(date);
    jour.setDate(date.getDate() + i);
    fenetre.push(jour.toLocaleDateString("fr"));
  }
  for (const jour of fenetre) {
    if (joursFeries.includes(jour)) {
      ajouterJours(date, 1);
    }
  }
}

const NOTICE_COMMUNE =
  "Lorsque le dernier jour du délai tombe un samedi, un dimanche ou un jour férié, il est prorogé jusqu'au premier jour ouvrable suivant.";

const NOTICE_HOMOLOGATION =
  "Le délai d'homologation est établi sur la base de jours ouvrables, excluant les jours fériés, et est prorogé en conséquence.";

function etapesLicenciement(date, joursFeries) {
  const etapes = [];
  const jalon = (libelle) => etapes.push({ libelle, date: new Date(date) });

  ajouterJours(date, 6);
  reporterWeekend(date);
  reporterFerie(date, joursFeries);
  jalon("Date d'entretien préalable");

  ajouterJours(date, 3);
  reporterWeekend(date);
  reporterFerie(date, joursFeries);
  jalon("Date d'envoi de la notification");

  return { etapes, notices: [NOTICE_COMMUNE] };
}

function etapesRuptureConventionnelle(date, joursFeries) {
  const etapes = [];
  const jalon = (libelle) => etapes.push({ libelle, date: new Date(date) });

  ajouterJours(date, 1);
  jalon("Début du délai de réflexion");

  ajouterJours(date, 14);
  reporterWeekend(date);
  reporterFerie(date, joursFeries);
  jalon("Fin du délai de réflexion");

  ajouterJours(date, 1);
  jalon("Envoi de la convention");

  ajouterJours(date, 1);
  reporterWeekend(date);
  reporterFerie(date, joursFeries);
  jalon("Début du délai d'homologation");

  prorogerFeriesDansDelai(date, joursFeries, 16);

  ajouterJours(date, 16);
  reporterWeekend(date);
  reporterFerie(date, joursFeries);
  jalon("Fin du délai d'homologation");

  ajouterJours(date, 1);
  jalon("Rupture possible à partir du");

  return { etapes, notices: [NOTICE_COMMUNE, NOTICE_HOMOLOGATION] };
}

export const NATURES_DELAIS = [
  { valeur: "licenciement", libelle: "Délais de licenciement", labelDate: "Date d'envoi de la convocation à entretien préalable" },
  { valeur: "ruptureCo", libelle: "Délais de rupture conventionnelle", labelDate: "Date de signature de la convention de rupture" },
];

export function calculerDelais(nature, dateDepart, joursFeries) {
  const date = new Date(dateDepart);
  if (Number.isNaN(date.getTime())) return null;
  return nature === "licenciement"
    ? etapesLicenciement(date, joursFeries)
    : etapesRuptureConventionnelle(date, joursFeries);
}

export function formaterDateLongue(date) {
  return date.toLocaleDateString("fr", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}
