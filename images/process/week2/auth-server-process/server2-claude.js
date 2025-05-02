import "dotenv/config";
import { App } from "@tinyhttp/app";
import { logger } from "@tinyhttp/logger";
import { Liquid } from "liquidjs";
import sirv from "sirv";

// import session from 'express-session';

const engine = new Liquid({
  extname: ".liquid",
});

const app = new App();
app
  .use(logger())
  .use("/", sirv(process.env.NODE_ENV === "development" ? "client" : "dist"))
  .listen(3000, () => console.log("Server available on http://localhost:3000"));


// Added API key
const appId = process.env.PINTEREST_APP_ID;
const appSecret = process.env.PINTEREST_APP_SECRET;
const apiAuth = process.env.PINTEREST_AUTH_URL;

let isLoggedIn = false;
let token;

app.get("/", async (req, res) => {
    const { code, state } = req.query;
  
    // If we received a code from Pinterest, exchange it for an access token
    if (code) {
      try {
        // Make sure we're using the correct token URL
        const tokenUrl = "https://api.pinterest.com/v5/oauth/token";
  
        const params = new URLSearchParams({
          grant_type: "authorization_code",
          code,
          redirect_uri: "http://localhost:3000/",
          client_id: appId,
          client_secret: appSecret,
        });
  
        // Exchange authorization code for access token
        const tokenResponse = await fetch(tokenUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: params.toString()
        });
  
        // Get the response as text first for debugging
        const responseText = await tokenResponse.text();
        console.log("Raw response:", responseText);
  
        // Try to parse as JSON
        let tokenData;
        try {
          tokenData = JSON.parse(responseText);
        } catch (e) {
          res
            .status(400)
            .send(`Failed to parse response as JSON: ${responseText}`);
          return;
        }
  
        if (tokenData.access_token) {
          // Save the token
          token = tokenData.access_token;
          isLoggedIn = true;
  
          // Render home page with success message
          res.send(`
            <h1>Pinterest Authentication Success!</h1>
            <p>Your access token: ${token}</p>
            <p>You can now use this token to make API calls to Pinterest.</p>
          `);
        } else {
          res
            .status(400)
            .send("Failed to get access token: " + JSON.stringify(tokenData));
        }
      } catch (error) {
        console.error("Error exchanging code for token:", error);
        res.status(500).send("Error getting access token: " + error.message);
      }
    } else {
      // Regular home page when not in OAuth flow
      res.send(`
        <h1>Pinterest API Demo</h1>
        <p>Click the button below to authenticate with Pinterest</p>
        <a href="/auth"><button>Login with Pinterest</button></a>
      `);
    }
  });
  
  // First addition of ChatGPT's code/help
  app.get("/auth", (req, res) => {
    const params = new URLSearchParams({
      response_type: "code",
      client_id: appId,
      redirect_uri: "http://localhost:3000/",
      scope: "pins:read boards:read user_accounts:read", // adjust scopes as needed
      state: "random_csrf_token", // recommended to prevent CSRF
    });
  
    res.redirect(`${apiAuth}?${params.toString()}`);
  });

  const renderTemplate = (template, data) => {
    const templateData = {
      NODE_ENV: process.env.NODE_ENV || "production",
      ...data,
    };
  
    return engine.renderFileSync(template, templateData);
  };