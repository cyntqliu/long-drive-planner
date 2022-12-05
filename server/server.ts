import express from "express";
import path from "path";

const app = express()
const PORT = 8080;

app.get("/foo/:place", (req, res) => {
  console.log(req.params.place)
  res.send({"test":"a"});
});

// load the compiled react files, which will serve /index.html
const reactPath = path.resolve(__dirname, "..", "build");
app.use(express.static(reactPath));

// for all other routes, render index.html and let react router handle it
app.get("*", (req, res) => {
  res.sendFile(path.join(reactPath, "index.html"));
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
