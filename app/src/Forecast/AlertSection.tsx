import { Box, Heading, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { getAlertGeoJson } from "@vavassor/nws-client";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

export const AlertSection: FC = () => {
  const { alertId } = useParams();
  const { data: alert } = useQuery(
    ["alert"],
    () => getAlertGeoJson({ id: alertId! }),
    {
      enabled: !!alertId,
    }
  );
  const { i18n, t } = useTranslation("forecast");

  return (
    <Box as="section" borderRadius="lg" borderWidth="1px" px={8} py={4}>
      {!!alert && (
        <>
          <Heading as="h1" size="lg">
            {alert.properties.event}
          </Heading>
          <Text>
            {t("alertSection.effectiveTimeRange", {
              timeRange: new Intl.DateTimeFormat(i18n.language, {
                hour: "numeric",
                timeZoneName: "short",
                weekday: "short",
              }).formatRange(
                new Date(alert.properties.effective),
                new Date(alert.properties.expires)
              ),
            })}
          </Text>
          {alert.properties.parameters["NWSheadline"]?.length > 0 && (
            <>
              <Heading as="h2" mt={4} size="md">
                {t("alertSection.summaryHeading")}
              </Heading>
              {alert.properties.parameters["NWSheadline"].map((headline) => (
                <Text>{headline}</Text>
              ))}
            </>
          )}
          {alert.properties.instruction && (
            <>
              <Heading as="h2" mt={4} size="md">
                {t("alertSection.actionRecommendedHeading")}
              </Heading>
              <Text overflowX="auto" whiteSpace="pre-wrap">
                {alert.properties.instruction}
              </Text>
            </>
          )}
          <Heading as="h2" mt={4} size="md">
            {t("alertSection.descriptionHeading")}
          </Heading>
          <Text overflowX="auto" whiteSpace="pre-wrap">
            {alert.properties.description}
          </Text>
          <Heading as="h2" mt={4} size="md">
            {t("alertSection.issuedByHeading")}
          </Heading>
          <Text>{alert.properties.senderName}</Text>
          <Heading as="h2" mt={4} size="md">
            {t("alertSection.affectedAreasHeading")}
          </Heading>
          <Text>{alert.properties.areaDesc}</Text>
        </>
      )}
    </Box>
  );
};
