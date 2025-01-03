import express from 'express';
import Patient from '../models/patient.model.js';
import authenticate from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/register-patient', authenticate , async (req, res) => {
  try {
    const { personalInformation, medicalInformation, identification } = req.body;

    const newPatient = new Patient({
      patientId:req.user.id,
      personalInformation,
      medicalInformation,
      identification,
    });

    const savedPatient = await newPatient.save();
    res.status(201).json({ message: 'Patient registered successfully', data: savedPatient });
  } catch (error) {
    console.error('Error registering patient:', error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
});



router.get('/patient/:id', authenticate , async (req, res) => {
    try {
      const patientId = req.params.id;
      const patient = await Patient.findOne({ patientId }).populate('patientId', 'name email');
      
      if (!patient) {
        return res.status(404).json({ message: 'Patient not found' });
      }
  
      res.status(200).json({ message: 'Patient fetched successfully', data: patient });
    } catch (error) {
      console.error('Error fetching patient:', error);
      res.status(500).json({ message: 'Internal Server Error', error });
    }
  });
  

export default router;
