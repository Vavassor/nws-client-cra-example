import {
  getQuantitativeValue,
  getUcumCode,
  Gridpoint,
  GridpointQuantitativeValueLayer,
  GridpointWeatherValue,
  GridpointWeatherValueValue,
} from "@vavassor/nws-client";
import {
  getIsInInterval,
  parseInterval,
} from "../Common/DateIntervalUtilities";
import { format } from "../Common/FormattingUtilities";

export enum SkyCondition {
  Clear,
  Cloudy,
  MostlyClear,
  MostlyCloudy,
  PartlyCloudy,
}

export enum TimePeriod {
  Afternoon,
  Evening,
  Morning,
  Overnight,
}

export enum WindSpeedDescription {
  Breezy,
  Light,
  None,
  Strong,
  VeryWindy,
  Windy,
}

export interface WeatherClass {
  isNight: boolean;
  predominantWeather?: GridpointWeatherValueValue;
  skyCondition: SkyCondition;
  timePeriod: TimePeriod;
  windSpeedDescription: WindSpeedDescription;
}

export const classifyWeather = (gridpoint: Gridpoint, date: Date) => {
  const weatherClass: WeatherClass = {
    isNight: getIsNight(date),
    skyCondition: SkyCondition.Clear,
    timePeriod: getTimePeriod(date),
    windSpeedDescription: WindSpeedDescription.None,
  };

  const skyCover = findValue(gridpoint.skyCover, date);
  if (skyCover?.value) {
    weatherClass.skyCondition = getSkyCondition(skyCover.value);
  }

  const windSpeed = findValue(gridpoint.windSpeed, date);
  if (windSpeed?.value && gridpoint.windSpeed?.uom) {
    const unitCode = getUcumCode(gridpoint.windSpeed.uom);
    if (unitCode) {
      const value = getQuantitativeValue(windSpeed.value, unitCode);
      const mph = format(value, "[mi_i]/h").value;
      if (mph) {
        weatherClass.windSpeedDescription = getWindSpeedDescription(mph);
      }
    }
  }

  const weather = findWeatherValue(gridpoint, date);
  if (weather?.value && weather.value.length > 0) {
    const sortedValues = weather.value
      .slice(0)
      .sort(
        (a, b) =>
          getPredominantWeatherWeight(a) - getPredominantWeatherWeight(b)
      );
    weatherClass.predominantWeather = sortedValues[0];
  }

  return weatherClass;
};

/**
 * Find the value for the given time in a quantitative value layer.
 */
export const findValue = (
  layer: GridpointQuantitativeValueLayer | undefined,
  date: Date
) => {
  if (!layer) {
    return undefined;
  }

  const value = layer.values.find((value) => {
    const interval = parseInterval(value.validTime);
    return getIsInInterval(date, interval);
  });

  return value;
};

/**
 * Find a weather value for the given time.
 */
export const findWeatherValue = (gridpoint: Gridpoint, date: Date) => {
  const weatherValues = gridpoint.weather.values as GridpointWeatherValue[];

  const value = weatherValues.find((value) => {
    const interval = parseInterval(value.validTime);
    return getIsInInterval(date, interval);
  });

  return value;
};

const getIsNight = (time: Date) => {
  const hour = time.getHours();
  return hour < 6 || hour >= 18;
};

/**
 * The percentage cutoffs are chosen as per the weather.gov forecast terms.
 *
 * @see {@link https://www.weather.gov/bgm/forecast_terms | Forecast Terms}
 */
const getSkyCondition = (skyCover: number): SkyCondition => {
  if (skyCover >= 87.5) {
    return SkyCondition.Cloudy;
  } else if (skyCover >= 62.5) {
    return SkyCondition.MostlyCloudy;
  } else if (skyCover >= 37.5) {
    return SkyCondition.PartlyCloudy;
  } else if (skyCover >= 12.5) {
    return SkyCondition.MostlyClear;
  } else {
    return SkyCondition.Clear;
  }
};

const getTimePeriod = (time: Date) => {
  const hour = time.getHours();
  if (hour >= 18) {
    return TimePeriod.Evening;
  } else if (hour >= 12) {
    return TimePeriod.Afternoon;
  } else if (hour >= 6) {
    return TimePeriod.Morning;
  } else {
    return TimePeriod.Overnight;
  }
};

/**
 * The mile per hour cutoffs are chosen as per the weather.gov forecast terms.
 *
 * @see {@link https://www.weather.gov/bgm/forecast_terms | Forecast Terms}
 */
const getWindSpeedDescription = (windSpeedMph: number) => {
  if (windSpeedMph >= 40) {
    return WindSpeedDescription.Strong;
  } else if (windSpeedMph >= 30) {
    return WindSpeedDescription.VeryWindy;
  } else if (windSpeedMph >= 20) {
    return WindSpeedDescription.Windy;
  } else if (windSpeedMph >= 15) {
    return WindSpeedDescription.Breezy;
  } else if (windSpeedMph >= 5) {
    return WindSpeedDescription.Light;
  } else {
    return WindSpeedDescription.None;
  }
};

/**
 * Returns a weight to use for comparing which weather conditions are most
 * predominant.
 * 
 * When a grid has multiple simultaneous weather conditions, like fog, rain,
 * and sleet, this can be used to determine which is most important to express
 * in a summary or icon.
 */
const getPredominantWeatherWeight = (value: GridpointWeatherValueValue) => {
  return (
    getAttributeWeight(value) *
    getIntensityWeight(value) *
    getWeatherTypeWeight(value)
  );
};

const getAttributeWeight = (value: GridpointWeatherValueValue) => {
  // All below weights are arbitrary. They're roughly based on percent
  // probability or coverage amount.
  switch (value.coverage) {
    case "brief":
    case "few":
    case "isolated":
      return 0.1;
    case "patchy":
    case "slight_chance":
      return 0.2;
    case "chance":
    case "intermittent":
    case "scattered":
      return 0.3;
    case "frequent":
    case "likely":
    case "numerous":
      return 0.6;
    case "areas":
    case "widespread":
      return 0.5;
    case "definite":
    case "occasional":
    case "periods":
      return 0.8;
    default:
      return 1;
  }
};

const getIntensityWeight = (value: GridpointWeatherValueValue) => {
  switch (value.intensity) {
    case "heavy":
      return 1;
    case "light":
      return 0.5;
    default:
    case "moderate":
      return 0.75;
    case "very_light":
      return 0.25;
  }
};

const getWeatherTypeWeight = (value: GridpointWeatherValueValue) => {
  // All below weights are arbitrary. Obscurations are generally weighted lower
  // than precipitation.
  switch (value.weather) {
    case "blowing_dust":
    case "blowing_sand":
    case "fog":
    case "freezing_fog":
    case "haze":
    case "ice_crystals":
    case "ice_fog":
    case "smoke":
    case "volcanic_ash":
      return 0.25;
    case "blowing_snow":
    case "drizzle":
    case "freezing_drizzle":
    case "freezing_spray":
    case "frost":
    case "water_spouts":
      return 0.5;
    case "freezing_rain":
    case "rain":
    case "rain_showers":
      return 0.75;
    case "hail":
    case "sleet":
    case "snow":
    case "snow_showers":
      return 0.85;
    case "thunderstorms":
    default:
      return 1;
  }
};
