const express = require("express");
const path = require("path");
const app = express();
const proxy = require("http-proxy-middleware");

const apiProxyTarget = "http://localhost:8000/graphql";
app.use(express.static("public"));
if (apiProxyTarget) {
  app.use("/graphql", proxy.createProxyMiddleware({ target: apiProxyTarget }));
}

app.listen(3000, function () {
  console.log("App started on port 3000");
});

app.get("/", (req, res) => res.sendFile(path.resolve(__dirname, "index.html")));
