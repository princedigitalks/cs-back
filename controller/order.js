const ORDER = require("../model/order");
const QUOTATION = require("../model/quotation");
const ORDERSTATUS = require("../model/orderStatus");

const populateOrder = (query) =>
  query.populate("quotation").populate("category").populate("orderStatus");

exports.createOrderFromQuotation = async (req, res) => {
  try {
    const { quotation, deliveryDate, remarks, orderStatus } = req.body;

    if (!quotation) {
      throw new Error("Quotation is required");
    }

    const quotationExists = await QUOTATION.findById(quotation);
    if (!quotationExists) {
      throw new Error("Quotation not found");
    }

    const orderDetails = await ORDER.create({
      quotation,
      customerName: quotationExists.customerName,
      mobileNumber: quotationExists.mobileNumber,
      email: quotationExists.email,
      category: quotationExists.category,
      productName: quotationExists.productName,
      qty: quotationExists.qty,
      price: quotationExists.price,
      subTotal: quotationExists.subTotal,
      taxType: quotationExists.taxType,
      gstType: quotationExists.gstType,
      igstPercentage: quotationExists.igstPercentage,
      cgstPercentage: quotationExists.cgstPercentage,
      sgstPercentage: quotationExists.sgstPercentage,
      igst: quotationExists.igst,
      cgst: quotationExists.cgst,
      sgst: quotationExists.sgst,
      grandTotal: quotationExists.grandTotal,
      deliveryDate,
      remarks,
      orderStatus,
    });
    const populatedOrder = await populateOrder(ORDER.findById(orderDetails._id));

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

exports.createOrderManually = async (req, res) => {
  try {
    const {
      customerName, mobileNumber, email, category,
      productName, qty, price, subTotal, taxType,
      gstType, igstPercentage, cgstPercentage, sgstPercentage,
      igst, cgst, sgst, grandTotal,
    } = req.body;

    if (!customerName || !mobileNumber || !productName || !qty || !price || !grandTotal) {
      throw new Error("customerName, mobileNumber, productName, qty, price and grandTotal are required");
    }

    const orderDetails = await ORDER.create({
      customerName, mobileNumber, email, category,
      productName, qty, price, subTotal, taxType,
      gstType, igstPercentage, cgstPercentage, sgstPercentage,
      igst, cgst, sgst, grandTotal,
    });

    const populatedOrder = await populateOrder(ORDER.findById(orderDetails._id));

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
    const ordersData = await populateOrder(
      ORDER.find().skip(skip).limit(limit).sort({ createdAt: -1 })
    );

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
    const orderData = await populateOrder(ORDER.findById(req.params.id));

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
    const oldOrder = await ORDER.findById(req.params.id);
    if (!oldOrder) {
      throw new Error("Order not found");
    }

    const updatedOrder = await populateOrder(
      ORDER.findByIdAndUpdate(req.params.id, req.body, { new: true })
    );

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
    const oldOrder = await ORDER.findById(req.params.id);
    if (!oldOrder) {
      throw new Error("Order not found");
    }

    if (oldOrder.orderStatuses && oldOrder.orderStatuses.length > 0) {
      await ORDERSTATUS.deleteMany({ _id: { $in: oldOrder.orderStatuses } });
    }

    await ORDER.findByIdAndDelete(req.params.id);

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
