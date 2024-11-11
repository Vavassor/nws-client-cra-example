import {
  Box,
  Heading,
  Link,
  Skeleton,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import {
  getStationJsonLd,
  getStationObservationsJsonLd,
} from "@vavassor/nws-client";
import { FC, useMemo, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Link as RouterLink } from "react-router-dom";
import {
  format,
  formatWindSpeedAndDirection,
  getUnitPrintSymbol,
} from "../Common/FormattingUtilities";

enum SystemOfMeasurement {
  Metric,
  UsCustomary,
}

interface RecentObservationsSectionProps {
  stationId: string | undefined;
}

export const RecentObservationsSection: FC<RecentObservationsSectionProps> = ({
  stationId,
}) => {
  const { data: observations, isLoading } = useQuery(
    ["observations", stationId],
    () => getStationObservationsJsonLd({ stationId: stationId! }),
    { enabled: !!stationId }
  );
  const { data: station } = useQuery(
    ["stations", stationId],
    () => getStationJsonLd({ stationId: stationId! }),
    { enabled: !!stationId }
  );
  const { i18n, t } = useTranslation("station");
  const [systemOfMeasurement, setSystemOfMeasurement] = useState(
    SystemOfMeasurement.UsCustomary
  );

  const units = useMemo(() => {
    return systemOfMeasurement === SystemOfMeasurement.UsCustomary
      ? {
          barometricPressure: "[in_i'Hg]",
          precipitation: "[in_i]",
          temperature: "[degF]",
          visibility: "[mi_i]",
          windSpeed: "[mi_i]/h",
        }
      : {
          barometricPressure: "cm[Hg]",
          precipitation: "cm",
          temperature: "Cel",
          visibility: "km",
          windSpeed: "km/h",
        };
  }, [systemOfMeasurement]);

  const symbols = useMemo(() => {
    return {
      barometricPressure: getUnitPrintSymbol(units.barometricPressure),
      precipitation: getUnitPrintSymbol(units.precipitation),
      temperature: getUnitPrintSymbol(units.temperature),
      visibility: getUnitPrintSymbol(units.visibility),
      windSpeed: getUnitPrintSymbol(units.windSpeed),
    };
  }, [units]);

  const formattedObservations = useMemo(() => {
    if (!observations) {
      return undefined;
    }

    return observations["@graph"].map((observation) => {
      return {
        barometricPressure: format(
          observation.barometricPressure,
          units.barometricPressure
        ).formattedValue,
        description: observation.textDescription,
        dewPoint: format(observation.dewpoint, units.temperature)
          .formattedValue,
        heatIndex: format(observation.heatIndex, units.temperature)
          .formattedValue,
        maxTemperatureLast24Hours: format(
          observation.maxTemperatureLast24Hours,
          units.temperature
        ).formattedValue,
        minTemperatureLast24Hours: format(
          observation.minTemperatureLast24Hours,
          units.temperature
        ).formattedValue,
        precipitationLastHour: format(
          observation.precipitationLastHour,
          units.precipitation
        ).formattedValue,
        precipitationLast3Hours: format(
          observation.precipitationLast3Hours,
          units.precipitation
        ).formattedValue,
        precipitationLast6Hours: format(
          observation.precipitationLast6Hours,
          units.precipitation
        ).formattedValue,
        relativeHumidity: format(
          observation.relativeHumidity,
          units.temperature
        ).formattedValue,
        seaLevelPressure: format(observation.relativeHumidity, "mbar")
          .formattedValue,
        skyCondition: observation.presentWeather,
        temperature: format(observation.temperature, units.temperature)
          .formattedValue,
        timestamp: observation.timestamp,
        visibility: format(observation.visibility, units.visibility, {
          precision: 2,
        }).formattedValue,
        wind: formatWindSpeedAndDirection(
          observation.windSpeed,
          observation.windDirection,
          units.windSpeed
        ),
        windChill: format(observation.windChill, units.temperature)
          .formattedValue,
      };
    });
  }, [observations, units]);

  return (
    <Box as="section" pt={4}>
      <Box>
        <Heading as="h2" px={8} size="lg">
          {t("recentObservationsSection.heading")}
        </Heading>
        <Link
          as={RouterLink}
          px={8}
          to={`/stations/${station?.stationIdentifier}`}
        >
          {t("recentObservationsSection.stationLink", {
            stationName: station?.name,
          })}
        </Link>
      </Box>
      {!!formattedObservations && formattedObservations.length > 0 ? (
        <TableContainer>
          <Table variant="striped">
            <Thead>
              <Tr>
                <Th rowSpan={2}>
                  {t("recentObservationsSection.timeTableHeader")}
                </Th>
                <Th rowSpan={2}>
                  <Trans
                    i18nKey="recentObservationsSection.windTableHeader"
                    t={t}
                  >
                    Wind (
                    <Text as="span" textTransform="none">
                      {{ unit: symbols.windSpeed } as any}
                    </Text>
                    )
                  </Trans>
                </Th>
                <Th rowSpan={2}>
                  <Trans
                    i18nKey="recentObservationsSection.visibilityTableHeader"
                    t={t}
                  >
                    Visibility (
                    <Text as="span" textTransform="none">
                      {{ unit: symbols.visibility } as any}
                    </Text>
                    )
                  </Trans>
                </Th>
                <Th rowSpan={2}>
                  {t("recentObservationsSection.forecastTableHeader")}
                </Th>
                <Th colSpan={4}>
                  {t("recentObservationsSection.temperatureTableHeader", {
                    unit: symbols.temperature,
                  })}
                </Th>
                <Th rowSpan={2}>
                  {t("recentObservationsSection.relativeHumidityTableHeader", {
                    unit: "%",
                  })}
                </Th>
                <Th rowSpan={2}>
                  {t("recentObservationsSection.windChillTableHeader", {
                    unit: symbols.temperature,
                  })}
                </Th>
                <Th rowSpan={2}>
                  {t("recentObservationsSection.heatIndexTableHeader", {
                    unit: symbols.temperature,
                  })}
                </Th>
                <Th colSpan={2}>
                  {t("recentObservationsSection.pressureTableHeader")}
                </Th>
                <Th colSpan={3}>
                  <Trans
                    i18nKey="recentObservationsSection.precipitationTableHeader"
                    t={t}
                  >
                    Precipitation (
                    <Text as="span" textTransform="none">
                      {{ unit: symbols.precipitation } as any}
                    </Text>
                    )
                  </Trans>
                </Th>
              </Tr>
              <Tr>
                <Th>
                  {t("recentObservationsSection.airTemperatureTableHeader")}
                </Th>
                <Th>
                  {t(
                    "recentObservationsSection.dewPointTemperatureTableHeader"
                  )}
                </Th>
                <Th>
                  {t(
                    "recentObservationsSection.minTemperatureLast24HoursTableHeader"
                  )}
                </Th>
                <Th>
                  {t(
                    "recentObservationsSection.maxTemperatureLast24HoursTableHeader"
                  )}
                </Th>
                <Th>
                  <Trans
                    i18nKey="recentObservationsSection.barometricPressureTableHeader"
                    t={t}
                  >
                    Barometric (
                    <Text as="span" textTransform="none">
                      {{ unit: symbols.barometricPressure } as any}
                    </Text>
                    )
                  </Trans>
                </Th>
                <Th>
                  <Trans
                    i18nKey="recentObservationsSection.seaLevelPressureTableHeader"
                    t={t}
                  >
                    Sea level (
                    <Text as="span" textTransform="none">
                      {{ unit: "mbar" } as any}
                    </Text>
                    )
                  </Trans>
                </Th>
                <Th>1 hr</Th>
                <Th>3 hr</Th>
                <Th>6 hr</Th>
              </Tr>
            </Thead>
            <Tbody>
              {formattedObservations.map((observation) => (
                <Tr key={observation.timestamp}>
                  <Td>
                    {new Intl.DateTimeFormat(i18n.language, {
                      day: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                    }).format(new Date(observation.timestamp))}
                  </Td>
                  <Td>{observation.wind}</Td>
                  <Td isNumeric>{observation.visibility}</Td>
                  <Td>{observation.description}</Td>
                  <Td isNumeric>{observation.temperature}</Td>
                  <Td isNumeric>{observation.dewPoint}</Td>
                  <Td isNumeric>{observation.minTemperatureLast24Hours}</Td>
                  <Td isNumeric>{observation.maxTemperatureLast24Hours}</Td>
                  <Td isNumeric>{observation.relativeHumidity}</Td>
                  <Td isNumeric>{observation.windChill}</Td>
                  <Td isNumeric>{observation.heatIndex}</Td>
                  <Td isNumeric>{observation.barometricPressure}</Td>
                  <Td isNumeric>{observation.seaLevelPressure}</Td>
                  <Td isNumeric>{observation.precipitationLastHour}</Td>
                  <Td isNumeric>{observation.precipitationLast3Hours}</Td>
                  <Td isNumeric>{observation.precipitationLast6Hours}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      ) : isLoading ? (
        <Stack gap={8} padding={8}>
          <Skeleton height="30px" />
          <Skeleton height="20px" />
          <Skeleton height="20px" />
          <Skeleton height="20px" />
          <Skeleton height="20px" />
          <Skeleton height="20px" />
        </Stack>
      ) : (
        <Text px={8}>{t("recentObservationsSection.noResultsMessage")}</Text>
      )}
    </Box>
  );
};
