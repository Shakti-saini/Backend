
const becryptService = require('../services/bcrypt.services');
const jwtService = require('../services/jwt.services');
const resModel = require('../lib/resModel');
const userServices = require('../services/user.service');
let User = require("../models/userModel");
let Contact = require("../models/contact");
let cartUser = require("../models/userCart");
let Address = require("../models/billingAddress");
let Order = require("../models/order");
let Product = require("../models/product");
let OrderItem = require("../models/orderItem");
let ProductRating = require("../models/productRating");
const bcryptServices = require('../services/bcrypt.services');

/**
 * @api {post} /api/user/signup Signup User
 * @apiName Signup User
 * @apiGroup User
 * @apiBody {String} first_name User FirstName.
 * @apiBody {String} last_name User LastName.
 * @apiBody {String} email User Email.
 * @apiBody {String} password Password.
 * @apiBody {String} confirmPassword ConfirmPassword.
 * @apiDescription User Service...
 * @apiSampleRequest http://localhost:2001/api/user/signup
 */
module.exports.signupUser = async (req, res) => {
    try {
        const { first_name, last_name, email, password, confirmPassword } = req.body;
        const userCheck = await User.findOne({ email });
        if (userCheck) {
            resModel.success = false;
            resModel.message = "User  Already Exists";
            resModel.data = null;
            res.status(201).json(resModel);
        } else {
            if (password == confirmPassword) {
                let passwordHash = await becryptService.generatePassword(password)
                if (passwordHash) {
                    let userInfo = {
                        email: email.toLowerCase(),
                        password: passwordHash,
                        first_name: first_name,
                        last_name: last_name,
                        role_id: 2
                    }
                    const newUser = new User(userInfo)
                    let users = await newUser.save();
                    if (users) {
                        let cartInfo = {
                            user_id: users._id
                        }
                        let addcart = new cartUser(cartInfo)
                        await addcart.save()
                        resModel.success = true;
                        resModel.message = "User Added Successfully";
                        resModel.data = users
                        res.status(200).json(resModel)

                    } else {
                        resModel.success = false;
                        resModel.message = "Error while creating User";
                        resModel.data = null;
                        res.status(400).json(resModel);
                    }
                } else {
                    resModel.success = false;
                    resModel.message = "Something went wrong";
                    resModel.data = null;
                    res.status(500).json(resModel)
                }
            } else {
                resModel.success = false;
                resModel.message = "Please enter password and confirm should be same";
                resModel.data = null;
                res.status(400).json(resModel);
            }
        }
    } catch (error) {
        resModel.success = false;
        resModel.message = "Internal Server Error";
        resModel.data = null;
        res.status(500).json(resModel);

    }
}
/**
 * @api {post} /api/user/signin Signin User
 * @apiName SinginUser
 * @apiGroup User
 * @apiBody {String} email User Email.
 * @apiBody {String} password Password.
 * @apiDescription User Service...
 * @apiSampleRequest http://localhost:2001/api/user/signin
 */
module.exports.signInUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const emails = email.toLowerCase();

        // Find user by email
        const userCheck = await User.findOne({ email: emails });
        if (!userCheck) {
            resModel.success = false;
            resModel.message = "Please create an account first";
            resModel.data = null;
            return res.status(400).json(resModel);
        }

        // Compare password
        const passwordMatch = await bcryptServices.comparePassword(password, userCheck.password);
        if (!passwordMatch) {
            resModel.success = false;
            resModel.message = "Invalid Credentials";
            resModel.data = {};
            return res.status(400).json(resModel);
        }

        // Generate JWT token
        const accessToken = await jwtService.issueJwtToken({
            email,
            first_name: userCheck.first_name,
            id: userCheck._id, // MongoDB uses _id instead of id
        });

        // Remove password from response
        userCheck.password = undefined;

        resModel.success = true;
        resModel.message = "User Login Successfully";
        resModel.data = { token: accessToken, user: userCheck };
        res.status(200).json(resModel);

    } catch (error) {
        resModel.success = false;
        resModel.message = error.message;
        resModel.data = null;
        res.status(500).json(resModel);
    }
};

