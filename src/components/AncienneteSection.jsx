import { useState } from "react";
import {
  Alert, Button, EmptyState, Field, Heading, HStack, IconButton, Input,
  NativeSelect, SimpleGrid, Stack, Text,
} from "@chakra-ui/react";
import { NATURES_ABSENCE, natureAbsence } from "../lib/absences.js";
import { resumerAnciennete } from "../lib/anciennete.js";
import { useSimulation } from "../state/SimulationContext.jsx";
import { CorbeilleIcon, PlusIcon } from "./icons.jsx";
import { Resultat, Section } from "./Section.jsx";

function formater(valeur) {
  return new Date(valeur).toLocaleDateString("fr");
}

function SaisieAbsence() {
  const { ajouterAbsence } = useSimulation();
  const [debut, setDebut] = useState("");
  const [fin, setFin] = useState("");
  const [nature, setNature] = useState(NATURES_ABSENCE[0].valeur);
  const [erreur, setErreur] = useState(null);

  const soumettre = (event) => {
    event.preventDefault();
    const message = ajouterAbsence(debut, fin, nature);
    setErreur(message);
    if (message === null) {
      setDebut("");
      setFin("");
    }
  };

  return (
    <Stack as="form" gap="3" onSubmit={soumettre}>
      <SimpleGrid columns={{ base: 1, md: 3 }} gap="3">
        <Field.Root>
          <Field.Label>Nature de l'absence</Field.Label>
          <NativeSelect.Root>
            <NativeSelect.Field value={nature} onChange={(event) => setNature(event.currentTarget.value)}>
              {NATURES_ABSENCE.map((item) => (
                <option key={item.valeur} value={item.valeur}>
                  {item.libelle}
                </option>
              ))}
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
        </Field.Root>
        <Field.Root>
          <Field.Label>Début d'absence</Field.Label>
          <Input type="date" value={debut} onChange={(event) => setDebut(event.currentTarget.value)} />
        </Field.Root>
        <Field.Root>
          <Field.Label>Fin d'absence</Field.Label>
          <Input type="date" value={fin} onChange={(event) => setFin(event.currentTarget.value)} />
        </Field.Root>
      </SimpleGrid>

      {erreur !== null && (
        <Alert.Root status="error" variant="subtle">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Description>{erreur}</Alert.Description>
          </Alert.Content>
        </Alert.Root>
      )}

      <Button type="submit" alignSelf="start" size="sm">
        <PlusIcon />
        Ajouter l'absence
      </Button>
    </Stack>
  );
}

function ListeAbsences() {
  const { etat, derive, supprimerAbsence } = useSimulation();

  if (etat.absences.length === 0) {
    return (
      <EmptyState.Root size="sm">
        <EmptyState.Content>
          <EmptyState.Title>Aucune absence enregistrée</EmptyState.Title>
          <EmptyState.Description>
            L'ancienneté est calculée sur la période d'emploi complète.
          </EmptyState.Description>
        </EmptyState.Content>
      </EmptyState.Root>
    );
  }

  return (
    <Stack gap="2">
      {etat.absences.map((absence) => (
        <HStack
          key={absence.id}
          justify="space-between"
          gap="4"
          borderWidth="1px"
          rounded="md"
          px="3"
          py="2"
          flexWrap="wrap"
        >
          <Stack gap="0">
            <Text fontSize="sm" fontWeight="medium">
              Du {formater(absence.dateFrom)} au {formater(absence.dateTo)} — {absence.duree} jours
            </Text>
            <Text fontSize="xs" color="fg.muted">
              {natureAbsence(absence.nature).mention}
            </Text>
          </Stack>
          <IconButton
            aria-label="Supprimer cette absence"
            size="xs"
            variant="ghost"
            colorPalette="red"
            onClick={() => supprimerAbsence(absence.id)}
          >
            <CorbeilleIcon />
          </IconButton>
        </HStack>
      ))}
      {derive.totalAbsence > 0 && (
        <Text fontSize="sm" color="fg.muted">
          La somme des absences à déduire de l'ancienneté totalise {derive.totalAbsence} jours.
        </Text>
      )}
    </Stack>
  );
}

export function AncienneteSection() {
  const { etat, derive, modifier } = useSimulation();
  const resume = resumerAnciennete(derive.anciennete);

  return (
    <Section
      valeur="anciennete"
      titre="Calcul de l'ancienneté"
      description="Période d'emploi, diminuée des absences non assimilées à du travail effectif."
      badge={derive.anciennete !== null && !derive.anciennete.nulle ? resume : null}
    >
      <Stack gap="5">
        <SimpleGrid columns={{ base: 1, md: 2 }} gap="3">
          <Field.Root>
            <Field.Label>Date d'embauche</Field.Label>
            <Input
              type="date"
              value={etat.dateEmbauche}
              onChange={(event) => modifier("dateEmbauche", event.currentTarget.value)}
            />
          </Field.Root>
          <Field.Root>
            <Field.Label>Date de rupture</Field.Label>
            <Input
              type="date"
              value={etat.dateRupture}
              onChange={(event) => modifier("dateRupture", event.currentTarget.value)}
            />
          </Field.Root>
        </SimpleGrid>

        {derive.anciennete !== null && (
          <Resultat label="Ancienneté décomptée">
            {derive.anciennete.nulle ? (
              "L'ancienneté calculée est nulle."
            ) : (
              <>
                {resume}
                {derive.anciennete.annees > 10 && (
                  <Text as="span" fontSize="sm" fontWeight="normal" color="fg.muted">
                    {" "}
                    dont {derive.anciennete.ansAuDelaDeDix} {derive.anciennete.annees < 12 ? "an" : "ans"} et{" "}
                    {derive.anciennete.mois} mois au-delà de 10 ans
                  </Text>
                )}
              </>
            )}
          </Resultat>
        )}

        <Stack gap="3">
          <Heading size="sm">Décompte des absences</Heading>
          <SaisieAbsence />
          <ListeAbsences />
        </Stack>
      </Stack>
    </Section>
  );
}
