import { Container, Grid, GridItem } from "@chakra-ui/react";
import { SkipNavContent } from "@chakra-ui/skip-nav";
import { useTranslation } from "react-i18next";
import { useDocumentTitle } from "../Common/useDocumentTitle";
import { CurrentConditionsSection } from "./CurrentConditionsSection";
import { LocalInformationSection } from "./LocalInformationSection";
import { TodaysConditionsSection } from "./TodaysConditionsSection";
import { WeatherAlertsSection } from "./WeatherAlertsSection";

export const TodaysWeatherPage = () => {
  const { t } = useTranslation("forecast");
  useDocumentTitle(t("todaysWeatherPage.pageTitle"));

  return (
    <Container as="main" maxW="container.sm" pt={4}>
      <SkipNavContent />
      <Grid
        gap={4}
        gridTemplateColumns="100%"
        maxWidth="100%"
        templateAreas={`"current"
          "alerts"
          "todays"
          "local"`}
      >
        <GridItem area="current">
          <CurrentConditionsSection />
        </GridItem>
        <GridItem area="alerts">
          <WeatherAlertsSection />
        </GridItem>
        <GridItem area="todays">
          <TodaysConditionsSection />
        </GridItem>
        <GridItem area="local">
          <LocalInformationSection />
        </GridItem>
      </Grid>
    </Container>
  );
};
