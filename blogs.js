const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const addblogsModel = require("./models/blogs")
const userModel = require('./models/user')
var jwt = require('jsonwebtoken');
secret = "FORM"
const cors = require("cors")

router.use(bodyParser.json())

router.use(cors({
    origin: "*"
}))

router.use('/', (req, res, next) => {

    if (req.headers.authorization) {

        const token = req.headers.authorization.split("FORM")[1];
        try {
            jwt.verify(token, secret, async function (err, decoded) {
                if (err) {
                    res.status(400).json(err.message)
                }
                console.log(decoded)
                const user = await userModel.findOne({ _id: decoded.data });

                req.user = user.email;

                next();
            });
        }
        catch (e) {
            res.status(400).json(e.message)
        }
    }
    else {
        res.status(400).json({ message: "user invalid" })
    }

})

router.get('/', async (req, res) => {
    try {
        const posts = await addblogsModel.find({ userid: req.user });
        res.status(200).json(posts);
        console.log(posts)
    } catch (e) {
        console.log(e.message)
        res.status(400).json({
            message: e.message
        })
    }
})


router.post('/', async (req, res) => {

    console.log(req.body)

    try {
        const blog = await addblogsModel.create({

            title: req.body.title,
            description: req.body.description,
            author: req.body.author,
            userid: req.user
        })
        res.status(200).json({
            message: "success",
            blog
        })
    }

    catch (e) {
        console.log(e.message)
        res.status(400).json({
            message: e.message

        })
    }
})


module.exports = router