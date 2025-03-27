import { AbstractAnalyticsStrategy } from '../abstract-strategy';
import { StatsigClient, StatsigOptions, StatsigUser } from '@statsig/js-client';
import { StatsigAutoCapturePlugin } from '@statsig/web-analytics';

export interface StatsigStrategyOptions {
  clientKey: string;
  statsigOptions?: StatsigOptions;
  statsigUser: StatsigUser;
}

export class StatsigStrategy extends AbstractAnalyticsStrategy {
  client: StatsigClient;
  constructor(
    private options: StatsigStrategyOptions
  ) {
    super();
  }

  async initialize() {
    try {
      const { clientKey, statsigUser, statsigOptions } = this.options;
      const optionsWithAutoCapture = {
        ...statsigOptions,
        plugins: [new StatsigAutoCapturePlugin()]
      }
      this.client = new StatsigClient(clientKey, statsigUser, optionsWithAutoCapture);
      await this.client.initializeAsync();
    } catch (e) {
      console.error('Error initializing statsig client. ', e);
      throw e;
    }
  }

  track(eventName: string, params: any) {
    const { value, ...metadata } = params;
    this.client.logEvent({
      eventName,
      value,
      metadata
    });
  }
}