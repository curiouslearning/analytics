import { StatsigClient } from '@statsig/js-client';
import { StatsigStrategy } from './statsig-strategy';
import { EventNames } from '../../event-schemas';

const MOCK_OPTIONS = {
  clientKey: 'mock-key',
  statsigUser: {
    userID: 'mock-user-id'
  },
  statsigOptions: {},
  debug: false
};

// Mock StatsigClient
const mockLogEvent = jest.fn();
const mockInitializeAsync = jest.fn();

jest.mock('@statsig/js-client', () => ({
  StatsigClient: jest.fn().mockImplementation(() => ({
    logEvent: mockLogEvent,
    initializeAsync: mockInitializeAsync
  }))
}));

describe('StatsigStrategy', () => {
  let strategy: StatsigStrategy;

  beforeEach(async () => {
    mockLogEvent.mockClear();
    mockInitializeAsync.mockClear();
    strategy = new StatsigStrategy(MOCK_OPTIONS);
    await strategy.initialize();
  });

  describe('When initialized', () => {
    it('should call initializeAsync()', async () => {
      expect(mockInitializeAsync).toHaveBeenCalled();
    });
  });

  describe('Common field validation across all events', () => {
    it('should fail validation for missing cr_user_id consistently', () => {
      const baseIncompleteEvent = {
        event_date: '20240315',
        event_timestamp: 1710633600000,
        ftm_language: 'en_US',
        version_number: '1.2.3',
        json_version_number: '2.0.0'
      };

      // Test with level_completed event
      strategy.track(EventNames.LEVEL_COMPLETED, {
        ...baseIncompleteEvent,
        success_or_failure: 'success',
        number_of_successful_puzzles: 4,
        level_number: 1,
        duration: 120
      });

      expect(mockLogEvent).toHaveBeenLastCalledWith(expect.objectContaining({
        metadata: expect.objectContaining({
          is_valid: false,
          reason: expect.stringContaining('CR User ID is required')
        })
      }));
    });
  });

  describe('When tracking session events', () => {
    describe('session_start', () => {
      it('should validate successful session_start event', () => {
        const validEvent = {
          event_date: '20240315',
          event_timestamp: 1710633600000,
          cr_user_id: 'user123',
          ftm_language: 'en_US',
          version_number: '1.2.3',
          json_version_number: '2.0.0',
          days_since_last: 2
        };

        strategy.track(EventNames.SESSION_START, validEvent);

        expect(mockLogEvent).toHaveBeenCalledWith({
          eventName: EventNames.SESSION_START,
          value: undefined,
          metadata: {
            ...validEvent,
            is_valid: true
          }
        });
      });

      it('should fail validation for missing days_since_last', () => {
        const invalidEvent = {
          event_date: '20240315',
          event_timestamp: 1710633600000,
          cr_user_id: 'user123',
          ftm_language: 'en_US',
          version_number: '1.2.3',
          json_version_number: '2.0.0'
        };

        strategy.track(EventNames.SESSION_START, invalidEvent);

        expect(mockLogEvent).toHaveBeenCalledWith({
          eventName: EventNames.SESSION_START,
          value: undefined,
          metadata: {
            ...invalidEvent,
            is_valid: false,
            reason: expect.stringContaining('Days since last play is required')
          }
        });
      });
    });

    describe('session_end', () => {
      it('should validate successful session_end event', () => {
        const validEvent = {
          event_date: '20240315',
          event_timestamp: 1710633600000,
          cr_user_id: 'user123',
          ftm_language: 'en_US',
          version_number: '1.2.3',
          json_version_number: '2.0.0',
          duration: 300
        };

        strategy.track(EventNames.SESSION_END, validEvent);

        expect(mockLogEvent).toHaveBeenCalledWith({
          eventName: EventNames.SESSION_END,
          value: undefined,
          metadata: {
            ...validEvent,
            is_valid: true
          }
        });
      });

      it('should fail validation for missing duration', () => {
        const invalidEvent = {
          event_date: '20240315',
          event_timestamp: 1710633600000,
          cr_user_id: 'user123',
          ftm_language: 'en_US',
          version_number: '1.2.3',
          json_version_number: '2.0.0'
        };

        strategy.track(EventNames.SESSION_END, invalidEvent);

        expect(mockLogEvent).toHaveBeenCalledWith({
          eventName: EventNames.SESSION_END,
          value: undefined,
          metadata: {
            ...invalidEvent,
            is_valid: false,
            reason: expect.stringContaining('Session duration in seconds is required')
          }
        });
      });
    });
  });

  describe('When tracking puzzle events', () => {
    describe('puzzle_completed', () => {
      it('should validate successful puzzle_completed event', () => {
        const validEvent = {
          event_date: '20240315',
          event_timestamp: 1710633600000,
          cr_user_id: 'user123',
          ftm_language: 'en_US',
          version_number: '1.2.3',
          json_version_number: '2.0.0',
          success_or_failure: 'success',
          level_number: 1,
          puzzle_number: 3,
          item_selected: 'A',
          target: 'A',
          foils: 'B,C,D',
          response_time: 2.5
        };

        strategy.track(EventNames.PUZZLE_COMPLETED, validEvent);

        expect(mockLogEvent).toHaveBeenCalledWith({
          eventName: EventNames.PUZZLE_COMPLETED,
          value: undefined,
          metadata: {
            ...validEvent,
            is_valid: true
          }
        });
      });

      it('should fail validation for missing puzzle fields', () => {
        const invalidEvent = {
          event_date: '20240315',
          event_timestamp: 1710633600000,
          cr_user_id: 'user123',
          ftm_language: 'en_US',
          version_number: '1.2.3',
          json_version_number: '2.0.0'
        };

        strategy.track(EventNames.PUZZLE_COMPLETED, invalidEvent);

        expect(mockLogEvent).toHaveBeenCalledWith({
          eventName: EventNames.PUZZLE_COMPLETED,
          value: undefined,
          metadata: {
            ...invalidEvent,
            is_valid: false,
            reason: expect.stringMatching(/Success or failure is required|Level number is required|Puzzle number is required|Item selected is required|Target \(correct answer\) is required|Foils \(wrong answers\) is required|Response time in seconds is required/)
          }
        });
      });
    });
  });

  describe('When tracking level events', () => {
    describe('selected_level', () => {
      it('should validate successful selected_level event', () => {
        const validEvent = {
          event_date: '20240315',
          event_timestamp: 1710633600000,
          cr_user_id: 'user123',
          ftm_language: 'en_US',
          version_number: '1.2.3',
          json_version_number: '2.0.0',
          level_selected: 1
        };

        strategy.track(EventNames.SELECTED_LEVEL, validEvent);

        expect(mockLogEvent).toHaveBeenCalledWith({
          eventName: EventNames.SELECTED_LEVEL,
          value: undefined,
          metadata: {
            ...validEvent,
            is_valid: true
          }
        });
      });

      it('should fail validation for missing level_selected', () => {
        const invalidEvent = {
          event_date: '20240315',
          event_timestamp: 1710633600000,
          cr_user_id: 'user123',
          ftm_language: 'en_US',
          version_number: '1.2.3',
          json_version_number: '2.0.0'
        };

        strategy.track(EventNames.SELECTED_LEVEL, invalidEvent);

        expect(mockLogEvent).toHaveBeenCalledWith({
          eventName: EventNames.SELECTED_LEVEL,
          value: undefined,
          metadata: {
            ...invalidEvent,
            is_valid: false,
            reason: expect.stringContaining('Level selected is required')
          }
        });
      });
    });

    describe('level_completed', () => {
      it('should validate successful level_completed event', () => {
        const validEvent = {
          event_date: '20240315',
          event_timestamp: 1710633600000,
          cr_user_id: 'user123',
          ftm_language: 'en_US',
          version_number: '1.2.3',
          json_version_number: '2.0.0',
          success_or_failure: 'success',
          number_of_successful_puzzles: 4,
          level_number: 1,
          duration: 120
        };

        strategy.track(EventNames.LEVEL_COMPLETED, validEvent);

        expect(mockLogEvent).toHaveBeenCalledWith({
          eventName: EventNames.LEVEL_COMPLETED,
          value: undefined,
          metadata: {
            ...validEvent,
            is_valid: true
          }
        });
      });

      it('should fail validation for missing level completion fields', () => {
        const invalidEvent = {
          event_date: '20240315',
          event_timestamp: 1710633600000,
          cr_user_id: 'user123',
          ftm_language: 'en_US',
          version_number: '1.2.3',
          json_version_number: '2.0.0'
        };

        strategy.track(EventNames.LEVEL_COMPLETED, invalidEvent);

        expect(mockLogEvent).toHaveBeenCalledWith({
          eventName: EventNames.LEVEL_COMPLETED,
          value: undefined,
          metadata: {
            ...invalidEvent,
            is_valid: false,
            reason: expect.stringMatching(/Success or failure is required|Number of successful puzzles is required|Level number is required|Duration in seconds is required/)
          }
        });
      });
    });
  });

  describe('When tracking download_25 event', () => {
    it('should validate successful download_25 event', () => {
      const validEvent = {
        event_date: '20240315',
        event_timestamp: 1710633600000,
        cr_user_id: 'user123',
        ftm_language: 'en_US',
        version_number: '1.2.3',
        json_version_number: '2.0.0',
        ms_since_session_start: 5000
      };

      strategy.track(EventNames.DOWNLOAD_25, validEvent);

      expect(mockLogEvent).toHaveBeenCalledWith({
        eventName: EventNames.DOWNLOAD_25,
        value: undefined,
        metadata: {
          ...validEvent,
          is_valid: true
        }
      });
    });

    it('should fail validation for missing required fields', () => {
      const incompleteEvent = {
        event_date: '20240315',
        event_timestamp: 1710633600000
      };

      strategy.track(EventNames.DOWNLOAD_25, incompleteEvent);

      expect(mockLogEvent).toHaveBeenCalledWith({
        eventName: EventNames.DOWNLOAD_25,
        value: undefined,
        metadata: {
          ...incompleteEvent,
          is_valid: false,
          reason: expect.stringMatching(/CR User ID is required|Language is required|Version number is required|JSON version number is required|Milliseconds since session start is required/)
        }
      });
    });
  });
});