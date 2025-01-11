import express from 'express';
import Patient from '../models/patient.model.js';
import authenticate from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/register-patient', authenticate , async (req, res) => {
  try {
    const { personalInformation, medicalInformation, identification } = req.body;


       // Check if a patient record already exists for the authenticated user
   const existingPatient = await Patient.findOne({ patientId: req.user.id });

   if (existingPatient) {
     return res.status(400).json({ 
       message: 'Patient record already exists. Please update your information instead.' 
     });
   }
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



router.get('/patient/profile', authenticate , async (req, res) => {
    try {
      const patient = await Patient.findOne({ patientId: req.user.id }).populate('patientId', 'name email');
      
      if (!patient) {
        return res.status(404).json({ message: 'Patient not found' });
      }
  
      res.status(200).json({ message: 'Patient fetched successfully', data: patient });
    } catch (error) {
      console.error('Error fetching patient:', error);
      res.status(500).json({ message: 'Internal Server Error', error });
    }
  });
  

  router.put('/update-patient', authenticate, async (req, res) => {
    try {
      const { personalInformation, medicalInformation, identification } = req.body;
  
      // Find the existing patient record
      const patient = await Patient.findOne({ patientId: req.user.id });
  
      if (!patient) {
        return res.status(404).json({ message: 'Patient record not found. Please register first.' });
      }
  
      // Update the fields
      patient.personalInformation = personalInformation || patient.personalInformation;
      patient.medicalInformation = medicalInformation || patient.medicalInformation;
      patient.identification = identification || patient.identification;
  
      const updatedPatient = await patient.save();
      res.status(200).json({ message: 'Patient information updated successfully', data: updatedPatient });
    } catch (error) {
      console.error('Error updating patient information:', error);
      res.status(500).json({ message: 'Internal Server Error', error });
    }
  });
  


  

  

export default router;
