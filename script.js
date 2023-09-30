import { renvoiDate  } from "./delais.js"
import { controleDate } from "./absences.js"

document.getElementById("boutonDelais").addEventListener("click",()=>renvoiDate()) ///BLOC DES DELAIS

document.getElementById("ajout").addEventListener("click",()=> (controleDate ())) ///AJOUT DES ABSENCES






