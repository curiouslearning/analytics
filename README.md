# Introduction
A wrapper project for curious learning analytics.

# Setup
Add as node dependency

`$ npm i @curiouslearning/analytics`

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

# Caveats
We are leaving the configuration option definition on the consuming app layer since we may want to have different buckets or measurement ids for these apps.
