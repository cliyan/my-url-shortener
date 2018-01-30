const mongoose = require('mongoose');

const shortenSchema = new mongoose.Schema({
    url: {type: String, required: true},
    shorten: {type: String, required: true}
});

const Shorten = mongoose.model('Shorten', shortenSchema);

module.exports = Shorten;