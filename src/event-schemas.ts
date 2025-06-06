import { z } from 'zod';
import {
  requiredString,
  requiredNumber,
  requiredDate,
  requiredDateInFormat
} from './validators';

/**
 * Event Schemas
 * 
 * Download milestone events in Feed The Monster that fire at different stages of the content download process.
 * Used to track download progress and timing between milestones:
 * app_launch -> download_25 -> download_50 -> download_75 -> download_completed
 * 
 * Other events track user interactions, game progression, and engagement metrics.
 */

/**
 * Event Names Constants
 */
export const EventNames = {
  DOWNLOAD_25: 'download_25',
  DOWNLOAD_50: 'download_50',
  DOWNLOAD_75: 'download_75',
  DOWNLOAD_COMPLETED: 'download_completed',
  TAPPED_START: 'tapped_start',
  SELECTED_LEVEL: 'selected_level',
  PUZZLE_COMPLETED: 'puzzle_completed',
  LEVEL_COMPLETED: 'level_completed',
  SESSION_START: 'session_start',
  SESSION_END: 'session_end'
} as const;

// Base event schema with fields common to all events
const baseEventSchema = z.object({
  event_date: requiredDate('Event date'),
  event_timestamp: requiredNumber('Event timestamp'),
  cr_user_id: requiredString('CR User ID'),
  ftm_language: requiredString('Language'),
  version_number: requiredString('Version number'),
  json_version_number: requiredString('JSON version number')
});

// Download events include ms_since_session_start
const downloadEventSchema = baseEventSchema.extend({
  ms_since_session_start: requiredNumber('Milliseconds since session start')
});

/**
 * Fires when download reaches 25% completion
 */
export const download25Schema = downloadEventSchema;

/**
 * Fires when download reaches 50% completion
 */
export const download50Schema = downloadEventSchema;

/**
 * Fires when download reaches 75% completion
 */
export const download75Schema = downloadEventSchema;

/**
 * Fires when download reaches 100% completion
 */
export const downloadCompletedSchema = downloadEventSchema;

/**
 * Fires when user taps the initial FTM screen to go to level selection
 * Note: Was temporarily renamed to 'user_clicked' in 2023
 */
export const tappedStartSchema = baseEventSchema;

/**
 * Fires when user selects a level to play
 * Added: Feb 21, 2024
 */
export const selectedLevelSchema = baseEventSchema.extend({
  level_selected: requiredNumber('Level selected')
});

/**
 * Fires when a puzzle is completed (success or failure)
 * A puzzle is a single question in a level (5 puzzles per level).
 * Success means item_selected matches target.
 * Failure can be wrong answer or timeout (not differentiated).
 * For multi-stone puzzles, item_selected contains running list of selections.
 */
export const puzzleCompletedSchema = baseEventSchema.extend({
  success_or_failure: requiredString('Success or failure'),
  level_number: requiredNumber('Level number'),
  puzzle_number: requiredNumber('Puzzle number'),
  item_selected: requiredString('Item selected'),
  target: requiredString('Target (correct answer)'),
  foils: requiredString('Foils (wrong answers)'),
  response_time: requiredNumber('Response time in seconds')
});

/**
 * Summary event fired when all puzzles in a level are completed
 * Level is considered successful if 3 or more puzzles (out of 5) were completed correctly
 */
export const levelCompletedSchema = baseEventSchema.extend({
  success_or_failure: requiredString('Success or failure'),
  number_of_successful_puzzles: requiredNumber('Number of successful puzzles'),
  level_number: requiredNumber('Level number'),
  duration: requiredNumber('Duration in seconds')
});

/**
 * Fires when app is launched or foregrounded
 * Used to track user engagement patterns and frequency of play
 */
export const sessionStartSchema = baseEventSchema.extend({
  days_since_last: requiredNumber('Days since last play')
});

/**
 * Fires when app is closed or backgrounded
 * Pairs with session_start to measure complete session duration
 */
export const sessionEndSchema = baseEventSchema.extend({
  duration: requiredNumber('Session duration in seconds')
});

/**
 * Default event schemas mapping
 */
export const DefaultEventSchemas = {
  [EventNames.DOWNLOAD_25]: download25Schema,
  [EventNames.DOWNLOAD_50]: download50Schema,
  [EventNames.DOWNLOAD_75]: download75Schema,
  [EventNames.DOWNLOAD_COMPLETED]: downloadCompletedSchema,
  [EventNames.TAPPED_START]: tappedStartSchema,
  [EventNames.SELECTED_LEVEL]: selectedLevelSchema,
  [EventNames.PUZZLE_COMPLETED]: puzzleCompletedSchema,
  [EventNames.LEVEL_COMPLETED]: levelCompletedSchema,
  [EventNames.SESSION_START]: sessionStartSchema,
  [EventNames.SESSION_END]: sessionEndSchema
} as const;

// Types
export type StandardEventName = keyof typeof DefaultEventSchemas;
export type EventSchemas = typeof DefaultEventSchemas & Record<string, z.ZodSchema<any>>; 