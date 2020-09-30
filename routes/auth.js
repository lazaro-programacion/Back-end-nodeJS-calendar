/* 
    Rutas de Usuarios / Auth
    host + /api/auth
*/

const { Router } = require('express');
const router = Router()
const { check } = require('express-validator')
const { crearUsuario, loginUsuario, revalidarToken } = require('../controllers/auth');
const {validarCampos} = require('../middeleware/validarCampos');
const {validarJWT} = require('../middeleware/validarJWT');


/* Registrar usuario */
router.post('/register',
// middlewares
[
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password debe tener 6 caracteres').isLength({ min: 6 }),
    validarCampos
],
crearUsuario)

/* Login */
router.post('/',
// middlewares
[
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password debe tener 6 caracteres').isLength({ min: 6 }),
    validarCampos
],
loginUsuario)

/* Renovar token */
router.get('/renew',validarJWT , revalidarToken)

module.exports = router