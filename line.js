const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const lineSchema = new mongoose.Schema({

    index: Number,
    character: String,
    _id: Schema.Types.ObjectId,
    text: String,

    


})

module.exports = mongoose.model('line',lineSchema);