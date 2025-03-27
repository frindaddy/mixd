const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MenuSchema = new Schema({
    menu_id: String,
    name: String,
    drinks: [String]
});

const Menus = mongoose.model('menu', MenuSchema);

module.exports = Menus;