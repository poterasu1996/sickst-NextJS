/* eslint-disable prettier/prettier */
const express = require("express");
const subscriptionController = require("./../controllers/subscriptionController");

const router = express.Router();

router
  .route("/")
  .get(subscriptionController.getAllSubscriptions)
  .post(subscriptionController.createSubscription);

router
  .route("/:id")
  .get(subscriptionController.getSubscription)
  .patch(subscriptionController.updateSubscription)
  .delete(subscriptionController.deleteSubscription);

module.exports = router;
