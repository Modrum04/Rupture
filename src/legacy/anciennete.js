import { calculTotalAbsence,tabAbsence } from "./absences.js"
import { calculSalaireRef } from "./salaires.js"
import { calculIndemnites } from "./indemnites.js"


const affichageAnciennete = document.getElementById("affichageAnciennete")
const dateEmbauche = document.getElementById("dateEmbauche")
const dateRupture = document.getElementById("dateRupture")

dateRupture.addEventListener("change",()=>{
    affichageAnciennete.innerText=''
   if(dateRupture.value !== "" && dateEmbauche.value !== ""){
    calculAnciennete()
    calculSalaireRef()
    calculIndemnites()
   }
})

dateEmbauche.addEventListener("change",()=>{
    affichageAnciennete.innerText=''
    if(dateRupture.value !== "" && dateEmbauche.value !== ""){
        calculAnciennete()
        calculSalaireRef()
        calculIndemnites()
       }
 })

export function calculAnciennete(){
    const absenceAdeduire = calculTotalAbsence(tabAbsence)
    const ancienneteJ = (((Date.parse(dateRupture.value))-(Date.parse(dateEmbauche.value))) / (8.64 * Math.pow(10, 7)) + 1)-absenceAdeduire
    const ancienneteA = ancienneteJ/365.25
    const ancienneteDecimalM = (ancienneteA-Math.floor(ancienneteA))*12
    if (ancienneteJ>0){
        affichageAnciennete.innerText=`L'ancienneté décomptée est de ${Math.floor(ancienneteA)} ${ancienneteA > 2 ? "ans" : "an"} et ${Math.floor(ancienneteDecimalM)} mois`+
        `${ancienneteA > 10 ? (`\n dont ` + Math.floor(ancienneteA-10) + `${ancienneteA < 12 ? ` an` :` ans`} et ${Math.floor(ancienneteDecimalM)} mois au delà de 10 ans`) : "" }`
        affichageAnciennete.innerText+=`\n ${absenceAdeduire > 0 ? (`Durée d'absence déduite du calcul : `+ absenceAdeduire + ` jours`): "Aucune absence déduite"}`
    }else{
        affichageAnciennete.innerText="L'ancienneté calculée est nulle"
    }
    return ancienneteA
}