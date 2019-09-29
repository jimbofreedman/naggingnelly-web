const {
  override,
  addDecoratorsLegacy,
  disableEsLint,
} = require("customize-cra");

module.exports = override(
  addDecoratorsLegacy(), // for Mobx Decorators
  disableEsLint(), // for Mobx Decorators
);
