import express from "express"

import {bookAppointment , viewAppointments , updateAppointmentStatus} from "../controllers/appointmentController.js"

import authenticate from "../middleware/authMiddleware.js"
const router = express.Router();


router.post('/', authenticate, bookAppointment);
router.get('/', authenticate, viewAppointments);

router.patch('/:id' , authenticate , updateAppointmentStatus);



export default router;