/**
 * @api {get} /api/user/getAllUser  Get All User
 * @apiName Get All User
 * @apiGroup User
 * @apiDescription User Service...
 * @apiSampleRequest http://localhost:2001/api/user/getAllUser
 */
module.exports.getAllUser = async (req, res) => {
    try {
        const userCheck = await userServices().getAllUsers(req.query);
        if (userCheck) {
            resModel.success = true;
            resModel.message = "Get All Users Successfully";
            resModel.data = userCheck;
            res.status(200).json(resModel);
        }
        else {
            resModel.success = true;
            resModel.message = "User Not Found";
            resModel.data = [];
            res.status(200).json(resModel)
        }
    } catch (error) {
        resModel.success = false;
        resModel.message = "Internal Server Error";
        resModel.data = null;
        res.status(500).json(resModel);
    }
}



/**
 * @api {get} /api/user/details/:id  Get User Details
 * @apiName Get User Details
 * @apiGroup User
 * @apiDescription User Service...
 * @apiSampleRequest http://localhost:2001/api/user/details/:id
 */
module.exports.getUserDetails = async (req, res) => {
    try {
        const { id } = req.params;
        let _id = id
        // Find product by ID
        const user = await User.findById(_id);
        if (!user) {
            resModel.success = false;
            resModel.message = "User Does't Exists";
            resModel.data = null;
            res.status(400).json(resModel)
        } else {
            resModel.success = true;
            resModel.message = "User Details Fetched Successfully";
            resModel.data = user;
            res.status(200).json(resModel);
        }
    } catch (error) {
        resModel.success = false;
        resModel.message = "Internel Server Error";
        resModel.data = null;
        res.status(500).json(resModel)
    }
};

/**
 * @api {delete} /api/user/delete/:id  Delete User 
 * @apiName Delete User
 * @apiGroup User
 * @apiDescription User Service...
 * @apiSampleRequest http://localhost:2001/api/user/delete/:id
 */
module.exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        let _id = id
        // Check if the product exists
        const existingUser = await User.findById(_id);
        if (!existingUser) {
            resModel.success = false;
            resModel.message = "User Does't Exists";
            resModel.data = null;
            res.status(400).json(resModel);
        }
        let deleteRes = await User.findByIdAndDelete(_id);
        if (deleteRes) {
            resModel.success = true;
            resModel.message = "User Deleted Successfully";
            resModel.data = null;
            res.status(200).json(resModel);
        } else {
            resModel.success = false;
            resModel.message = "Error While User Deleting";
            resModel.data = null;
            res.status(400).json(resModel);
        }
    } catch (error) {
        resModel.success = false;
        resModel.message = "Internal Server Error";
        resModel.data = null;
        res.status(500).json(resModel);
    }
};

/**
 * @api {post} /api/contact/add Add Conatct
 * @apiName Add Contact
 * @apiGroup Contact
 * @apiBody {String} name  Contact Name.
 * @apiBody {String} email  Contact Email.
 * @apiBody {String} message Contact Message.
 * @apiDescription Contact Service...
 * @apiSampleRequest http://localhost:2001/api/Contact/add
 */
module.exports.addContact = async (req, res) => {
    try {
        const { name, email, message } = req.body;
        let contactInfo = {
            name: name,
            email: email,
            message: message,

        }
        const newContact = new Contact(contactInfo);
        let contactRes = await newContact.save();
        if (contactRes) {
            resModel.success = true;
            resModel.message = "Contact Added Successfully";
            resModel.data = contactRes
            res.status(201).json(resModel)

        } else {
            resModel.success = false;
            resModel.message = "Error while Adding Contact";
            resModel.data = null;
            res.status(400).json(resModel);
        }
    } catch (error) {
        resModel.success = false;
        resModel.message = "Internal Server Error";
        resModel.data = null;
        res.status(500).json(resModel);

    }
}
/**
 * @api {get} /api/contact/getAllContact  Get All Contact
 * @apiName Get All Contact
 * @apiGroup Contact
 * @apiDescription Contact Service...
 * @apiSampleRequest http://localhost:2001/api/contact/getAllContact
 */
