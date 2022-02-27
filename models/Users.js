const {Schema, model} = require('mongoose');

const userSchema = new Schema({
    email: {
        type: String,
    },
    passwordHash: {
        type: String,
    },
    name: {
        type: String,
    },
    contactPhone: {
        type: String,
    },
})
module.exports = model('User', userSchema);

