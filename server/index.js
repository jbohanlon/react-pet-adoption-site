import express from "express";
import React from "react";
import { renderToNodeStream } from "react-dom/server";
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
app.use((request, response) => {
  response.write(parts[0]);
  const reactMarkup = (
    <ServerLocation url={request.url}>
      <App />
    </ServerLocation>
  );

  const stream = renderToNodeStream(reactMarkup);

  stream.pipe(response, { end: false });

  stream.on("end", () => {
    response.write(parts[1]);
    response.end();
  });
});

console.log("Listening on " + PORT); // eslint-disable-line no-console
app.listen(PORT);
