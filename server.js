const express = require("express");
const path = require("path");
const app = express();
const router = express.Router();

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

router.get("*", function (request, response) {
  response.sendFile(path.join(__dirname, "./app/build/index.html"));
});

app.use("/", router);

app.listen(process.env.PORT || 8080);
