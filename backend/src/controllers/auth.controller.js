import { upsertStreamUser } from "../lib/stream.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

export async function signup(req, res) {
   const {email, password, fullName} = req.body;
   try {
      

      if(!email || !password || !fullName){
         return res.status(400).json({message: "All fields are required"});
      }
      if(password.length < 6){
         return res.status(400).json({message: "Password must be at least 6 characters"});
      }

      const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
      if(!emailRegex.test(email)){
         return res.status(400).json({message: "Invalid email format"});
      }

      const existingUser = await User.findOne({email});
      if(existingUser){
         return res.status(400).json({message: "Email already in use"});
      }

      const index = Math.floor(Math.random() * 10) + 1;
      const randomAvatar = `https://avatar.iran.liara.run/public/${index}.png`;

      const newUser = await User.create({
         fullName,
         email,
         password,
         profilePic: randomAvatar,
      });

     try {
         await upsertStreamUser({
            id: newUser._id.toString(),
            name: newUser.fullName,
            profilePic: newUser.profilePic || "",
         });
         console.log(`Stream user created for ${newUser.fullName}`);
     } catch (error) {
       console.error("Error upserting Stream user:", error);
     }



      const token = jwt.sign({userId:newUser._id},
         process.env.JWT_SECRET, {expiresIn: "1d"});

      res.cookie("jwt", token, {
         httpOnly: true,
         maxAge: 24 * 60 * 60 * 1000, // 1 day
         sameSite: "lax",
         secure: process.env.NODE_ENV === "production",
         domain: process.env.NODE_ENV === "production" ? ".vercel.app" : undefined,
      });

      res.status(201).json({
         success: true,
         user: newUser,
         message: "User created successfully",
      });

   } catch (error) {
      console.log("Error occurred during signup:", error);
      res.status(500).json({ message: "Internal server error" });
   }
   
}

export async function login(req, res) {
   try {
      const {email, password} = req.body;

      if(!email || !password){
         return res.status(400).json({message: "All fields are required"});
      }
      const user = await User.findOne({email});
      if(!user){
         return res.status(401).json({message: "Invalid credentials"});
      }
      const isPasswordValid = await user.matchPassword(password);
      if(!isPasswordValid){
         return res.status(401).json({message: "Invalid credentials"});
      }
      
      const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn: "1d"});
      res.cookie("jwt", token, {
         httpOnly: true,
         maxAge: 24 * 60 * 60 * 1000, // 1 day
         sameSite: "lax",
         secure: process.env.NODE_ENV === "production",
         domain: process.env.NODE_ENV === "production" ? ".vercel.app" : undefined,
      });
      res.status(200).json({
         success: true,
         user,
         message: "Login successful",
      });
   } catch (error) {
      console.log("Error occurred during login:", error);
      res.status(500).json({ message: "Internal server error" });
   }
}
//update
export async function logout(req, res) {
   console.log("Logout Successfully")
   res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      domain: process.env.NODE_ENV === "production" ? ".vercel.app" : undefined,
   });
   res.status(200).json({message: "Logout successful"});
}



export async function onboard(req, res) {
   try {
      const userId = req.user._id;
      const {fullName, bio, nativeLanguage, learningLanguage, location} = req.body;

      if (!fullName || !bio || !nativeLanguage || !learningLanguage || !location) {
         return res.status(400).json({ message: "All fields are required",
            missingFields: [
               !fullName && "fullName",
               !bio && "bio",
               !nativeLanguage && "nativeLanguage",
               !learningLanguage && "learningLanguage",
               !location && "location"
            ].filter(Boolean),
         });
      }
      const updatedUser = await User.findByIdAndUpdate(userId, {
         fullName,
         bio,
         nativeLanguage,
         learningLanguage,
         location,
         isOnboarded: true,
      },{ new: true });

      if(!updatedUser)  return res.status(404).json({message: "User not found"});


     try {
       await upsertStreamUser({
         id: updatedUser._id.toString(),
         name: updatedUser.fullName,
         profilePic: updatedUser.profilePic || "",
      });
      console.log(`Stream user updated for ${updatedUser.fullName}`);
     } catch (streamError) {
         console.error("Error upserting Stream user during onboarding:", streamError.message);
     }


      res.status(200).json({
         success: true,
         user: updatedUser,
         message: "User onboarded successfully"
      });

   } catch (error) {
      console.log("Error occurred during onboarding:", error);
      res.status(500).json({ message: "Internal server error" });
   }
}
