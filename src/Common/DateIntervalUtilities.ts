export interface DateInterval {
  endTime: string;
  startTime: string;
}

export interface Duration {
  days: number;
  hours: number;
  minutes: number;
  months: number;
  seconds: number;
  weeks: number;
  years: number;
}

type Designator = "D" | "H" | "M" | "S" | "T" | "W" | "Y";

class DurationParser {
  private duration: Duration = {
    days: 0,
    hours: 0,
    minutes: 0,
    months: 0,
    seconds: 0,
    weeks: 0,
    years: 0,
  };
  private hasFoundOneValue = false;
  private value: string;
  private valueIndex: number;

  constructor(value: string, valueIndex: number) {
    this.value = value;
    this.valueIndex = valueIndex;
  }

  parse() {
    const designatorIndex = findNextDesignator(this.value, this.valueIndex);
    if (designatorIndex === -1) {
      return null;
    }

    const designator = this.value[designatorIndex] as Designator;

    switch (designator) {
      case "W":
        this.duration.weeks = this.getValue();
        return this.duration;
      case "T":
        this.valueIndex = designatorIndex + 1;
        return this.parseTime();
      default:
        return this.parsePeriod();
    }
  }

  private getValue() {
    this.hasFoundOneValue = true;
    return parseFloat(this.value.slice(this.valueIndex));
  }

  private parsePeriod() {
    while (true) {
      const designatorIndex = findNextDesignator(this.value, this.valueIndex);
      if (designatorIndex === -1) {
        return this.hasFoundOneValue ? this.duration : null;
      }

      const designator = this.value[designatorIndex] as Designator;
      switch (designator) {
        case "T":
          this.valueIndex = designatorIndex + 1;
          return this.parseTime();
        case "D":
          this.duration.days = this.getValue();
          break;
        case "M":
          this.duration.months = this.getValue();
          break;
        case "Y":
          this.duration.years = this.getValue();
          break;
        default:
          return null;
      }

      this.valueIndex = designatorIndex + 1;
    }
  }

  private parseTime() {
    while (true) {
      const designatorIndex = findNextDesignator(this.value, this.valueIndex);
      if (designatorIndex === -1) {
        return this.hasFoundOneValue ? this.duration : null;
      }

      const designator = this.value[designatorIndex] as Designator;
      switch (designator) {
        case "H":
          this.duration.hours = this.getValue();
          break;
        case "M":
          this.duration.minutes = this.getValue();
          break;
        case "S":
          this.duration.seconds = this.getValue();
          break;
        default:
          return null;
      }

      this.valueIndex = designatorIndex + 1;
    }
  }
}

export const getIsInInterval = (date: Date, interval: DateInterval) => {
  const startTime = new Date(interval.startTime);
  const endTime = new Date(interval.endTime);
  return (
    startTime.getTime() <= date.getTime() && date.getTime() <= endTime.getTime()
  );
};

/**
 * @see {@link https://en.wikipedia.org/wiki/ISO_8601#Durations | ISO 8601 Durations}
 */
export const parseDuration = (iso8601Duration: string) => {
  if (!iso8601Duration.startsWith("P")) {
    return null;
  }
  return new DurationParser(iso8601Duration, 1).parse();
};

/**
 * @see {@link https://en.wikipedia.org/wiki/ISO_8601#Time_intervals | ISO 8601 Time intervals}
 */
export const parseInterval = (iso8601Interval: string) => {
  const parts = iso8601Interval.split("/");

  // The interval could be a duration and an end time.
  const durationBefore = parseDuration(parts[0]);
  if (durationBefore) {
    const endTime = parts[1];
    const startTime = new Date(endTime);
    subtractDuration(startTime, durationBefore);
    const interval: DateInterval = {
      startTime: startTime.toISOString(),
      endTime,
    };
    return interval;
  }

  // The interval could be a start time and a duration.
  const durationAfter = parseDuration(parts[1]);
  if (durationAfter) {
    const startTime = parts[0];
    const endTime = new Date(startTime);
    addDuration(endTime, durationAfter);
    const interval: DateInterval = {
      startTime,
      endTime: endTime.toISOString(),
    };
    return interval;
  }

  // The interval must be a start and end time.
  const interval: DateInterval = {
    startTime: parts[0],
    endTime: parts[1],
  };

  return interval;
};

const addDuration = (date: Date, duration: Duration) => {
  date.setUTCHours(
    date.getUTCHours() + duration.hours,
    date.getUTCMinutes() + duration.minutes,
    date.getUTCSeconds() + duration.seconds
  );
  date.setUTCFullYear(
    date.getUTCFullYear() + duration.years,
    date.getUTCMonth() + duration.months,
    date.getUTCDate() + 7 * duration.weeks + duration.days
  );
};

const findNextDesignator = (value: string, startIndex = 0) => {
  for (let i = startIndex; i < value.length; i++) {
    switch (value[i]) {
      case "D":
      case "H":
      case "M":
      case "S":
      case "T":
      case "W":
      case "Y":
        return i;
    }
  }
  return -1;
};

const subtractDuration = (date: Date, duration: Duration) => {
  date.setUTCHours(
    date.getUTCHours() - duration.hours,
    date.getUTCMinutes() - duration.minutes,
    date.getUTCSeconds() - duration.seconds
  );
  date.setUTCFullYear(
    date.getUTCFullYear() - duration.years,
    date.getUTCMonth() - duration.months,
    date.getUTCDate() - 7 * duration.weeks - duration.days
  );
};
