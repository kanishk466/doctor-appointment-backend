import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    personalInformation: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: {
        type: String,
        required: true,
        match: ^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$,
      },
      dateOfBirth: { type: Date, required: true },
      gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true,
      },
      emergencyContact: {
        type: String,
        required: true,
        match: /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/,
      },
      occupation: { type: String, required: true },
      address: {
        primary: { type: String, required: true },
        secondary: { type: String },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zip: { type: String, required: true },
      },
    },
    medicalInformation: {
      primaryCarePhysician: { type: String, required: true },
      insuranceProvider: { type: String },
      insurancePolicyNumber: { type: String },
      allergies: { type: String },
      currentMedication: { type: String },
      familyMedicalHistory: { type: String },
      pastMedicalHistory: { type: String },
    },
    identification: {
      idNumber: { type: String, required: true },
      idDocumentPath: { type: String, required: true },
    }
  }, { timestamps: true });
  

  
export default mongoose.model('Patient' , patientSchema)




    
  
