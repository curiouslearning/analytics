// Abstract Analytics Strategy Class Definition

/**
 * Abstract base class that defines the interface for analytics strategies.
 * Implementations of this class handle initialization and event tracking
 * for specific analytics providers like Firebase, Statsig etc.
 */
export abstract class AbstractAnalyticsStrategy {
  abstract initialize(): Promise<void>;
  abstract track(eventName: string, data: any): void;
}