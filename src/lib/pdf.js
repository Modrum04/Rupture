import { NATURES_DELAIS, formaterDateLongue } from "./delais.js";
import { natureAbsence } from "./absences.js";
import { NATURES_RUPTURE, indemniteNulle } from "./indemnites.js";
import { resumerAnciennete } from "./anciennete.js";

const MARGE = 8;
const LARGEUR = 430;

function formaterCourt(valeur) {
  return new Date(valeur).toLocaleDateString("fr");
}

// jsPDF pèse lourd : il n'est chargé qu'au moment où l'utilisateur demande un PDF.
export async function genererPdf(etat, derive, nomSalarie) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF("p", "px", "a4");
  doc.setFontSize(9);

  let y = 10;
  const sections = [];

  const titre = (texte, hauteur) => {
    doc.rect(MARGE, y, LARGEUR, hauteur);
    y += 14;
    doc.text(texte, MARGE + LARGEUR / 2, y, { align: "center" });
    y += 12;
  };
  const ligne = (texte) => {
    for (const morceau of doc.splitTextToSize(texte, LARGEUR - 8)) {
      doc.text(morceau, MARGE + 4, y);
      y += 10;
    }
  };

  if (derive.delais !== null) {
    const nature = NATURES_DELAIS.find((item) => item.valeur === etat.natureDelais);
    titre("DÉLAIS DE RUPTURE", 26 + derive.delais.etapes.length * 10);
    if (nature !== undefined) {
      ligne(nature.libelle);
      ligne(`${nature.labelDate} : ${formaterCourt(etat.dateDepart)}`);
    }
    for (const etape of derive.delais.etapes) {
      ligne(`${etape.libelle} : ${formaterDateLongue(etape.date)}`);
    }
    y += 10;
    sections.push("delais");
  }

  if (derive.anciennete !== null) {
    titre("ANCIENNETÉ", 26 + (etat.absences.length + 2) * 10);
    ligne(`Période d'emploi du ${formaterCourt(etat.dateEmbauche)} au ${formaterCourt(etat.dateRupture)}`);
    ligne(
      derive.anciennete.nulle
        ? "L'ancienneté calculée est nulle."
        : `Ancienneté décomptée : ${resumerAnciennete(derive.anciennete)}`,
    );
    for (const absence of etat.absences) {
      ligne(
        `Absence du ${formaterCourt(absence.dateFrom)} au ${formaterCourt(absence.dateTo)} : ` +
          `${absence.duree} jours, ${natureAbsence(absence.nature).mention}`,
      );
    }
    if (derive.totalAbsence > 0) {
      ligne(`Total des absences déduites : ${derive.totalAbsence} jours`);
    }
    y += 10;
    sections.push("anciennete");
  }

  if (derive.detailSalaire !== null) {
    const { nbMois, nbTrois, moyenneTrois, moyenneDouze } = derive.detailSalaire;
    titre("SALAIRE DE RÉFÉRENCE", 46 + (derive.moisReference.length + 1) * 10);
    ligne("Douze derniers mois de salaire brut :");
    for (const mois of derive.moisReference) {
      const montant = etat.salaires[mois.cle];
      // Un mois vide n'est pas un mois à zéro : il doit se lire comme tel sur le document.
      ligne(
        montant === undefined || montant === ""
          ? `${mois.libelle} : mois non travaillé`
          : `${mois.libelle} : ${montant} euros`,
      );
    }
    ligne(`Moyenne des ${nbTrois} derniers mois travaillés : ${moyenneTrois} euros`);
    ligne(`Moyenne des ${nbMois} mois travaillés : ${moyenneDouze} euros`);
    ligne(`Salaire de référence retenu : ${derive.salaireRef} euros`);
    y += 10;
    sections.push("salaire");
  }

  if (derive.indemnite !== null) {
    const nature = NATURES_RUPTURE.find((item) => item.valeur === etat.natureRupture);
    titre("INDEMNITÉ", 46);
    ligne(`Nature de l'indemnité : indemnité légale de ${derive.indemnite.libelle}`);
    ligne(
      indemniteNulle(derive.indemnite)
        ? "L'indemnité est nulle."
        : `L'indemnité légale de ${derive.indemnite.libelle} est estimée à ${derive.indemnite.montant} euros.`,
    );
    if (nature) ligne(nature.libelle);
    y += 10;
    sections.push("indemnite");
  }

  if (sections.length === 0) return false;

  const dateEdition = new Date().toLocaleDateString("fr");
  y += 20;
  ligne(`Nom du salarié : ${nomSalarie}`);
  ligne(`Date d'édition : ${dateEdition}`);

  doc.save(`Rupture_${nomSalarie}_${dateEdition.replaceAll("/", "")}.pdf`);
  return true;
}
