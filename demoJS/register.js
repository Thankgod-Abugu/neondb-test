import express from "express";
import db from "../db.js";

const router = express.Router();

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
        const userExist = userNameQuery.rows.length > 0;

        if (userExist) {
            const errMsg = "user already exists";
            res.redirect(`/register?errMsg=${encodeURIComponent(errMsg)}`);
        } else {
            await db.query(
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

export default router;
