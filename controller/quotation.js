const QUOTATION = require("../model/quotation");
const LEAD = require("../model/lead");

exports.createQuotation = async (req, res) => {
  try {
    const { lead, price, taxType, gstType, igstPercentage, cgstPercentage, sgstPercentage, grandTotal } = req.body;

    const leadExists = await LEAD.findById(lead);
    if (!leadExists) {
      throw new Error("Lead not found");
    }

    let igst = 0;
    let cgst = 0;
    let sgst = 0;
    let igstPer = 0;
    let cgstPer = 0;
    let sgstPer = 0;

    if (taxType === "withGst") {
      if (gstType === "igst") {
        igstPer = igstPercentage || 18;
        igst = (price * igstPer) / 100;
      } else if (gstType === "cgst_sgst") {
        cgstPer = cgstPercentage || 9;
        sgstPer = sgstPercentage || 9;
        cgst = (price * cgstPer) / 100;
        sgst = (price * sgstPer) / 100;
      }
    }

    const quotationData = {
      lead,
      price,
      taxType,
      gstType: taxType === "withoutGst" ? "none" : gstType,
      igstPercentage: igstPer,
      cgstPercentage: cgstPer,
      sgstPercentage: sgstPer,
      igst,
      cgst,
      sgst,
      grandTotal,
    };

    const quotationDetails = await QUOTATION.create(quotationData);
    const populatedQuotation = await QUOTATION.findById(quotationDetails._id).populate({
      path: "lead",
      populate: [
        { path: "category" },
        { path: "leadStatus" }
      ]
    });

    return res.status(201).json({
      status: "Success",
      message: "Quotation created successfully",
      data: populatedQuotation,
    });
  } catch (error) {
    return res.status(400).json({
      status: "Fail",
      message: error.message,
    });
  }
};

exports.fetchAllQuotations = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalQuotations = await QUOTATION.countDocuments();
    const quotationsData = await QUOTATION.find()
      .populate({
        path: "lead",
        populate: [
          { path: "category" },
          { path: "leadStatus" }
        ]
      })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      status: "Success",
      message: "Quotations fetched successfully",
      pagination: {
        totalRecords: totalQuotations,
        currentPage: page,
        totalPages: Math.ceil(totalQuotations / limit),
        limit,
      },
      data: quotationsData,
    });
  } catch (error) {
    return res.status(500).json({
      status: "Fail",
      message: error.message,
    });
  }
};

exports.fetchQuotationById = async (req, res) => {
  try {
    let quotationId = req.params.id;
    let quotationData = await QUOTATION.findById(quotationId).populate({
      path: "lead",
      populate: [
        { path: "category" },
        { path: "leadStatus" }
      ]
    });
    if (!quotationData) {
      throw new Error("Quotation not found");
    }
    return res.status(200).json({
      status: "Success",
      message: "Quotation fetched successfully",
      data: quotationData,
    });
  } catch (error) {
    return res.status(404).json({
      status: "Fail",
      message: error.message,
    });
  }
};

exports.quotationUpdate = async (req, res) => {
  try {
    let quotationId = req.params.id;
    let oldQuotation = await QUOTATION.findById(quotationId);

    if (!oldQuotation) {
      throw new Error("Quotation not found");
    }

    const { price, taxType, gstType, igstPercentage, cgstPercentage, sgstPercentage } = req.body;

    if (price || taxType || gstType || igstPercentage || cgstPercentage || sgstPercentage) {
      const finalPrice = price || oldQuotation.price;
      const finalTaxType = taxType || oldQuotation.taxType;
      const finalGstType = gstType || oldQuotation.gstType;

      let igst = 0;
      let cgst = 0;
      let sgst = 0;
      let igstPer = 0;
      let cgstPer = 0;
      let sgstPer = 0;

      if (finalTaxType === "withGst") {
        if (finalGstType === "igst") {
          igstPer = igstPercentage || oldQuotation.igstPercentage || 18;
          igst = (finalPrice * igstPer) / 100;
        } else if (finalGstType === "cgst_sgst") {
          cgstPer = cgstPercentage || oldQuotation.cgstPercentage || 9;
          sgstPer = sgstPercentage || oldQuotation.sgstPercentage || 9;
          cgst = (finalPrice * cgstPer) / 100;
          sgst = (finalPrice * sgstPer) / 100;
        }
      }

      req.body.igstPercentage = igstPer;
      req.body.cgstPercentage = cgstPer;
      req.body.sgstPercentage = sgstPer;
      req.body.igst = igst;
      req.body.cgst = cgst;
      req.body.sgst = sgst;
      req.body.gstType = finalTaxType === "withoutGst" ? "none" : finalGstType;
    }

    let updatedQuotation = await QUOTATION.findByIdAndUpdate(quotationId, req.body, {
      new: true,
    }).populate({
      path: "lead",
      populate: [
        { path: "category" },
        { path: "leadStatus" }
      ]
    });

    return res.status(200).json({
      status: "Success",
      message: "Quotation updated successfully",
      data: updatedQuotation,
    });
  } catch (error) {
    return res.status(404).json({
      status: "Fail",
      message: error.message,
    });
  }
};

exports.quotationDelete = async (req, res) => {
  try {
    let quotationId = req.params.id;
    let oldQuotation = await QUOTATION.findById(quotationId);

    if (!oldQuotation) {
      throw new Error("Quotation not found");
    }
    await QUOTATION.findByIdAndDelete(quotationId);

    return res.status(200).json({
      status: "Success",
      message: "Quotation deleted successfully",
    });
  } catch (error) {
    return res.status(404).json({
      status: "Fail",
      message: error.message,
    });
  }
};

exports.fetchQuotationsByLead = async (req, res) => {
  try {
    let leadId = req.params.leadId;
    
    const leadExists = await LEAD.findById(leadId);
    if (!leadExists) {
      throw new Error("Lead not found");
    }

    const quotationsData = await QUOTATION.find({ lead: leadId }).populate({
      path: "lead",
      populate: [
        { path: "category" },
        { path: "leadStatus" }
      ]
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      status: "Success",
      message: "Quotations fetched successfully",
      data: quotationsData,
    });
  } catch (error) {
    return res.status(404).json({
      status: "Fail",
      message: error.message,
    });
  }
};
