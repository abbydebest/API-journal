import 'dotenv/config';
import { App } from '@tinyhttp/app';
import { logger } from '@tinyhttp/logger';
import { Liquid } from 'liquidjs';
import sirv from 'sirv';

const engine = new Liquid({
  extname: '.liquid',
});

const app = new App();
// Added API key
const apiKey = process.env.POKE_API_SECRET;
const apiAuth = process.env.PINTEREST_AUTH_URL;
const apiToken = process.env.PINTEREST_ACCESS_TOKEN_URL;

app
  .use(logger())
  .use('/', sirv(process.env.NODE_ENV === 'development' ? 'client' : 'dist'))
  .listen(3000, () => console.log('Server available on http://localhost:3000'));

app.get('/auth/pinterest', (req, res) => {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.PINTEREST_APP_ID,
    redirect_uri: 'http://localhost:3000/auth/pinterest/callback',
    scope: 'pins:read boards:read', // adjust scopes as needed
    state: 'random_csrf_token', // recommended to prevent CSRF
  });

  res.redirect(`${process.env.PINTEREST_AUTH_URL}?${params.toString()}`);
});

app.get('/pinterest/profile', async (req, res) => {
  const token = req.session.pinterestToken;
  if (!token) {
    return res.redirect('/auth/pinterest');
  }

  try {
    const userResponse = await fetch('https://api.pinterest.com/v5/user_account', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const userData = await userResponse.json();
    console.log('User Data:', userData);

    res.send(renderTemplate('server/views/index.liquid', {
      title: 'Pinterest Profile',
      user: userData
    }));
  } catch (err) {
    console.error('Pinterest API error:', err);
    res.status(500).send('Failed to fetch user data.');
  }
});

