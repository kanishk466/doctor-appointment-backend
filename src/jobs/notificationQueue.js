import Queue from "bull";
import Redis from "ioredis";
import { sendTaskAssignmentEmail } from "../services/notificationService.js";
import { twilioClient } from "../services/twilioservice.js";


const redis = new Redis(process.env.KV_URL, {
  tls: { rejectUnauthorized: false }, // For secure connections
});

// Create a Bull queue for notifications
const notificationQueue = new Queue("notifications", {
  redis: {
    host: redis.options.host,
    port: redis.options.port,
    password: redis.options.password,
    tls: { rejectUnauthorized: false },
  },
});


// Process email notifications
notificationQueue.process("email", async (job, done) => {
  const { email, subject, message } = job.data;

  try {
    await sendTaskAssignmentEmail(email, { subject, message });
    console.log("Email sent successfully:", email);
    done();
  } catch (error) {
    console.error("Email notification failed:", error);
    done(error);
  }
});



// Process SMS notifications
notificationQueue.process("sms", async (job, done) => {
  const { phone, message } = job.data;
  try {
    await twilioClient.messages.create({
      body: message,
      messagingServiceSid:process.env.MessagingId,
      to: phone,
    });
    console.log("SMS sent successfully:", phone);
    done();
  } catch (error) {
    console.error("SMS notification failed:", error);
    done(error);
  }
});

export default notificationQueue;
