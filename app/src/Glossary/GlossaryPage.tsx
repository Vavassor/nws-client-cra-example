import { Container } from "@chakra-ui/react";
import { SkipNavContent } from "@chakra-ui/skip-nav";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { useDocumentTitle } from "../Common/useDocumentTitle";
import { GlossarySection } from "./GlossarySection";

export const GlossaryPage: FC = () => {
  const { t } = useTranslation("glossary");
  useDocumentTitle(t("glossaryPage.pageTitle"));

  return (
    <Container as="main" maxW="container.sm" pt={4}>
      <SkipNavContent />
      <GlossarySection />
    </Container>
  );
};
