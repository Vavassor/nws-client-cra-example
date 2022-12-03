import { Gridpoint } from "@vavassor/nws-client";
import {
  classifyWeather,
  SkyCondition,
  WindSpeedDescription,
} from "./WeatherClassification";

export enum WeatherIconType {
  ClearDaytime,
  ClearNighttime,
  CloudyDaytime,
  CloudyNighttime,
  Fog,
  FreezingRain,
  HazeDaytime,
  HazeNighttime,
  Ice,
  MostlyClearDaytime,
  MostlyClearNighttime,
  MostlyCloudyDaytime,
  MostlyCloudyNighttime,
  MostlyCloudyWithRainDaytime,
  MostlyCloudyWithRainNighttime,
  PartlyCloudyDaytime,
  PartlyCloudyNighttime,
  Rain,
  Sleet,
  Snow,
  Thunderstorms,
  Windy,
}

export interface WeatherIcon {
  type: WeatherIconType;
}

export const getEmojiByWeatherIconType = (type: WeatherIconType) => {
  switch (type) {
    case WeatherIconType.ClearDaytime:
    case WeatherIconType.Windy:
      return "☀️";
    case WeatherIconType.ClearNighttime:
      return "🌙";
    case WeatherIconType.CloudyDaytime:
    case WeatherIconType.CloudyNighttime:
      return "☁️";
    case WeatherIconType.Fog:
    case WeatherIconType.HazeDaytime:
    case WeatherIconType.HazeNighttime:
      return "🌫️";
    case WeatherIconType.Ice:
      return "❄️";
    case WeatherIconType.PartlyCloudyDaytime:
    case WeatherIconType.PartlyCloudyNighttime:
      return "⛅";
    case WeatherIconType.MostlyClearDaytime:
    case WeatherIconType.MostlyClearNighttime:
      return "🌤️";
    case WeatherIconType.MostlyCloudyDaytime:
    case WeatherIconType.MostlyCloudyNighttime:
      return "🌥️";
    case WeatherIconType.FreezingRain:
    case WeatherIconType.Sleet:
    case WeatherIconType.Rain:
      return "🌧️";
    case WeatherIconType.MostlyCloudyWithRainDaytime:
    case WeatherIconType.MostlyCloudyWithRainNighttime:
      return "🌦️";
    case WeatherIconType.Snow:
      return "🌨️";
    case WeatherIconType.Thunderstorms:
      return "⛈️";
  }
};

export const getWeatherIcon = (
  gridpoint: Gridpoint,
  date: Date
): WeatherIcon => {
  const weatherClass = classifyWeather(gridpoint, date);

  if (weatherClass.predominantWeather) {
    switch (weatherClass.predominantWeather.weather) {
      case "fog":
      case "freezing_fog":
      case "ice_crystals":
      case "ice_fog":
        return { type: WeatherIconType.Fog };
      case "freezing_drizzle":
      case "freezing_rain":
        return { type: WeatherIconType.FreezingRain };
      case "frost":
      case "freezing_spray":
        return { type: WeatherIconType.Ice };
      case "blowing_dust":
      case "blowing_sand":
      case "haze":
      case "smoke":
      case "volcanic_ash":
        return weatherClass.isNight
          ? { type: WeatherIconType.HazeNighttime }
          : { type: WeatherIconType.HazeDaytime };
      case "drizzle":
      case "rain":
      case "rain_showers":
        return { type: WeatherIconType.Rain };
      case "thunderstorms":
        return { type: WeatherIconType.Thunderstorms };
      case "hail":
      case "sleet":
        return { type: WeatherIconType.Sleet };
      case "blowing_snow":
      case "snow":
      case "snow_showers":
        return { type: WeatherIconType.Snow };
    }
  }

  switch (weatherClass.windSpeedDescription) {
    case WindSpeedDescription.None:
      switch (weatherClass.skyCondition) {
        case SkyCondition.Clear:
          return weatherClass.isNight
            ? { type: WeatherIconType.ClearNighttime }
            : { type: WeatherIconType.ClearDaytime };
        case SkyCondition.Cloudy:
          return weatherClass.isNight
            ? { type: WeatherIconType.CloudyNighttime }
            : { type: WeatherIconType.CloudyDaytime };
        case SkyCondition.MostlyClear:
          return weatherClass.isNight
            ? { type: WeatherIconType.MostlyClearNighttime }
            : { type: WeatherIconType.MostlyClearDaytime };
        case SkyCondition.MostlyCloudy:
          return weatherClass.isNight
            ? { type: WeatherIconType.MostlyCloudyNighttime }
            : { type: WeatherIconType.MostlyCloudyDaytime };
        case SkyCondition.PartlyCloudy:
          return weatherClass.isNight
            ? { type: WeatherIconType.CloudyNighttime }
            : { type: WeatherIconType.CloudyDaytime };
      }
      break;
    default:
      return { type: WeatherIconType.Windy };
  }
};
