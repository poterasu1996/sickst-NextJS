/* eslint-disable prettier/prettier */
// const fs = require('fs');
const Category = require("./../models/categoryModel");
const APIFeatures = require("./../utils/apiFeatures");
const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/catchAsync");

// ---- route handlers ----
exports.getAllCategories = catchAsync(async (req, res, next) => {
  // EXECUTE QUERY (chaining filtering, sorting, field limit)
  const features = new APIFeatures(Category.find(), req.query).sort();
  const categories = await features.query;

  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    results: categories.length,
    data: {
      categories,
    },
  });
});

exports.getCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new AppError("No category found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      category,
    },
  });
});

exports.createCategory = catchAsync(async (req, res, next) => {
  // synce this is an async function, it will return a promise
  const newCategory = await Category.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      category: newCategory,
    },
  });

  // try {
  //   const newCategory = await Category.create(req.body);

  //   res.status(201).json({
  //     status: "success",
  //     data: {
  //       category: newCategory
  //     }
  //   });
  // } catch (error) {
  //   res.status(400).json({
  //     status: "fail",
  //     message: error
  //   });
  // }
});

exports.updateCategory = catchAsync(async (req, res, next) => {
  // ... logic code (for the moment we use file, not a real DB)
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!category) {
    return next(new AppError("No category found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      category,
    },
  });
});

exports.deleteCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findByIdAndDelete(req.params.id);

  if (!category) {
    return next(new AppError("No category found with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});
