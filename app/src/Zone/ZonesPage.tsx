import { Container } from "@chakra-ui/react";
import { SkipNavContent } from "@chakra-ui/skip-nav";
import { FC } from "react";
import { ZonesSection } from "./ZonesSection";

export const ZonesPage: FC = () => {
  return (
    <Container as="main" maxW="container.sm" pt={4}>
      <SkipNavContent />
      <ZonesSection />
    </Container>
  );
};
