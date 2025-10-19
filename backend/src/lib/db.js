 import mongoose from "mongoose";



export const connectDB =async () =>{

    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        return `MongoDB connected: ${conn.connection.host}`;
}

        

     catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        console.log(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1); //
    }

}


