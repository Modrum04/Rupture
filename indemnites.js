import { calculSalaireRef } from "./salaires.js";
import { calculAnciennete } from "./anciennete.js";

const selectorNatureRupture = document.getElementById("selectorNatureRupture");
selectorNatureRupture.value = "";

selectorNatureRupture.addEventListener("change", () => calculIndemnites());

export function calculIndemnites() {
  const salaireRef = calculSalaireRef();
  const ancienneteA = calculAnciennete();
  const ancienneteDecimalM = Math.floor(
    (ancienneteA - Math.floor(ancienneteA)) * 12,
  );
  const ancienneteAplusDix = ancienneteA > 10 ? ancienneteA - 10 : 0;
  let indemniteLcmntTotale = 0;
  let indemniteRetraiteTotale = 0;

if (selectorNatureRupture.value === "Licenciement") {
    ancienneteA > 10
      ? (indemniteLcmntTotale = calculIndemniteLcmnt(10, ancienneteAplusDix, 3)) //si anciennete +10 ans
      : (indemniteLcmntTotale = calculIndemniteLcmnt(ancienneteA, 0, 4)); //si anciennete -10 max  ;
    displayIndemnite("licenciement", indemniteLcmntTotale);
  } else if (selectorNatureRupture.value === "departRetraite"){
    calculIndemniteRetraite();
    displayIndemnite(
      "départ volontaire à la retraite",
      indemniteRetraiteTotale,
    );
  }

  function calculIndemniteLcmnt(ancienneteA, ancienneteAplusDix, x) {
    const indemniteMoinsDix =
      Math.round((salaireRef / 4) * Math.floor(ancienneteA) * 100) / 100;
    const indemnitePlusDix =
      Math.round((salaireRef / 3) * Math.floor(ancienneteAplusDix) * 100) / 100;
    const indemniteMois =
      Math.round((((salaireRef / x) * ancienneteDecimalM) / 12) * 100) / 100;
    const indemniteLcmntTotale =
      Math.round((indemniteMoinsDix + indemniteMois + indemnitePlusDix) * 100) /
      100;
    console.log("indemnite de licenciement calculée : " + indemniteLcmntTotale);
    return indemniteLcmntTotale;
  }

  function calculIndemniteRetraite() {
    console.log("module calcul retraite");
    switch (true) {
      case ancienneteA < 10:
        indemniteRetraiteTotale = 0;

        break;
      case ancienneteA >= 10 && ancienneteA < 15:
        indemniteRetraiteTotale = Math.floor((salaireRef / 2)*100)/100;

        break;
      case ancienneteA >= 15 && ancienneteA < 20:
        indemniteRetraiteTotale = Math.floor(salaireRef*100)/100;

        break;
      case ancienneteA >= 20 && ancienneteA < 30:
        indemniteRetraiteTotale = Math.floor((salaireRef * 1.5)*100)/100;

        break;
      case ancienneteA >= 30:
        indemniteRetraiteTotale = salaireRef * 2;

        break;
      default:
    }
  }

  function displayIndemnite(description, indemniteLcmntTotale) {
    const blocIndemnites = document.getElementById("blocIndemnites");
    let affichageIndemnite = document.getElementById("affichageIndemnite");
    if (affichageIndemnite === null) {
      affichageIndemnite = document.createElement("div");
      affichageIndemnite.setAttribute("id", "affichageIndemnite");
    } else {
      affichageIndemnite = document.getElementById("affichageIndemnite");
    }

    affichageIndemnite.innerText =
      indemniteLcmntTotale <= 0 || isNaN(indemniteLcmntTotale)
        ? "L'indemnité est nulle."
        : `L'indemnité légale de ${description} est estimée à ${indemniteLcmntTotale} euros.`;
    blocIndemnites.appendChild(affichageIndemnite);
  }
}
