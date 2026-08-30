import { Accordion, Badge, Card, Heading, HStack, Span, Stack, Text } from "@chakra-ui/react";

// Enveloppe commune des cinq blocs : carte + titre + zone de résultat.
export function Section({ valeur, titre, description, badge, children }) {
  return (
    <Accordion.Item value={valeur} border="none">
      <Card.Root rounded="card" bg="surface.panel" borderWidth="1px" overflow="hidden">
        <Accordion.ItemTrigger px="5" py="4" cursor="pointer" _hover={{ bg: "bg.muted" }}>
          <Stack gap="0.5" flex="1" textAlign="start">
            <HStack gap="3">
              <Heading size="md">{titre}</Heading>
              {badge !== undefined && badge !== null && (
                <Badge colorPalette="teal" variant="subtle">
                  {badge}
                </Badge>
              )}
            </HStack>
            <Text fontSize="sm" color="fg.muted">
              {description}
            </Text>
          </Stack>
          <Accordion.ItemIndicator />
        </Accordion.ItemTrigger>
        <Accordion.ItemContent>
          <Accordion.ItemBody px="5" pb="5" pt="1">
            {children}
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Card.Root>
    </Accordion.Item>
  );
}

// Bandeau de résultat, réutilisé par l'ancienneté, le salaire et l'indemnité.
export function Resultat({ label, children, unite, detail }) {
  return (
    <Stack
      gap="1"
      bg="colorPalette.subtle"
      borderStartWidth="3px"
      borderColor="colorPalette.solid"
      rounded="md"
      px="4"
      py="3"
    >
      <Text fontSize="xs" textTransform="uppercase" letterSpacing="wider" color="fg.muted">
        {label}
      </Text>
      <Text fontSize="xl" fontWeight="semibold">
        {children}
        {unite !== undefined && (
          <Span fontSize="md" fontWeight="normal" color="fg.muted">
            {" "}
            {unite}
          </Span>
        )}
      </Text>
      {detail !== undefined && (
        <Text fontSize="xs" color="fg.muted">
          {detail}
        </Text>
      )}
    </Stack>
  );
}
