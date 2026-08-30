export const MOIS = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

// Les douze mois précédant le dernier mois rémunéré connu, du plus récent au plus ancien.
export function moisDeReference(annee, moisIndex) {
  const depart = new Date(annee, moisIndex, 1);
  return Array.from({ length: 12 }, (_, i) => {
    const mois = new Date(depart.getFullYear(), depart.getMonth() - i, 1);
    return {
      cle: `${mois.getFullYear()}-${String(mois.getMonth() + 1).padStart(2, "0")}`,
      libelle: `${MOIS[mois.getMonth()]} ${mois.getFullYear()}`,
    };
  });
}

export function anneesSelectionnables() {
  const anneeCourante = new Date().getFullYear();
  return [anneeCourante + 1, anneeCourante, anneeCourante - 1];
}

const arrondi = (montant) => Math.round(montant * 100) / 100;

// Un mois laissé vide est un mois non travaillé : il sort de la moyenne, et il
// sort aussi du diviseur. Un mois saisi à 0 reste, lui, un mois travaillé non
// rémunéré, donc compté au dénominateur.
function montantsTravailles(valeurs) {
  return valeurs.map((valeur) => parseFloat(valeur)).filter((montant) => !Number.isNaN(montant));
}

// Salaire de référence : le plus favorable entre la moyenne des 3 et celle des
// 12 derniers mois, chacune ramenée au nombre de mois réellement travaillés.
export function detailSalaireRef(valeurs) {
  const montants = montantsTravailles(valeurs);
  if (montants.length === 0) return null;

  const nbTrois = Math.min(3, montants.length);
  const moyenneTrois = montants.slice(0, nbTrois).reduce((total, montant) => total + montant, 0) / nbTrois;
  const moyenneDouze = montants.reduce((total, montant) => total + montant, 0) / montants.length;

  return {
    nbMois: montants.length,
    nbTrois,
    moyenneTrois: arrondi(moyenneTrois),
    moyenneDouze: arrondi(moyenneDouze),
    retenu: arrondi(moyenneDouze < moyenneTrois ? moyenneTrois : moyenneDouze),
    formule: moyenneDouze < moyenneTrois ? "trois" : "douze",
  };
}

export function calculerSalaireRef(valeurs) {
  const detail = detailSalaireRef(valeurs);
  return detail === null ? 0 : detail.retenu;
}

export function nbMoisTravailles(valeurs) {
  return montantsTravailles(valeurs).length;
}

const estVide = (salaires, cle) => (salaires[cle] ?? "") === "";

// Le mois renseigné le plus récent sert de source au report.
export function cleSourceReport(salaires, cles) {
  return cles.find((cle) => !estVide(salaires, cle));
}

export function clesVides(salaires, cles) {
  return cles.filter((cle) => estVide(salaires, cle));
}

// Recopie la valeur source dans les seuls mois vides : une saisie existante,
// y compris un 0 explicite, n'est jamais écrasée.
export function reporterSurMoisVides(salaires, cles) {
  const source = cleSourceReport(salaires, cles);
  if (source === undefined) return salaires;

  const valeur = salaires[source];
  const resultat = { ...salaires };
  for (const cle of clesVides(salaires, cles)) {
    resultat[cle] = valeur;
  }
  return resultat;
}
