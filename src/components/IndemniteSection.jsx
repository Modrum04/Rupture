import { Alert, Field, NativeSelect, Stack } from "@chakra-ui/react";
import { NATURES_RUPTURE, indemniteNulle } from "../lib/indemnites.js";
import { useSimulation } from "../state/SimulationContext.jsx";
import { Resultat, Section } from "./Section.jsx";

export function IndemniteSection() {
  const { etat, derive, modifier } = useSimulation();
  const { indemnite } = derive;

  return (
    <Section
      valeur="indemnite"
      titre="Calcul des indemnités"
      description="Indemnité légale, calculée à partir de l'ancienneté et du salaire de référence."
      badge={indemnite !== null && !indemniteNulle(indemnite) ? `${indemnite.montant} €` : null}
    >
      <Stack gap="4">
        <Field.Root>
          <Field.Label>Nature de la rupture</Field.Label>
          <NativeSelect.Root>
            <NativeSelect.Field
              value={etat.natureRupture}
              onChange={(event) => modifier("natureRupture", event.currentTarget.value)}
            >
              <option value="">Sélectionner…</option>
              {NATURES_RUPTURE.map((item) => (
                <option key={item.valeur} value={item.valeur}>
                  {item.libelle}
                </option>
              ))}
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
        </Field.Root>

        {etat.natureRupture !== "" && derive.anciennete === null && (
          <Alert.Root status="info" variant="subtle">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Description>
                Renseignez les dates d'embauche et de rupture pour obtenir une estimation.
              </Alert.Description>
            </Alert.Content>
          </Alert.Root>
        )}

        {indemnite !== null && (
          <Resultat
            label={`Indemnité légale de ${indemnite.libelle}`}
            unite={indemniteNulle(indemnite) ? undefined : "euros"}
          >
            {indemniteNulle(indemnite) ? "L'indemnité est nulle." : indemnite.montant}
          </Resultat>
        )}
      </Stack>
    </Section>
  );
}
