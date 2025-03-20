const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DrinkSchema = new Schema({
    uuid: String,
    name: String,
    url_name: String,
    tags: [{value: String, category: String}],
    etoh: Number,
    volume: Number,
    override_volume: Number,
    ingredients: [{amount: Number, unit: String, ingredient: String}],
    garnish: String,
    glass: String,
    instructions: String,
    description: String,
    footnotes: String,
    image: String,
    timestamp: Date,
});

const Drinks = mongoose.model('drink', DrinkSchema);

module.exports = Drinks;