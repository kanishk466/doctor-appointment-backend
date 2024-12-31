import mongoose from "mongoose"
import bcrypt from "bcryptjs"


const userSchema = new mongoose.Schema({
    role: { type: String, enum: ['patient', 'doctor'], required: true },
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    phone: { type: String, match: /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/ }, // Optional for patients
    address: { type: String }, // Optional for patients
    specialization: String, // For doctors only
    services: [String], // For doctors only
    approved: { type: Boolean, default: false }, // For doctors
  }, { timestamps: true });



  userSchema.pre("save" , async function(next){
    if(!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password , 10);
    next();
})

userSchema.methods.comparePassword = async function(password){
           return await bcrypt.compare(password, this.password);
}
  
export default mongoose.model('User', userSchema);
