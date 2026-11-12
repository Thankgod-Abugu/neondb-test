import express from "express";
import "dotenv/config";
import bodyParser from "body-parser";
import registerRouter from "./routes/register.js";
import loginRouter from "./routes/login.js"

const app = express();
const port = 3000;

// middlewares
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static("public"));

app.set("view engine", "ejs");

/** ROUTES */
app.get("/", (req, res) => {
    res.render("register.ejs");
});

app.use("/register", registerRouter);
app.use("/login", loginRouter);

// home route
app.get("/home", (req, res) => {
    // read username from url query (?username=...)
    const username = req.query.username || "Guest";
    // render thee home page and pass the username variable
    res.render("home.ejs", { message: username });
});

app.listen(port, () => {
    console.log(`server running on port ${port}`);
});
