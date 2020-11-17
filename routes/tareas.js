const express = require('express');
const router = express.Router();
const tareasController = require('../Controllers/TareasController');
const { check } = require('express-validator');
const auth = require('../middleware/auth');


//Crea una tarea
// api/tareas con tipo post
router.post('/',
    auth,
    [
        check('nombre', 'El nombre de la tarea es obligatorio').not().isEmpty(),
        check('proyecto', 'El proyecto es obligatorio').not().isEmpty()
    ],
    tareasController.crearTarea
);


//Obtener tareas
// api/tareas con tipo get
router.get('/',
    auth,
    tareasController.obtenerTareas
);

//Actualizar tarea
// api/tareas con tipo put
router.put('/:id',
    auth,
    [
        check('nombre', 'El nombre de la tarea es obligatorio').not().isEmpty(),
        check('proyecto', 'El proyecto es obligatorio').not().isEmpty()
    ],
    tareasController.actualizarTarea
);




//Actualizar tarea
// api/tareas con tipo delete
router.delete('/:id',
    auth,
    tareasController.borrarTarea
);



module.exports = router;