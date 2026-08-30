import { Heading } from "@chakra-ui/react";

// Premier bloc porté sur Chakra. Les autres sections vivent encore dans
// index.html et src/legacy/, et seront migrées une par une.
export default function App() {
  return (
    <Heading
      as="h1"
      textAlign="center"
      color="rupture.text"
      fontFamily="heading"
      letterSpacing="0.1em"
      size="3xl"
    >
      RUPTURE
    </Heading>
  );
}
