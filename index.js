import express from "express";
import pg from "pg";
import "dotenv/config";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

// connect db
const db = new pg.Client({
    connectionString: process.env.DATABASE_URL,
});
db.connect();

// middlewares
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static("public"));

app.set("view engine", "ejs");

// register route
app.get("/", (req, res) => {
    res.render("register.ejs");
});

app.post("/register", async (req, res) => {
    try {
        const { username, password } = req.body;
        const userExist = await db.query(
            "SELECT username FROM users WHERE username = $1",
            [username],
        );

        if (userExist.rows.length > 0) {
            console.log(userExist.rows[0].username);
            res.render("register.ejs", { message: "user already exists" });
        } else {
            const registerUser = await db.query(
                "INSERT INTO users (username, password) VALUES ($1, $2)",
                [username, password],
            );

            res.redirect(`/home?username=${encodeURIComponent(username)}`);
        }
    } catch (error) {
        console.error(error.message);
    }
});

// home route
app.get("/home", (req, res) => {
    // read username from url query (?username=...)
    const username = req.query.username || "Guest";
    // render thee home page and pass the username variable
    res.render("home.ejs", { message: username });
});

// login route
app.get("/login", (req, res) => {
    res.render("login.ejs");
});

app.post("/login", (req, res) => {
    // get username and password
    // check if username and password match
    try {
        const { username, password } = req.body;
    } catch (error) {}
});


app.listen(port, () => {
    console.log(`server running on port ${port}`);
});
