// Home page
app.get("/", async (req, res) => {
    let pinData = [];

    if (token.access_token) {
      fetch
      data =
      const pins = await fetch("https://api.pinterest.com/v5/pins", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token.access_token,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      pinData = await pins.json();
      console.log(pinData.items[0])
    }
    
    return res.send(
      renderTemplate("server/views/index.liquid", {
        title: "After party",
        token,
        pinData,
      })
    );
  });