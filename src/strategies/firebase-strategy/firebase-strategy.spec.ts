import { FirebaseStrategy } from './firebase-strategy';
import * as firebaseDefaults from 'firebase/app';
import * as firebaseAnalyticsDefaults from 'firebase/analytics';

const MOCK_OPTIONS = {
  userProperties: {
    userID: 'mock-user-id'
  },
  firebaseOptions: {}
};

describe('FirebaseStrategy', () => {
  describe('Given MOCK_OPTIONS options', () => {
    const strategy = new FirebaseStrategy(MOCK_OPTIONS);

    describe('When initialized', () => {
      it('should call initializeApp()', async () => {
        const spy = jest.spyOn(firebaseDefaults, 'initializeApp')
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
      it('should call logEvent()', () => {
        const spy = jest.spyOn(firebaseAnalyticsDefaults, 'logEvent');
        strategy.track('mock-event', {});
        expect(spy).toHaveBeenCalled();
      });
    });
  });
});