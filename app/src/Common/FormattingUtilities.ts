import { UcumLhcUtils } from "@lhncbc/ucum-lhc";
import { QuantitativeValue } from "@vavassor/nws-client";
import { convertToUnit } from "./ConversionUtilities";

const utils = UcumLhcUtils.getInstance();

interface FormatOptions {
  precision?: number;
  noQuantityPlaceholder?: string;
}

export const format = (
  value: QuantitativeValue | undefined,
  toUnitCode: string,
  options?: FormatOptions
) => {
  const precision = options?.precision ?? 0;
  const noQuantityPlaceholder = options?.noQuantityPlaceholder ?? "--";

  const convertedValue = convertToUnit(value, toUnitCode);
  if (convertedValue) {
    const formattedValue = convertedValue.value.toFixed(precision);
    const formattedUnit = convertedValue.unitPrintSymbol;
    return {
      formattedText: `${formattedValue} ${formattedUnit}`,
      formattedValue,
      value: convertedValue.value,
    };
  }

  return {
    formattedText: noQuantityPlaceholder,
    formattedValue: noQuantityPlaceholder,
    value: undefined,
  };
};

export const formatWindSpeedAndDirection = (
  speed: QuantitativeValue,
  direction: QuantitativeValue,
  speedUnitCode: string
) => {
  const formattedDirection = get8WindCompassAbbreviation(
    format(direction, "deg").value
  );
  const formattedSpeed = format(speed, speedUnitCode).formattedValue;
  return formattedDirection
    ? `${formattedDirection} ${formattedSpeed}`
    : formattedSpeed;
};

export const get8WindCompassAbbreviation = (degrees: number | undefined) => {
  if (!degrees) {
    return undefined;
  }
  const index = Math.floor(degrees / 45) % 8;
  const abbreviations = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return abbreviations[index];
};

export const getUnitPrintSymbol = (unitCode: string) => {
  const unit = utils.getSpecifiedUnit(unitCode, "validate");
  return unit.unit.getProperty("printSymbol");
};
