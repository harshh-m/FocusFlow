import { connect } from "mongoose";

const connectDB = async () => {
  await connect(process.env.MONGO_URI);
  console.log("MongoDB Connected");
};

export default connectDB;