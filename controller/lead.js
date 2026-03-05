const LEAD = require("../model/lead");

exports.createLead = async (req, res) => {
  try {
    const { customerName, mobileNumber, email, category, productName, qty, leadStatus } = req.body;

    const leadData = {
      customerName,
      mobileNumber,
      email,
      category,
      productName,
      qty,
      leadStatus,
    };

    const leadDetails = await LEAD.create(leadData);

    return res.status(201).json({
      status: "Success",
      message: "Lead created successfully",
      data: leadDetails,
    });
  } catch (error) {
    return res.status(400).json({
      status: "Fail",
      message: error.message,
    });
  }
};

exports.fetchAllLeads = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const search = req.query.search || "";

    const query = {
      $or: [
        { customerName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { mobileNumber: { $regex: search, $options: "i" } },
        { productName: { $regex: search, $options: "i" } },
      ],
    };

    const totalLeads = await LEAD.countDocuments(query);
    const leadsData = await LEAD.find(query)
      .populate("category")
      .populate("leadStatus")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      status: "Success",
      message: "Leads fetched successfully",
      pagination: {
        totalRecords: totalLeads,
        currentPage: page,
        totalPages: Math.ceil(totalLeads / limit),
        limit,
      },
      data: leadsData,
    });
  } catch (error) {
    return res.status(500).json({
      status: "Fail",
      message: error.message,
    });
  }
};

exports.fetchLeadById = async (req, res) => {
  try {
    let leadId = req.params.id;
    let leadData = await LEAD.findById(leadId)
      .populate("category")
      .populate("leadStatus");
    if (!leadData) {
      throw new Error("Lead not found");
    }
    return res.status(200).json({
      status: "Success",
      message: "Lead fetched successfully",
      data: leadData,
    });
  } catch (error) {
    return res.status(404).json({
      status: "Fail",
      message: error.message,
    });
  }
};

exports.leadUpdate = async (req, res) => {
  try {
    let leadId = req.params.id;
    let oldLead = await LEAD.findById(leadId);

    if (!oldLead) {
      throw new Error("Lead not found");
    }

    let updatedLead = await LEAD.findByIdAndUpdate(leadId, req.body, {
      new: true,
    })
      .populate("category")
      .populate("leadStatus");

    return res.status(200).json({
      status: "Success",
      message: "Lead updated successfully",
      data: updatedLead,
    });
  } catch (error) {
    return res.status(404).json({
      status: "Fail",
      message: error.message,
    });
  }
};

exports.leadDelete = async (req, res) => {
  try {
    let leadId = req.params.id;
    let oldLead = await LEAD.findById(leadId);

    if (!oldLead) {
      throw new Error("Lead not found");
    }
    await LEAD.findByIdAndDelete(leadId);

    return res.status(200).json({
      status: "Success",
      message: "Lead deleted successfully",
    });
  } catch (error) {
    return res.status(404).json({
      status: "Fail",
      message: error.message,
    });
  }
};
