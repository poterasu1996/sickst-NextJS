'use strict';

/**
 * cancelled-subscription service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::cancelled-subscription.cancelled-subscription');
