export abstract class AbstractAnalyticsStrategy {
  abstract initialize(): Promise<void>;
  abstract track(evetName: string, data: any): void;
}