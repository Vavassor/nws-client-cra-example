import { Container } from "@chakra-ui/react";
import { SkipNavContent } from "@chakra-ui/skip-nav";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { useDocumentTitle } from "../Common/useDocumentTitle";
import { HourlyWeatherSection } from "./HourlyWeatherSection";

export const HourlyWeatherPage: FC = () => {
  const { t } = useTranslation("forecast");
  useDocumentTitle(t("hourlyWeatherPage.pageTitle"));

  return (
    <Container as="main" maxW="container.sm" pt={4}>
      <SkipNavContent />
      <HourlyWeatherSection />
    </Container>
  );
};
