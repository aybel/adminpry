const Proyecto = require('../Modelos/Proyecto');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.crearProyecto = async (req, res) => {

    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }


    try {
        const proyecto = new Proyecto(req.body);

        proyecto.creador = req.usuario;
        proyecto.save();
        res.json(proyecto);

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }


}

//obtiene todos los proyectos del usario actual
//api/proyectos
exports.obtenerProyectos = async (req, res) => {
    try {
        //console.log(req.usuario);
        const proyectos = await Proyecto.find({ creador: req.usuario }).sort({ creado: -1 });
        res.json(proyectos);

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

//actualiza proyectos

exports.actualizaProyectos = async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }

    //extraer la informacion del  proyecto

    const { nombre } = req.body;
    const nuevoProyecto = {};

    if (nombre) {
        nuevoProyecto.nombre = nombre;
    }

    try {
        //revisar que exista el proyecto
        //console.log(req.params.id);
        let proyecto=await Proyecto.findById(req.params.id);
        //verificar el creador del proyecto

        if(!proyecto){
           return res.status(404).json({msg:"Proyecto no encontrado"});
        }
       
        if(proyecto.creador.toString()!==req.usuario){
            return res.status(401).json({msg:"No autorizado"});
        }

         ////actualizar
         proyecto=await Proyecto.findByIdAndUpdate({ _id: req.params.id}, {$set:nuevoProyecto},{new:true})

        res.json(proyecto);

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }

}
//elimina un pryoecto mediante su id
exports.eliminarProyecto=async (req, res) => {
    try {
        //revisar que exista el proyecto
        //console.log(req.params.id);
        let proyecto=await Proyecto.findById(req.params.id);
        //verificar el creador del proyecto

        if(!proyecto){
           return res.status(404).json({msg:"Proyecto no encontrado"});
        }
       
        if(proyecto.creador.toString()!==req.usuario){
            return res.status(401).json({msg:"No autorizado"});
        }

         ////actualizar
         await Proyecto.findByIdAndDelete(req.params.id);

        res.json({msg:"Proyecto eliminado"});

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }

}
