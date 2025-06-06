# Introduction
A wrapper project for curious learning analytics.

# Setup
Simply add as dependency.

`$ npm i @curiouslearning/analytics`

[![CircleCI](https://dl.circleci.com/status-badge/img/gh/curiouslearning/analytics/tree/main.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/gh/curiouslearning/analytics/tree/main)
# Usage
```ts
import { AnalyticsService, FirebaseStrategy } from '@curiouslearning/analytics';

const analytics = new AnalyticsService();

// each strategy will have its own set of configuration options.


// using firebase strategy
const firebaseStrategy = new FirebaseStrategy({
  firebaseOptions: {
    apiKey: 'api-key',
    authDomain: 'my-domain.firebaseapp.com',
    databaseURL: 'https://my-db.firebaseio.com',
    projectId: 'project-id',
    storageBucket: 'my-bucket.appspot.com',
    messagingSenderId: 'sender-id',
    appId: 'app-id',
    measurementId: 'G-measurement-id',
  },
  userProperties: {
    campaign_id: 'my-campaign',
    source: 'my-source'
  }
});

await firebaseStrategy.initialize();
analytics.register('firebase', firebaseStrategy);
analytics.track('initialized', { test: 'test' }); // fires a tracking event to firebase

// using statsig strategy
const statsigStrategy = new StatsigStrategy({
  clientKey: 'statsig-api-key';
  statsigUser: {
    userId: 'my-psuedo-user-id'
  };
});

await statsigStrategy.initialize();
analytics.register('statsig', statsigStrategy);
analytics.track('initialized', { test: 'test' }); // fires a tracking event to firebase and statsig
```

# Event Schemas & Validation

The Analytics package is using [Zod](https://github.com/colinhacks/zod) for event validation. Built-in event schemas are provided (FTM), and you can also define your own custom schemas.

## Using Built-in Event Schemas

You can import the default event schemas and event names:

```ts
import { DefaultEventSchemas, EventNames } from '@curiouslearning/analytics';

// Example: Use EventNames to ensure correct event names
const eventName = EventNames.SESSION_START;

// Example: Validate event params manually (optional)
import { z } from 'zod';
const params = { /* ... */ };
const result = DefaultEventSchemas[eventName].safeParse(params);
if (!result.success) {
  console.error(result.error);
}
```

## Using StatsigStrategy with Validation

When you use the `StatsigStrategy`, event parameters are automatically validated against the built-in schemas (and any custom schemas you provide). Invalid events will include validation errors in the metadata.

```ts
import { StatsigStrategy, EventNames } from '@curiouslearning/analytics';

const statsigStrategy = new StatsigStrategy({
  clientKey: 'your-statsig-key',
  statsigUser: { userID: 'user-123' },
  debug: true // enables validation error logging
});

await statsigStrategy.initialize();

// This will be validated against the SESSION_START schema
statsigStrategy.track(EventNames.SESSION_START, {
  event_date: '20240315',
  event_timestamp: 1710633600000,
  cr_user_id: 'user123',
  ftm_language: 'en_US',
  version_number: '1.2.3',
  json_version_number: '2.0.0',
  days_since_last: 2
});
```

## Common Validators (common-params)

This package provides reusable validators in `common-params` for required fields, such as `requiredString`, `requiredNumber`, and `requiredDate`. These helpers wrap Zod's types to provide consistent required field validation and clear error messages. They are used in all built-in event schemas and are recommended for custom schemas as well.

**Example:**
```ts
import { requiredString, requiredNumber } from '@curiouslearning/analytics/validators';

const schema = z.object({
  event_date: requiredString('Event date'),
  duration: requiredNumber('Duration in seconds')
});
```

- `requiredString('Field Name')` ensures the field is present and a string, with a custom error message.
- `requiredNumber('Field Name')` ensures the field is present and a number, with a custom error message.
- See `common-params.ts` for more helpers like `requiredDate`, `requiredNonNegativeNumber`, and `requiredDateInFormat`.

## Defining and Using Custom Schemas

You can define your own Zod schemas and pass them to the strategy. Custom schemas will override or extend the built-in ones. For consistency and better error messages, use the provided validators from `common-params`:

```ts
import { z } from 'zod';
import { StatsigStrategy, EventNames } from '@curiouslearning/analytics';
import { requiredString } from '@curiouslearning/analytics/validators';

const customSchemas = {
  [EventNames.SESSION_START]: z.object({
    event_date: requiredString('Event date'), // uses the shared validator
    custom_field: requiredString('Custom field')
  })
};

const statsigStrategy = new StatsigStrategy({
  clientKey: 'your-statsig-key',
  statsigUser: { userID: 'user-123' },
  customEventSchemas: customSchemas,
  debug: true
});

await statsigStrategy.initialize();

// This will be validated against your custom SESSION_START schema
statsigStrategy.track(EventNames.SESSION_START, {
  event_date: '20240315',
  custom_field: 'my-value'
});
```

# Other Use Cases
## A single strategy trigger
```
const firebaseStrategy = analytics.getRegistry('firebase');
firebaseStrategy.track('test', { test: 'test' });
```

## A custom strategy
Make sure to extend the abstract strategy to making sure all necessary implementations are present.
```
import { AbstractAnalyticsStrategy } from '@curiouslearning/analytics';

export class CustomStrategy extends AbstractAnalyticsStrategy {
  async initialize() {
    // initialization
  }

  track(evetName: string, data: any) {
    // do something with eventName and data
  }
}

// ..
const customStrategy = new CustomStrategy();
await customStrategy.initialize();
analytics.register('custom', customStrategy);

analytics.track('test', { foo: 'baz' });
```


# Caveats
We are leaving the configuration option definition on the consuming app layer since we may want to have different buckets or measurement ids for these apps.
