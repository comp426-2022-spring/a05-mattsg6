// Route (endpoint) definitions go in this directory
const express = require('express')

const router = express.Router();

const controller = require('../controllers/mycontrollers')
const middleware = require('../middleware/mymiddleware')

router.use(middleware.database)

router.use(middleware.logging)

router.get('/app', controller.root)

router.get('/app/log/access/', controller.log)

router.get('/app/error/', controller.error)

router.get('/app/flip', controller.flip)

router.post('/app/flip/coins/', controller.flips)

router.post('/app/flip/call/', controller.call)

router.use(middleware.notFound)

module.exports = router
