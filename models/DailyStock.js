const mongoose = require('mongoose');

const StockSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    open: {
        type: Number,
        required: true,
    },
    high: {
        type: Number,
        required: true,
    },
    low: {
        type: Number,
        required: true,
    },
    close: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
});

module.exports = mongoose.model('DailyStock', StockSchema,'DailyStock');
