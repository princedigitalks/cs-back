const LEAD = require("../model/lead");
const CUSTOMER = require("../model/customer");
const ORDER = require("../model/order");
const QUOTATION = require("../model/quotation");

async function getDashboard(req, res) {
  try {
    const [totalLead, totalCustomer, totalOrder, totalQuotation, leadsByStatus, ordersByStatus] =
      await Promise.all([
        LEAD.countDocuments(),
        CUSTOMER.countDocuments(),
        ORDER.countDocuments(),
        QUOTATION.countDocuments(),
        LEAD.aggregate([
          {
            $group: {
              _id: "$leadStatus",
              count: { $sum: 1 },
            },
          },
          {
            $lookup: {
              from: "leadstatuses",
              localField: "_id",
              foreignField: "_id",
              as: "status",
            },
          },
          {
            $project: {
              _id: 0,
              leadStatus: { $arrayElemAt: ["$status.name", 0] },
              count: 1,
            },
          },
        ]),
        ORDER.aggregate([
          {
            $group: {
              _id: "$orderStatus",
              count: { $sum: 1 },
            },
          },
          {
            $lookup: {
              from: "orderstatuses",
              localField: "_id",
              foreignField: "_id",
              as: "status",
            },
          },
          {
            $project: {
              _id: 0,
              orderStatus: { $arrayElemAt: ["$status.status", 0] },
              count: 1,
            },
          },
        ]),
      ]);

    res.status(200).json({
      status: "Success",
      data: {
        totalLead,
        totalCustomer,
        totalOrder,
        totalQuotation,
        leadsByStatus,
        ordersByStatus,
      },
    });
  } catch (err) {
    res.status(500).json({ status: "Fail", message: err.message });
  }
}

module.exports = { getDashboard };
