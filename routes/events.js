/* 
    Rutas de Eventos / events
    host + /api/events
*/

const { Router } = require('express');
const router = Router()
const { getEventos, crearEvento, actualizarEvento, eliminarEvento} = require('../controllers/events');
const { check } = require('express-validator')
const {validarJWT} = require('../middeleware/validarJWT');
const {validarCampos} = require('../middeleware/validarCampos');
const {isDate} = require('../helpers/isDate');

// Todas tienen que pasar por la validacion del JWT
router.use( validarJWT )

// Obtener eventos
router.get('/', getEventos)

// Crear un nuevo evento
router.post('/',
// middlewares
[
    check('title', 'El titulo es obligatorio').not().isEmpty(),
    check('start', 'Fecha de inicio es obligatoria').custom( isDate ),
    check('end', 'Fecha de fin es obligatoria').custom( isDate ),
    validarCampos
],
crearEvento)

// Actualizar evento
router.put('/:id', actualizarEvento)

// Borrar evento
router.delete('/:id', eliminarEvento)



module.exports = router