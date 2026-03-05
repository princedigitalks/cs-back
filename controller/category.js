const CATEGORY = require("../model/category");

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const categoryData = await CATEGORY.create({ name });

    return res.status(201).json({
      status: "Success",
      message: "Category created successfully",
      data: categoryData,
    });
  } catch (error) {
    return res.status(400).json({
      status: "Fail",
      message: error.message,
    });
  }
};

exports.fetchAllCategories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";

    const query = {
      name: { $regex: search, $options: "i" },
    };

    const total = await CATEGORY.countDocuments(query);
    const data = await CATEGORY.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      status: "Success",
      message: "Categories fetched successfully",
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

exports.fetchCategoryById = async (req, res) => {
  try {
    const data = await CATEGORY.findById(req.params.id);
    if (!data) {
      throw new Error("Category not found");
    }
    return res.status(200).json({
      status: "Success",
      message: "Category fetched successfully",
      data,
    });
  } catch (error) {
    return res.status(404).json({
      status: "Fail",
      message: error.message,
    });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const data = await CATEGORY.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!data) {
      throw new Error("Category not found");
    }
    return res.status(200).json({
      status: "Success",
      message: "Category updated successfully",
      data,
    });
  } catch (error) {
    return res.status(404).json({
      status: "Fail",
      message: error.message,
    });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const data = await CATEGORY.findByIdAndDelete(req.params.id);
    if (!data) {
      throw new Error("Category not found");
    }
    return res.status(200).json({
      status: "Success",
      message: "Category deleted successfully",
    });
  } catch (error) {
    return res.status(404).json({
      status: "Fail",
      message: error.message,
    });
  }
};
