import { Group } from "../modals/groupModel.js";
import { Manager } from "../modals/managerModel.js";
import { User } from "../modals/userModel.js";

// Create a new group
export const createGroup = async (req, res, next) => {
  try {
    const { name, description, managers, employees } = req.body;

    // Check if group name already exists
    const existingGroup = await Group.findOne({ name });
    if (existingGroup) {
      return res.status(400).json({
        success: false,
        message: "A group with this name already exists",
      });
    }

    // Create group
    const group = await Group.create({
      name,
      description,
      managers: managers || [],
      employees: employees || [],
      createdBy: req.user.id,
    });

    // Populate the created group
    const populatedGroup = await Group.findById(group._id)
      .populate("managers", "firstName lastName email")
      .populate("employees", "firstName lastName email")
      .populate("createdBy", "firstName lastName");

    res.status(201).json({
      success: true,
      message: "Group created successfully",
      data: populatedGroup,
    });
  } catch (error) {
    console.error("Create group error:", error);
    next({ status: 400, message: error.message || "Failed to create group" });
  }
};

// Get all groups
export const getAllGroups = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;

    const query = {};
    if (status) query.status = status;
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const groups = await Group.find(query)
      .populate("managers", "firstName lastName email")
      .populate("employees", "firstName lastName email")
      .populate("createdBy", "firstName lastName")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Group.countDocuments(query);

    res.status(200).json({
      success: true,
      data: groups,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get all groups error:", error);
    next({ status: 500, message: "Failed to fetch groups" });
  }
};

// Get group by ID
export const getGroupById = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate("managers", "firstName lastName email phone status")
      .populate("employees", "firstName lastName email phone status")
      .populate("createdBy", "firstName lastName");

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    res.status(200).json({
      success: true,
      data: group,
    });
  } catch (error) {
    console.error("Get group by id error:", error);
    next({ status: 500, message: "Failed to fetch group" });
  }
};

// Update group
export const updateGroup = async (req, res, next) => {
  try {
    const { name, description, managers, employees, status } = req.body;

    // Check if new name conflicts with existing group
    if (name) {
      const existingGroup = await Group.findOne({
        name,
        _id: { $ne: req.params.id },
      });
      if (existingGroup) {
        return res.status(400).json({
          success: false,
          message: "A group with this name already exists",
        });
      }
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (managers) updateData.managers = managers;
    if (employees) updateData.employees = employees;
    if (status) updateData.status = status;

    const group = await Group.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("managers", "firstName lastName email")
      .populate("employees", "firstName lastName email");

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Group updated successfully",
      data: group,
    });
  } catch (error) {
    console.error("Update group error:", error);
    next({ status: 400, message: error.message || "Failed to update group" });
  }
};

// Delete group
export const deleteGroup = async (req, res, next) => {
  try {
    const group = await Group.findByIdAndDelete(req.params.id);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Group deleted successfully",
    });
  } catch (error) {
    console.error("Delete group error:", error);
    next({ status: 500, message: "Failed to delete group" });
  }
};

// Add members to group
export const addMembersToGroup = async (req, res, next) => {
  try {
    const { managers, employees } = req.body;

    const updateData = {};
    if (managers && managers.length > 0) {
      updateData.$addToSet = { managers: { $each: managers } };
    }
    if (employees && employees.length > 0) {
      if (!updateData.$addToSet) updateData.$addToSet = {};
      updateData.$addToSet.employees = { $each: employees };
    }

    const group = await Group.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    })
      .populate("managers", "firstName lastName email")
      .populate("employees", "firstName lastName email");

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Members added successfully",
      data: group,
    });
  } catch (error) {
    console.error("Add members error:", error);
    next({ status: 500, message: "Failed to add members" });
  }
};

// Remove members from group
export const removeMembersFromGroup = async (req, res, next) => {
  try {
    const { managers, employees } = req.body;

    const updateData = {};
    if (managers && managers.length > 0) {
      updateData.$pull = { managers: { $in: managers } };
    }
    if (employees && employees.length > 0) {
      if (!updateData.$pull) updateData.$pull = {};
      updateData.$pull.employees = { $in: employees };
    }

    const group = await Group.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    })
      .populate("managers", "firstName lastName email")
      .populate("employees", "firstName lastName email");

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Members removed successfully",
      data: group,
    });
  } catch (error) {
    console.error("Remove members error:", error);
    next({ status: 500, message: "Failed to remove members" });
  }
};

// Get available managers and employees for group creation
export const getAvailableMembers = async (req, res, next) => {
  try {
    const managers = await Manager.find({ status: "Active" }).select(
      "firstName lastName email",
    );
    const employees = await User.find({ status: "Active" }).select(
      "firstName lastName email",
    );

    res.status(200).json({
      success: true,
      data: {
        managers,
        employees,
      },
    });
  } catch (error) {
    console.error("Get available members error:", error);
    next({ status: 500, message: "Failed to fetch available members" });
  }
};
