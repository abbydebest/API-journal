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

app.get('/', async (req, res) => {
  // const pins = await fetch(''+apiKey);
  const pokemon = await fetch('https://pokeapi.co/api/v2/pokemon/')
  const pokemonData = await pokemon.json();

  console.log(pokemonData);

  return res.send(renderTemplate('server/views/index.liquid', { title: 'Pokemon', pokemon: pokemonData}));
  // return res.send(renderTemplate('server/views/index.liquid', { title: 'Digital journal', pins: pinsData }));
});

// app.get('/pokemon/:name/', async (req, res) => {
//   // const pins = await fetch('+apiKey');
//   const pokemon = await fetch('https://pokeapi.co/api/v2/pokemon/'+name)
//   const pokemonData = await pokemon.json();

//   console.log(pokemonData);

//   return res.send(renderTemplate('server/views/details.liquid', { title: 'Pokemon', pokemon: pokemonData}));
//   // return res.send(renderTemplate('server/views/index.liquid', { title: 'Digital journal', pins: pinsData }));
// });

const renderTemplate = (template, data) => {
  const templateData = {
    NODE_ENV: process.env.NODE_ENV || 'production',
    ...data
  };

  return engine.renderFileSync(template, templateData);
};