module.exports.getAllContact = async (req, res) => {
    try {
        const contactCheck = await userServices().getAllContact(req.query);
        if (contactCheck) {
            resModel.success = true;
            resModel.message = "Get All Users Successfully";
            resModel.data = contactCheck;
            res.status(200).json(resModel);
        }
        else {
            resModel.success = true;
            resModel.message = "Contact Not Found";
            resModel.data = [];
            res.status(200).json(resModel)
        }
    } catch (error) {
        resModel.success = false;
        resModel.message = "Internal Server Error";
        resModel.data = null;
        res.status(500).json(resModel);
    }
}


/**
 * @api {post} /api/address/add Add Address
 * @apiName Add Address
 * @apiGroup User
 * @apiBody {String} first_name  First Name.
 * @apiBody {String} last_name  Last Name.
 * @apiBody {String} email  Email.
 * @apiBody {String} phone_number  Phone Number.
 * @apiBody {String} address  Address.
 * @apiBody {String} city  City.
 * @apiBody {String} country  Country.
 * @apiBody {String} zip_code Zip Code.
 * @apiDescription User Service...
 * @apiHeader {String} authorization Authorization.
 * @apiSampleRequest http://localhost:2001/api/address/add
 */
module.exports.addAddress = async (req, res) => {
    try {
        const { first_name, last_name, email, phone_number, address, city, country, zip_code } = req.body;
        let contactInfo = {
            first_name: first_name,
            last_name: last_name,
            email: email,
            phone_number: phone_number,
            address: address,
            city: city,
            country: country,
            zip_code: zip_code,
            user_id: req.userInfo.id

        }
        const newAddress = new Address(contactInfo);
        let addressRes = await newAddress.save();
        if (addressRes) {
            resModel.success = true;
            resModel.message = "Address Added Successfully";
            resModel.data = addressRes
            res.status(201).json(resModel)

        } else {
            resModel.success = false;
            resModel.message = "Error while Adding Address";
            resModel.data = null;
            res.status(400).json(resModel);
        }
    } catch (error) {
        resModel.success = false;
        resModel.message = "Internal Server Error";
        resModel.data = null;
        res.status(500).json(resModel);

    }
}

/**
 * @api {get} /api/address/getUserAddress  Get All User Address
 * @apiName Get All User Address
 * @apiGroup User
 * @apiDescription User Service...
 * @apiHeader {String} authorization Authorization.
 * @apiSampleRequest http://localhost:2001/api/address/getUserAddress
 */
module.exports.getAllAddress = async (req, res) => {
    try {
        let user_id = req.userInfo.id
        const addressRes = await Address.find({ user_id });
        if (addressRes) {
            resModel.success = true;
            resModel.message = "Get All Users Address Successfully";
            resModel.data = addressRes;
            res.status(200).json(resModel);
        }
        else {
            resModel.success = true;
            resModel.message = "Address Not Found";
            resModel.data = [];
            res.status(200).json(resModel)
        }
    } catch (error) {
        resModel.success = false;
        resModel.message = "Internal Server Error";
        resModel.data = null;
        res.status(500).json(resModel);
    }
}
/**
 * @api {put} /api/user/update/:id Update User 
 * @apiName Update User 
 * @apiGroup User
 * @apiBody {String} first_name User FirstName.
 * @apiBody {String} last_name User LastName.
 * @apiBody {String} email User Email.
 * @apiHeader {String} authorization Authorization.
 * @apiDescription User Service...
 * @apiSampleRequest http://localhost:2001/api/user/update/:id
 */
module.exports.updateUser = async (req, res) => {
    try {
        const { first_name, last_name, email } = req.body;
        const updatedFields = { first_name, last_name, email };
        const _id = req.params.id;
        // Check if user exists in the database
        const userCheck = await User.findById(_id);
        if (!userCheck) {
            resModel.success = false;
            resModel.message = "User not found";
            resModel.data = null;
            res.status(404).json(resModel);
        } else {
            if (email) {
                const existingUser = await User.findOne({ email });
                if (existingUser && existingUser._id.toString() !== _id) {
                    resModel.success = false;
                    resModel.message = "Email is already taken by another user";
                    resModel.data = null;
                    res.status(400).json(resModel);
                    return;
                }
            }
            if (first_name) {
                updatedFields.first_name = first_name.toLowerCase();
            }
            if (last_name) {
                updatedFields.last_name = last_name.toLowerCase();
            }
        }
        let updatedCategory = await User.findByIdAndUpdate(_id, { $set: updatedFields },
            { new: true, runValidators: true });
        if (updatedCategory) {
            resModel.success = true;
            resModel.message = "User updated successfully";
            resModel.data = userCheck;
            res.status(200).json(resModel);
        } else {
            resModel.success = false;
            resModel.message = "Error While User Updating";
            resModel.data = null;
            res.status(400).json(resModel);
        }

    } catch (error) {
        resModel.success = false;
        resModel.message = "Internal Server Error";
        resModel.data = null;
        res.status(500).json(resModel);
    }
};

