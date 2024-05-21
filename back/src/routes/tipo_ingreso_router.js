/*****************conection 3*********************/

const express = require('express')
const router = express.Router()
const Users = require('../controller/tipo_ingreso_controller')


// Ruta para obtener todos los tipo de ingresos
router.get('/tipo_ingreso',Users.getAll)
// Ruta para cambiar el estado de un tipo de ingresos
router.put('/tipo_ingreso/:userId/state', Users.changeState);
// Ruta para crear un nuevo tipo de ingresos
router.post('/create_tipo_ingreso', Users.createUser);
// Ruta para actualizar un usuario existente
router.put('/tipo_ingreso/:id_tipo_ingresos', Users.updateUser);
// Ruta para eliminar un tipo de ingresos
router.delete('/tipo_ingreso_delete/:userId', Users.deleteUser);
 
 
module.exports = router 