import { Container } from "@chakra-ui/react";
import { SkipNavContent } from "@chakra-ui/skip-nav";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { useDocumentTitle } from "../Common/useDocumentTitle";
import { StationsSection } from "./StationsSection";

export const StationsPage: FC = () => {
  const { t } = useTranslation("station");
  useDocumentTitle(t("stationsPage.pageTitle"));

  return (
    <Container as="main" maxW="container.sm" pt={4}>
      <SkipNavContent />
      <StationsSection />
    </Container>
  );
};
