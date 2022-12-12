import { UcumLhcUtils } from "@lhncbc/ucum-lhc";
import { getUcumCode, QuantitativeValue } from "@vavassor/nws-client";

const utils = UcumLhcUtils.getInstance();

export interface ConversionResult {
  unitPrintSymbol: string;
  value: number;
}

export const convertToUnit = (
  value: QuantitativeValue | undefined,
  toUnitCode: string
) => {
  if (!value) {
    return undefined;
  }

  const ucumCode = getUcumCode(value.unitCode);
  if (ucumCode && value.value !== null) {
    const convertedValue = utils.convertUnitTo(
      ucumCode,
      value.value,
      toUnitCode
    );

    if (convertedValue.toVal) {
      const result: ConversionResult = {
        unitPrintSymbol: convertedValue.toUnit.getProperty(
          "printSymbol"
        ) as string,
        value: convertedValue.toVal,
      };

      return result;
    }
  }

  return undefined;
};
