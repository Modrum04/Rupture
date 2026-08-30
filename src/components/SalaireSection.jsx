import { Button, Field, HStack, InputGroup, NativeSelect, NumberInput, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import { MOIS, anneesSelectionnables, cleSourceReport, clesVides } from "../lib/salaires.js";

// Décrit la formule effectivement retenue, pour que le chiffre affiché soit vérifiable.
function detailFormule(detail) {
  const { nbMois, nbTrois, moyenneTrois, moyenneDouze, formule } = detail;
  const mois = (n) => `${n} mois travaillé${n > 1 ? "s" : ""}`;

  if (nbMois <= 3) return `Moyenne des ${mois(nbMois)}.`;

  return formule === "trois"
    ? `Moyenne des ${nbTrois} derniers mois travaillés, plus favorable que celle des ${mois(nbMois)} (${moyenneDouze} €).`
    : `Moyenne des ${mois(nbMois)}, plus favorable que celle des ${nbTrois} derniers (${moyenneTrois} €).`;
}
import { useSimulation } from "../state/SimulationContext.jsx";
import { ReporterIcon } from "./icons.jsx";
import { Resultat, Section } from "./Section.jsx";

export function SalaireSection() {
  const { etat, derive, modifier, modifierSalaire, reporterSalaire } = useSimulation();

  const cles = derive.moisReference.map((mois) => mois.cle);
  const cleSource = cleSourceReport(etat.salaires, cles);
  const nbVides = clesVides(etat.salaires, cles).length;
  const reportPossible = cleSource !== undefined && nbVides > 0;
  const nbTravailles = cles.length - nbVides;

  return (
    <Section
      valeur="salaire"
      titre="Calcul du salaire de référence"
      description="Le plus favorable entre la moyenne des 3 et celle des 12 derniers mois travaillés."
      badge={derive.salaireRef > 0 ? `${derive.salaireRef} €` : null}
    >
      <Stack gap="5">
        <SimpleGrid columns={{ base: 1, md: 2 }} gap="3">
          <Field.Root>
            <Field.Label>Dernier mois rémunéré connu</Field.Label>
            <NativeSelect.Root>
              <NativeSelect.Field
                value={etat.dernierMois}
                onChange={(event) => modifier("dernierMois", event.currentTarget.value)}
              >
                <option value="">Sélectionner…</option>
                {MOIS.map((mois, index) => (
                  <option key={mois} value={index}>
                    {mois}
                  </option>
                ))}
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
          </Field.Root>
          <Field.Root>
            <Field.Label>Année</Field.Label>
            <NativeSelect.Root>
              <NativeSelect.Field
                value={etat.dernierAnnee}
                onChange={(event) => modifier("dernierAnnee", event.currentTarget.value)}
              >
                {anneesSelectionnables().map((annee) => (
                  <option key={annee} value={annee}>
                    {annee}
                  </option>
                ))}
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
          </Field.Root>
        </SimpleGrid>

        {derive.moisReference.length === 0 ? (
          <Text fontSize="sm" color="fg.muted">
            Sélectionnez un mois pour saisir les douze derniers salaires bruts.
          </Text>
        ) : (
          <>
            <Stack
              gap="1"
              bg="bg.muted"
              rounded="md"
              px="4"
              py="3"
              fontSize="sm"
              color="fg.muted"
            >
              <Text>
                <Text as="span" fontWeight="medium" color="fg">
                  Un mois laissé vide est considéré comme non travaillé
                </Text>{" "}
                : il est exclu de la moyenne et du diviseur.
              </Text>
              <Text>
                Un mois travaillé mais non rémunéré — congé sans solde, absence — se saisit à{" "}
                <Text as="span" fontWeight="medium" color="fg">
                  0
                </Text>{" "}
                : il reste compté au diviseur.
              </Text>
            </Stack>

            <HStack justify="space-between" gap="3" flexWrap="wrap">
              <Text fontSize="sm" color="fg.muted">
                {nbTravailles === 0
                  ? "Aucun mois travaillé renseigné."
                  : `${nbTravailles} mois travaillé${nbTravailles > 1 ? "s" : ""} sur 12 renseigné${nbTravailles > 1 ? "s" : ""}.`}
              </Text>
              <Button
                size="xs"
                variant="outline"
                onClick={() => reporterSalaire(cles)}
                disabled={!reportPossible}
              >
                <ReporterIcon />
                {reportPossible
                  ? `Reporter ${etat.salaires[cleSource]} € sur les ${nbVides} mois vides`
                  : "Reporter sur les mois vides"}
              </Button>
            </HStack>

            <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} gap="3">
              {derive.moisReference.map((mois) => (
                <Field.Root key={mois.cle}>
                  <Field.Label fontSize="xs" color="fg.muted">
                    {mois.libelle}
                  </Field.Label>
                  <NumberInput.Root
                    min={0}
                    value={etat.salaires[mois.cle] ?? ""}
                    onValueChange={(details) => modifierSalaire(mois.cle, details.value)}
                    width="full"
                  >
                    <InputGroup endElement="€">
                      {/* Pas de placeholder "0" : 0 est une valeur légitime (mois non
                          rémunéré), un mois vide doit rester visiblement vide. */}
                      <NumberInput.Input />
                    </InputGroup>
                  </NumberInput.Root>
                </Field.Root>
              ))}
            </SimpleGrid>

            {derive.detailSalaire !== null && (
              <Resultat
                label="Salaire de référence"
                unite="euros bruts"
                detail={detailFormule(derive.detailSalaire)}
              >
                {derive.salaireRef}
              </Resultat>
            )}
          </>
        )}
      </Stack>
    </Section>
  );
}
