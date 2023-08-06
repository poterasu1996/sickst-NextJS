/* eslint-disable prettier/prettier */
// const fs = require('fs');
const Subscription = require("./../models/subscriptionModel");
const APIFeatures = require("./../utils/apiFeatures");
const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/catchAsync");

exports.getAllSubscriptions = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Subscription.find(), req.query).sort();
  const subscriptions = await features.query;

  res.status(200).json({
    status: "success",
    results: subscriptions.length,
    data: {
        subscriptions,
    },
  });
});

exports.getSubscription = catchAsync(async (req, res, next) => {
  const subscription = await Subscription.findById(req.params.id);

  if (!subscription) {
    return next(new AppError("No subscription found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
        subscription,
    },
  });
});

exports.createSubscription = catchAsync(async (req, res, next) => {
  const newSubscription = await Subscription.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
        subscription: newSubscription,
    },
  });
});

exports.updateSubscription = catchAsync(async (req, res, next) => {
  const subscription = await Subscription.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!subscription) {
    return next(new AppError("No subscription found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
        subscription,
    },
  });
});

exports.deleteSubscription = catchAsync(async (req, res, next) => {
    const subscription = await Subscription.findByIdAndDelete(req.params.id);
  
    if (!subscription) {
      return next(new AppError("No subscription found with that ID", 404));
    }
  
    res.status(204).json({
      status: "success",
      data: null,
    });
  });

