const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IngredientSchema = new Schema({
    uuid: String,
    name: String,
    abv: Number,
    category: String
});

const Ingredients = mongoose.model('ingredient', IngredientSchema);

module.exports = Ingredients;