const mongoose = require('mongoose')

const serverThemeSchema = new mongoose.Schema({
    name: {
        type: String,
        default: 'Dark',
        required: true
    }
},{timestamps: true})

module.exports = mongoose.model("ServerTheme",serverThemeSchema)