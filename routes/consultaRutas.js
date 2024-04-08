const express = require('express');
const rutas = express.Router();
const MenuModelo = require('../models/Menu');

//Obtener todos los productos
rutas.get('/', async (req, res) => {
    try {
        const obtener = await MenuModelo.find();
        res.json(obtener);
    }
    catch (error) {
        res.status(404).json({ mensaje: error.message });
    }
});

//AGREGAR productos
rutas.post('/agregar', async (req, res) => {
    const nuevaPizza = new MenuModelo({
        nombre: req.body.nombre,
        ingrediente: req.body.ingrediente,
        precio: req.body.precio
    });

    try {
        const guardarPizza = await nuevaPizza.save();
        res.status(201).json(guardarPizza);
    } catch (error) {
        res.status(404).json({ mensaje: error.mensaje });
    }
});

//EDITAR productos
rutas.put('/editar/:id', async (req, res) => {
    try {
        const actualizarPizza = await MenuModelo.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(201).json(actualizarPizza);
    } catch (error) {
        res.status(404).json({ mensaje: error.mensaje });
    }
});

//ELIMINAR producto
rutas.delete('/eliminar/:id', async (req, res) => {
    try {
        const eliminarPizza = await MenuModelo.findByIdAndDelete(req.params.id);
        res.json({ message: 'Tarea eliminada correctamente' });
    } catch (error) {
        res.status(404).json({ mensaje: error.mensaje });
    }
});

//Obtener la pizza con el precio mas bajo
rutas.get('/obtener-economico', async (req, res) => {
    try {
        const pizzaEconomica = await MenuModelo.findOne().sort({ precio: 1 }); //+1 ascendente -1 descendente
        res.json(pizzaEconomica);
    } catch (error) {
        res.status(404).json({ mensaje: error.mensaje });
    }
});

//Obtener las pizzas que tengan pina
rutas.get('/con-pina', async (req, res) => {
    try {
        const pizzasConPina = await MenuModelo.find({ ingrediente: { $regex: 'pina', $options: 'i' } });
        
        if (pizzasConPina.length === 0) {
            return res.status(404).json({ mensaje: 'No se encontraron pizzas con piña' });
        }
        
        res.json(pizzasConPina);
    } catch (error) {
        res.status(404).json({ mensaje: error.message });
    }
});

module.exports = rutas;
