import { Container, Grid, GridItem } from "@chakra-ui/react";
import { SkipNavContent } from "@chakra-ui/skip-nav";
import { useQuery } from "@tanstack/react-query";
import { getStationJsonLd } from "@vavassor/nws-client";
import { FC, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useDocumentTitle } from "../Common/useDocumentTitle";
import { StationSection } from "./StationSection";

export const StationPage: FC = () => {
  const { stationId } = useParams();
  const { t } = useTranslation("station");
  const { setDocumentTitle } = useDocumentTitle();
  const { data: station } = useQuery(
    ["stations", stationId],
    () => getStationJsonLd({ stationId: stationId! }),
    { enabled: !!stationId }
  );

  useEffect(() => {
    if (station) {
      setDocumentTitle(
        t("stationPage.pageTitle", { stationName: station.name })
      );
    }
  }, [setDocumentTitle, station, t]);

  return (
    <Container as="main" maxW="container.sm" pt={4}>
      <SkipNavContent />
      <Grid
        gap={4}
        gridTemplateColumns="100%"
        maxWidth="100%"
        templateAreas={`"summary"`}
      >
        <GridItem area="summary">
          <StationSection stationId={stationId} />
        </GridItem>
      </Grid>
    </Container>
  );
};
