const express = require('express');
const router = express.Router();
const proyectosController = require('../Controllers/ProyectosController');
const { check } = require('express-validator');
const auth = require('../middleware/auth');
//Crea proyectos
// api/proyectos para crear proyectos
router.post('/',
    auth,
    [
        check('nombre', 'El nombre del proyecto es obligatorio').not().isEmpty()
    ],
    proyectosController.crearProyecto
);

//oobtener proyectos
router.get('/',
    auth,
    proyectosController.obtenerProyectos
);

//Actualiza un proyecto

router.put('/:id',
    auth,
    [
        check('nombre', 'El nombre del proyecto es obligatorio').not().isEmpty()
    ],
    proyectosController.actualizaProyectos
)

router.delete('/:id',
    auth,
    proyectosController.eliminarProyecto
)

module.exports = router;