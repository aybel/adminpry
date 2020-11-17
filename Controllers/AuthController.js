const Usuario = require('../Modelos/Usuario');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.autenticarUsaurio = async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }

    //extraer datos
    const { email, password } = req.body;
    try {
        //Revisar que el usuario este registrado
        let usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(400).json({ msg: "El usario no existe" });
        }

        //Revisar el password
        const passCorrecto = await bcryptjs.compare(password, usuario.password);
        if (!passCorrecto) {
            return res.status(400).json({ msg: "La contraseña es incorrecta" });
        }

        //si todo es correcto crear el jwt
        const payload = {
            usuario: {
                id: usuario.id
            }
        };

        //firmar el token
        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 86400 //1 hora
        }, (error, token) => {
            if (error) throw error;

            res.json({ token: token })
        });

    } catch (error) {
        console.log(error);
    }
}

//obtiene usario autenticado

exports.usuarioAutenticado = async (req, res) => {
    //console.log("entro a usario autenticado");
    try {
        //console.log(req.usuario);
        const usuario =await Usuario.findById(req.usuario).select('-password');
        //console.log(usuario);
        res.json({ usuario });

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hubo un error perroo' });
    }
}