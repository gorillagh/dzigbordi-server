const Branch = require("../models/Branch");

exports.fetchBranches = async (req, res) => {
  try {
    const branches = await Branch.find().exec();
    res.json(branches);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.fetchBranch = async (req, res) => {
  try {
    const branchId = req.params.id;
    const branch = await Branch.findById(branchId).exec();

    if (!branch) {
      return res.status(404).json({ error: "Branch not found" });
    }

    res.json(branch);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.createBranch = async (req, res) => {
  try {
    const { name, location } = req.body;

    const branch = new Branch({
      name,
      location,
    });

    await branch.save();

    res.json(branch);
  } catch (error) {
    console.log(error);
    res.json({
      message:
        error.code === 11000
          ? "Branch already exists!"
          : "Internal server error",
      status: "false",
    });
  }
};

exports.updateBranch = async (req, res) => {
  try {
    const branchId = req.params.id;
    const { name } = req.body;

    // Check if the branch name already exists
    const existingBranch = await Branch.findOne({ name });

    if (existingBranch) {
      return res.json({
        message: "Branch name already exists",
        status: "false",
      });
    }

    const updatedBranch = await Branch.findByIdAndUpdate(branchId, req.body, {
      new: true,
    }).exec();

    console.log("updated----->", updatedBranch);

    if (!updatedBranch) {
      return res.status(404).json({ error: "Branch not found" });
    }

    res.json(updatedBranch);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteBranch = async (req, res) => {
  try {
    const branchId = req.params.id;
    const deletedBranch = await Branch.findByIdAndDelete(branchId).exec();

    if (!deletedBranch) {
      return res.status(404).json({ error: "Branch not found" });
    }

    res.json({
      message: `${deletedBranch.name} deleted successfully`,
      status: "ok",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
