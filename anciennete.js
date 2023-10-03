import { calculTotalAbsence,tabAbsence } from "./absences.js"

const affichageAnciennete = document.getElementById("affichageAnciennete")
const dateEmbauche = document.getElementById("dateEmbauche")
const dateRupture = document.getElementById("dateRupture")

dateRupture.addEventListener("change",()=>{
    affichageAnciennete.innerText=''
   if(dateRupture.value !== "" && dateEmbauche.value !== ""){
    console.log(dateRupture.value)
    calculAnciennete()
   }
})

dateEmbauche.addEventListener("change",()=>{
    affichageAnciennete.innerText=''
    if(dateRupture.value !== "" && dateEmbauche.value !== ""){
        console.log(dateRupture.value)
        calculAnciennete()
       }
 })

export function calculAnciennete(){
    const absenceAdeduire = calculTotalAbsence(tabAbsence)
    const ancienneteJ = (((Date.parse(dateRupture.value))-(Date.parse(dateEmbauche.value))) / (8.64 * Math.pow(10, 7)) + 1)-absenceAdeduire
    const ancienneteA = ancienneteJ/365.25
    const ancienneteDecimalM = (ancienneteA-Math.floor(ancienneteA))*12
    if (ancienneteJ>0){
        affichageAnciennete.innerText=`L'ancienneté décomptée est de ${Math.floor(ancienneteA)} ${ancienneteA > 2 ? "ans" : "an"} et ${Math.floor(ancienneteDecimalM)} mois
        ${ancienneteA > 10 ? (`Dont ` + Math.floor(ancienneteA-10) + ` ans et ${Math.floor(ancienneteDecimalM)} mois au delà de 10 ans`) : ""}
        Durée d'absence déduite du calcul : ${absenceAdeduire} jours`
    }else{
        affichageAnciennete.innerText="L'ancienneté calculée est nulle"
    }
    return ancienneteJ

}