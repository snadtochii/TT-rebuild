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
    userId: {
        type: String,
        required: true
    }
});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.addUser = async (newUser) => {
   const user = await User.findOne({userId: newUser.userId});
   if (!user) {
       return await newUser.save();
   } else {
       return;
   }
}
