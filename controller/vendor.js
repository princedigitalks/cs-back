const VENDOR = require("../model/vendor");

exports.createVendor = async (req, res) => {
  try {
    const { name, mobileNo, labelId } = req.body;

    const vendorData = {
      name,
      mobileNo,
      labelId,
    };

    const vendorDetails = await VENDOR.create(vendorData);

    return res.status(201).json({
      status: "Success",
      message: "Vendor created successfully",
      data: vendorDetails,
    });
  } catch (error) {
    return res.status(400).json({
      status: "Fail",
      message: error.message,
    });
  }
};

exports.fetchAllVendors = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const search = req.query.search || "";

    const query = {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { mobileNo: { $regex: search, $options: "i" } },
      ],
    };

    const totalVendors = await VENDOR.countDocuments(query);
    const vendorsData = await VENDOR.find(query)
      .populate("labelId")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      status: "Success",
      message: "Vendors fetched successfully",
      pagination: {
        totalRecords: totalVendors,
        currentPage: page,
        totalPages: Math.ceil(totalVendors / limit),
        limit,
      },
      data: vendorsData,
    });
  } catch (error) {
    return res.status(500).json({
      status: "Fail",
      message: error.message,
    });
  }
};

exports.fetchVendorById = async (req, res) => {
  try {
    let vendorId = req.params.id;
    let vendorData = await VENDOR.findById(vendorId).populate("labelId");
    if (!vendorData) {
      throw new Error("Vendor not found");
    }
    return res.status(200).json({
      status: "Success",
      message: "Vendor fetched successfully",
      data: vendorData,
    });
  } catch (error) {
    return res.status(404).json({
      status: "Fail",
      message: error.message,
    });
  }
};

exports.vendorUpdate = async (req, res) => {
  try {
    let vendorId = req.params.id;
    let oldVendor = await VENDOR.findById(vendorId);

    if (!oldVendor) {
      throw new Error("Vendor not found");
    }

    let updatedVendor = await VENDOR.findByIdAndUpdate(vendorId, req.body, {
      new: true,
    }).populate("labelId");

    return res.status(200).json({
      status: "Success",
      message: "Vendor updated successfully",
      data: updatedVendor,
    });
  } catch (error) {
    return res.status(404).json({
      status: "Fail",
      message: error.message,
    });
  }
};

exports.vendorDelete = async (req, res) => {
  try {
    let vendorId = req.params.id;
    let oldVendor = await VENDOR.findById(vendorId);

    if (!oldVendor) {
      throw new Error("Vendor not found");
    }
    await VENDOR.findByIdAndDelete(vendorId);

    return res.status(200).json({
      status: "Success",
      message: "Vendor deleted successfully",
    });
  } catch (error) {
    return res.status(404).json({
      status: "Fail",
      message: error.message,
    });
  }
};
