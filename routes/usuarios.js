//rutas para crear usuarios
//importan express
const express=require('express');
const router=express.Router();
const usuarioController=require('../Controllers/UsuarioController');
const {check } =require('express-validator');
//api/usuarios y de tipo post
router.post('/',
[
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('email','Agrega un email válido').isEmail(),
    check('password','El password debe ser minimo de 6 caracteres').isLength({min:6})
],
usuarioController.crearUsuario
)

module.exports=router;