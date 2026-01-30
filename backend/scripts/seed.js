import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { Admin } from "../modals/adminModel.js";
import { Manager } from "../modals/managerModel.js";
import { User } from "../modals/userModel.js";

dotenv.config();

// Sample data for seeding
const seedData = {
  admin: {
    firstName: "Super",
    lastName: "Admin",
    email: "admin@workly.com",
    phone: "9876543210",
    password: "admin123",
  },
  managers: [
    {
      firstName: "Rahul",
      lastName: "Sharma",
      email: "rahul.manager@workly.com",
      phone: "9876543211",
      password: "manager123",
      status: "Active",
    },
    {
      firstName: "Priya",
      lastName: "Singh",
      email: "priya.manager@workly.com",
      phone: "9876543212",
      password: "manager123",
      status: "Active",
    },
    {
      firstName: "Amit",
      lastName: "Patel",
      email: "amit.manager@workly.com",
      phone: "9876543213",
      password: "manager123",
      status: "Pending",
    },
    {
      firstName: "Sanjay",
      lastName: "Mehta",
      email: "sanjay.manager@workly.com",
      phone: "9876543214",
      password: "manager123",
      status: "Pending",
    },
    {
      firstName: "Kavita",
      lastName: "Rao",
      email: "kavita.manager@workly.com",
      phone: "9876543215",
      password: "manager123",
      status: "Pending",
    },
  ],
  employees: [
    {
      firstName: "Vikram",
      lastName: "Kumar",
      email: "vikram@workly.com",
      phone: "9876543221",
      password: "employee123",
      status: "Active",
    },
    {
      firstName: "Sneha",
      lastName: "Gupta",
      email: "sneha@workly.com",
      phone: "9876543222",
      password: "employee123",
      status: "Active",
    },
    {
      firstName: "Arun",
      lastName: "Verma",
      email: "arun@workly.com",
      phone: "9876543223",
      password: "employee123",
      status: "Pending",
    },
    {
      firstName: "Neha",
      lastName: "Reddy",
      email: "neha@workly.com",
      phone: "9876543224",
      password: "employee123",
      status: "Pending",
    },
    {
      firstName: "Karan",
      lastName: "Malhotra",
      email: "karan@workly.com",
      phone: "9876543225",
      password: "employee123",
      status: "Pending",
    },
    {
      firstName: "Pooja",
      lastName: "Joshi",
      email: "pooja@workly.com",
      phone: "9876543226",
      password: "employee123",
      status: "Active",
    },
  ],
};

// Hash password helper
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// Seed function
const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    console.log("🔄 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("✅ Connected to MongoDB");

    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log("\n🗑️  Clearing existing data...");
    await Admin.deleteMany({});
    await Manager.deleteMany({});
    await User.deleteMany({});
    console.log("✅ Existing data cleared");

    // Create Admin
    console.log("\n👑 Creating Admin...");
    const adminData = {
      ...seedData.admin,
      password: await hashPassword(seedData.admin.password),
    };
    const admin = await Admin.create(adminData);
    console.log(`✅ Admin created: ${admin.email}`);

    // Create Managers
    console.log("\n👔 Creating Managers...");
    const createdManagers = [];
    for (const managerData of seedData.managers) {
      const hashedData = {
        ...managerData,
        password: await hashPassword(managerData.password),
        status: managerData.status || "Pending",
      };
      const manager = await Manager.create(hashedData);
      createdManagers.push(manager);
      console.log(
        `✅ Manager created: ${manager.firstName} ${manager.lastName} (${manager.email}) - Status: ${manager.status}`,
      );
    }

    // Create Employees and assign to managers
    console.log("\n👤 Creating Employees...");
    // Filter only active managers for assignment
    const activeManagers = createdManagers.filter((m) => m.status === "Active");

    for (let i = 0; i < seedData.employees.length; i++) {
      const employeeData = seedData.employees[i];
      // Assign each employee to an active manager (round-robin)
      const assignedManager =
        activeManagers.length > 0
          ? activeManagers[i % activeManagers.length]
          : null;

      const hashedData = {
        ...employeeData,
        password: await hashPassword(employeeData.password),
        status: employeeData.status || "Pending",
        manager: assignedManager?._id || null,
      };

      const employee = await User.create(hashedData);

      // Update manager's team if manager assigned
      if (assignedManager) {
        await Manager.findByIdAndUpdate(assignedManager._id, {
          $push: { teamMembers: employee._id },
          $inc: { teamSize: 1 },
        });
      }

      console.log(
        `✅ Employee created: ${employee.firstName} ${employee.lastName} (${employee.email}) - Status: ${employee.status}`,
      );
    }

    console.log("\n" + "=".repeat(60));
    console.log("🎉 DATABASE SEEDED SUCCESSFULLY!");
    console.log("=".repeat(60));

    console.log("\n📋 LOGIN CREDENTIALS:");
    console.log("-".repeat(60));

    console.log("\n👑 ADMIN:");
    console.log(`   Email: ${seedData.admin.email}`);
    console.log(`   Password: ${seedData.admin.password}`);

    console.log("\n👔 MANAGERS:");
    seedData.managers.forEach((m) => {
      console.log(`   Email: ${m.email}`);
      console.log(`   Password: ${m.password}`);
      console.log("");
    });

    console.log("👤 EMPLOYEES:");
    seedData.employees.forEach((e) => {
      console.log(`   Email: ${e.email}`);
      console.log(`   Password: ${e.password}`);
      console.log("");
    });

    console.log("-".repeat(60));
    console.log("✅ You can now login with these credentials!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

// Run the seed
seedDatabase();
