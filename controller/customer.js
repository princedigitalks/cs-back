const CUSTOMER = require("../model/customer");

const populateCustomer = (query) => query.populate("orders");

exports.fetchAllCustomers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { search } = req.query;

    const filter = search
      ? {
          $or: [
            { customerName: { $regex: search, $options: "i" } },
            { mobileNumber: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const totalCustomers = await CUSTOMER.countDocuments(filter);
    const customersData = await populateCustomer(
      CUSTOMER.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 })
    );

    return res.status(200).json({
      status: "Success",
      message: "Customers fetched successfully",
      pagination: {
        totalRecords: totalCustomers,
        currentPage: page,
        totalPages: Math.ceil(totalCustomers / limit),
        limit,
      },
      data: customersData,
    });
  } catch (error) {
    return res.status(500).json({ status: "Fail", message: error.message });
  }
};

exports.fetchCustomerById = async (req, res) => {
  try {
    const customerData = await populateCustomer(CUSTOMER.findById(req.params.id));
    if (!customerData) throw new Error("Customer not found");

    return res.status(200).json({
      status: "Success",
      message: "Customer fetched successfully",
      data: customerData,
    });
  } catch (error) {
    return res.status(404).json({ status: "Fail", message: error.message });
  }
};

exports.updateCustomer = async (req, res) => {
  try {
    const customer = await CUSTOMER.findById(req.params.id);
    if (!customer) throw new Error("Customer not found");

    const updatedCustomer = await populateCustomer(
      CUSTOMER.findByIdAndUpdate(req.params.id, req.body, { new: true })
    );

    return res.status(200).json({
      status: "Success",
      message: "Customer updated successfully",
      data: updatedCustomer,
    });
  } catch (error) {
    return res.status(404).json({ status: "Fail", message: error.message });
  }
};

exports.deleteCustomer = async (req, res) => {
  try {
    const customer = await CUSTOMER.findById(req.params.id);
    if (!customer) throw new Error("Customer not found");

    await CUSTOMER.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      status: "Success",
      message: "Customer deleted successfully",
    });
  } catch (error) {
    return res.status(404).json({ status: "Fail", message: error.message });
  }
};
