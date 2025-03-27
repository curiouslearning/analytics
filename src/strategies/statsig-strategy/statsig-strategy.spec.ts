import { StatsigClient } from '@statsig/js-client';
import { StatsigStrategy } from './statsig-strategy';

const MOCK_OPTIONS = {
  clientKey: 'mock-key',
  statsigUser: {
    userID: 'mock-user-id'
  },
  statsigOptions: {}
};

describe('StatsigStrategy', () => {
  describe('Given MOCK_OPTIONS options', () => {
    const strategy = new StatsigStrategy(MOCK_OPTIONS);

    describe('When intialized', () => {
      it('should call initializeAsync()', async () => {
        const spy = jest.spyOn(StatsigClient.prototype, 'initializeAsync')
        await strategy.initialize();
        expect(spy).toHaveBeenCalled();
      });
    });

    describe('When track() is invoked', () => {
      it('should call client.logEvent()', () => {
        const spy = jest.spyOn(StatsigClient.prototype, 'logEvent');
        strategy.track('mock-event', {});
        expect(spy).toHaveBeenCalled();
      });
    });
  });
});