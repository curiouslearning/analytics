import { FirebaseStrategy } from './firebase-strategy';
import * as firebaseDefaults from 'firebase/app';
import * as firebaseAnalyticsDefaults from 'firebase/analytics';

// Mock modules first
jest.mock('firebase/app');
jest.mock('firebase/analytics');

const MOCK_OPTIONS = {
  userProperties: {
    userID: 'mock-user-id'
  },
  firebaseOptions: {}
};

describe('FirebaseStrategy', () => {
  let strategy: FirebaseStrategy;
  let mockFirebaseApp: any;
  let mockAnalytics: any;

  beforeEach(() => {
    // Initialize mocks
    mockFirebaseApp = {};
    mockAnalytics = {};

    // Setup mock implementations
    (firebaseDefaults.initializeApp as jest.Mock).mockReturnValue(mockFirebaseApp);
    (firebaseDefaults.deleteApp as jest.Mock).mockResolvedValue(undefined);
    (firebaseAnalyticsDefaults.getAnalytics as jest.Mock).mockReturnValue(mockAnalytics);
    (firebaseAnalyticsDefaults.logEvent as jest.Mock).mockImplementation(() => {});
    (firebaseAnalyticsDefaults.setUserProperties as jest.Mock).mockImplementation(() => {});

    // Reset all mocks
    jest.clearAllMocks();
    
    strategy = new FirebaseStrategy(MOCK_OPTIONS);
  });

  describe('When initialized', () => {
    it('should call initializeApp()', async () => {
      const spy = jest.spyOn(firebaseDefaults, 'initializeApp');
      await strategy.initialize();
      expect(spy).toHaveBeenCalled();
    });

    it('should call getAnalytics()', async () => {
      const spy = jest.spyOn(firebaseAnalyticsDefaults, 'getAnalytics');
      await strategy.initialize();
      expect(spy).toHaveBeenCalled();
    });

    it('should call setUserProperties()', async () => {
      const spy = jest.spyOn(firebaseAnalyticsDefaults, 'setUserProperties');
      await strategy.initialize();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('When track() is invoked', () => {
    it('should call logEvent()', async () => {
      await strategy.initialize();
      const spy = jest.spyOn(firebaseAnalyticsDefaults, 'logEvent');
      strategy.track('mock-event', {});
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('When dispose() is called', () => {
    it('should call deleteApp() if firebaseApp exists', async () => {
      await strategy.initialize();
      const spy = jest.spyOn(firebaseDefaults, 'deleteApp');
      strategy.dispose();
      expect(spy).toHaveBeenCalledWith(mockFirebaseApp);
    });

    it('should not call deleteApp() if firebaseApp does not exist', () => {
      // Create a new strategy without initializing it
      const uninitializedStrategy = new FirebaseStrategy(MOCK_OPTIONS);
      const spy = jest.spyOn(firebaseDefaults, 'deleteApp');
      uninitializedStrategy.dispose();
      expect(spy).not.toHaveBeenCalled();
    });
  });
});