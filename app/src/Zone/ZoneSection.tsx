import {
  Box,
  Heading,
  Link,
  ListItem,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { getZoneJsonLd } from "@vavassor/nws-client";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { Link as RouterLink } from "react-router-dom";
import { getStateOrTerritoryNameByAbbreviation } from "../Common/LocalityUtilities";

interface ZoneSectionProps {
  type: string | undefined;
  zoneId: string | undefined;
}

export const ZoneSection: FC<ZoneSectionProps> = ({ type, zoneId }) => {
  const { t } = useTranslation("zone");
  const { data: zone } = useQuery(
    ["zone", zoneId],
    () => getZoneJsonLd({ zoneId: zoneId!, type: type! as any }),
    {
      enabled: !!type && !!zoneId,
    }
  );

  return (
    <Box as="section" borderRadius="lg" borderWidth="1px" py={4}>
      {!!zone && (
        <>
          <Heading as="h1" px={8} size="lg">
            {zone.name}
          </Heading>
          <Text px={8}>{t("zoneSection.zoneId", { id: zone.id })}</Text>
          <Text px={8}>
            {getStateOrTerritoryNameByAbbreviation(zone.state)}
          </Text>
          {!!zone.radarStation && (
            <Link
              as={RouterLink}
              px={8}
              // @TODO Fix radar station links for IDs that don't start with
              // the "K" prefix. Research what these prefixes mean.
              to={`/radarStations/K${zone.radarStation}`}
            >
              {t("zoneSection.radarStationLink", {
                radarStationId: zone.radarStation,
              })}
            </Link>
          )}
          <Heading as="h2" mt={4} px={8} size="md">
            {t("zoneSection.forecastOfficesHeading")}
          </Heading>
          {zone.forecastOffices.length > 0 && (
            <UnorderedList px={8}>
              {zone.cwa.map((office) => (
                <ListItem key={office}>
                  <Link as={RouterLink} to={`/offices/${office}`}>
                    {office}
                  </Link>
                </ListItem>
              ))}
            </UnorderedList>
          )}
        </>
      )}
    </Box>
  );
};
