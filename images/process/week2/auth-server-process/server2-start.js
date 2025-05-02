import 'dotenv/config';
import { App } from '@tinyhttp/app';
import { logger } from '@tinyhttp/logger';
import { Liquid } from 'liquidjs';
import sirv from 'sirv';

// import session from 'express-session';

const engine = new Liquid({
  extname: '.liquid',
});

const app = new App();
// Added API key
// const apiKey = process.env.POKE_API_SECRET;
const apiAuth = process.env.PINTEREST_AUTH_URL;
const apiToken = process.env.PINTEREST_ACCESS_TOKEN_URL;

let isLoggedIn = false;
let token;

app
  .use(logger())
  .use('/', sirv(process.env.NODE_ENV === 'development' ? 'client' : 'dist'))
  .listen(3000, () => console.log('Server available on http://localhost:3000'));

  app.get('/', async (req, res) => {
    if (req.query && req.query.code) {
      try {
        const code = req.query.code;
  
        const params = new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: 'http://localhost:3000/',
          client_id: process.env.PINTEREST_APP_ID,
          client_secret: process.env.PINTEREST_APP_SECRET,
        });

        console.log(process.env.PINTEREST_APP_ID, process.env.PINTEREST_APP_SECRET)
  
        const tokenResponse = await fetch(process.env.PINTEREST_ACCESS_TOKEN_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: params.toString()
        });
  
        const tokenData = await tokenResponse.json();
        console.log(tokenData, 'hoi');
        
        if (tokenData.access_token) {
          token = tokenData.access_token;
          isLoggedIn = true;
  
          // Optionally: store in session or persist somewhere
          // req.session.pinterestToken = token;
  
          const pinsResponse = await fetch('https://api.pinterest.com/v5/pins', {
            method: 'GET',
            headers: {
              'Authorization': 'Bearer ' + token,
              'Content-Type': 'application/json'
            }
          });
  
          const data = await pinsResponse.json();
          return res.send(renderTemplate('server/views/index.liquid', { title: 'Homepage', isLoggedIn, data }));
        } else {
          console.error('Token exchange failed:', tokenData);
          return res.status(401).send('Authentication failed. Invalid code or client credentials.');
        }
      } catch (error) {
        console.error('Error during token exchange or pin fetch:', error);
        return res.status(500).send('Internal server error during Pinterest auth.');
      }
    }
  
    // Default: not logged in yet
    return res.send(renderTemplate('server/views/index.liquid', { title: 'Homepage', isLoggedIn }));
  });
  

app.get('/auth', (req, res) => {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.PINTEREST_APP_ID,
    redirect_uri: 'http://localhost:3000/',
    scope: 'pins:read boards:read', // adjust scopes as needed
    state: 'random_csrf_token', // recommended to prevent CSRF
  });

  res.redirect(`${process.env.PINTEREST_AUTH_URL}?${params.toString()}`);
});

const renderTemplate = (template, data) => {
    const templateData = {
      NODE_ENV: process.env.NODE_ENV || 'production',
      ...data
    };
  
    return engine.renderFileSync(template, templateData);
  };