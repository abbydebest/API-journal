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
const redirectUri =
  process.env.REDIRECT_URI || "http://localhost:3000/callback";
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

// Example API endpoint to get user's boards
// app.get("/user-boards", async (req, res) => {
//   // In a real app, you'd get the token from session/db
//   const accessToken = req.query.token; // For testing only

//   if (!accessToken) {
//     return res.status(401).send("No access token provided");
//   }

//   try {
//     const response = await fetch("https://api.pinterest.com/v5/boards", {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });

//     if (!response.ok) {
//       throw new Error(`API request failed: ${response.statusText}`);
//     }

//     const data = await response.json();
//     res.json(data);
//   } catch (error) {
//     console.error("API Error:", error);
//     res.status(500).send(`API error: ${error.message}`);
//   }
// });

// Example endpoint to get pins from a board
// app.get("/board-pins/:boardId", async (req, res) => {
//   const { boardId } = req.params;
//   const accessToken = req.query.token; // For testing only

//   if (!accessToken) {
//     return res.status(401).send("No access token provided");
//   }

//   try {
//     const response = await fetch(
//       `https://api.pinterest.com/v5/boards/${boardId}/pins`,
//       {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         },
//       }
//     );

//     if (!response.ok) {
//       throw new Error(`API request failed: ${response.statusText}`);
//     }

//     const data = await response.json();
//     res.json(data);
//   } catch (error) {
//     console.error("API Error:", error);
//     res.status(500).send(`API error: ${error.message}`);
//   }
// });

// Home page
app.get("/", async (req, res) => {
  // let pinData = [];
  let boardData = [];
  let pinsPerBoard = {};
  let filteredBoards = [];

  if (token.access_token) {
    const boards = await fetch("https://api.pinterest.com/v5/boards?page_size=32", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token.access_token,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    boardData = await boards.json()

    const boardIds = ["315392848844176955", "315392848844279043", "315392848844176959", "315392848843935400", "315392848844176963"];
    
    console.log({items: boardData})

    filteredBoards = await boardData.items.filter((board) => {
      if (boardIds.includes(board.id)) {
        return board;
      }
    })
    console.log({filteredBoards})

    for (let index = 0; index < filteredBoards.length; index++) {
      const board = filteredBoards[index];
      const pinData = await fetch(
        `https://api.pinterest.com/v5/boards/${board.id}/pins?board_id=${board.id}&page_size=40`,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + token.access_token,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      const pins = await pinData.json()
      // console.log({pins})
      pinsPerBoard[board.id] = pins.items;

    }
    // console.log(pinsPerBoard)
  }
  return res.send(
    renderTemplate("server/views/index.liquid", {
      title: "After party",
      token,
      boardData: filteredBoards,
      pinsPerBoard,
    })
  );
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
