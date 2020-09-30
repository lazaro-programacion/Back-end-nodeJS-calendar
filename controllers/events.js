const { response } = require("express");
const Usuario = require("../models/UsuarioModal");
const Evento = require("../models/EventoModal");

// Obtener eventos
const getEventos = async (req, res = response) => {
    const eventos = await Evento.find().populate("user", "name");

    res.json({
        ok: true,
        eventos: eventos,
    });
};

// Crear un nuevo evento
const crearEvento = async (req, res = response) => {
    const evento = new Evento(req.body);

    try {
        evento.user = req.uid;

        const eventGuardado = await evento.save();

        res.status(201).json({
            ok: true,
            evento: eventGuardado,
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: "Por favor hable con el Administrador...",
        });
    }
};

// Actualizar evento
const actualizarEvento = async (req, res = response) => {

    const eventoId = req.params.id;
    const uid = req.uid;

    try {
        const evento = await Evento.findById(eventoId);

        if (!evento) {

            return res.status(404).json({
                ok: false,
                msg: "El evento no existe con ese ID ...",
            });
        }

        if (evento.user.toString() !== uid) {

            return res.status(401).json({
                ok: false,
                msg: "No tiene Privilegios de edicion...",
            });
        }

        const nuevoEvento = {

            ...req.body,
            user: uid,
        };

        const eventoActualizado = await Evento.findByIdAndUpdate(

            eventoId,
            nuevoEvento,
            { new: true }
        );

        res.json({
            ok: false,
            evento: eventoActualizado,
        });

    } catch (error) {

        res.status(500).json({
            ok: false,
            msg: "Por favor hable con el Administrador...",
        });
    }
};

// Borrar evento
const eliminarEvento = async (req, res = response) => {

    const eventoId = req.params.id;
    const uid = req.uid;

    try {
        const evento = await Evento.findById(eventoId);

        if (!evento) {

            return res.status(404).json({
                ok: false,
                msg: "El evento no existe con ese ID ...",
            });
        }

        if (evento.user.toString() !== uid) {

            return res.status(401).json({
                ok: false,
                msg: "No tiene Privilegios para eliminar...",
            });
        }

      

        const eventoActualizado = await Evento.findByIdAndDelete( eventoId );

        res.json({
            ok: true,
            msg: 'Borrado correctamente',
            evento: eventoActualizado,
        });

    } catch (error) {

        res.status(500).json({
            ok: false,
            msg: "Por favor hable con el Administrador...",
        });
    }
};

module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento,
};
