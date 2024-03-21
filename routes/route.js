import { Router } from 'express'

import { MultiTaskController } from '../controllers/control.js'

export const router = Router()

router.get('/', MultiTaskController.getAll)

router.get('/:email', MultiTaskController.getByEmail)

router.get('/generate-code/:email', MultiTaskController.generateCode)

