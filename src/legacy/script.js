import {} from "./delais.js";
import {} from "./anciennete.js";
import {} from "./indemnites.js";
import {} from "./salaires.js";
import {} from "./export_pdf.js"

document.getElementById("titleDelais").addEventListener("click", () => {
  showHide("delais");
});
document.getElementById("titleAnciennete").addEventListener("click", () => {
  showHide("anciennete");
});
document.getElementById("titleSalaire").addEventListener("click", () => {
  showHide("salaire");
});
document.getElementById("titleIndemnite").addEventListener("click", () => {
  showHide("indemnite");
});
document.getElementById("titleExport").addEventListener("click", () => {
  showHide("export");
});

function showHide(blocToShow) {
  document.getElementById(blocToShow).style.display === "block"
    ? (document.getElementById(blocToShow).style.display = "none")
    : (document.getElementById(blocToShow).style.display = "block");
}


