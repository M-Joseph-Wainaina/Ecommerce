const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const dbConnect = require("./config/dbConnect.js");
const authRouter = require("./routes/authRoutes.js");
const bodyParser = require('body-parser');
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const cookieParser = require('cookie-parser');


dbConnect();
const PORT = process.env.PORT || 4000;

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use("/api/user", authRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
});
