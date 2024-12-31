import Appointment from "../models/appointment.model.js"

export const bookAppointment = async (req, res) => {
  try {
    const { personalInformation, appointmentDetails,medicalInformation,identification } = req.body;

    const appointment = new Appointment({
      personalInformation,
      medicalInformation,
      identification,
    
      appointmentDetails: {
        ...appointmentDetails,
        patientId: req.user.id,
      },
    });

    await appointment.save();
    res.status(201).json({ message: 'Appointment booked successfully', appointment });
  } catch (error) {
    res.status(500).json({ message: 'Error booking appointment', error });
  }
};

 export const viewAppointments = async (req, res) => {
  try {
    const filter = req.user.role === 'doctor'
      ? { 'appointmentDetails.doctorId': req.user.id }
      : { 'appointmentDetails.patientId': req.user.id };

    const appointments = await Appointment.find(filter);
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appointments', error });
  }
};



export const updateAppointmentStatus =  async (req, res) => {
  try {
    const { id } = req.params; // Get the appointment ID from the URL
    const { status } = req.body; // Get the status from the request body

    // Validate the doctor making the request
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ message: 'Access denied. Only doctors can update appointment status.' });
    }

    // Find the appointment by ID
    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found.' });
    }

    // Update the status
    appointment.appointmentDetails.status = status;
    appointment.updatedAt = Date.now();

    await appointment.save();

    res.status(200).json({ message: 'Appointment status updated successfully.', appointment });
  } catch (error) {
    res.status(500).json({ message: 'Error updating appointment status.', error: error.message });
  }
};
