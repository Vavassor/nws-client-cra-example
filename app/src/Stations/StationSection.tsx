import { Box, Heading, Link } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { getStationJsonLd, getZoneByUriJsonLd } from "@vavassor/nws-client";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { Link as RouterLink } from "react-router-dom";

interface StationSectionProps {
  stationId: string | undefined;
}

export const StationSection: FC<StationSectionProps> = ({ stationId }) => {
  const { data: station } = useQuery(
    ["stations", stationId],
    () => getStationJsonLd({ stationId: stationId! }),
    { enabled: !!stationId }
  );
  const { data: fireWeatherZone } = useQuery(
    ["zones", station?.fireWeatherZone],
    () => getZoneByUriJsonLd({ uri: station!.fireWeatherZone }),
    { enabled: !!station }
  );
  const { data: county } = useQuery(
    ["zones", station?.county],
    () => getZoneByUriJsonLd({ uri: station!.county }),
    { enabled: !!station }
  );
  const { t } = useTranslation("station");

  return (
    <Box as="section" borderRadius="lg" borderWidth="1px" py={4}>
      {!!station && !!fireWeatherZone && !!county && (
        <>
          <Heading as="h1" px={8} size="lg">
            {t("stationSection.heading", { name: station.name })}
          </Heading>
          <Link
            as={RouterLink}
            mx={8}
            to={`/zones/${county.type}/${county.id}`}
          >
            {t("stationSection.countyLink", {
              name: county.name,
            })}
          </Link>
          <br />
          <Link
            as={RouterLink}
            mx={8}
            to={`/zones/${fireWeatherZone.type}/${fireWeatherZone.id}`}
          >
            {t("stationSection.fireWeatherZoneLink", {
              name: fireWeatherZone.name,
            })}
          </Link>
        </>
      )}
    </Box>
  );
};
