const VENDORLABEL = require("../model/vendorLabel");

exports.createVendorLabel = async (req, res) => {
  try {
    const { label } = req.body;

    const vendorLabelData = {
      label,
    };

    const vendorLabelDetails = await VENDORLABEL.create(vendorLabelData);

    return res.status(201).json({
      status: "Success",
      message: "Vendor label created successfully",
      data: vendorLabelDetails,
    });
  } catch (error) {
    return res.status(400).json({
      status: "Fail",
      message: error.message,
    });
  }
};

exports.fetchAllVendorLabels = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const search = req.query.search || "";

    const query = {
      label: { $regex: search, $options: "i" },
    };

    const totalVendorLabels = await VENDORLABEL.countDocuments(query);
    const vendorLabelsData = await VENDORLABEL.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      status: "Success",
      message: "Vendor labels fetched successfully",
      pagination: {
        totalRecords: totalVendorLabels,
        currentPage: page,
        totalPages: Math.ceil(totalVendorLabels / limit),
        limit,
      },
      data: vendorLabelsData,
    });
  } catch (error) {
    return res.status(500).json({
      status: "Fail",
      message: error.message,
    });
  }
};

exports.fetchVendorLabelById = async (req, res) => {
  try {
    let vendorLabelId = req.params.id;
    let vendorLabelData = await VENDORLABEL.findById(vendorLabelId);
    if (!vendorLabelData) {
      throw new Error("Vendor label not found");
    }
    return res.status(200).json({
      status: "Success",
      message: "Vendor label fetched successfully",
      data: vendorLabelData,
    });
  } catch (error) {
    return res.status(404).json({
      status: "Fail",
      message: error.message,
    });
  }
};

exports.vendorLabelUpdate = async (req, res) => {
  try {
    let vendorLabelId = req.params.id;
    let oldVendorLabel = await VENDORLABEL.findById(vendorLabelId);

    if (!oldVendorLabel) {
      throw new Error("Vendor label not found");
    }

    let updatedVendorLabel = await VENDORLABEL.findByIdAndUpdate(vendorLabelId, req.body, {
      new: true,
    });

    return res.status(200).json({
      status: "Success",
      message: "Vendor label updated successfully",
      data: updatedVendorLabel,
    });
  } catch (error) {
    return res.status(404).json({
      status: "Fail",
      message: error.message,
    });
  }
};

exports.vendorLabelDelete = async (req, res) => {
  try {
    let vendorLabelId = req.params.id;
    let oldVendorLabel = await VENDORLABEL.findById(vendorLabelId);

    if (!oldVendorLabel) {
      throw new Error("Vendor label not found");
    }
    await VENDORLABEL.findByIdAndDelete(vendorLabelId);

    return res.status(200).json({
      status: "Success",
      message: "Vendor label deleted successfully",
    });
  } catch (error) {
    return res.status(404).json({
      status: "Fail",
      message: error.message,
    });
  }
};
