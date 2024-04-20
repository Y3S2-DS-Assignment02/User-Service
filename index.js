const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { connectToDatabase } = require("./database/index");

//Middleware
app.use(bodyParser.json());
//middleware for cookies
app.use(cookieParser());

app.use("/api/demo", require("./routes/demoRoute"));
app.use("/api/user-service", require("./routes/registerRoutes"));
app.use("/api/user-service", require("./routes/authRoutes"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  connectToDatabase();
  console.log(`Server running on port ${PORT}`);
});
