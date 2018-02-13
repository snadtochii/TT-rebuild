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
        sub: req.body.sub,
        updated_at: new Date(req.body.updated_at)
    });
    console.log(user, req.body);
    
    const result = await User.addUser(user);
    res.json(result);
}));

router.get('', wrapper.wrapAsync(async (req, res, next) => {
    const email = req.query.email;
    console.log(email);
    const result = await User.getUserByEmail(email);
    console.log(result);
    res.json(result);
}));

module.exports = router;