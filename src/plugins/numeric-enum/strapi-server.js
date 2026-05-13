'use strict';

module.exports = {
  register({ strapi }) {
    strapi.customFields.register({
      name: 'numeric-enum',
      plugin: 'numeric-enum',
      type: 'integer',
      inputSize: {
        default: 6,
        isResizable: true,
      },
    });
  },
};
