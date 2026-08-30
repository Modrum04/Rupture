import { ClientOnly, IconButton, Skeleton, Span } from "@chakra-ui/react";
import { ThemeProvider, useTheme } from "next-themes";
import { LuneIcon, SoleilIcon } from "./icons.jsx";

// Chakra pilote le mode sombre via la classe `.dark` : c'est exactement ce que
// next-themes pose sur <html> avec attribute="class".
export function ColorModeProvider(props) {
  return <ThemeProvider attribute="class" disableTransitionOnChange {...props} />;
}

export function useColorMode() {
  const { resolvedTheme, setTheme } = useTheme();
  return {
    colorMode: resolvedTheme,
    setColorMode: setTheme,
    toggleColorMode: () => setTheme(resolvedTheme === "dark" ? "light" : "dark"),
  };
}

function BoutonTheme(props) {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <IconButton
      onClick={toggleColorMode}
      variant="ghost"
      size="sm"
      aria-label={colorMode === "dark" ? "Passer en thème clair" : "Passer en thème sombre"}
      {...props}
    >
      <Span display="contents">{colorMode === "dark" ? <SoleilIcon /> : <LuneIcon />}</Span>
    </IconButton>
  );
}

export function ColorModeButton(props) {
  // Le thème résolu n'est lisible qu'une fois monté côté navigateur : ClientOnly
  // réserve la place plutôt que d'afficher brièvement la mauvaise icône.
  return (
    <ClientOnly fallback={<Skeleton boxSize="8" rounded="md" />}>
      <BoutonTheme {...props} />
    </ClientOnly>
  );
}
