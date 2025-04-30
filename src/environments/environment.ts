// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

interface AngularEnvironment {
  production: boolean;
  serverUrl: string;
  stripeApiPublic: string;
}

export const environment: AngularEnvironment = {
  production: false,
  // serverUrl: 'http://localhost:3002',
  // serverUrl: 'http://localhost:3000',
  // serverUrl: 'http://213.165.232.14:3000',
  // serverUrl: 'http://roboswarm.convesio.e247.site:3000',
  // serverUrl: 'https://roboswarm.convesio.e247.site/api',
  serverUrl: 'https://roboswarm.convesio.do.e247.site/backend',
  stripeApiPublic: 'pk_test_51Ig7WwSACg5J6CChdECBkzMhxopcY18EQyEGcaWakip7FuKjYyYxQUZCRFcTN2OD2mbDOc8lnnFQ7iId9tXesKyl00U8J3wxMg' // Stripe public key. Used for adding/editing payment details
};
