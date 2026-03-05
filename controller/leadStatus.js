const LEADSTATUS = require("../model/leadStatus");

exports.createLeadStatus = async (req, res) => {
  try {
    const { name } = req.body;
    const leadStatusData = await LEADSTATUS.create({ name });

    return res.status(201).json({
      status: "Success",
      message: "Lead Status created successfully",
      data: leadStatusData,
    });
  } catch (error) {
    return res.status(400).json({
      status: "Fail",
      message: error.message,
    });
  }
};

exports.fetchAllLeadStatus = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";

    const query = {
      name: { $regex: search, $options: "i" },
    };

    const total = await LEADSTATUS.countDocuments(query);
    const data = await LEADSTATUS.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      status: "Success",
      message: "Lead Status fetched successfully",
      pagination: {
        totalRecords: total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        limit,
      },
      data,
    });
  } catch (error) {
    return res.status(500).json({
      status: "Fail",
      message: error.message,
    });
  }
};

exports.fetchLeadStatusById = async (req, res) => {
  try {
    const data = await LEADSTATUS.findById(req.params.id);
    if (!data) {
      throw new Error("Lead Status not found");
    }
    return res.status(200).json({
      status: "Success",
      message: "Lead Status fetched successfully",
      data,
    });
  } catch (error) {
    return res.status(404).json({
      status: "Fail",
      message: error.message,
    });
  }
};

exports.updateLeadStatus = async (req, res) => {
  try {
    const data = await LEADSTATUS.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!data) {
      throw new Error("Lead Status not found");
    }
    return res.status(200).json({
      status: "Success",
      message: "Lead Status updated successfully",
      data,
    });
  } catch (error) {
    return res.status(404).json({
      status: "Fail",
      message: error.message,
    });
  }
};

exports.deleteLeadStatus = async (req, res) => {
  try {
    const data = await LEADSTATUS.findByIdAndDelete(req.params.id);
    if (!data) {
      throw new Error("Lead Status not found");
    }
    return res.status(200).json({
      status: "Success",
      message: "Lead Status deleted successfully",
    });
  } catch (error) {
    return res.status(404).json({
      status: "Fail",
      message: error.message,
    });
  }
};
