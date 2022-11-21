import { Container, Grid, GridItem } from "@chakra-ui/react";
import { SkipNavContent } from "@chakra-ui/skip-nav";
import { FC } from "react";
import { useParams } from "react-router-dom";
import { ZoneAlertsSection } from "./ZoneAlertsSection";
import { ZoneForecastSection } from "./ZoneForecastSection";
import { ZoneSection } from "./ZoneSection";

export const ZonePage: FC = () => {
  const { type, zoneId } = useParams();

  return (
    <Container as="main" maxW="container.sm" pt={4}>
      <SkipNavContent />
      <Grid
        gap={4}
        gridTemplateColumns="100%"
        maxWidth="100%"
        templateAreas={`"summary"
          "forecast"
          "alerts"`}
      >
        <GridItem area="summary">
          <ZoneSection type={type} zoneId={zoneId} />
        </GridItem>
        <GridItem area="forecast">
          <ZoneForecastSection type={type} zoneId={zoneId} />
        </GridItem>
        <GridItem area="alerts">
          <ZoneAlertsSection zoneId={zoneId} />
        </GridItem>
      </Grid>
    </Container>
  );
};
