const MS_PAR_JOUR = 8.64 * Math.pow(10, 7);

export { MS_PAR_JOUR };

const cache = new Map();

async function joursFeriesDeAnnee(annee) {
  if (cache.has(annee)) return cache.get(annee);
  const promesse = fetch(`https://calendrier.api.gouv.fr/jours-feries/metropole/${annee}.json`)
    .then((reponse) => {
      if (!reponse.ok) throw new Error(`Réponse ${reponse.status} de l'API jours fériés`);
      return reponse.json();
    })
    .then((liste) => Object.keys(liste).map((date) => new Date(date).toLocaleDateString("fr")))
    .catch((erreur) => {
      // Un échec réseau ne doit pas bloquer la simulation : on repart sans jour férié
      // plutôt que de laisser l'utilisateur devant un écran vide.
      cache.delete(annee);
      throw erreur;
    });
  cache.set(annee, promesse);
  return promesse;
}

// L'API ne renvoie qu'une année : les délais pouvant franchir le 31 décembre,
// on charge l'année de départ et la suivante, comme le faisait le code d'origine.
export async function getJoursFeries(dateDepart) {
  const annee = dateDepart.getFullYear();
  const [courante, suivante] = await Promise.all([joursFeriesDeAnnee(annee), joursFeriesDeAnnee(annee + 1)]);
  return courante.concat(suivante);
}
