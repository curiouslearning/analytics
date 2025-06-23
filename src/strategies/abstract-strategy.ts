// Abstract Analytics Strategy Class Definition

/**
 * Abstract base class that defines the interface for analytics strategies.
 * Implementations of this class handle initialization and event tracking
 * for specific analytics providers like Firebase, Statsig etc.
 */
export abstract class AbstractAnalyticsStrategy {

  /**
   * Initialize the strategy
   * This method is called when the strategy is created and should be used 
   * to initialize the strategy.
   * @returns A promise that resolves when the strategy is initialized.
   */
  abstract initialize(): Promise<void>;

  /**
   * Track an event
   * This method is called to track an event.
   * @param eventName The name of the event to track.
   * @param data The data to track.
   */
  abstract track(eventName: string, data: any): void;

  /**
   * Dispose the strategy
   * This method is called when the strategy is no longer needed and should be used
   * to dispose the strategy.
   */
  abstract dispose(): void;

}