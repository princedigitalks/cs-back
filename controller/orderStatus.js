const ORDERSTATUS = require("../model/orderStatus");
const ORDER = require("../model/order");

exports.createOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    if (!orderId) {
      throw new Error("Order ID is required");
    }

    if (!status) {
      throw new Error("Status is required");
    }

    const orderExists = await ORDER.findById(orderId);
    if (!orderExists) {
      throw new Error("Order not found");
    }

    const orderStatus = await ORDERSTATUS.create({ status });

    await ORDER.findByIdAndUpdate(orderId, {
      $push: { orderStatuses: orderStatus._id },
    });

    return res.status(201).json({
      status: "Success",
      message: "Order status created successfully",
      data: orderStatus,
    });
  } catch (error) {
    return res.status(400).json({
      status: "Fail",
      message: error.message,
    });
  }
};

exports.fetchAllOrderStatuses = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalRecords = await ORDERSTATUS.countDocuments();
    const orderStatuses = await ORDERSTATUS.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      status: "Success",
      message: "Order statuses fetched successfully",
      pagination: {
        totalRecords,
        currentPage: page,
        totalPages: Math.ceil(totalRecords / limit),
        limit,
      },
      data: orderStatuses,
    });
  } catch (error) {
    return res.status(500).json({
      status: "Fail",
      message: error.message,
    });
  }
};

exports.fetchOrderStatusById = async (req, res) => {
  try {
    const orderStatus = await ORDERSTATUS.findById(req.params.id);

    if (!orderStatus) {
      throw new Error("Order status not found");
    }

    return res.status(200).json({
      status: "Success",
      message: "Order status fetched successfully",
      data: orderStatus,
    });
  } catch (error) {
    return res.status(404).json({
      status: "Fail",
      message: error.message,
    });
  }
};

exports.fetchOrderStatusesByOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;

    const order = await ORDER.findById(orderId).populate({
      path: "orderStatuses",
      options: { sort: { createdAt: -1 } }
    });

    if (!order) {
      throw new Error("Order not found");
    }

    return res.status(200).json({
      status: "Success",
      message: "Order statuses fetched successfully",
      data: order.orderStatuses,
    });
  } catch (error) {
    return res.status(404).json({
      status: "Fail",
      message: error.message,
    });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      throw new Error("Status is required");
    }

    const oldOrderStatus = await ORDERSTATUS.findById(req.params.id);
    if (!oldOrderStatus) {
      throw new Error("Order status not found");
    }

    const updatedOrderStatus = await ORDERSTATUS.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      status: "Success",
      message: "Order status updated successfully",
      data: updatedOrderStatus,
    });
  } catch (error) {
    return res.status(404).json({
      status: "Fail",
      message: error.message,
    });
  }
};

exports.deleteOrderStatus = async (req, res) => {
  try {
    const orderStatus = await ORDERSTATUS.findById(req.params.id);
    if (!orderStatus) {
      throw new Error("Order status not found");
    }

    await ORDER.updateMany(
      { orderStatuses: req.params.id },
      { $pull: { orderStatuses: req.params.id } }
    );

    await ORDERSTATUS.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      status: "Success",
      message: "Order status deleted successfully",
    });
  } catch (error) {
    return res.status(404).json({
      status: "Fail",
      message: error.message,
    });
  }
};
