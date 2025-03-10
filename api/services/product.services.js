let Category = require("../models/productCategory");
let CartItem = require("../models/cartItem");
const mongoose = require("mongoose");

const productService = () => {


    const getAllCategory = async (query) => {
        try {
            let page = query.pageNumber || 1
            let limit = query.pageLimit || 10
            const skip = (page - 1) * limit;
            const category = await Category.find().skip(skip).limit(limit).sort({ createdAt: -1 })
            const totalcategory = await Category.countDocuments();
            const totalPages = Math.ceil(totalcategory / limit);

            return {
                category,
                totalcategory,
                totalPages,
                currentPage: page,
                pageSize: category.length,
            };
        } catch (error) {
            throw new Error(error.message);
        }
    };

    const  getUserItem = async(userId) =>{
        try {
          // Perform aggregation to get cart items and join with product details
          const cartItems = await CartItem.aggregate([
            // Match cart items by the user's ID
            {
              $match: { user_id: new mongoose.Types.ObjectId(userId) },
            },
            // Lookup the associated product details
            {
              $lookup: {
                from: 'products', // Name of the Product collection
                localField: 'product_id', // Field in CartItem to match
                foreignField: '_id', // Field in Product to match
                as: 'product', // Alias for the joined product data
              },
            },
            // Unwind the product array (since it will be an array with one product)
            {
              $unwind: '$product',
            },
            // Project the desired fields
            {
              $project: {
                _id: 1,
                size: 1,
                quantity: 1,
                price: 1,
                'product.product_name': 1,
                'product.images': 1,
                'product.price': 1,
              },
            },
          ]);
      
          // Return the cart items with product details
          return cartItems;
        } catch (error) {
          console.error('Error fetching user cart items:', error);
          throw new Error('Failed to retrieve cart items');
        }
      }


      const removeItem = async(user_id,item_id)=>{
        try {
            const result = await CartItem.deleteOne({ user_id, _id: item_id });
    
            // Check if the item was removed successfully
            if (result.deletedCount === 0) {
                throw new Error('Cart item not found or already removed');
            }
    
            return { success: true, message: 'Cart item removed successfully' };
        } catch (error) {
            console.error('Error removing cart item:', error);
            return { success: false, message: error.message };
        }
      }


    return {
        getAllCategory,
        getUserItem,
        removeItem
    };
}
module.exports = productService;

