import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import { system } from "./theme.js";
import App from "./App.jsx";
import "./style.css";
// Logique historique en DOM natif : elle s'accroche au balisage statique
// d'index.html, en dehors du sous-arbre React.
import "./legacy/script.js";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ChakraProvider value={system}>
      <App />
    </ChakraProvider>
  </StrictMode>,
);
