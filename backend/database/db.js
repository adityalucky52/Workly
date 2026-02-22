import { mongoose } from "mongoose"


const db =async ()=>{
  try {
    await mongoose.connect(process.env.MONGODB_URL)
  } catch (error) {
  }

}

export default db;
