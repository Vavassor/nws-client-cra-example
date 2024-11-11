import { Container } from "@chakra-ui/react";
import { SkipNavContent } from "@chakra-ui/skip-nav";
import { useQuery } from "@tanstack/react-query";
import { getRadarStationJsonLd } from "@vavassor/nws-client";
import { FC, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useDocumentTitle } from "../Common/useDocumentTitle";
import { RadarStationSection } from "./RadarStationSection";

export const RadarStationPage: FC = () => {
  const { stationId } = useParams();
  const { t } = useTranslation("radar");
  const { data: station } = useQuery(
    ["radarStation", stationId],
    () => getRadarStationJsonLd({ stationId: stationId! }),
    { enabled: !!stationId }
  );
  const { setDocumentTitle } = useDocumentTitle();

  useEffect(() => {
    if (station) {
      setDocumentTitle(
        t("radarStationPage.pageTitle", { stationName: station.name })
      );
    }
  }, [setDocumentTitle, station, t]);

  return (
    <Container as="main" maxW="container.sm" pt={4}>
      <SkipNavContent />
      <RadarStationSection stationId={stationId} />
    </Container>
  );
};
