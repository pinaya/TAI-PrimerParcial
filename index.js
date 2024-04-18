const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Usuario = require('./models/Usuario');
require('dotenv').config();

//importar rutas
const consultaRutas = require('./routes/consultaRutas');
const authRutas = require('./routes/authRutas');
const UsuarioModel = require('./models/Usuario');

//configuraciones
const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGO_URL;

//configurar express para JSON
app.use(express.json());

//conexion con la DB
mongoose.connect(MONGODB_URI)
    .then(() => {
                console.log('conexion con MONGODB exitosa');
                app.listen(PORT, () => { console.log(`Servidor en funcionando en puerto: ${PORT}`) });
            })
    .catch( error => console.log("Error de conexion con MongoDB", error));

//autenticar
const autenticar = async (req,res,next)=>{
    try {
        const token = req.headers.authorization?.split(' ')[1];
        console.log(token);

        if(!token){
            res.status(401).json({message: 'No existe el token de autenticacion'})
        }

        const decodificar = jwt.verify(token,'clave_secreta');
        req.usuario = await Usuario.findById(decodificar.userId);
        next();

    } catch (error) {
        res.status(404).json({message: error.message});
    }
}

//CON AUTENTICACION
app.use('/auth',authRutas);
app.use('/consulta-pizza',
//autenticar,
consultaRutas);

//SIN AUTENTICACION
//app.use('/auth',authRutas);
//app.use('/consulta-pizza',consultaRutas);
