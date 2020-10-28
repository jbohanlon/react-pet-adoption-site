import express from "express";
import React from "react";
import { renderToString } from "react-dom/server";
import { ServerLocation } from "@reach/router";
import fs from "fs";
import App from "../src/App";

const PORT = process.env.PORT || 3000;

const html = fs.readFileSync("dist/index.html").toString();

// You're treating index.html as a string, so you can
// split it on the part you want to replace
const parts = html.split("not rendered");

const app = express();

// Statically serve everything from the dist directory
app.use("/dist", express.static("dist"));
app.use((request, result) => {
  const reactMarkup = (
    <ServerLocation url={request.url}>
      <App />
    </ServerLocation>
  );
  result.send(parts[0] + renderToString(reactMarkup) + parts[1]);
  result.end();
});

console.log("Listening on " + PORT); // eslint-disable-line no-console
app.listen(PORT);
