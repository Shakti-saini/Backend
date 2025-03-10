var joi = require("joi");

module.exports.signinUser = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required(),
})

module.exports.signupUser = joi.object({
  email: joi.string().email().required(),
  first_name: joi.string().required(),
  last_name: joi.string().required(),
  password: joi.string().required(),
  confirmPassword: joi.string().required(),
})
module.exports.commonId = joi.object({
  id: joi.string().required(),

})

module.exports.updateUser = joi.object({
  first_name: joi.string().required(),
  last_name: joi.string().required(),
  email: joi.string().required(),
})
module.exports.changePassword = joi.object({
  confirm_password: joi.string().required(),
  new_password: joi.string().required(),
  old_password: joi.string().required(),
})
module.exports.addContact = joi.object({
  name: joi.string().required(),
  message: joi.string().required(),
  email: joi.string().required(),
})

module.exports.updateUserid = joi.object({
  id: joi.number().integer().required()
})

module.exports.deleteUser = joi.object({
  id: joi.number().integer().required()
})

module.exports.getdatabyid = joi.object({
  id: joi.number().integer().required()
})

module.exports.verifyOtp = joi.object({
  email: joi.string().email().required(),
  otp: joi.number().integer().required()
})

module.exports.sendOtp = joi.object({
  email: joi.string().email().required(),
})
module.exports.addAddress = joi.object({
  first_name: joi.string().required(),
  last_name: joi.string().required(),
  email: joi.string().required(),
  phone_number: joi.string().required(),
  address: joi.string().required(),
  city: joi.string().required(),
  country: joi.string().required(),
  zip_code: joi.string().required(),
})
module.exports.addOrder = joi.object({
  item_id: joi.array().required(),
  quantity: joi.number().required(),
  shipping: joi.string().required(),
  total_price: joi.string().required(),
  address_id: joi.string().required(),
  size: joi.string().required(),
})
module.exports.addRating = joi.object({
  product_id: joi.string().required(),
  rating: joi.number().required(),
  review: joi.string().required(),
})