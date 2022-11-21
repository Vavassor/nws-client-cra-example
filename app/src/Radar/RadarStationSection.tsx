import { Box, Heading, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { getRadarStationJsonLd } from "@vavassor/nws-client";
import { FC } from "react";
import { useTranslation } from "react-i18next";

interface RadarStationSectionProps {
  stationId: string | undefined;
}

export const RadarStationSection: FC<RadarStationSectionProps> = ({
  stationId,
}) => {
  const { t } = useTranslation("radar");
  const { data: station } = useQuery(
    ["radarStation", stationId],
    () => getRadarStationJsonLd({ stationId: stationId! }),
    { enabled: !!stationId }
  );

  return (
    <Box as="section" borderRadius="lg" borderWidth="1px" py={4}>
      {!!station && (
        <>
          <Heading as="h1" px={8} size="lg">
            {station.name}
          </Heading>
          <Text px={8}>
            {t("radarStationSection.stationType", {
              type: station.stationType,
            })}
          </Text>
          {/* @TODO Add more station information. */}
        </>
      )}
    </Box>
  );
};
