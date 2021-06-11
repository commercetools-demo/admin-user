/* 
This function handles a user login and creates elevated privileges if the user has an 'admin' role.

Environment should be configured with 2 API keys, a "low-privilege" and a "high-privilege" key.
See ../env/.env-sample for more details
*/
const express = require('express');
const fetch = require('node-fetch');
const app = express();
app.use(express.json());
const base64 = require('base-64');

const projectVars = {
  projectKey: process.env.CTP_PROJECT_KEY,
  authUrl: process.env.CTP_AUTH_URL,
  apiUrl: process.env.CTP_API_URL,
}

const lowPrivilegeKey = {
  clientId: process.env.CTP_LOW_PRIV_CLIENT_ID,
  clientSecret: process.env.CTP_LOW_PRIV_CLIENT_SECRET,
  scopes: process.env.CTP_LOW_PRIV_SCOPES
}

const highPrivilegeKey = {
  clientId: process.env.CTP_CLIENT_ID,
  clientSecret: process.env.CTP_CLIENT_SECRET,
  scopes: process.env.CTP_SCOPES
}

if (!lowPrivilegeKey.clientId || !highPrivilegeKey.clientId) {
  console.error("Environment variables not configured -- exiting");
  process.exit(1);
}

// Fetch an access token from commercetools, using the passed API key.
async function getAccessToken(key) {
  let basicAuth = base64.encode(`${key.clientId}:${key.clientSecret}`);
  const response = await fetch(`${projectVars.authUrl}/oauth/token`,{
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + basicAuth,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: `grant_type=client_credentials&scope=${key.scopes}`
  });
  console.log(response.status);
  if(response && response.status==200) {
    const json = await response.json();
    console.log('access token',json.access_token);
    return json.access_token;
  } else {
    console.log('Error getting access token');
    return null;
  } 
}

app.post('/login', async function (req, res, next) {
  try {
    // Create an access token with enough privileges to call login
    let accessToken = await getAccessToken(lowPrivilegeKey);
    if(!accessToken) {
      console.log('Unable to get access token');
      res.status(500).send(null);
      return;
    }

    // Log in the user
    console.log('handling login request');
    const url = `${projectVars.apiUrl}/${projectVars.projectKey}/me/login`;
    const options = {
      method: 'POST',
      headers: { 
        'Authorization': 'Bearer ' + accessToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: req.body.email,
        password: req.body.password
      })
    };
    const response = await fetch(url,options);

    if(response && response.status==200) {
      console.log('Log in successful');
      const json = await response.json();
      if(json.customer?.custom?.fields?.role=='admin') {
        // Is admin user, elevate privileges
        console.log('Is admin user -- getting high privilege access token');
        accessToken = await getAccessToken(highPrivilegeKey);
      } else {
        // Keep current (low-priv) access token
        console.log('low privileges');
      }
      json.accessToken = accessToken;
      res.status(200).send(json);
    } else {
      res.status(response.status).send(null);
    } 
  } catch(e) {
    console.error(e);
    next(e);
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`login-service: listening on port ${port}`);
});
