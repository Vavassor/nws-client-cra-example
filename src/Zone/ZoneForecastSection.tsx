import { Box, Heading, SkeletonText, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { getZoneForecastJsonLd } from "@vavassor/nws-client";
import { FC, useMemo } from "react";
import { Trans, useTranslation } from "react-i18next";

interface ZoneForecastSectionProps {
  type: string | undefined;
  zoneId: string | undefined;
}

export const ZoneForecastSection: FC<ZoneForecastSectionProps> = ({
  type,
  zoneId,
}) => {
  const { i18n, t } = useTranslation("zone");
  const { data: forecast, isLoading } = useQuery(
    ["zoneForecast", type, zoneId],
    () => getZoneForecastJsonLd({ type: type! as any, zoneId: zoneId! }),
    {
      enabled: !!zoneId,
      refetchOnWindowFocus: false,
      retry: false,
    }
  );

  const formattedForecast = useMemo(() => {
    if (!forecast) {
      return undefined;
    }

    const updateTimeIso = forecast.updated;
    const updateTime = new Intl.DateTimeFormat(i18n.language, {
      hour: "numeric",
      minute: "numeric",
      timeZoneName: "short",
    }).format(new Date(updateTimeIso));

    const period = forecast.periods[0];
    const detailedForecast = period.detailedForecast;

    return {
      detailedForecast,
      updateTime,
      updateTimeIso,
    };
  }, [forecast, i18n]);

  return (
    <Box as="section" borderRadius="lg" borderWidth="1px" py={4}>
      {!!formattedForecast ? (
        <>
          <Heading as="h2" px={8} size="md">
            <Trans i18nKey="zoneForecastSection.heading" t={t}>
              Forecast as of
              <time dateTime={formattedForecast.updateTimeIso}>
                {{ updateTime: formattedForecast.updateTime } as any}
              </time>
            </Trans>
          </Heading>
          <Text px={8}>{formattedForecast.detailedForecast}</Text>
        </>
      ) : isLoading ? (
        <SkeletonText px={8} />
      ) : (
        <Text px={8}>{t("zoneForecastSection.noForecastMessage")}</Text>
      )}
    </Box>
  );
};
