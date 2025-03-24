require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const meetingsRouter = require("./routes/meetings");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Atlas Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api/meetings", meetingsRouter);

app.get("/", (req, res) => {
  res.send("Meeting Scheduler API");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
