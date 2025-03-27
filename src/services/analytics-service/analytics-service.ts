import { AbstractAnalyticsStrategy } from '../../strategies/abstract-strategy';
import { Registry } from '../registry/registry';

/**
 * A singleton service with strategy registry used to trigger analytics handlers
 */
export class AnalyticsService extends Registry<AbstractAnalyticsStrategy> {
  private static _instance: AnalyticsService;
  
  constructor() {
    super();
    if (AnalyticsService._instance) return AnalyticsService._instance;
  }

  static get instance() {
    if (!AnalyticsService._instance) {
      AnalyticsService._instance = new AnalyticsService();
    }

    return AnalyticsService._instance;
  }

  track(eventName: string, params: any) {
    Object.keys(this.registry).forEach((key) => this.registry[key].track(eventName, params))
  }
}