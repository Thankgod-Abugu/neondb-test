import express from "express";
import pg from "pg";
import "dotenv/config";
import bodyParser from "body-parser";
import {attachDatabasePool} from "@vercel/functions"

const app = express();
const port = 3000;

// connect db
const db = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
});
attachDatabasePool(db);

// middlewares
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static("public"));

app.set("view engine", "ejs");

/** ROUTES */
// register routes
app.get("/", (req, res) => {
    res.render("register.ejs");
});

app.post("/register", async (req, res) => {
    try {
        const { username, password } = req.body;
        const userNameQuery = await db.query(
            "SELECT username FROM users WHERE username = $1",
            [username],
        );
        const userExist = userNameQuery.rows.length > 0;

        if (userExist) {
            let errMsg = "user already exists";
            console.log(userNameQuery.rows[0].username);
            // res.render("register.ejs", { message: "user already exists" });
            res.redirect(`/register?errMsg=${encodeURIComponent(errMsg)}`);
        } else {
            const registerUser = await db.query(
                "INSERT INTO users (username, password) VALUES ($1, $2)",
                [username, password],
            );

            res.redirect(`/home?username=${encodeURIComponent(username)}`);
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Something went wrong. Please try again.");
    }
});

app.get("/register", (req, res) => {
    const errMsg = req.query.errMsg;

    // res.render("register.ejs");
    res.render("register.ejs", { message: errMsg });
});

// home route
app.get("/home", (req, res) => {
    // read username from url query (?username=...)
    const username = req.query.username || "Guest";
    // render thee home page and pass the username variable
    res.render("home.ejs", { message: username });
});

// login route
app.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        const userQuery = await db.query(
            "SELECT username, password FROM users WHERE username = $1",
            [username],
        );
        // console.log(userQuery.rows);
        const userExist = userQuery.rows.length > 0;

        if (userExist) {
            const dbUserData = userQuery.rows[0];

            if (password === dbUserData.password) {
                res.redirect(`/home?username=${encodeURIComponent(username)}`);
            } else {
                let errMsg = "incorrect password";
                res.redirect(`/login?errMsg=${encodeURIComponent(errMsg)}`);
            }
        } else {
            let errMsg = "user does not exist";
            res.redirect(`/login?errMsg=${encodeURIComponent(errMsg)}`);
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Something went wrong. Please try again.");
    }
});

app.get("/login", (req, res) => {
    const errMsg = req.query.errMsg;

    //res.render("login.ejs");
    res.render("login.ejs", { message: errMsg });
});

app.listen(port, () => {
    console.log(`server running on port ${port}`);
});
