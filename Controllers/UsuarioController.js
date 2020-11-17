const Usuario=require('../Modelos/Usuario');
const bcryptjs=require('bcryptjs');
const {validationResult}=require('express-validator');
const jwt=require('jsonwebtoken');

exports.crearUsuario=async(req,res)=>{
    //req.body lee los valores del body del post
    //lo que envia desde el la url de la API
    //console.log(req.body);
    //Revisar si hay errores
    const errores=validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({errores:errores.array()});
    }
    const {email,password}=req.body;
    try {

        //Revisar que el email sea único
        let usuario=await Usuario.findOne({email});

        if(usuario){
            return res.status(500).json({msg:"El usuario ya existe"})
        }   
        //crear usuarios
        usuario=new Usuario(req.body);

        //hasear password
        const salt= await bcryptjs.genSalt(10);
        usuario.password=await bcryptjs.hash(password,salt);
        //guardar usuario
        await usuario.save();
        //res.json({msg:"Usuario creado correctamente"});
        console.log(usuario);
        //crear y firmar el jwt
        const payload={
            usuario:{
               id: usuario.id
            }
        };

        //firmar el token
        jwt.sign(payload,process.env.SECRETA,{
            expiresIn:3600 //1 hora
        },(error,token)=>{
            if(error) throw error;

            res.json({token:token})
        });

        //Mensaje de confirmacion
        
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }

}