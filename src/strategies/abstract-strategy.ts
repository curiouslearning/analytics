export abstract class AbstractAnalyticsStrategy {
  abstract track(evetName: string, data: any): void;
}