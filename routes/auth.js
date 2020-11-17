//rutas para autenticar usuarios
//importan express
const express = require('express');
const router = express.Router();
const AuthController = require('../Controllers/AuthController');
const { check } = require('express-validator');
const auth = require('../middleware/auth');

//Inicia sesión
//api/proyectos y de tipo post
router.post('/',
    AuthController.autenticarUsaurio
);

//Obtiene EL Usuario autenticado
router.get('/',
    auth,
    AuthController.usuarioAutenticado
);

module.exports = router;