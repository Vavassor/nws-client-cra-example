import { parseDuration, parseInterval } from "./DateIntervalUtilities";

describe("DateIntervalUtilities", () => {
  describe("parseDuration", () => {
    test("returns null when given an invalid duration", () => {
      expect(parseDuration("")).toBeNull();
      expect(parseDuration("P")).toBeNull();
      expect(parseDuration("PT")).toBeNull();
      expect(parseDuration("T")).toBeNull();
    });

    test("returns a valid duration", () => {
      expect(parseDuration("P3Y6M4DT12H30M5S")).toStrictEqual({
        days: 4,
        hours: 12,
        minutes: 30,
        months: 6,
        seconds: 5,
        weeks: 0,
        years: 3,
      });
    });

    test("allows reduced precision durations", () => {
      expect(parseDuration("P4Y")).toStrictEqual({
        days: 0,
        hours: 0,
        minutes: 0,
        months: 0,
        seconds: 0,
        weeks: 0,
        years: 4,
      });
      expect(parseDuration("P23DT23H")).toStrictEqual({
        days: 23,
        hours: 23,
        minutes: 0,
        months: 0,
        seconds: 0,
        weeks: 0,
        years: 0,
      });
    });

    test("returns minutes only", () => {
      expect(parseDuration("PT1M")).toStrictEqual({
        days: 0,
        hours: 0,
        minutes: 1,
        months: 0,
        seconds: 0,
        weeks: 0,
        years: 0,
      });
    });

    test("returns months only", () => {
      expect(parseDuration("P1M")).toStrictEqual({
        days: 0,
        hours: 0,
        minutes: 0,
        months: 1,
        seconds: 0,
        weeks: 0,
        years: 0,
      });
    });

    test("returns weeks only", () => {
      expect(parseDuration("P20W")).toStrictEqual({
        days: 0,
        hours: 0,
        minutes: 0,
        months: 0,
        seconds: 0,
        weeks: 20,
        years: 0,
      });
    });

    test("returns zero durations", () => {
      const zeroDuration = {
        days: 0,
        hours: 0,
        minutes: 0,
        months: 0,
        seconds: 0,
        weeks: 0,
        years: 0,
      };
      expect(parseDuration("PT0S")).toStrictEqual(zeroDuration);
      expect(parseDuration("P0D")).toStrictEqual(zeroDuration);
    });
  });

  describe("parseInterval", () => {
    test("returns an interval for a start and end date", () => {
      expect(
        parseInterval("2007-03-01T13:00:00Z/2008-05-11T15:30:00Z")
      ).toStrictEqual({
        endTime: "2008-05-11T15:30:00Z",
        startTime: "2007-03-01T13:00:00Z",
      });
    });

    test("returns an interval for a start date and duration", () => {
      expect(
        parseInterval("2007-03-01T13:00:00Z/P1Y2M10DT2H30M")
      ).toStrictEqual({
        endTime: "2008-05-11T15:30:00.000Z",
        startTime: "2007-03-01T13:00:00Z",
      });
    });

    test("returns an interval for a duration and end date", () => {
      expect(
        parseInterval("P1Y2M10DT2H30M/2008-05-11T15:30:00Z")
      ).toStrictEqual({
        endTime: "2008-05-11T15:30:00Z",
        startTime: "2007-03-01T13:00:00.000Z",
      });
    });
  });
});
