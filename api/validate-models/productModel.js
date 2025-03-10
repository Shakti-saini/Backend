 var Joi = require("joi");

module.exports.addCategory = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  image: Joi.string().required(),
})

module.exports.updateCategory = Joi.object({
    name: Joi.string().optional(),
    description: Joi.string().optional(),
    image: Joi.string().optional(),
})
module.exports.commonId = Joi.object({
    id: Joi.string().required(),

})
module.exports.itemId = Joi.object({
  item_id: Joi.string().required(),

})
module.exports.wishlistProduct = Joi.object({
  product_id: Joi.string().required(),
  user_id: Joi.string().required(),

})


module.exports.addProduct = Joi.object({
  category_id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required().messages({
    "string.pattern.base": "Invalid Category ID format.",
    "any.required": "Category ID is required.",
  }),

  product_name: Joi.string().trim().required().messages({
    "string.empty": "Product name cannot be empty.",
    "any.required": "Product name is required.",
  }),

  price: Joi.number().positive().required().messages({
    "number.base": "Price must be a number.",
    "number.positive": "Price must be greater than 0.",
    "any.required": "Price is required.",
  }),

  sizes: Joi.array()
    .items(
      Joi.object({
        size: Joi.string()
          .valid("S", "M", "L", "XL", "XXL")
          .required()
          .messages({
            "any.only": "Size must be one of S, M, L, XL, XXL.",
            "any.required": "Size is required.",
          }),
        quantity: Joi.number().integer().min(0).required().messages({
          "number.base": "Quantity must be a number.",
          "number.min": "Quantity cannot be negative.",
          "any.required": "Quantity is required.",
        }),
      })
    )
    .required()
    .messages({
      "any.required": "Sizes array is required.",
      "array.base": "Sizes must be an array.",
    }),

  images: Joi.array().items(Joi.string().uri()).min(1).required().messages({
    "array.min": "At least one product image URL is required.",
    "string.uri": "Each image must be a valid URL.",
    "any.required": "Images are required.",
  }),

  description: Joi.string().trim().required().messages({
    "string.empty": "Description cannot be empty.",
    "any.required": "Description is required.",
  }),
});


module.exports.updateProduct = Joi.object({
  category_id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required().messages({
    "string.pattern.base": "Invalid Category ID format.",
    "any.required": "Category ID is required.",
  }),

  product_name: Joi.string().trim().optional().messages({
    "string.empty": "Product name cannot be empty.",
  }),

  price: Joi.number().positive().optional().messages({
    "number.base": "Price must be a number.",
    "number.positive": "Price must be greater than 0.",
  }),

  sizes: Joi.array()
    .items(
      Joi.object({
        size: Joi.string()
          .valid("S", "M", "L", "XL", "XXL")
          .required()
          .messages({
            "any.only": "Size must be one of S, M, L, XL, XXL.",
            "any.required": "Size is required.",
          }),
        quantity: Joi.number().integer().min(0).required().messages({
          "number.base": "Quantity must be a number.",
          "number.min": "Quantity cannot be negative.",
          "any.required": "Quantity is required.",
        }),
      })
    )
    .optional()
    .messages({
      "array.base": "Sizes must be an array.",
    }),

  images: Joi.array().items(Joi.string().uri()).optional().messages({
    "string.uri": "Each image must be a valid URL.",
  }),

  description: Joi.string().trim().optional().messages({
    "string.empty": "Description cannot be empty.",
  }),
});




module.exports.addCart = Joi.object({
  product_id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required().messages({
    "string.pattern.base": "Invalid Product ID format.",
    "any.required": "Product ID is required.",
  }),

  size_id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required().messages({
    "string.pattern.base": "Invalid Size ID format.",
    "any.required": "Size ID is required.",
  }),

  size: Joi.string()
    .valid("S", "M", "L", "XL", "XXL")
    .required()
    .messages({
      "any.only": "Size must be one of S, M, L, XL, XXL.",
      "any.required": "Size is required.",
    }),

  quantity: Joi.number().integer().positive().required().messages({
    "number.base": "Quantity must be a number.",
    "number.integer": "Quantity must be an integer.",
    "number.positive": "Quantity must be greater than 0.",
    "any.required": "Quantity is required.",
  }),

  price: Joi.number().positive().required().messages({
    "number.base": "Price must be a number.",
    "number.positive": "Price must be greater than 0.",
    "any.required": "Price is required.",
  }),
});


