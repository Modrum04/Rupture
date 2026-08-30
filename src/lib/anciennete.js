import { MS_PAR_JOUR } from "./joursFeries.js";

// Ancienneté bornes incluses, diminuée des absences, convertie en années de 365,25 jours.
export function calculerAnciennete(dateEmbauche, dateRupture, totalAbsence) {
  if (dateEmbauche === "" || dateRupture === "") return null;

  const jours = (Date.parse(dateRupture) - Date.parse(dateEmbauche)) / MS_PAR_JOUR + 1 - totalAbsence;
  const annees = jours / 365.25;
  const moisDecimal = (annees - Math.floor(annees)) * 12;

  return {
    jours,
    annees,
    ans: Math.floor(annees),
    mois: Math.floor(moisDecimal),
    ansAuDelaDeDix: annees > 10 ? Math.floor(annees - 10) : 0,
    totalAbsence,
    nulle: !(jours > 0),
  };
}

export function resumerAnciennete(anciennete) {
  if (anciennete === null) return null;
  if (anciennete.nulle) return "L'ancienneté calculée est nulle.";
  const { annees, ans, mois } = anciennete;
  return `${ans} ${annees > 2 ? "ans" : "an"} et ${mois} mois`;
}
