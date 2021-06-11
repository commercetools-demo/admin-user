const fetch = require('node-fetch');

const projectVars = {
  projectKey: process.env.CTP_PROJECT_KEY,
  authUrl: process.env.CTP_AUTH_URL,
  apiUrl: process.env.CTP_API_URL,
}

// Configure these variables with a user in your project
const email='cboyke@gmail.com';
const password='Test1234';


async function main() {
  // Log in the test user.
  console.log('Logging in',email);
  let result = await fetch('http://localhost:8080/login',{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: email,
      password: password
    }),
  });
  if(result.status!=200) {
    console.log('Error logging in');
    return;
  }

  const data = await result.json();
  const accessToken = data.accessToken;
  console.log('access token',accessToken);

  // Now, perform an action that only an admin user should be able to perform -- query customers
  let url = `${projectVars.apiUrl}/${projectVars.projectKey}/customers`;
  console.log('calling API that requires manage_customers scope:',url);

  result = await fetch(url,{
    method: 'GET',
    headers: {
      Authorization : 'Bearer ' + accessToken
    }
  });
  console.log('Result status:',result.status);
  if(result.status==403) {
    console.log('*** Unauthorized');
  } 
  if(result.status==200) {
    console.log('*** Successfully accessed privileged API - listing customers:')
    let data = await result.json();
    for(let c of data.results) {
      console.log(c.email);
    }
  }
}

main();
