import { AbstractAnalyticsStrategy } from '../abstract-strategy';
import { StatsigClient, StatsigOptions, StatsigUser } from '@statsig/js-client';
import { StatsigAutoCapturePlugin } from '@statsig/web-analytics';
import { z } from 'zod';
import { DefaultEventSchemas } from '../../event-schemas';

export interface StatsigStrategyOptions {
  clientKey: string;
  statsigOptions?: StatsigOptions;
  statsigUser: StatsigUser;
  // Custom event schemas that will be merged with default schemas
  customEventSchemas?: Record<string, z.ZodSchema<any>>;
  debug?: boolean; // Add debug mode option
}

export class StatsigStrategy extends AbstractAnalyticsStrategy {
  client: StatsigClient;
  private eventSchemas: Record<string, z.ZodSchema<any>>;
  private debug: boolean;

  constructor(
    private options: StatsigStrategyOptions
  ) {
    super();
    this.debug = options.debug ?? false;
    // Merge default schemas with custom schemas, custom schemas take precedence
    this.eventSchemas = {
      ...DefaultEventSchemas,
      ...options.customEventSchemas
    };
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

  track(eventName: string, params: any): void {
    let finalParams = { ...params };
    let isValid = true;
    let validationReason: string | undefined;

    // Validate against schema if one exists for this event
    if (this.eventSchemas[eventName]) {
      const schema = this.eventSchemas[eventName];
      const result = schema.safeParse(params);
      if (!result.success) {
        if (this.debug) {
          console.error(`Validation failed for event ${eventName}:`, result.error);
        }
        isValid = false;
        // Use Zod's formatted error messages
        validationReason = result.error.issues
          .map(issue => {
            const path = issue.path.length > 0 ? `${issue.path.join('.')}: ` : '';
            return `${path}${issue.message}`;
          })
          .join('; ');
      } else {
        finalParams = result.data; // Use validated data
      }
    }

    // Add validation metadata
    const enrichedParams = {
      ...finalParams,
      is_valid: isValid,
      ...(validationReason && { reason: validationReason })
    };

    // Extract value and metadata for Statsig's format
    const { value, ...metadata } = enrichedParams;
    this.client.logEvent({
      eventName,
      value,
      metadata
    });
  }
}