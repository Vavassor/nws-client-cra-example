import { Box, Heading } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import {
  getGridpointGeoJson,
  getQuantitativeValue,
  GridpointQuantitativeValueLayer,
} from "@vavassor/nws-client";
import { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  format,
  get8WindCompassAbbreviation,
} from "../Common/FormattingUtilities";
import { usePoint } from "./usePoint";

export const TodaysConditionsSection: FC = () => {
  const { city, point, state } = usePoint();
  const { data: gridpoint } = useQuery(
    ["gridpoint", point],
    () =>
      getGridpointGeoJson({
        forecastOfficeId: point!.properties.gridId,
        gridX: point!.properties.gridX.toString(),
        gridY: point!.properties.gridY.toString(),
      }),
    { enabled: !!point }
  );
  const { t } = useTranslation("forecast");

  const formattedGridpoint = useMemo(() => {
    if (!gridpoint) {
      return undefined;
    }

    const getQuantitativeValueFromLayer = (
      layer: GridpointQuantitativeValueLayer | undefined
    ) => {
      const currentValue = layer?.values[0];
      return currentValue && currentValue.value !== null && layer?.uom
        ? getQuantitativeValue(currentValue.value, layer?.uom)
        : undefined;
    };

    const dewPoint = format(
      getQuantitativeValueFromLayer(gridpoint.properties.dewpoint),
      "[degF]"
    ).formattedText;

    const maxTemperature = format(
      getQuantitativeValueFromLayer(gridpoint.properties.maxTemperature),
      "[degF]"
    ).formattedText;
    const minTemperature = format(
      getQuantitativeValueFromLayer(gridpoint.properties.minTemperature),
      "[degF]"
    ).formattedText;

    const pressure = format(
      getQuantitativeValueFromLayer(gridpoint.properties.pressure),
      "[in_i'Hg]"
    ).formattedText;

    const relativeHumidity = format(
      getQuantitativeValueFromLayer(gridpoint.properties.relativeHumidity),
      "%"
    ).formattedText;

    const windSpeedMph = format(
      getQuantitativeValueFromLayer(gridpoint.properties.windSpeed),
      "[mi_i]/h"
    );
    const windSpeed = windSpeedMph.value
      ? `${windSpeedMph.formattedValue} mph`
      : windSpeedMph.formattedText;

    const windDirection = get8WindCompassAbbreviation(
      format(
        getQuantitativeValueFromLayer(gridpoint.properties.windDirection),
        "deg"
      ).value
    );

    const visibility = format(
      getQuantitativeValueFromLayer(gridpoint.properties.visibility),
      "[mi_i]"
    ).formattedText;

    return {
      dewPoint,
      maxTemperature,
      minTemperature,
      pressure,
      relativeHumidity,
      visibility,
      windDirection,
      windSpeed,
    };
  }, [gridpoint]);

  return (
    <Box as="section" borderRadius="lg" borderWidth="1px" px={8} py={4}>
      <Heading as="h2" size="lg">
        {t("todaysConditionsCard.heading", { city, state })}
      </Heading>
      <p>
        {t("todaysConditionsCard.lowAndHighTemperature", {
          min: formattedGridpoint?.minTemperature,
          max: formattedGridpoint?.maxTemperature,
        })}
      </p>
      <p>
        {t("todaysConditionsCard.pressure", {
          pressure: formattedGridpoint?.pressure,
        })}
      </p>
      <p>
        {t("todaysConditionsCard.humidity", {
          humidity: formattedGridpoint?.relativeHumidity,
        })}
      </p>
      <p>
        {t("todaysConditionsCard.dewPoint", {
          dewPoint: formattedGridpoint?.dewPoint,
        })}
      </p>
      <p>
        {t("todaysConditionsCard.wind", {
          direction: formattedGridpoint?.windDirection,
          speed: formattedGridpoint?.windSpeed,
        })}
      </p>
      <p>
        {t("todaysConditionsCard.visibility", {
          visibility: formattedGridpoint?.visibility,
        })}
      </p>
    </Box>
  );
};
