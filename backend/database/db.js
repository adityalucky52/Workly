import { mongoose } from "mongoose"


const db =async ()=>{
  try {
    await mongoose.connect(process.env.MONGODB_URL)
    console.log("connected to db successfully");
  } catch (error) {
    console.log("error while connecting to db",error);
  }

}

export default db;
