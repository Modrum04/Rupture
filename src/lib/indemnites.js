export const NATURES_RUPTURE = [
  { valeur: "Licenciement", libelle: "Licenciement, rupture conventionnelle, mise à la retraite…" },
  { valeur: "departRetraite", libelle: "Départ volontaire à la retraite" },
];

// 1/4 de mois par année jusqu'à 10 ans, 1/3 au-delà, au prorata pour les mois entamés.
function indemniteLicenciement(salaireRef, annees, moisDecimal) {
  const [anneesBase, anneesAuDela, diviseurMois] = annees > 10 ? [10, annees - 10, 3] : [annees, 0, 4];

  const partJusquaDix = Math.round((salaireRef / 4) * Math.floor(anneesBase) * 100) / 100;
  const partAuDelaDeDix = Math.round((salaireRef / 3) * Math.floor(anneesAuDela) * 100) / 100;
  const partMois = Math.round((((salaireRef / diviseurMois) * moisDecimal) / 12) * 100) / 100;

  return Math.round((partJusquaDix + partMois + partAuDelaDeDix) * 100) / 100;
}

// Barème légal du départ volontaire à la retraite, par tranche d'ancienneté.
function indemniteDepartRetraite(salaireRef, annees) {
  if (annees < 10) return 0;
  if (annees < 15) return Math.floor((salaireRef / 2) * 100) / 100;
  if (annees < 20) return Math.floor(salaireRef * 100) / 100;
  if (annees < 30) return Math.floor(salaireRef * 1.5 * 100) / 100;
  return salaireRef * 2;
}

export function calculerIndemnite(nature, salaireRef, anciennete) {
  if (nature === "" || anciennete === null) return null;

  const annees = anciennete.annees;
  const moisDecimal = Math.floor((annees - Math.floor(annees)) * 12);

  if (nature === "Licenciement") {
    return { libelle: "licenciement", montant: indemniteLicenciement(salaireRef, annees, moisDecimal) };
  }
  return { libelle: "départ volontaire à la retraite", montant: indemniteDepartRetraite(salaireRef, annees) };
}

export function indemniteNulle(indemnite) {
  return indemnite === null || indemnite.montant <= 0 || Number.isNaN(indemnite.montant);
}
