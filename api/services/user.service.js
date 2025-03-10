let User = require("../models/userModel");
let Contact = require("../models/contact");
let OrderItem = require("../models/orderItem");
let Order = require("../models/order");
const mongoose = require("mongoose");

const userService = () => {


    const getAllUsers = async (query) => {
        try {
            let page = query.pageNumber || 1
            let limit = query.pageLimit || 10
            const skip = (page - 1) * limit;
            const users = await User.find().skip(skip).limit(limit).sort({ createdAt: -1 }).select('first_name last_name email createdAt');
            const totalUsers = await User.countDocuments();
            const totalPages = Math.ceil(totalUsers / limit);

            return {
                users,
                totalUsers,
                totalPages,
                currentPage: page,
                pageSize: users.length,
            };
        } catch (error) {
            throw new Error(error.message);
        }
    };
    const getAllContact = async (query) => {
        try {
            let page = query.pageNumber || 1
            let limit = query.pageLimit || 10
            const skip = (page - 1) * limit;
            const Contacts = await Contact.find().skip(skip).limit(limit).sort({ createdAt: -1 }).select('name message email createdAt');
            const totalContact = await Contact.countDocuments();
            const totalPages = Math.ceil(totalContact / limit);

            return {
                Contacts,
                totalContact,
                totalPages,
                currentPage: page,
                pageSize: Contacts.length,
            };
        } catch (error) {
            throw new Error(error.message);
        }
    };

    const getUserOrders = async (user_id) => {
        try {
            const orders = await Order.aggregate([
                // Match orders for the specific user
                { $match: { user_id: new mongoose.Types.ObjectId(user_id) } },
    
                // Lookup to join with OrderItem collection
                {
                    $lookup: {
                        from: "orderitems", // Collection name in MongoDB
                        localField: "_id", // Order's _id
                        foreignField: "order_id", // OrderItem's order_id
                        as: "order_items"
                    }
                },
    
                // Unwind order_items array to process each item separately
                { $unwind: { path: "$order_items", preserveNullAndEmptyArrays: true } },
    
                // Lookup to join with Product collection
                {
                    $lookup: {
                        from: "products", // Collection name in MongoDB
                        localField: "order_items.item_id", // OrderItem's item_id
                        foreignField: "_id", // Product's _id
                        as: "order_items.product"
                    }
                },
    
                // Unwind product array
                { $unwind: { path: "$order_items.product", preserveNullAndEmptyArrays: true } },
    
                // Reshape order_items to include only product_name from product
                {
                    $project: {
                        _id: 1,
                        user_id: 1,
                        total_price: 1,
                        status: 1,
                        createdAt: 1,
                        "order_items._id": 1,
                        "order_items.item_id": 1,
                        "order_items.status": 1,
                        "order_items.size": 1,
                        "order_items.address_id": 1,
                        "order_items.order_id": 1,
                        "order_items.user_id": 1,
                        "order_items.price": 1,
                        "order_items.product_name": "$order_items.product.product_name" // Extract only product_name
                    }
                },
    
                // Group back orders with their items and products
                {
                    $group: {
                        _id: "$_id",
                        user_id: { $first: "$user_id" },
                        total_price: { $first: "$total_price" },
                        status: { $first: "$status" },
                        createdAt: { $first: "$createdAt" },
                        order_items: { $push: "$order_items" }
                    }
                }
            ]);
    
            return orders;
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };
    
    const getOrderDetails = async (order_id, user_id) => {
        try {
            const orders = await Order.aggregate([
                // Match a specific order by _id and user_id
                { 
                    $match: { 
                        _id: new mongoose.Types.ObjectId(order_id), 
                        user_id: new mongoose.Types.ObjectId(user_id) 
                    } 
                },
    
                // Lookup to join with OrderItem collection, ensuring both order_id and user_id match
                {
                    $lookup: {
                        from: "orderitems", 
                        let: { orderId: "$_id", userId: "$user_id" },
                        pipeline: [
                            { 
                                $match: { 
                                    $expr: { 
                                        $and: [
                                            { $eq: ["$order_id", "$$orderId"] },
                                            { $eq: ["$user_id", "$$userId"] }
                                        ]
                                    }
                                }
                            },
                            {
                                $project: {
                                    _id: 1,  // Include _id of OrderItem
                                    item_id: 1,
                                    user_id: 1, // Include user_id inside order_items
                                    status: 1,
                                    size: 1,
                                    address_id: 1,
                                    order_id: 1,
                                    price: 1
                                }
                            }
                        ],
                        as: "order_items"
                    }
                },
    
                // Unwind order_items array to process each item separately
                { $unwind: { path: "$order_items", preserveNullAndEmptyArrays: true } },
    
                // Lookup to join with Product collection
                {
                    $lookup: {
                        from: "products", 
                        localField: "order_items.item_id", 
                        foreignField: "_id", 
                        as: "order_items.product"
                    }
                },
    
                // Unwind product array
                { $unwind: { path: "$order_items.product", preserveNullAndEmptyArrays: true } },
    
                // Reshape order_items to include only required fields
                {
                    $project: {
                        _id: 1,
                        user_id: 1,
                        total_price: 1,
                        status: 1,
                        createdAt: 1,
                        "order_items._id": 1,  // Include order_items._id
                        "order_items.item_id": 1,
                        "order_items.user_id": 1, // Ensure user_id is inside order_items
                        "order_items.status": 1,
                        "order_items.size": 1,
                        "order_items.address_id": 1,
                        "order_items.order_id": 1,
                        "order_items.price": 1,
                        "order_items.product_name": "$order_items.product.product_name" 
                    }
                },
    
                // Group back orders with their items and products
                {
                    $group: {
                        _id: "$_id",
                        user_id: { $first: "$user_id" },
                        total_price: { $first: "$total_price" },
                        status: { $first: "$status" },
                        createdAt: { $first: "$createdAt" },
                        order_items: { $push: "$order_items" }
                    }
                }
            ]);
    
            return orders.length > 0 ? orders[0] : null; // Return a single order
        } catch (error) {
            console.error("Error fetching order details:", error);
        }
    };
    
    
    
    


    return {
        getUserOrders,
        getOrderDetails,
        getAllUsers,
        getAllContact
    };
}
module.exports = userService;

