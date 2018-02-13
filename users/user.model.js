const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    email_verified: {
        type: Boolean
    },
    name: {
        type: String
    },
    nickname: {
        type: String,
    },
    picture: {
        type: String
    },
    sub: {
        type: String,
        required: true
    },
    updated_at: {
        type: Date
    }
});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.addUser = async (newUser) => {
    const user = await User.findOne({ sub: newUser.sub });
    if (!user) {
        return await newUser.save();
    } else {
        return;
    }
}


module.exports.getUserByEmail = async (email) => {
    const user = await User.findOne({ email });
    console.log(user);
    if (user) { 
        return user;
    } else {
        throw new Error('User not found');
    }
}