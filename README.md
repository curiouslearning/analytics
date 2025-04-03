# Introduction
A wrapper project for curious learning analytics.

# Setup
Simply add as dependency.

`$ npm i @curiouslearning/analytics`

[![CircleCI](https://dl.circleci.com/status-badge/img/gh/curiouslearning/analytics/tree/main.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/gh/curiouslearning/analytics/tree/main)
# Usage
```
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
