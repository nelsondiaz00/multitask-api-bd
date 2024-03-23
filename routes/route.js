import { Router } from 'express'

import { MultiTaskController } from '../controllers/control.js'

export const router = Router()
// obtener TODOS los usuarios
router.get('/', MultiTaskController.getAll)
// obtener TODOS los usuarios empleados
router.get('/employee', MultiTaskController.getAllEmployees)
// obtener por email
router.get('/:email', MultiTaskController.getByEmail)
// generar código de autenticación
router.get('/generate-code/:email', MultiTaskController.generateCode)
// obtener persona por email
router.get('/person/:email', MultiTaskController.getPersonByEmail)
// obteenr los servicios según el sector
router.get('/service/:sector', MultiTaskController.getServicesBySector)
// crear persona junto a su usuario
router.post('/person', MultiTaskController.createPersonUser)
// modificar persona y usuario
router.put('/person/:user', MultiTaskController.modifyPersonUser)

