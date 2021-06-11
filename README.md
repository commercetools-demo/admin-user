# admin-user

A code sample of a microservice that can be used to facilitate an elevated-privilege (admin user) type of access to commercetools.

The idea behind this is that a SPA front-end will typically only contain API keys sufficient for anonymous access and to support customer login.   Privileged access would be provided by a microservice where API keys could be kept out of public visibility.

This uses a custom field ("role') on the Customer object which is used to determine whether privileged access can be granted.  If so, then an API key with additional scopes is used to provide an access token back to the front-end.

## Setup

1. Create 2 API clients - with with 'Admin Client' scope and one with 'Mobile & Single Page Application' scopes.
1. Copy packages/env/.env-sample to packages/env/.env and set the variable values per the comments in that file.
1. To set up the custom type:
```
cd packages/types
yarn
node installTypes.js
```

## Running the login service (runs on localhost:8080)

```
cd packages/login-services
yarn
yarn start
```

## Running the test app (calls the login service running locally)
```
cd packages/test
yarn
node testLocal.js
```

## TO DO

- Still need to configure gcloud run deployment.

