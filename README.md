# API Journal

## Introduction
The goal of this assignment is to experience the power of the web by developing a web application just as attractive as native mobile apps with the help of web API's.

# 🪐 Week 1

### Concept
For the assignment we had to choose a app concept we wanted to remake with API's. I was immediately drawn to the idea of recreating an e-commerce or wishlist app. 

### API Research
#### Content API
For my API research I wanted to use an e-com content API with products I could use for the wishlist app. After checking out many API's, and almost two days passing by due to intensive research and reading documentation, I could only find suitable API's for payment or extremely limiting ones. API's I wanted to use in the first place or that I have considered where h&m API, Zara(home) API, Farfetch API, Bol API, Amazon API, Etsy API
I came to the conclusion that using the Pinterest API would be best suitable for my concept. But not knowing yet exactly what capabilities I have and what functions or ideas I can develop for my app with it, I had to adjust and adapt my concept a bit. To somewhat more general, like an app people can use their pins within.

#### Web API
The web API's that got my attention where the canvas API, color picker and view transitions. Not sure yet of what their capabilities are and what I can achieve with them, I decided to first start working with my content API and later implementing the web API for functionalities.
<br>
<br>

#### Sources for API's
🔗 SOURCE: https://rapidapi.com/hub

🔗 SOURCE: https://publicapis.dev/

🔗 SOURCE: https://developer.mozilla.org/en-US/docs/Web/API
<br>
<br>

#### API's I have researched
🔗 SOURCE: https://portal.api.hmgroup.com/

🔗 SOURCE: https://github.com/farfetch

🔗 SOURCE: https://developers.etsy.com/documentation/

🔗 SOURCE: https://apify.com/datasaurus/zarahome

🔗 SOURCE: https://www.retailed.io/datasources/api/zara-product

🔗 SOURCE: https://fakestoreapi.com/
<br>
<br>

#### Pinterest API
🔗 SOURCE: https://developers.pinterest.com/docs/api/v5/introduction
<br>
<br>

### Moodboard
Something I always use to get a visual representation of what I want to make, the look & feel and to gather inspiration is a moodboard. My moodboard for this project!

<img src="images/process/week1/screenshot-week1-postman.png" width="100%" height="auto" alt="Generating a token with postman and receiving a data response">

### Postman
As a way to get the authentication of the API to work, I used postman to try and achieve this, but mainly to see what data I get returned form the endpoints and to see what I can actually do with the API.

This also showed me how the data is structured and how I would have to write and use liquid to get data into my app. For example, when I get pins returned, they are returned in the array "items" and I get information such as the id, the id of the board it is in, the title, dominant color and multiple image sizes and the url I can use to add the image to my web app. 

<img src="images/process/week1/screenshot-week1-postman.png" width="75%" height="auto" alt="Generating a token with postman and receiving a data response">

# 🪩 Week 2

### Authorization
#### *With help of Cyd, ChatGPT and Claude*

#### 1 Start VScode & working API
To start my project, I used and forked an existing repository with all the needed files and base code already set up. 

The base server.js I worked with
<img src="images/process/week2/screenshot-week2-base-server.png" width="75%" height="auto" alt="The base server from repo">

🔗 SOURCE: https://github.com/cmda-minor-web/API-2425

To learn how to get an API working, I tested adding and working with the data from some other API's. 

<img src="images/process/week2/screenshot-week2-api-server.png" width="75%" height="auto" alt="Testing other API's">

#### 2 My own attempt auth with ChatGPT
In an attempt to get the Pinterest API authorization to work I added the keys from my Pinterest app dashboard to the base server.js and to the .env file.

<img src="images/process/week2/screenshot-week2-env.png" width="75%" height="auto" alt=".env file with API keys">

<img src="images/process/week2/screenshot-week2-own-attempt-server.png" width="75%" height="auto" alt="My own attempt in the server.js">

🔗 SOURCE CHATGPT: https://chatgpt.com/share/6814ded5-2578-8002-844e-e3c10b7f9574

#### 3 Auth with Cyd (& ClaudeAI)
After my own failed attempt to get the auth working, I asked Cyd for help. I already got pretty far on my own and for the fact that I had never worked with server side applications, content API's and/or data with liquid. But I realised it didn't work because I needed to generate the access token with the key and give/send it to the redirectUri. But I hadn't quite figured it out.

<img src="images/process/week2/screenshot-week2-server2-start.png" width="75%" height="auto" alt="Experimenting and debugging in server2.js">

