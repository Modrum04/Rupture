import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import { ColorModeProvider } from "./components/color-mode.jsx";
import { SimulationProvider } from "./state/SimulationContext.jsx";
import { system } from "./theme.js";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ChakraProvider value={system}>
      <ColorModeProvider>
        <SimulationProvider>
          <App />
        </SimulationProvider>
      </ColorModeProvider>
    </ChakraProvider>
  </StrictMode>,
);
