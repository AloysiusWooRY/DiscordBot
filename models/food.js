const mongoose = require("mongoose")
const foodSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: String,
    userID: String,
    food: String,
    count: Number
})

module.exports = mongoose.model("Foods", foodSchema);