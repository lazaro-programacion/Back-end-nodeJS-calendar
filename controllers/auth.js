const { response } = require("express");
const bcrypt = require("bcryptjs");
const Usuario = require("../models/UsuarioModal");
const { generarJWT } = require("../helpers/jwt");

/* Ceamos usuario */

const crearUsuario = async (req, res = response) => {
    const { email, password } = req.body;

    try {
        let usuario = await Usuario.findOne({ email });

        if (usuario) {
            return res.status(400).json({
                ok: false,
                msg: "El email ya existe...",
            });
        }

        usuario = new Usuario(req.body);

        // Encriptar contraseña...
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        await usuario.save();

        // Generar token
        const token = await generarJWT(usuario.id, usuario.name);

        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token,
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: "Por favor hable con el Administrador...",
        });
    }
};

/* Login Usuario */

const loginUsuario = async (req, res = response) => {
    const { email, password } = req.body;

    try {
        const usuario = await Usuario.findOne({ email });

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: "El email no pertenece a ningun Usuario...",
            });
        }

        // Confirnar los passwords
        const validPassword = bcrypt.compareSync(password, usuario.password);

        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: "Password Incorrecto...",
            });
        }

        // Generar JWT
        const token = await generarJWT(usuario.id, usuario.name);
        res.json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token,
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: "Por favor hable con el Administrador...",
        });
    }
};

/* Validar token */

const revalidarToken = async (req, res = response) => {

    const { uid, name } = req
 

    // Generar JWT
    const token = await generarJWT( uid, name);


    res.json({
        ok: true,
        token
    });
};

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken,
};
