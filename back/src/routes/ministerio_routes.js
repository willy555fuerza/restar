/*****************conection 3*********************/

const express = require('express')
const router = express.Router()
const Users = require('../controller/ministerio_controller')


// Ruta para obtener todos los ministerios
router.get('/ministerio',Users.getAll)
// Ruta para cambiar el estado de un ministerio
router.put('/ministerio/:userId/state', Users.changeState);
// Ruta para crear una nuevo ministerio
router.post('/create_ministerio', Users.createUser);
// Ruta para actualizar un ministerio existente
router.put('/ministerio/:id_ministerio', Users.updateUser); 
// Ruta para eliminar un ministerio
router.delete('/ministerio_delete/:userId', Users.deleteUser);
 

module.exports = router 