/**
 * @api {post} /api/user/change-password Change Password
 * @apiName Change Password
 * @apiGroup User
 * @apiBody {String} old_password User's current password.
 * @apiBody {String} new_password User's new password.
 * @apiBody {String} confirm_password User's confirmation of the new password.
 * @apiHeader {String} authorization Authorization.
 * @apiDescription Change the user's password by verifying the old password and ensuring the new password matches the confirmation.
 * @apiSampleRequest http://localhost:2001/api/user/change-password
 */
module.exports.changePassword = async (req, res) => {
    try {
        const { old_password, new_password, confirm_password } = req.body;
        let _id = req.userInfo.id

        // Check if the new password and confirm password match
        if (new_password !== confirm_password) {
            resModel.success = false;
            resModel.message = "New password and confirm password do not match.";
            resModel.data = null;
            res.status(400).json(resModel);
            return;
        }

        // Check password strength criteria (optional)
        if (new_password.length < 6) {
            resModel.success = false;
            resModel.message = "Password should be at least 6 characters long.";
            resModel.data = null;
            res.status(400).json(resModel);
            return;
        }

        // Find the user by ID
        const user = await User.findById(_id);
        if (!user) {
            resModel.success = false;
            resModel.message = "User not found.";
            resModel.data = null;
            res.status(404).json(resModel);
            return;
        }

        // Check if the old password is correct
        const isMatch = await bcryptServices.comparePassword(old_password, user.password); // Assuming you have a method to compare the password.
        if (!isMatch) {
            resModel.success = false;
            resModel.message = "Old password is incorrect.";
            resModel.data = null;
            res.status(400).json(resModel);
            return;
        }

        // Update the password
        user.password = await becryptService.generatePassword(new_password); // Hash the password before saving (assuming bcrypt or other hashing function)
        let updateRes = await User.findByIdAndUpdate(_id, { $set: user },
            { new: true, runValidators: true });
        if (updateRes) {
            resModel.success = true;
            resModel.message = "Password Changed successfully.";
            resModel.data = null;
            res.status(200).json(resModel);
        } else {
            resModel.success = false;
            resModel.message = "Error While Password Changing";
            resModel.data = null;
            res.status(400).json(resModel);
        }


    } catch (error) {
        resModel.success = false;
        resModel.message = "Internal Server Error";
        resModel.data = null;
        res.status(500).json(resModel);
    }
};

/**Order Api's Start */

/**
 * @api {post} /api/order/add Add Order
 * @apiName Add Order
 * @apiGroup Order
 * @apiBody {Array} item_id  Item Id.
 * @apiBody {Number} quantity  Quantity.
 * @apiBody {String} shipping  Shipping.
 * @apiBody {String} total_price  Total Price.
 * @apiBody {String} address_id  AddressId.
 * @apiBody {String} size  Size.
 * @apiDescription Order Service...
 * @apiHeader {String} authorization Authorization.
 * @apiSampleRequest http://localhost:2001/api/order/add
 */
