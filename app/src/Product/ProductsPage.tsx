import { Container } from "@chakra-ui/react";
import { SkipNavContent } from "@chakra-ui/skip-nav";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { useDocumentTitle } from "../Common/useDocumentTitle";
import { ProductsSection } from "./ProductsSection";

export const ProductsPage: FC = () => {
  const { t } = useTranslation("product");
  useDocumentTitle(t("productsPage.pageTitle"));

  return (
    <Container as="main" maxW="container.sm" pt={4}>
      <SkipNavContent />
      <ProductsSection />
    </Container>
  );
};
