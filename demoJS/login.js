import express from "express";
import db from "../db.js";

const router = express.Router();

// GET /login
router.get("/", (req, res) => {
    const errMsg = req.query.errMsg;
    res.render("login.ejs", { message: errMsg });
});

// POST /login
router.post("/", async (req, res) => {
    try {
        const { username, password } = req.body;

        const userQuery = await db.query(
            "SELECT username, password FROM users WHERE username = $1",
            [username],
        );
        const userExist = userQuery.rows.length > 0;

        if (userExist) {
            const dbUserData = userQuery.rows[0];

            if (password === dbUserData.password) {
                res.redirect(`/home?username=${encodeURIComponent(username)}`);
            } else {
                const errMsg = "incorrect password";
                res.redirect(`/login?errMsg=${encodeURIComponent(errMsg)}`);
            }
        } else {
            const errMsg = "user does not exist";
            res.redirect(`/login?errMsg=${encodeURIComponent(errMsg)}`);
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Something went wrong. Please try again.");
    }
});

export default router;
