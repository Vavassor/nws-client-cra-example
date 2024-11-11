import { Container } from "@chakra-ui/react";
import { SkipNavContent } from "@chakra-ui/skip-nav";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { useDocumentTitle } from "../Common/useDocumentTitle";
import { ZonesSection } from "./ZonesSection";

export const ZonesPage: FC = () => {
  const { t } = useTranslation("zone");
  useDocumentTitle(t("zonesPage.pageTitle"));

  return (
    <Container as="main" maxW="container.sm" pt={4}>
      <SkipNavContent />
      <ZonesSection />
    </Container>
  );
};
