import { AbstractAnalyticsStrategy } from '../abstract-strategy';
import { FirebaseApp, FirebaseOptions, initializeApp } from 'firebase/app';
import { Analytics, getAnalytics, logEvent, setUserProperties} from 'firebase/analytics';

export interface FirebaseStrategyOptions {
  firebaseOptions: FirebaseOptions;
  userProperties: any;
}

export class FirebaseStrategy extends AbstractAnalyticsStrategy {
  firebaseApp: FirebaseApp;
  analytics: Analytics;

  constructor(
    private options: FirebaseStrategyOptions
  ) {
    super();
  }

  async initialize() {
    try {
      const { firebaseOptions, userProperties } = this.options;
      this.firebaseApp = initializeApp(firebaseOptions);
      this.analytics = getAnalytics(this.firebaseApp);
      setUserProperties(this.analytics, userProperties, { global: true });
    } catch (error) {
      console.error('Error while initializing Firebase:', error);
      throw error;
    }
  }

  track(eventName: string, params: any) {
    logEvent(this.analytics, eventName, params);
  }
}