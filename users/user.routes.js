const express = require('express');
const router = express.Router();

const jwtCheck = require('../configs/guards');
const wrapper = require('../configs/wrapper');
const User = require('./user.model');

router.post('', wrapper.wrapAsync(async (req, res, next) => {
    const user = new User({
        email: req.body.email,
        email_verified: req.body.email_verified,
        name: req.body.name,
        nickname: req.body.nickname,
        picture: req.body.picture,
        userId: req.body.userId
    });
    const result = await User.addUser();
    res.json(result);
}));

module.exports = router;