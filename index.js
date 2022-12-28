const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const User = require("./models/user")
const { body, validationResult } = require("express-validator")
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const secret = "FORM"
const Blogs = require("./blogs")
// const router = express.Router();

const app = express()


app.use("/api/Blogs",Blogs)
app.use(bodyParser.json())

mongoose.connect('mongodb://localhost:27017/my_dataBase')  // my_dataBase
    .then(console.log("connected to db"))
    .catch(console.error);


app.post("/signup", body("email").isEmail(), body("password").isLength({ min: 5, max: 15 }),
    async (req, res) => {

        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { email, password } = req.body
            let user = await User.findOne({ email })

            if (user) {
                return (res.status(401).json({
                    status: "Failed",
                    message: "Email already exists"
                }))
            }

            bcrypt.hash(password, 10, async function (err, hash) {
                if (err) {
                    res.status(400).json({
                        status: "Failed",
                        message: err.message
                    })
                }

                const user = await User.create({
                    email,
                    password: hash
                })
                return (
                    res.json({
                        status: "Success",
                        message: "Regestration Successfull"
                    }))
            });

        }
        catch (e) {
            res.status(500).json({
                status: "Failed",
                message: e.message
            })
        }
    })

//.........................................................................................................................................

app.post("/login", body("email").isEmail(),
    async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email,password } = req.body
        let user = await User.findOne({ email })

        if (!user) {
            return (res.status(401).json({
                status: "Failed",
                message: "Invalid User"
            }))
        }

        bcrypt.compare(password, user.password, function (err, result) {

            if (err) {
                return res.status(500).json({
                    status: "Failed",
                    message: err.message
                });
            }

            if (result) {
                // token will be used to track the user for further operation
                const token = jwt.sign({
                    exp: Math.floor(Date.now() / 1000) + (60 * 60),
                    data: user._id
                  }, secret);
        

                res.status(200).json({
                    status: "Sucess",
                    message: "Login successful ",
                    token
                });
            } else {
                res.status(401).json({
                    status: "Falied",
                    message: "Invalid credentials !! Please provide correct email/password"
                });
            }

        })

    })




// app.get("/", (req, res) => {
//     res.send("Hello World")
// })

app.listen(5000, console.log("server running at port 5000"))