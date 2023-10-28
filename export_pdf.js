
const boutonPdf = document.getElementById("buttonPdf")


boutonPdf.addEventListener("click",()=> {
    const doc = new jspdf.jsPDF('p','px', 'a4')
    let textAdded = false
  let espace = 0
  let textToSet = ""
  const dateEmbauche = document.getElementById("dateEmbauche")
  const dateRupture = document.getElementById("dateRupture")
  const calendrier = document.getElementById("calendrier") 
  const affichageSalaireReference = document.getElementById("affichageSalaireReference")
  const affichageIndemnite = document.getElementById("affichageIndemnite")
  doc.setFontSize(9)

  calendrier ? exportDelaisPdf () : console.log("Pas de calendrier") //Trigger pour exporter les délais
  Date.parse(dateRupture.value)-Date.parse(dateEmbauche.value) > 0 ? exportAnciennetePdf() : console.log("Pas d'ancienneté") //Trigger pour exporter l'ancienneté
  affichageSalaireReference && affichageSalaireReference.innerText !="" ? exportSalairePdf() : console.log("Pas de salaire de reference") //Trigger pour exporter le salaire de référence
  affichageIndemnite ? exportIndemnitePdf () : console.log("Pas d'indemnite") //Trigger pour exporter les délais
  textAdded === true ? saveToPdf() : alert("Aucune saisie effectuée")
  
function exportDelaisPdf (){
doc.rect(8, espace+=10, 430, 110);
doc.text("DELAIS DE RUPTURE", 180,espace+=20)  
let selector = document.getElementById("selectorNatureDelais")

selector.value === "" ?  textToSet="pas de selection de délais de procédure" : textToSet=selector.options[selector.selectedIndex].text
doc.text(textToSet,10,espace+=10)

document.getElementById("startDate").value === "" 
? doc.text("Date de départ non saisie", 10,espace +=20 )  
: doc.text(document.querySelector('[for="startDate"]').innerHTML + new Date(document.getElementById("startDate").value).toLocaleDateString("fr"),10,espace+=20)

calendrier === null 
? doc.text("", 10,espace +=20)
: doc.text(calendrier.innerText,10,espace+=20)
textAdded = true
}
  
function  exportAnciennetePdf(){
    doc.rect(8, espace+=50, 430, 70);
    doc.text("ANCIENNETE", 180,espace+=20)  
    doc.text("Période d'emploi du "+ new Date(document.getElementById("dateEmbauche").value).toLocaleDateString("fr") 
    + " au "+new Date(document.getElementById("dateRupture").value).toLocaleDateString("fr"),10,espace+=10)
    doc.text(document.getElementById("affichageAnciennete").innerText,10,espace+=10)
    textAdded = true
}

function exportSalairePdf(){
  doc.rect(8, espace+=50, 430, 110);
  doc.text("SALAIRE DE REFERENCE", 180,espace+=20)
  doc.text("Douze derniers mois de salaire brut :",10,espace+=20)
  addMonthSalaries(0,4)
  doc.text(textToSet,10,espace += 10)
  addMonthSalaries(4,8)
  doc.text(textToSet,120,espace )
  addMonthSalaries(8,12)
  doc.text(textToSet,230,espace )
  doc.text(affichageSalaireReference.innerText,10,espace+=40)
  textAdded = true

    function addMonthSalaries(x,y){
      let formElements = document.getElementById('moisSalaireRef').elements;
      textToSet = ""
      for (let i = x; i < y; i++) {
        let element = formElements[i];
        let label = document.querySelector('label[for="' + element.id + '"]');
        let labelText = label ? label.textContent : '';
        textToSet += labelText + " : " + element.value+" euros \n"
    }
    }
}

function exportIndemnitePdf(){
  doc.rect(8, espace+=50, 430, 50);
  doc.text("INDEMNITE", 180,espace+=20)  
  let selector = document.getElementById("selectorNatureRupture")
    textToSet = selector.value === "Licenciement" 
    ? "Nature de l'indemnité : Indemnité légale de licenciement" 
    : "Nature de l'indemnité : Indemnité de départ volontaire à la retraite"
  
doc.text(textToSet,10,espace+=10)
doc.text(affichageIndemnite.innerText,10,espace+=10)
textAdded = true

}

function saveToPdf(){
  let nom = prompt("Nom du salarié")
  let date = new Date().toLocaleDateString("fr")
  doc.text("Nom du salarié : " + nom,10,espace+=50)
  doc.text("Date d'édition : "+date,10,espace+=20)
  doc.save("Rupture_"+nom+"_"+date.replaceAll("/","")+".pdf")
}

})
