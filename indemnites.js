import { calculSalaireRef } from "./salaires.js"
import {calculAnciennete} from "./anciennete.js"

export function calculIndemnites(){
    const salaireRef = calculSalaireRef()
    const ancienneteA = calculAnciennete()
    const ancienneteDecimalM = Math.floor((ancienneteA-Math.floor(ancienneteA))*12)
    const ancienneteAplusDix = ancienneteA > 10 ? ancienneteA-10 : 0
    let indemniteTotale = 0

    ancienneteA > 10 ?
    indemniteTotale = selectTypeIndemnite(10,ancienneteAplusDix,3)//si anciennete +10 ans
    : indemniteTotale = selectTypeIndemnite(ancienneteA,0,4);//si anciennete -10 max

    displayIndemnite()
    
function selectTypeIndemnite (ancienneteA,ancienneteAplusDix,x){
        const indemniteMoinsDix = Math.round(((salaireRef/4)*Math.floor(ancienneteA))*100)/100
        const indemnitePlusDix = Math.round(((salaireRef/3)*Math.floor(ancienneteAplusDix))*100)/100
        const indemniteMois = Math.round(((salaireRef/x)*ancienneteDecimalM/12)*100)/100
        const indemniteTotale = Math.round((indemniteMoinsDix + indemniteMois + indemnitePlusDix)*100)/100
        console.log("indemnite calculee : "+indemniteTotale)
    return indemniteTotale
    }

function displayIndemnite(){
        const blocIndemnites = document.getElementById("blocIndemnites");
      let affichageIndemnite = document.getElementById(
        "affichageIndemnite",
      );
    console.log(affichageIndemnite)
      if (affichageIndemnite === null) {
        affichageIndemnite = document.createElement("div");
        affichageIndemnite.setAttribute("id", "affichageIndemnite");
      } else {
        affichageIndemnite = document.getElementById(
          "affichageIndemnite",
        );
      }

      affichageIndemnite.innerText =
      indemniteTotale <= 0
        ? ""
        : `L'indemnité légale de licenciement est estimée à ${indemniteTotale} euros.`;
      blocIndemnites.appendChild(affichageIndemnite)
     }
}
 

