const mongoose = require('mongoose');

const usuarioEsquema = new mongoose.Schema({
    nombre : String,
    contrasena : String
})

const UsuarioModel = mongoose.model('Usuario',usuarioEsquema,'usuario');
module.exports = UsuarioModel;