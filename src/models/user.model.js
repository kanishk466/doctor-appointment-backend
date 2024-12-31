import mongoose from "mongoose"
import bcrypt from "bcryptjs"


const userSchema = new mongoose.Schema({
   name: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["doctor", "patient"], required: true },
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