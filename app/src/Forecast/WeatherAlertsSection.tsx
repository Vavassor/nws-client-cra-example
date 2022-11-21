import {
  Box,
  Heading,
  Link,
  ListItem,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { getActiveAlertsGeoJson } from "@vavassor/nws-client";
import { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { getCurrentPosition } from "../Common/getCurrentPosition";
import { Link as RouterLink } from "react-router-dom";

interface Alert {
  description: string;
  eventName: string;
  headline: null | string | undefined;
  id: string;
}

export const WeatherAlertsSection: FC = () => {
  const { data: position } = useQuery(["currentPosition"], () =>
    getCurrentPosition({ timeout: 5000 })
  );
  const { data: alertCollection } = useQuery(
    ["activeAlerts"],
    () =>
      getActiveAlertsGeoJson({
        point: `${position!.coords.latitude.toFixed(
          4
        )},${position!.coords.longitude.toFixed(4)}`,
      }),
    { enabled: !!position }
  );
  const { t } = useTranslation("forecast");

  const alerts = useMemo(() => {
    if (!alertCollection) {
      return undefined;
    }

    const result: Alert[] = alertCollection.features.map((feature) => ({
      description: feature.properties.description,
      eventName: feature.properties.event,
      headline: feature.properties.headline,
      id: feature.properties.id,
    }));

    return result;
  }, [alertCollection]);

  return (
    <Box borderRadius="lg" borderWidth="1px" px={8} py={4}>
      <Heading as="h2" size="lg">
        {t("weatherAlertsCard.heading")}
      </Heading>
      {!!alerts && alerts.length > 0 ? (
        <UnorderedList>
          {alerts.map((alert) => (
            <ListItem>
              <Link
                as={RouterLink}
                to={`alerts/${encodeURIComponent(alert.id)}`}
              >
                {alert.headline || alert.eventName}
              </Link>
            </ListItem>
          ))}
        </UnorderedList>
      ) : (
        <Text>{t("weatherAlertsCard.noAlertsMessage")}</Text>
      )}
    </Box>
  );
};
