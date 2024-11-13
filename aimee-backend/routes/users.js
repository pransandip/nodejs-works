const controllers = require('./controller.js')
const router = require('express').Router()

module.exports = () => {
   router.get('/users', controllers.allUsers)
   router.get('/users/:id', controllers.getUser)
   router.post('/users', controllers.createUser)
   router.put('/users/:id', controllers.updateUser)
   router.delete('/users/:id', controllers.deleteUser)
}