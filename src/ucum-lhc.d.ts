declare module "@lhncbc/ucum-lhc" {
  interface Hash {
    fromUnit: Unit;
    msg: string[];
    status: "error" | "failed" | "succeeded";
    toUnit: Unit;
    toVal: number | null;
  }

  interface SpecifiedUnitHash {
    origString: string;
    retMsg: string[];
    unit: Unit;
  }

  export class UcumLhcUtils {
    static getInstance(): UcumLhcUtils;

    convertUnitTo(
      fromUnitCode: string,
      fromVal: number,
      toUnitCode: string,
      suggest?: boolean,
      molecularWeight?: number | null
    ): Hash;

    getSpecifiedUnit(
      uName: string,
      valConv: "convert" | "validate",
      suggest?: boolean
    ): SpecifiedUnitHash;
  }

  class Unit {
    getProperty(propertyName: string): boolean | null | number | string;
  }
}
