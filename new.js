import express from "express";
import db from "../database/db.js";
import bcrypt from "bcrypt";

const router = express.Router();
const saltRounds = 10; // change the hash to 12 in production for more security

// GET /login
router.get("/", (req, res) => {
    const errMsg = req.query.errMsg;
    res.render("login.ejs", { message: errMsg });
});

// POST /login
router.post("/", async (req, res) => {
    try {
        const { username, password } = req.body;
console.log("1");
        const userQuery = await db.query(
            "SELECT username, password FROM users WHERE username = $1",
            [username],
        );
console.log("2");

        const userExist = userQuery.rows.length > 0;
console.log("3");

        if (userExist) {
            const dbUserData = userQuery.rows[0];
            // const hash = dbUserData.password; // hashed password from db
console.log("4");

            bcrypt.compare(password, dbUserData.password, function (err, result) {
                if (result === true) {
console.log("5");

                    res.redirect(
                        `/home?username=${encodeURIComponent(username)}`,
                    );
                } else {
console.log("6");

                    const errMsg = "Incorrect password.";
                    res.redirect(`/login?errMsg=${encodeURIComponent(errMsg)}`);
                }
            });
            /** if (password === dbUserData.password) {
                res.redirect(`/home?username=${encodeURIComponent(username)}`);
            } else {
                const errMsg = "Incorrect password.";
                res.redirect(`/login?errMsg=${encodeURIComponent(errMsg)}`);
            } */
        } else {
console.log("7");

            const errMsg = "User does not exist.";
            res.redirect(`/login?errMsg=${encodeURIComponent(errMsg)}`);
        }
    } catch (error) {
console.log("8");

        console.error(error.message);
        res.status(500).send("Something went wrong. Please try again.");
    }
});

export default router;
