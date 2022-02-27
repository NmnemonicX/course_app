const {Schema, model} = require('mongoose');

const advertisementSchema = new Schema({
    shortText: {
        type: String,
    },
    description: {
        type: String,
    },
    images: {
        type: [String],
    },
    tags: {
        type: [String],
    },
    userId:{
        type:String
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
})
module.exports = model('advertisement', advertisementSchema);
