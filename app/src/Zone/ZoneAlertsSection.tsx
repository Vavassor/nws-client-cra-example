import {
  Box,
  Heading,
  Link,
  ListItem,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { getActiveAlertsByZoneJsonLd } from "@vavassor/nws-client";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { Link as RouterLink } from "react-router-dom";

interface ZoneAlertsSectionProps {
  zoneId: string | undefined;
}

export const ZoneAlertsSection: FC<ZoneAlertsSectionProps> = ({ zoneId }) => {
  const { data: alerts } = useQuery(
    ["alerts", zoneId],
    () => getActiveAlertsByZoneJsonLd({ zoneId: zoneId! }),
    { enabled: !!zoneId }
  );
  const { t } = useTranslation("zone");

  return (
    <Box as="section" borderRadius="lg" borderWidth="1px" px={8} py={4}>
      <Heading as="h2" size="lg">
        {t("zoneAlertsSection.heading")}
      </Heading>
      {!!alerts && alerts["@graph"].length > 0 ? (
        <UnorderedList>
          {alerts["@graph"].map((alert) => (
            <ListItem>
              <Link
                as={RouterLink}
                to={`/alerts/${encodeURIComponent(alert.id)}`}
              >
                {alert.headline || alert.event}
              </Link>
            </ListItem>
          ))}
        </UnorderedList>
      ) : (
        <Text>{t("zoneAlertsSection.noAlertsMessage")}</Text>
      )}
    </Box>
  );
};
