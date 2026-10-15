import express from "express";
import db from "../database/db.js";
import bcrypt from "bcrypt";

const router = express.Router();
const saltRounds = 10; // change the hash to 12 in production for more security

// GET /register
router.get("/", (req, res) => {
    const errMsg = req.query.errMsg;
    res.render("register.ejs", { message: errMsg });
});

// POST /register
router.post("/", async (req, res) => {
    try {
        const { username, password } = req.body;
        const userNameQuery = await db.query(
            "SELECT username FROM users WHERE username = $1",
            [username],
        );
        // console.log(userNameQuery.rows);
        const userExist = userNameQuery.rows.length > 0;

        if (userExist) {
            const errMsg = "user already exists";
            res.redirect(`/register?errMsg=${encodeURIComponent(errMsg)}`);
        } else {
            bcrypt.hash(password, saltRounds, async function (err, hash) {
                await db.query(
                    "INSERT INTO users (username, password) VALUES ($1, $2)",
                    [username, hash],
                );
                res.redirect(`/home?username=${encodeURIComponent(username)}`);
            });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Something went wrong. Please try again.");
    }
});

export default router;
