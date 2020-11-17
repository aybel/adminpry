const Tarea = require('../Modelos/Tarea');
const Proyecto = require('../Modelos/Proyecto');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');


exports.crearTarea = async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }
    const { proyecto } = req.body;

    try {

        const resp = await Proyecto.findById(proyecto);
        if (!resp) {
            return res.status(404).send({ msg: 'El proyecto no existe' });
        }

        //Revisar si el proyecto actual pertenece al usuario autenticado
        if (resp.creador.toString() !== req.usuario) {
            return res.status(401).json({ msg: "No autorizado" });
        }

        //guardar tarea
        const tarea = new Tarea(req.body);
        await tarea.save();
        res.json({ tarea });

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }

}


exports.obtenerTareas = async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }
    const { proyecto } = req.query;
    try {
        //console.log(req.body);
        let tarea = await Tarea.find({ proyecto: proyecto }).sort({ creado: -1 });
        //console.log(tarea);
        res.json(tarea);

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

//Actualizar tarea


exports.actualizarTarea = async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }

    const { nombre, proyecto,estado } = req.body;
    const nuevaTarea = {};

    if (nombre && proyecto) {
        nuevaTarea.nombre = nombre;
        nuevaTarea.proyecto = proyecto;
        nuevaTarea.estado=estado;
    }

    try {
        //Revisamos que exista la tarea
        let tarea = await Tarea.findById(req.params.id);
        if (!tarea) {
            return res.status(404).json({ msg: "Tarea no existe" });
        }

        //Obtenemos el proyecto para revisar el creador
        let proyectoResp = await Proyecto.findById(proyecto);

        if (proyectoResp.creador.toString() !== req.usuario) {
            return res.status(401).json({ msg: "No autorizado" });
        }

        //Actualizamos la tarea
        tarea = await Tarea.findByIdAndUpdate({ _id: req.params.id }, { $set: nuevaTarea }, { new: true })

        res.json(tarea);


    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

//Borrar Tarea
exports.borrarTarea = async (req, res) => {
    const { proyectoId } = req.query;
   
    try {

        //Revisamos que la tarea exista
        let tarea = await Tarea.findById(req.params.id);
        if (!tarea) {
            return res.status(404).json({ msg: "Tarea no existe" });
        }

        //Obtenemos el proyecto para revisar el creador
        let proyectoResp = await Proyecto.findById(proyectoId);
        //console.log(proyectoResp);

        if (proyectoResp.creador.toString() !== req.usuario) {
            return res.status(401).json({ msg: "No autorizado" });
        }

        ////borramos la tarea
        await Tarea.findByIdAndDelete(req.params.id);

        res.json({ msg: "Tarea eliminado" });


    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}