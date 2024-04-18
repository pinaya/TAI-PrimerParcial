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
        res.json({ message: 'Pizza eliminada correctamente' });
    } catch (error) {
        res.status(404).json({ mensaje: error.mensaje });
    }
});

//CONSULTAS AVANZADAS
//01. Obtener la pizza con el precio mas bajo
rutas.get('/obtener-economico', async (req, res) => {
    try {
        const pizzaEconomica = await MenuModelo.findOne().sort({ precio: 1 }); //+1 ascendente -1 descendente
        res.json(pizzaEconomica);
    } catch (error) {
        res.status(404).json({ mensaje: error.mensaje });
    }
});

//02. Obtener las pizzas que tengan pina
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

//03. Obtener pizzas con precio menor o igual a cierto valor
rutas.get('/precio-menor-o-igual/:precio', async (req, res) => {
    try {
        const { precio } = req.params;
        const pizzas = await MenuModelo.find({ precio: { $lte: parseInt(precio) } });
        
        if (pizzas.length === 0) {
            return res.status(404).json({ mensaje: 'No se encontraron pizzas dentro de ese rango de precio' });
        }
        
        res.json(pizzas);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al procesar la consulta' });
    }
});

//04. Busca pizzas que tenga uno o mas ingredientes en especifico y un precio maximo que el cliente esta dispuesto a pagar
rutas.get('/por-ingredientes-y-precio-maximo', async (req, res) => {
    try {
        const { ingredientes, precioMaximo } = req.query;
        const ingredientesArray = ingredientes.split(',');

        const pizzas = await MenuModelo.find({
            ingrediente: { $all: ingredientesArray },
            precio: { $lte: parseInt(precioMaximo) }
        });

        if (pizzas.length === 0) {
            return res.status(404).json({ mensaje: 'No se encontraron pizzas' });
        }

        res.json(pizzas);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al procesar la consulta' });
    }
});

//05.Buscar pizzas duplicadas
rutas.get('/nombres-duplicados', async (req, res) => {
    try {
        const pizzasDuplicadas = await MenuModelo.aggregate([
            // Agrupar por el campo 'nombre' y contar las ocurrencias
            { $group: { _id: "$nombre", count: { $sum: 1 } } },
            // Filtrar solo los documentos con más de una ocurrencia (duplicados)
            { $match: { count: { $gt: 1 } } }
        ]);

        // Obtener solo los nombres de las pizzas duplicadas
        const nombresDuplicados = pizzasDuplicadas.map(pizza => pizza._id);

        if (nombresDuplicados.length === 0) {
            return res.status(404).json({ mensaje: 'No se encontraron nombres de pizza duplicados' });
        }

        res.json({ nombresDuplicados });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al procesar la consulta' });
    }
});

//06.Ordenar pizzas en orden alfabético
rutas.get('/pizzas-alfabeticas', async (req, res) => {
    try {
        const pizzasOrdenadas = await MenuModelo.find()
            .sort({ nombre: 1 }) // Ordenar por nombre en orden ascendente (alfabético)
            .exec();

        if (pizzasOrdenadas.length === 0) {
            return res.status(404).json({ mensaje: 'No se encontraron pizzas' });
        }

        res.json(pizzasOrdenadas);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al procesar la consulta' });
    }
});

//07.

//08.

//09.

//10.

module.exports = rutas;
