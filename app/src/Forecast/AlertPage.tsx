import { Container } from "@chakra-ui/react";
import { SkipNavContent } from "@chakra-ui/skip-nav";
import { useQuery } from "@tanstack/react-query";
import { getAlertGeoJson } from "@vavassor/nws-client";
import { FC, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useDocumentTitle } from "../Common/useDocumentTitle";
import { AlertSection } from "./AlertSection";

export const AlertPage: FC = () => {
  const { alertId } = useParams();
  const { data: alert } = useQuery(
    ["alert"],
    () => getAlertGeoJson({ id: alertId! }),
    {
      enabled: !!alertId,
    }
  );
  const { setDocumentTitle } = useDocumentTitle();
  const { t } = useTranslation("forecast");

  useEffect(() => {
    if (alert) {
      setDocumentTitle(
        t("alertPage.pageTitle", {
          eventName: alert.properties.event,
          forecastOfficeName: alert.properties.senderName,
        })
      );
    }
  }, [alert, setDocumentTitle, t]);

  return (
    <Container as="main" maxW="container.sm" pt={4}>
      <SkipNavContent />
      <AlertSection />
    </Container>
  );
};
