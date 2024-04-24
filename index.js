const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { connectToDatabase } = require("./database/index");

//Middleware
app.use(bodyParser.json());
app.use(
  cors({
    origin: "*",
  })
);
//middleware for cookies
app.use(cookieParser());

app.use("/api/user-service", require("./routes/registerRoutes"));
app.use("/api/user-service", require("./routes/authRoutes"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  connectToDatabase();
  console.log(`Server running on port ${PORT}`);
});
