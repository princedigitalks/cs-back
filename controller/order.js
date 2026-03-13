const ORDER = require("../model/order");
const LEAD = require("../model/lead");
const QUOTATION = require("../model/quotation");

exports.createOrder = async (req, res) => {
  try {
    const { lead, quotation, ...otherFields } = req.body;

    if (!lead) {
      throw new Error("Lead is required");
    }

    const leadExists = await LEAD.findById(lead);
    if (!leadExists) {
      throw new Error("Lead not found");
    }

    let orderData = { lead, ...otherFields };

    if (quotation) {
      const quotationExists = await QUOTATION.findById(quotation);
      if (!quotationExists) {
        throw new Error("Quotation not found");
      }
      orderData.quotation = quotation;
    }

    const orderDetails = await ORDER.create(orderData);

    const populatedOrder = await ORDER.findById(orderDetails._id)
      .populate({
        path: "lead",
        populate: [
          { path: "category" },
          { path: "leadStatus" }
        ]
      })
      .populate("quotation")
      .populate("category")
      .populate("orderStatuses");

    return res.status(201).json({
      status: "Success",
      message: "Order created successfully",
      data: populatedOrder,
    });
  } catch (error) {
    return res.status(400).json({
      status: "Fail",
      message: error.message,
    });
  }
};

exports.fetchAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalOrders = await ORDER.countDocuments();
    const ordersData = await ORDER.find()
      .populate({
        path: "lead",
        populate: [
          { path: "category" },
          { path: "leadStatus" }
        ]
      })
      .populate("quotation")
      .populate("category")
      .populate("orderStatuses")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      status: "Success",
      message: "Orders fetched successfully",
      pagination: {
        totalRecords: totalOrders,
        currentPage: page,
        totalPages: Math.ceil(totalOrders / limit),
        limit,
      },
      data: ordersData,
    });
  } catch (error) {
    return res.status(500).json({
      status: "Fail",
      message: error.message,
    });
  }
};

exports.fetchOrderById = async (req, res) => {
  try {
    let orderId = req.params.id;
    let orderData = await ORDER.findById(orderId)
      .populate({
        path: "lead",
        populate: [
          { path: "category" },
          { path: "leadStatus" }
        ]
      })
      .populate("quotation")
      .populate("category")
      .populate("orderStatuses");

    if (!orderData) {
      throw new Error("Order not found");
    }
    return res.status(200).json({
      status: "Success",
      message: "Order fetched successfully",
      data: orderData,
    });
  } catch (error) {
    return res.status(404).json({
      status: "Fail",
      message: error.message,
    });
  }
};

exports.orderUpdate = async (req, res) => {
  try {
    let orderId = req.params.id;
    let oldOrder = await ORDER.findById(orderId);

    if (!oldOrder) {
      throw new Error("Order not found");
    }

    let updatedOrder = await ORDER.findByIdAndUpdate(orderId, req.body, {
      new: true,
    })
      .populate({
        path: "lead",
        populate: [
          { path: "category" },
          { path: "leadStatus" }
        ]
      })
      .populate("quotation")
      .populate("category")
      .populate("orderStatuses");

    return res.status(200).json({
      status: "Success",
      message: "Order updated successfully",
      data: updatedOrder,
    });
  } catch (error) {
    return res.status(404).json({
      status: "Fail",
      message: error.message,
    });
  }
};

exports.orderDelete = async (req, res) => {
  try {
    let orderId = req.params.id;
    let oldOrder = await ORDER.findById(orderId);

    if (!oldOrder) {
      throw new Error("Order not found");
    }

    // Delete all associated order statuses
    if (oldOrder.orderStatuses && oldOrder.orderStatuses.length > 0) {
      await ORDERSTATUS.deleteMany({ _id: { $in: oldOrder.orderStatuses } });
    }

    await ORDER.findByIdAndDelete(orderId);

    return res.status(200).json({
      status: "Success",
      message: "Order deleted successfully",
    });
  } catch (error) {
    return res.status(404).json({
      status: "Fail",
      message: error.message,
    });
  }
};

exports.fetchOrdersByLead = async (req, res) => {
  try {
    let leadId = req.params.leadId;
    
    const leadExists = await LEAD.findById(leadId);
    if (!leadExists) {
      throw new Error("Lead not found");
    }

    const ordersData = await ORDER.find({ lead: leadId })
      .populate({
        path: "lead",
        populate: [
          { path: "category" },
          { path: "leadStatus" }
        ]
      })
      .populate("quotation")
      .populate("category")
      .populate("orderStatuses")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      status: "Success",
      message: "Orders fetched successfully",
      data: ordersData,
    });
  } catch (error) {
    return res.status(404).json({
      status: "Fail",
      message: error.message,
    });
  }
};
