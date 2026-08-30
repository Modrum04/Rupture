import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { calculerDelais } from "../lib/delais.js";
import { getJoursFeries } from "../lib/joursFeries.js";
import { dureeAbsence, totalAbsences, validerAbsence } from "../lib/absences.js";
import { calculerAnciennete } from "../lib/anciennete.js";
import {
  anneesSelectionnables,
  detailSalaireRef,
  moisDeReference,
  reporterSurMoisVides,
} from "../lib/salaires.js";
import { calculerIndemnite } from "../lib/indemnites.js";

const SimulationContext = createContext(null);

const ETAT_INITIAL = {
  natureDelais: "",
  dateDepart: "",
  dateEmbauche: "",
  dateRupture: "",
  absences: [],
  dernierMois: "",
  dernierAnnee: String(anneesSelectionnables()[1]),
  salaires: {},
  natureRupture: "",
};

// `etatInitial` sert à amorcer une simulation déjà remplie (tests de rendu,
// futur rechargement d'un dossier sauvegardé).
export function SimulationProvider({ children, etatInitial }) {
  const [etat, setEtat] = useState({ ...ETAT_INITIAL, ...etatInitial });
  // Résultat des délais mémorisé avec la saisie qui l'a produit : comparer cette
  // clé à la saisie courante suffit à savoir si le résultat est encore valable,
  // sans avoir à le remettre à zéro depuis un effet.
  const [resultatDelais, setResultatDelais] = useState(null);
  const prochainIdAbsence = useRef(0);

  const modifier = useCallback((champ, valeur) => {
    setEtat((precedent) => ({ ...precedent, [champ]: valeur }));
  }, []);

  const ajouterAbsence = useCallback((dateFrom, dateTo, nature) => {
    const erreur = validerAbsence(dateFrom, dateTo);
    if (erreur !== null) return erreur;
    const absence = {
      id: prochainIdAbsence.current++,
      dateFrom,
      dateTo,
      nature,
      duree: dureeAbsence(dateFrom, dateTo, nature),
    };
    setEtat((precedent) => ({ ...precedent, absences: [...precedent.absences, absence] }));
    return null;
  }, []);

  const supprimerAbsence = useCallback((id) => {
    setEtat((precedent) => ({
      ...precedent,
      absences: precedent.absences.filter((absence) => absence.id !== id),
    }));
  }, []);

  const modifierSalaire = useCallback((cle, valeur) => {
    setEtat((precedent) => ({ ...precedent, salaires: { ...precedent.salaires, [cle]: valeur } }));
  }, []);

  const reporterSalaire = useCallback((cles) => {
    setEtat((precedent) => ({ ...precedent, salaires: reporterSurMoisVides(precedent.salaires, cles) }));
  }, []);

  const reinitialiser = useCallback(() => {
    setEtat(ETAT_INITIAL);
    setResultatDelais(null);
  }, []);

  const cleDelais =
    etat.natureDelais === "" || etat.dateDepart === "" ? "" : `${etat.natureDelais}|${etat.dateDepart}`;

  // Les jours fériés viennent d'une API : le calcul des délais est le seul asynchrone.
  useEffect(() => {
    if (cleDelais === "") return;

    const dateDepart = new Date(etat.dateDepart);
    if (Number.isNaN(dateDepart.getTime())) return;

    let annule = false;
    const publier = (joursFeries, erreur) => {
      if (annule) return;
      setResultatDelais({
        cle: cleDelais,
        delais: calculerDelais(etat.natureDelais, dateDepart, joursFeries),
        erreur,
      });
    };

    getJoursFeries(dateDepart)
      .then((joursFeries) => publier(joursFeries, null))
      .catch(() =>
        // Sans les jours fériés, la simulation reste exploitable : on la produit
        // en ne reportant que les week-ends, et on le signale à l'utilisateur.
        publier(
          [],
          "Les jours fériés n'ont pas pu être récupérés : les reports de délai ne tiennent compte que des samedis et dimanches.",
        ),
      );

    return () => {
      annule = true;
    };
  }, [cleDelais, etat.natureDelais, etat.dateDepart]);

  const delaisAJour = resultatDelais !== null && resultatDelais.cle === cleDelais;
  const delais = delaisAJour ? resultatDelais.delais : null;
  const erreurDelais = delaisAJour ? resultatDelais.erreur : null;
  const delaisEnCours = cleDelais !== "" && !delaisAJour;

  const derive = useMemo(() => {
    const totalAbsence = totalAbsences(etat.absences);
    const anciennete = calculerAnciennete(etat.dateEmbauche, etat.dateRupture, totalAbsence);

    const moisReference =
      etat.dernierMois === "" ? [] : moisDeReference(Number(etat.dernierAnnee), Number(etat.dernierMois));
    const detailSalaire =
      moisReference.length === 0
        ? null
        : detailSalaireRef(moisReference.map((mois) => etat.salaires[mois.cle] ?? ""));
    const salaireRef = detailSalaire === null ? 0 : detailSalaire.retenu;

    return {
      totalAbsence,
      anciennete,
      moisReference,
      detailSalaire,
      salaireRef,
      indemnite: calculerIndemnite(etat.natureRupture, salaireRef, anciennete),
      delais,
    };
  }, [etat, delais]);

  const valeur = useMemo(
    () => ({
      etat,
      derive,
      delaisEnCours,
      erreurDelais,
      modifier,
      ajouterAbsence,
      supprimerAbsence,
      modifierSalaire,
      reporterSalaire,
      reinitialiser,
    }),
    [
      etat, derive, delaisEnCours, erreurDelais, modifier, ajouterAbsence,
      supprimerAbsence, modifierSalaire, reporterSalaire, reinitialiser,
    ],
  );

  return <SimulationContext.Provider value={valeur}>{children}</SimulationContext.Provider>;
}

export function useSimulation() {
  const contexte = useContext(SimulationContext);
  if (contexte === null) throw new Error("useSimulation doit être utilisé dans un SimulationProvider");
  return contexte;
}
