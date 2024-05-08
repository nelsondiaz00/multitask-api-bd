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
router.get('/service/sector/:sector', MultiTaskController.getServicesBySector)
// crear persona junto a su usuario
router.post('/person', MultiTaskController.createPersonUser)
// modificar persona y usuario
router.put('/person/:email', MultiTaskController.modifyPersonUser)
// eliminar usuario
router.put('/employee/delete/:idUser', MultiTaskController.deleteUser)
// obtener datos por id
router.get('/employee/:id', MultiTaskController.getEmployeeByID)
// publicar una postulación
router.post('/companie/postulation', MultiTaskController.postOffer)
// generar pre-factura
router.get('/billing/pre-bill/:nivel_De_Educacion/:cantidad', MultiTaskController.preBillGenerator);
// generar factura
router.post('/billing/bill', MultiTaskController.billGenerator);
// registrar metodo de pago
router.post('/person/pay-method', MultiTaskController.registerPayMethod);
// obtener todos los métodos de pago por email
router.get('/person/pay-method/:email', MultiTaskController.getPayMethodByEmail);
// obtener empresa por email
router.get('/companie/:email', MultiTaskController.getCompanieByEmail)
// MODIFICAR EMPRESA Y USUARIO
router.put('/companie/:email', MultiTaskController.modifyCompanieUser)
// OBTENER POSTULACIONES DE EMPRESA SEGÚN CORREO
router.get('/companie/postulation/:email', MultiTaskController.getPostulations)
// CAMBIAR ESTADO DE POSTULACION
router.put('/companie/postulation/:offerID', MultiTaskController.changePostulationState)
// obtener postulaciones por profesion
router.get('/service/profession/:profession', MultiTaskController.getServicesByProfession)
// registrar postulación
router.post('/aspirant/postulation', MultiTaskController.postPostulation)
// OBTENER POSTULADO POR EMAIL
router.get('/aspirant/:email', MultiTaskController.getAspirant)
// OBTENER CONFIRMACIÓN DE INSCRIPCIÓN
router.get('/aspirant/postulation/confirm/:idPostulado/:idPostulacion', MultiTaskController.getPostulationConfirm)
// OBTENER TODOS LOS USUARIOS EMPRESA
router.get('/all/companie', MultiTaskController.getCompanieUsers)
// OBTENER TODOS LOS USUARIOS ASPIRANTES
router.get('/all/aspirant', MultiTaskController.getAspirantUsers)
// obtener entrevistas
router.get('/all/interview', MultiTaskController.getInterviews)
