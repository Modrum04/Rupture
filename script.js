import {} from "./delais.js";
import {} from "./anciennete.js";
import {} from "./indemnites.js";
import {} from "./salaires.js";

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

function showHide(blocToShow) {
  document.getElementById(blocToShow).style.display === "block"
    ? (document.getElementById(blocToShow).style.display = "none")
    : (document.getElementById(blocToShow).style.display = "block");
}
