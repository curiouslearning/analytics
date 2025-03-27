import { AnalyticsService } from './analytics-service';
import { AbstractAnalyticsStrategy } from '../../strategies/abstract-strategy';

const MockStrategy = jest.fn().mockImplementation(() => ({
  track: jest.fn()
}));

describe('AnalyticsService', () => {
  describe('Default', () => {
    describe('Given seprate instantiations', () => {
      it('should be equal', () => {
        const a = new AnalyticsService();
        const b = new AnalyticsService();

        expect(a).toEqual(b);
      });
    });

    describe('Given new and instance getter', () => {
      it('should be equal', () => {
        const a = new AnalyticsService();
        const b = AnalyticsService.instance;

        expect(a).toEqual(b);
      });
    });
  });

  describe('Given a mock strategy is registered', () => {
    describe('When track is called', () => {
      it('should call the strategies\' track method', () => {
        const mockStrategy = new MockStrategy();
        const spy = jest.spyOn(mockStrategy, 'track');
        const service = new AnalyticsService();
        service.register('mock', mockStrategy);
        service.track('test', {});

        expect(spy).toHaveBeenCalled();
      });
    });
  });
});