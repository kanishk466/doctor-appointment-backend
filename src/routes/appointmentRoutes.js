import express from "express"

import {bookAppointment , viewAppointments , updateAppointmentStatus , getDoctor , getPateintBookedAppointment} from "../controllers/appointmentController.js"

import authenticate from "../middleware/authMiddleware.js"
const router = express.Router();


router.post('/', authenticate, bookAppointment);
router.get('/', authenticate, viewAppointments);

router.patch('/:id/status' , authenticate , updateAppointmentStatus);

router.get('/doctor' , authenticate , getDoctor);

router.get('/patient/:id' , authenticate , getPateintBookedAppointment);


export default router;
