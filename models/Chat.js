const {Schema, model, ObjectId} = require('mongoose');

const chatSchema = new Schema({
    users: {
        type: [ObjectId, ObjectId],
    },
    createAt: {
        type: Date,
    },
    messages: {
        type: [ObjectId],
        ref: 'Message',
    },
})

module.exports = model('Chat', chatSchema)
