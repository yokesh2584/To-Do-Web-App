import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MongoDb = async () => {
  try {
    mongoose
      .connect(process.env.MONGO_URI as string)
      .then(() => console.log("mongodb connected successfully"))
      .catch((err) => console.error(`error connecting mongodb: ${err}`));
  } catch (err) {
    console.error(err);
    throw new Error(`Error connecting mongodb: ${err}`);
  }
};

export default MongoDb;