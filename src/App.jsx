import { Accordion, Box, Button, Container, Heading, HStack, Stack, Text } from "@chakra-ui/react";
import { ColorModeButton } from "./components/color-mode.jsx";
import { DelaisSection } from "./components/DelaisSection.jsx";
import { AncienneteSection } from "./components/AncienneteSection.jsx";
import { SalaireSection } from "./components/SalaireSection.jsx";
import { IndemniteSection } from "./components/IndemniteSection.jsx";
import { ExportSection } from "./components/ExportSection.jsx";
import { useSimulation } from "./state/SimulationContext.jsx";

function Entete() {
  const { reinitialiser } = useSimulation();

  return (
    <Stack gap="6">
      <HStack justify="space-between" align="start">
        <Stack gap="1">
          <Heading size="3xl" letterSpacing="tight">
            Rupture
          </Heading>
          <Text color="fg.muted" maxW="prose">
            Boîte à outils de la rupture du contrat de travail : délais de procédure, ancienneté,
            salaire de référence et indemnités légales.
          </Text>
        </Stack>
        <HStack gap="2">
          <Button variant="ghost" size="sm" onClick={reinitialiser}>
            Réinitialiser
          </Button>
          <ColorModeButton />
        </HStack>
      </HStack>
    </Stack>
  );
}

export default function App() {
  return (
    <Box minH="dvh" py={{ base: "8", md: "12" }}>
      <Container maxW="4xl">
        <Stack gap="8">
          <Entete />
          <Accordion.Root multiple collapsible defaultValue={["delais"]} variant="plain">
            <Stack gap="4">
              <DelaisSection />
              <AncienneteSection />
              <SalaireSection />
              <IndemniteSection />
              <ExportSection />
            </Stack>
          </Accordion.Root>
          <Text fontSize="xs" color="fg.subtle">
            Simulation indicative, sans valeur contractuelle.
          </Text>
        </Stack>
      </Container>
    </Box>
  );
}
