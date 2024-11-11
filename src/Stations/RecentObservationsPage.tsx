import { Box, Container } from "@chakra-ui/react";
import { SkipNavContent } from "@chakra-ui/skip-nav";
import { useQuery } from "@tanstack/react-query";
import { getStationJsonLd } from "@vavassor/nws-client";
import { FC, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useDocumentTitle } from "../Common/useDocumentTitle";
import { RecentObservationsSection } from "./RecentObservationsSection";

export const RecentObservationsPage: FC = () => {
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
        t("recentObservationsPage.pageTitle", { stationName: station.name })
      );
    }
  }, [setDocumentTitle, station, t]);

  return (
    <Box as="main">
      <SkipNavContent />
      <RecentObservationsSection stationId={stationId} />
    </Box>
  );
};
