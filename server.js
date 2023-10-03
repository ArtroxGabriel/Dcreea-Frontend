import express from "express";

const app = express();

// Serve only the static files form the dist directory
app.use(express.static("./dist/DCREAE-Front"));

app.get("/*", (req, res) => res.sendFile("index.html", { root: "dist/DCREAE-Front/" }));

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);
