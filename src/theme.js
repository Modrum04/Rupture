import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
  globalCss: {
    // Défini une fois ici, le colorPalette se propage à tous les composants Chakra
    // de l'application : les variantes solid/subtle/outline s'accordent d'elles-mêmes.
    body: {
      colorPalette: "teal",
      bg: "bg.subtle",
    },
  },
  theme: {
    tokens: {
      radii: {
        card: { value: "0.75rem" },
      },
    },
    semanticTokens: {
      colors: {
        "surface.panel": {
          value: { base: "{colors.white}", _dark: "{colors.gray.900}" },
        },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);
