import mongoose from "mongoose";
import dotenv from "dotenv";
import { Admin } from "../modals/adminModel.js";
import { Manager } from "../modals/managerModel.js";
import { User } from "../modals/userModel.js";

dotenv.config();

const verifyCounts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);

    const adminCount = await Admin.countDocuments();
    const managerCount = await Manager.countDocuments();
    const employeeCount = await User.countDocuments();

    console.log(`Admin Check: Expected 1, Found ${adminCount}`);
    console.log(`Manager Check: Expected 1, Found ${managerCount}`);
    console.log(`Employee Check: Expected 3, Found ${employeeCount}`);

    if (adminCount === 1 && managerCount === 1 && employeeCount === 3) {
      console.log("✅ Verification SUCCESS: Exact counts match.");
    } else {
      console.log("❌ Verification FAILED: Counts do not match.");
    }

    process.exit(0);
  } catch (error) {
    console.error("Verification Error:", error);
    process.exit(1);
  }
};

verifyCounts();
