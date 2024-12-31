import User from "../models/user.model.js"
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"



export const register  = async (req,res)=>{
 
    const { name, email, password, role, specialization, services } = req.body;


    try {
        let user = await User.findOne({email});
        if(user) return res.status(400).json({msg:"Email already exists"})

        user =  new User({ name, email, password, role, specialization, services });

        await user.save();
        res.status(201).json({ message: "User registered successfully" });


    } catch (error) {
        res.status(400).json({ error: error.message });
    }


}




export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user || !(await user.comparePassword(password))) {
        return res.status(400).json({ error: "Invalid credentials" });
      }



      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.status(200).json({ token , user});

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
