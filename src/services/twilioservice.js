import twilio from "twilio";
import {configDotenv} from "dotenv"
configDotenv();
export const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

