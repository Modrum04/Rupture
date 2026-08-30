import { useState } from "react";
import { Alert, Button, Field, Input, Stack, Text } from "@chakra-ui/react";
import { genererPdf } from "../lib/pdf.js";
import { useSimulation } from "../state/SimulationContext.jsx";
import { TelechargerIcon } from "./icons.jsx";
import { Section } from "./Section.jsx";

export function ExportSection() {
  const { etat, derive } = useSimulation();
  const [nom, setNom] = useState("");
  const [enCours, setEnCours] = useState(false);
  const [message, setMessage] = useState(null);

  const exporter = async () => {
    setEnCours(true);
    setMessage(null);
    try {
      const genere = await genererPdf(etat, derive, nom.trim() === "" ? "non renseigné" : nom.trim());
      if (!genere) setMessage({ status: "warning", texte: "Aucune saisie à exporter pour le moment." });
    } catch {
      setMessage({ status: "error", texte: "Le PDF n'a pas pu être généré." });
    } finally {
      setEnCours(false);
    }
  };

  const blocs = [
    derive.delais !== null && "délais",
    derive.anciennete !== null && "ancienneté",
    derive.detailSalaire !== null && "salaire de référence",
    derive.indemnite !== null && "indemnité",
  ].filter(Boolean);

  return (
    <Section
      valeur="export"
      titre="Export PDF"
      description="Récapitulatif de la simulation, prêt à être versé au dossier."
      badge={blocs.length > 0 ? `${blocs.length} blocs` : null}
    >
      <Stack gap="4">
        <Field.Root>
          <Field.Label>Nom du salarié</Field.Label>
          <Input value={nom} onChange={(event) => setNom(event.currentTarget.value)} placeholder="Nom figurant sur le document" />
        </Field.Root>

        <Text fontSize="sm" color="fg.muted">
          {blocs.length === 0
            ? "Aucun bloc renseigné : le document serait vide."
            : `Blocs inclus : ${blocs.join(", ")}.`}
        </Text>

        {message !== null && (
          <Alert.Root status={message.status} variant="subtle">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Description>{message.texte}</Alert.Description>
            </Alert.Content>
          </Alert.Root>
        )}

        <Button alignSelf="start" onClick={exporter} loading={enCours} disabled={blocs.length === 0}>
          <TelechargerIcon />
          Générer le PDF
        </Button>
      </Stack>
    </Section>
  );
}
