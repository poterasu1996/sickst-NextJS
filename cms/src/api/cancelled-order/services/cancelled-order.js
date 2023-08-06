'use strict';

/**
 * cancelled-order service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::cancelled-order.cancelled-order');
