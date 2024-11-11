import { Container, Grid, GridItem } from "@chakra-ui/react";
import { SkipNavContent } from "@chakra-ui/skip-nav";
import { useQuery } from "@tanstack/react-query";
import { getZoneJsonLd } from "@vavassor/nws-client";
import { FC, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useDocumentTitle } from "../Common/useDocumentTitle";
import { ZoneAlertsSection } from "./ZoneAlertsSection";
import { ZoneForecastSection } from "./ZoneForecastSection";
import { ZoneSection } from "./ZoneSection";

export const ZonePage: FC = () => {
  const { type, zoneId } = useParams();
  const { t } = useTranslation("zone");
  const { setDocumentTitle } = useDocumentTitle();
  const { data: zone } = useQuery(
    ["zone", zoneId],
    () => getZoneJsonLd({ zoneId: zoneId!, type: type! as any }),
    {
      enabled: !!type && !!zoneId,
    }
  );

  useEffect(() => {
    if (zone) {
      setDocumentTitle(t("zonePage.pageTitle", { zoneName: zone.name }));
    }
  }, [setDocumentTitle, t, zone]);

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
