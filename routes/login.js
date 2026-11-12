import express from "express";
import bcrypt from "bcrypt";
import db from "../database/db.js";

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
        
        const userExist = userQuery.rows.length === 1;
        console.log(userQuery.rows);

        if (userExist) {
            const dbUserData = userQuery.rows[0];
            const storedHash = dbUserData.password; // hashed password from db

            bcrypt.compare(password, storedHash, function (err, result) {
                if (result === true) {
                    res.redirect(
                        `/home?username=${encodeURIComponent(username)}`,
                    );
                } else {
                    const errMsg = "Incorrect password.";
                    res.redirect(`/login?errMsg=${encodeURIComponent(errMsg)}`);
                }
            });
        } else {
            const errMsg = "User does not exist.";
            res.redirect(`/login?errMsg=${encodeURIComponent(errMsg)}`);
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Something went wrong. Please try again.");
    }
});

export default router;
