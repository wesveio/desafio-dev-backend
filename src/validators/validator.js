'use strict';

let errors = [];

function Validator() {
  errors = [];
}

Validator.prototype.isRequired = (value, message) => {
  if (!value || value.length <= 0)
    errors.push({ message: message });
}

Validator.prototype.hasMinLen = (value, min, message) => {
  if (!value || value.length < min)
    errors.push({ message: message });
}

/* Validator.prototype.hasMinUser = (value, min, message) => {
  if (!value || value.length < min)
    errors.push({ message: message });
} */

Validator.prototype.hasMaxLen = (value, max, message) => {
  if (!value || value.length > max)
    errors.push({ message: message });
}

Validator.prototype.isFixedLen = (value, len, message) => {
  if (value.length != len)
    errors.push({ message: message });
}

Validator.prototype.isEmail = (value, message) => {
  var reg = new RegExp(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/);
  if (!reg.test(value))
    errors.push({ message: message });
}

Validator.prototype.errors = () => {
  return errors;
}

Validator.prototype.clear = () => {
  errors = [];
}

Validator.prototype.isValid = () => {
  return errors.length == 0;
}

module.exports = Validator;