const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DrinkSchema = new Schema({
    name: String,
    tags: [{value: String, category: String}],
    abv: Number,
    ingredients: [{amount: Number, unit: String, ingredient: String}],
    garnish: String,
    description: String,
    footnotes: String,
    image: String,
    timestamp: Date,
});

const Drinks = mongoose.model('drink', DrinkSchema);

module.exports = Drinks;