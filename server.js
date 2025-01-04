import express from "express"
import bodyParser from "body-parser";
import { configDotenv } from "dotenv";
import ConnectDB  from "./src/config/db.js"

import cors from "cors";


import authRoute from "./src/routes/auth.route.js"
import errorHandler from "./src/middleware/errorHandler.js"
import appointmentRoutes from "./src/routes/appointmentRoutes.js"
import patientRoute from "./src/routes/patient.route.js"

configDotenv();
const app = express();
app.use(bodyParser.json())

app.use(express.json());
app.use(cors());

ConnectDB();





app.use('/api/auth', authRoute);
app.use('/api/appointments', appointmentRoutes);
app.use('/api' , patientRoute)

app.use(errorHandler);
// Start the server
app.listen(5000, () => console.log('Server running on http://localhost:5000'));

export default app;