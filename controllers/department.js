const Department = require("../models/Department");

exports.fetchDepartments = async (req, res) => {
  try {
    const departments = await Department.find().exec();
    res.json(departments);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.fetchDepartment = async (req, res) => {
  try {
    const departmentId = req.params.id;
    const department = await Department.findById(departmentId).exec();

    if (!department) {
      return res.status(404).json({ error: "Department not found" });
    }

    res.json(department);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.createDepartment = async (req, res) => {
  try {
    const { name } = req.body;

    const department = new Department({
      name,
    });

    await department.save();

    res.json(department);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateDepartment = async (req, res) => {
  try {
    const departmentId = req.params.id;
    const updatedDepartment = await Department.findByIdAndUpdate(
      departmentId,
      req.body,
      { new: true }
    ).exec();

    if (!updatedDepartment) {
      return res.status(404).json({ error: "Department not found" });
    }

    res.json(updatedDepartment);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteDepartment = async (req, res) => {
  try {
    const departmentId = req.params.id;
    const deletedDepartment = await Department.findByIdAndDelete(
      departmentId
    ).exec();

    if (!deletedDepartment) {
      return res.status(404).json({ error: "Department not found" });
    }

    res.json({
      message: `${deletedDepartment.name} deleted successfully`,
      status: "ok",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
