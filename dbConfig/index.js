import mongoose from "mongoose";

const dbConnection = async () => { 
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Successfully connected to db");
  } catch (error) { 
    console.log("Error connecting to db", error);
  }
};

export default dbConnection;