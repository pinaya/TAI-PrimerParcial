const express = require('express');
const rutas = express.Router();
const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//REGISTRAR usuario
rutas.post('/registro', async (req, res) => {
    try {
        const { nombreusuario, correo, contrasena } = req.body;
        const usuario = new Usuario({ nombreusuario, correo, contrasena });
        await usuario.save();
        res.status(201).json({ mensaje: 'Usuario registrado correctamente' });
    } catch (error) {
        res.status(404).json({ mensaje: error.mensaje });
    }
});

//INICIAR SESION
rutas.post('/login', async (req, res) => {
    try {
        const { correo, contrasena } = req.body;
        const usuario = await Usuario.findOne({ correo });

        //encontrar al usuario
        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado! Credencial incorrecta' });
        }

        //comparar contrasena
        const validarContrasena = await usuario.comparePassword(contrasena);
        if (!validarContrasena) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado! Vuelva a intentarlo' });
        }
        const token = jwt.sign({ userId: usuario._id }, 'clave_secreta', { expiresIn: '1h' });
        
        usuario.tokenSesion = token; // Guarda el token de sesión
        await usuario.save();

        res.json(token);

    } catch (error) {
        res.status(404).json({ mensaje: error.mensaje });
    }
});

//CERRAR SESION
rutas.post('/logout', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        const decodificar = jwt.verify(token, 'clave_secreta');
        const usuario = await Usuario.findById(decodificar.userId);

        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        usuario.tokenSesion = null; // Invalida el token de sesión
        await usuario.save();

        res.json({ mensaje: 'Sesión cerrada correctamente' });
    } catch (error) {
        res.status(401).json({ mensaje: 'No se pudo cerrar sesión' });
    }
});

module.exports = rutas;