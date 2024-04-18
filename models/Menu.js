const mongoose = require('mongoose');

const menuEsquema = new mongoose.Schema({
    nombre : String,
    ingrediente : String,
    precio : Number
})

const MenuModelo = mongoose.model('Menu',menuEsquema,'sabores');
module.exports = MenuModelo;