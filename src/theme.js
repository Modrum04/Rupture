import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

// Le reset CSS de Chakra est cantonné au sous-arbre React (.chakra-reset) et les
// styles globaux par défaut sont retirés : la page historique garde style.css intact.
const { globalCss: _globalCss, ...baseConfig } = defaultConfig;

const config = defineConfig({
  preflight: { scope: ".chakra-reset" },
  theme: {
    tokens: {
      colors: {
        rupture: {
          bg: { value: "#313e50" },
          surface: { value: "#3a435e" },
          text: { value: "#fefff5" },
          border: { value: "#777777" },
          accent: { value: "#94acf5" },
        },
      },
      fonts: {
        heading: { value: '"Montserrat", sans-serif' },
        body: { value: '"Montserrat", sans-serif' },
      },
    },
  },
});

export const system = createSystem(baseConfig, config);