module.exports.addOrders = async (req, res) => {
    try {
        let userId = req.userInfo.id;
        const { item_id, quantity, shipping, total_price, address_id, size } = req.body;
        let ordrerInfo = {
            user_id: userId,
            quantity: quantity,
            shipping: shipping,
            total_price: total_price,
            address_id: address_id,

        }
        const newOrder = new Order(ordrerInfo);
        let orderRes = await newOrder.save();
        if (orderRes) {
            let orderItemInfo = await Promise.all(
                item_id.map(async (item) => {
                    let productRes = await Product.findOne({ _id: item });
                    return {
                        item_id: item,
                        status: "Pending",
                        size: size,
                        address_id: address_id,
                        order_id: orderRes?._id,
                        user_id: userId,
                        price: productRes?.price  // Default price to 0 if product not found
                    };
                })
            );
            let orderItemRes = await OrderItem.insertMany(orderItemInfo);
            if (orderItemRes) {
                console.log("Item Added Successfully");
            } else {
                console.log("Error While Adding Item");
            }
            resModel.success = true;
            resModel.message = "Order Added Successfully";
            resModel.data = orderRes
            res.status(201).json(resModel)

        } else {
            resModel.success = false;
            resModel.message = "Error while Adding Order";
            resModel.data = null;
            res.status(400).json(resModel);
        }
    } catch (error) {
        resModel.success = false;
        resModel.message = "Internal Server Error";
        resModel.data = null;
        res.status(500).json(resModel);

    }
}



/**
 * @api {get} /api/order/getAllOrder  Get All Order
 * @apiName Get All Order
 * @apiGroup Order
 * @apiDescription Order Service...
 * @apiHeader {String} authorization Authorization.
 * @apiSampleRequest http://localhost:2001/api/order/getAllOrder
 */
module.exports.getAllOrder = async (req, res) => {
    try {
        let user_id = req.userInfo.id
        const orderRes = await userServices().getUserOrders(user_id)
        if (orderRes) {
            resModel.success = true;
            resModel.message = "Get All Users Order Successfully";
            resModel.data = orderRes;
            res.status(200).json(resModel);
        }
        else {
            resModel.success = true;
            resModel.message = "Order Not Found";
            resModel.data = [];
            res.status(200).json(resModel)
        }
    } catch (error) {
        resModel.success = false;
        resModel.message = "Internal Server Error";
        resModel.data = null;
        res.status(500).json(resModel);
    }
}

/**
 * @api {get} /api/order/details/:order_id Get Order Details
 * @apiName Get Order Details
 * @apiGroup Order
 * @apiDescription Order Service...
 * @apiHeader {String} authorization Authorization.
 * @apiSampleRequest http://localhost:2001/api/order/details/:order_id
 */
module.exports.getOrderDetails = async (req, res) => {
    try {
        let _id = req.params.order_itemId
        let user_id = req.userInfo.id
        const orderRes = await userServices().getOrderDetails(_id,user_id)
        if (orderRes) {
            resModel.success = true;
            resModel.message = "Get All Users Order Successfully";
            resModel.data = orderRes;
            res.status(200).json(resModel);
        }
        else {
            resModel.success = true;
            resModel.message = "Order Not Found";
            resModel.data = [];
            res.status(200).json(resModel)
        }
    } catch (error) {
        resModel.success = false;
        resModel.message = "Internal Server Error";
        resModel.data = null;
        res.status(500).json(resModel);
    }
}



/**Order Api's Ends */



/**
 * @api {post} /api/rating/add Add Product Rating
 * @apiName Add Product Rating
 * @apiGroup Product
 * 
 * @apiBody {String} product_id  ID of the Product.
 * @apiBody {Number} rating  Rating (1 to 5).
 * @apiBody {String} [review]  Optional Review.
 * 
 * @apiDescription API to allow users to rate products.
 * @apiHeader {String} authorization Authorization Token.
 * @apiSampleRequest http://localhost:2001/api/rating/add
 */
module.exports.addRating = async (req, res) => {
    try {
        const { product_id, rating, review } = req.body;
        const newRating = new ProductRating({
            product_id,
            user_id: req.userInfo.id, 
            rating,
            review
        });
        const ratingRes = await newRating.save();
        if (ratingRes) {
            resModel.success = true;
            resModel.message = "Rating Added Successfully";
            resModel.data = ratingRes;
            return res.status(201).json(resModel);
        } else {
            resModel.success = false;
            resModel.message = "Error while adding rating";
            resModel.data = null;
            return res.status(400).json(resModel);
        }
    } catch (error) {
        resModel.success = false;
        resModel.message = "Internal Server Error";
        resModel.data = null;
        return res.status(500).json(resModel);
    }
};



