import { MS_PAR_JOUR } from "./joursFeries.js";

export const NATURES_ABSENCE = [
  { valeur: "1", libelle: "Absence maladie, sans solde…", mention: "intégralement déduite de l'ancienneté" },
  { valeur: "0.5", libelle: "Congé parental", mention: "déduite de l'ancienneté à 50 %" },
];

export function natureAbsence(valeur) {
  return NATURES_ABSENCE.find((nature) => nature.valeur === valeur) ?? NATURES_ABSENCE[0];
}

// Durée bornes incluses, pondérée par le coefficient de la nature d'absence.
export function dureeAbsence(dateDebut, dateFin, coefficient) {
  return ((new Date(dateFin) - new Date(dateDebut)) / MS_PAR_JOUR + 1) * parseFloat(coefficient);
}

export function totalAbsences(absences) {
  return absences.reduce((total, absence) => total + absence.duree, 0);
}

export function validerAbsence(dateDebut, dateFin) {
  if (dateDebut === "" || dateFin === "") return "Les dates de début et de fin doivent être renseignées.";
  if (dateDebut > dateFin) return "La date de début doit être antérieure à la date de fin.";
  return null;
}
