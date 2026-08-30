import { Alert, Field, Input, List, NativeSelect, Spinner, Stack, Text } from "@chakra-ui/react";
import { NATURES_DELAIS, formaterDateLongue } from "../lib/delais.js";
import { useSimulation } from "../state/SimulationContext.jsx";
import { Section } from "./Section.jsx";

export function DelaisSection() {
  const { etat, derive, delaisEnCours, erreurDelais, modifier } = useSimulation();
  const nature = NATURES_DELAIS.find((item) => item.valeur === etat.natureDelais);

  return (
    <Section
      valeur="delais"
      titre="Calcul des délais"
      description="Jalons de la procédure, reports de week-ends et de jours fériés inclus."
      badge={derive.delais === null ? null : `${derive.delais.etapes.length} étapes`}
    >
      <Stack gap="4">
        <Field.Root>
          <Field.Label>Type de délai</Field.Label>
          <NativeSelect.Root>
            <NativeSelect.Field
              value={etat.natureDelais}
              onChange={(event) => modifier("natureDelais", event.currentTarget.value)}
            >
              <option value="">Sélectionner…</option>
              {NATURES_DELAIS.map((item) => (
                <option key={item.valeur} value={item.valeur}>
                  {item.libelle}
                </option>
              ))}
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
        </Field.Root>

        {nature !== undefined && (
          <Field.Root>
            <Field.Label>{nature.labelDate}</Field.Label>
            <Input
              type="date"
              value={etat.dateDepart}
              onChange={(event) => modifier("dateDepart", event.currentTarget.value)}
            />
          </Field.Root>
        )}

        {delaisEnCours && (
          <Text fontSize="sm" color="fg.muted">
            <Spinner size="xs" me="2" />
            Récupération des jours fériés…
          </Text>
        )}

        {erreurDelais !== null && (
          <Alert.Root status="warning" variant="subtle">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Description>{erreurDelais}</Alert.Description>
            </Alert.Content>
          </Alert.Root>
        )}

        {derive.delais !== null && (
          <Stack gap="3">
            <List.Root variant="plain" gap="0">
              {derive.delais.etapes.map((etape, index) => (
                <List.Item
                  key={etape.libelle}
                  display="flex"
                  justifyContent="space-between"
                  gap="4"
                  flexWrap="wrap"
                  py="2.5"
                  borderTopWidth={index === 0 ? "0" : "1px"}
                >
                  <Text fontWeight="medium">{etape.libelle}</Text>
                  <Text color="colorPalette.fg">{formaterDateLongue(etape.date)}</Text>
                </List.Item>
              ))}
            </List.Root>
            {derive.delais.notices.map((notice) => (
              <Text key={notice} fontSize="xs" fontStyle="italic" color="fg.muted">
                {notice}
              </Text>
            ))}
          </Stack>
        )}
      </Stack>
    </Section>
  );
}
