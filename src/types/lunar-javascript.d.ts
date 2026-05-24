declare module 'lunar-javascript' {
  export class Lunar {
    static fromDate(date: Date): Lunar;
    getYearInGanZhi(): string;
    getMonthInGanZhi(): string;
    getDayInGanZhi(): string;
    getTimeInGanZhi(): string;
    getPrevJieQi(includeToday: boolean): JieQi;
    getDayXun(): string;
    getTimeXun(): string;
    getMonthXun(): string;
    getYearXun(): string;
    getDayZhi(): string;
    getTimeZhi(): string;
    getMonthZhi(): string;
    getYearZhi(): string;
    toString(): string;
  }

  export class Solar {
    static fromDate(date: Date): Solar;
    toFullString(): string;
  }

  export class JieQi {
    getName(): string;
  }
}
