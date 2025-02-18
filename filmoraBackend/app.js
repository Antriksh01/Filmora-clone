require("dotenv").config();
const express = require("express");
const cors = require("cors");
const videoRouter = require("./router/videoRouter");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/video", videoRouter);

// app.get("/", (req, res) => {
//   res.send("Welcome to the Video Editing API!");
// });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