<img src="images/process/week2/screenshot-week2-server2-start2.png" width="75%" height="auto" alt="More experimenting and debugging in server2.js">
<br>

<img src="images/process/week2/screenshot-week2-server2-claude.png" width="75%" height="auto" alt="Claude debugging server2.js">

<img src="images/process/week2/screenshot-week2-server2-claude2.png" width="75%" height="auto" alt="More Claude debugging server2.js">
<br>

🔗 SOURCE CLAUDE first attempt: https://claude.ai/share/2da4d09a-be1b-4056-9198-5cac267f2d51
🔗 SOURCE CLAUDE token: https://claude.ai/share/9466f5e8-3738-470c-9863-87c1987fdd7e
<br>

After trying out a lot of things(see the file server2.js), techniques and debugging(with ClaudeAI), when we finally got close to something that worked we asked ClaudeAI to give the last code to make it work.

Which resulted into the following new and working auth:
🔗 SOURCE CLAUDE auth: https://claude.ai/share/8d019feb-5ea0-423e-a713-01c2d25097e1
<br>

```javascript
import "dotenv/config";
import { App } from "@tinyhttp/app";
import { logger } from "@tinyhttp/logger";
import { Liquid } from "liquidjs";
import sirv from "sirv";
import bodyParser from "body-parser";
import crypto from "crypto";

const engine = new Liquid({
  extname: ".liquid",
});

const app = new App();

// Environment variables
const appId = process.env.PINTEREST_APP_ID;
const appSecret = process.env.PINTEREST_APP_SECRET;
const redirectUri = process.env.REDIRECT_URI || "http://localhost:3000/callback";
const scope = "boards:read,pins:read"; // Adjust scope as needed
let token = {};

// Generate a random state for CSRF protection
const generateState = () => {
  return crypto.randomBytes(16).toString("hex");
};

// Setup middleware
app.use(logger());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', sirv(process.env.NODE_ENV === 'development' ? 'client' : 'dist'));
app.use('/public', sirv('public'));
  

// Route to initiate OAuth flow
app.get("/login", (req, res) => {
  const state = generateState();
  // Store state in a session or cookie for verification later

  const authUrl = new URL("https://www.pinterest.com/oauth/");
  authUrl.searchParams.append("client_id", appId);
  authUrl.searchParams.append("redirect_uri", redirectUri);
  authUrl.searchParams.append("response_type", "code");
  authUrl.searchParams.append("scope", scope);
  authUrl.searchParams.append("state", state);

  res.redirect(authUrl.toString());
});

// Callback route after authorization
app.get("/callback", async (req, res) => {
  const { code, state } = req.query;

  // Verify state matches what was sent (CSRF protection)
  // If not using session, you can skip this check for now

  try {
    // Exchange code for access token
    const tokenResponse = await fetch(
      "https://api.pinterest.com/v5/oauth/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(`${appId}:${appSecret}`).toString(
            "base64"
          )}`,
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code,
          redirect_uri: redirectUri,
        }),
      }
    );

    if (!tokenResponse.ok) {
      throw new Error(`Token exchange failed: ${tokenResponse.statusText}`);
    }

    const tokenData = await tokenResponse.json();
    const { access_token, refresh_token } = tokenData;

    // Store tokens securely (in session, db, etc.)
    token = { access_token, refresh_token };

    // For demo purposes, we'll just display them
    res.redirect("/");
  } catch (error) {
    console.error("OAuth Error:", error);
    res.status(500).send(`Authentication error: ${error.message}`);
  }
});


// Home page
app.get("/", (req, res) => {
  res.send(`
    <h1>Pinterest API Integration</h1>
    <a href="/login">Login with Pinterest</a>
    `);
});

const renderTemplate = (template, data) => {
  const templateData = {
    NODE_ENV: process.env.NODE_ENV || "production",
    ...data,
  };

  return engine.renderFileSync(template, templateData);
};

// Start the server
app.listen(3000, () =>
  console.log("Server available on http://localhost:3000")
);
```
<br>

### Use first data with liquid in HTML & CSS

### Fetch pins data with endpoint

🔗 SOURCE Pinterest developer: https://developers.pinterest.com/docs/api/v5/pins-get/

### Fetch boards with set amount pins
### Fetch boards by id

### Access down
#### *Due to too many requests*

# 🌶️ Week 3

### Drag and drop tutorial
### Drag and drop codepen with Cyd
#### Const error
#### Container --> dropzone
#### Script niet goed gelinked

