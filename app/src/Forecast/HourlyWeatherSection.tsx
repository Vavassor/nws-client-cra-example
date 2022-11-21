import {
  Box,
  Heading,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import {
  getGridpointForecastHourlyGeoJson,
  getQuantitativeValue,
} from "@vavassor/nws-client";
import { FC, Fragment, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { groupBy } from "../Common/ArrayUtilities";
import { usePoint } from "./usePoint";

interface Day {
  name: string;
  periods: Period[];
}

interface Period {
  condition: string;
  startTime: string;
  temperature: string;
  wind: string;
}

const useHourlyForecast = () => {
  const { city, point, state } = usePoint();
  const { data: forecast } = useQuery(
    ["gridpointForecastHourly", point],
    () =>
      getGridpointForecastHourlyGeoJson({
        forecastOfficeId: point!.properties.gridId,
        gridX: point!.properties.gridX,
        gridY: point!.properties.gridY,
      }),
    { enabled: !!point }
  );
  const { i18n } = useTranslation();

  const days = useMemo(() => {
    if (!forecast) {
      return undefined;
    }

    const dayFormat = new Intl.DateTimeFormat(i18n.language, {
      weekday: "long",
    });

    const allPeriods = forecast.properties.periods.map((period) => {
      const temperatureValue = getQuantitativeValue(
        period.temperature,
        "[degF]"
      ).value;
      const temperature = temperatureValue ? temperatureValue.toString() : "--";
      const windSpeedValue = getQuantitativeValue(
        period.windSpeed,
        "[mi_i]/h"
      ).value;
      const wind = windSpeedValue ? windSpeedValue.toString() : "--";
      const hourPeriod: Period = {
        condition: period.shortForecast,
        startTime: period.startTime,
        temperature,
        wind,
      };
      return hourPeriod;
    });

    const result: Day[] = Object.entries(
      groupBy(allPeriods, (period) =>
        dayFormat.format(new Date(period.startTime))
      )
    ).map(([key, value]) => ({
      name: key,
      periods: value,
    }));

    return result;
  }, [forecast, i18n]);

  return { city, days, state };
};

export const HourlyWeatherSection: FC = () => {
  const { city, days, state } = useHourlyForecast();
  const { i18n, t } = useTranslation("forecast");

  return (
    <Box as="section" borderRadius="lg" borderWidth="1px" py={4}>
      {days && (
        <>
          <Heading as="h1" px={8} size="lg">
            {t("hourlyWeatherSection.heading", { city, state })}
          </Heading>
          <TableContainer>
            <Table variant="simple">
              <Thead className="visually-hidden">
                <Tr>
                  <Th id="time">{t("hourlyWeatherSection.timeTableHeader")}</Th>
                  <Th id="temperature">
                    {t("hourlyWeatherSection.temperatureTableHeader")}
                  </Th>
                  <Th id="condition">
                    {t("hourlyWeatherSection.shortForecastTableHeader")}
                  </Th>
                  <Th id="wind">{t("hourlyWeatherSection.windTableHeader")}</Th>
                </Tr>
              </Thead>
              <Tbody>
                {days.slice(0, 4).map((day, index) => {
                  const dayId = `day-${index}`;
                  return (
                    <Fragment key={day.name}>
                      <Tr>
                        <Th colSpan={4} id={dayId} scope="colgroup">
                          {day.name}
                        </Th>
                      </Tr>
                      {day.periods.map((period) => (
                        <Tr key={period.startTime}>
                          <Td headers={`${dayId} time`}>
                            {new Intl.DateTimeFormat(i18n.language, {
                              timeStyle: "short",
                            }).format(new Date(period.startTime))}
                          </Td>
                          <Td headers={`${dayId} temperature`}>
                            {period.temperature} °F
                          </Td>
                          <Td headers={`${dayId} condition`}>
                            {period.condition}
                          </Td>
                          <Td headers={`${dayId} wind`}>{period.wind} mph</Td>
                        </Tr>
                      ))}
                    </Fragment>
                  );
                })}
              </Tbody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  );
};
