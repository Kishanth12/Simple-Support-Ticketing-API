import mongoose from "mongoose";

const connectDb = async () => {
  try {
    const conn = await mongoose.connect(
      `${process.env.MONGODB_URL}/Ticket-booking`,
    );
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDb connection Error: ${error.message}`);
  }
};
export default connectDb;
